/**
 * Official Gemini Client Service
 * 
 * Encapsulates all Gemini API calls using the official @google/genai SDK.
 * Features:
 * - Structured Outputs with strict JSON Schemas
 * - Centralized model configuration (env.GEMINI_MODEL)
 * - Error handling for timeouts and rate limits
 * - Zero credentials exposed to logs or client responses
 */

import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export const DEFAULT_AI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';
export const DEFAULT_TIMEOUT_MS = env.GEMINI_TIMEOUT_MS || 60000;

export class GeminiService {
  constructor(apiKey = env.GEMINI_API_KEY, model = DEFAULT_AI_MODEL) {
    this.apiKey = typeof apiKey === 'string' ? apiKey.trim() : (env.GEMINI_API_KEY || '').trim();
    this.model = model;
    this.client = null;

    if (this.apiKey) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Reconfigures client if key or model changes dynamically
   */
  getClient(overrideKey) {
    const key = typeof overrideKey === 'string' ? overrideKey : (this.apiKey !== undefined ? this.apiKey : env.GEMINI_API_KEY);
    if (!key) {
      const err = new Error('Gemini API key is not configured on the server. Please set GEMINI_API_KEY in backend/.env.');
      err.code = 'GEMINI_KEY_MISSING';
      err.statusCode = 503;
      throw err;
    }
    return new GoogleGenAI({ apiKey: key.trim() });
  }

  /**
   * Executes a structured chat completion call with defensive timeout and error handling.
   * @param {Object} params - Prompt messages and schema
   * @param {string} params.systemInstruction - System instructions
   * @param {string|Array} params.contents - User prompt / document text
   * @param {Object} params.responseSchema - Structured Outputs json_schema definition
   * @param {string} [params.operation] - Operation name (summarize, analyze, extract, generate)
   * @param {Object} [options] - Overrides (model, temperature, timeoutMs, apiKey)
   */
  async executeStructuredPrompt(params, options = {}) {
    let model = options.model || env.GEMINI_MODEL || this.model || DEFAULT_AI_MODEL;
    if (model === 'gemini-2.5-flash') {
      model = 'gemini-3.6-flash';
    }
    const timeoutMs = options.timeoutMs || env.GEMINI_TIMEOUT_MS || DEFAULT_TIMEOUT_MS;
    const client = this.getClient(options.apiKey);

    // Normalize prompt inputs for compatibility with both Gemini and OpenAI test harnesses
    let systemInstruction = params.systemInstruction;
    let contents = params.contents;
    let responseSchema = params.responseSchema;

    if (!contents && Array.isArray(params.messages)) {
      const sysMsg = params.messages.find(m => m.role === 'system');
      if (sysMsg && !systemInstruction) {
        systemInstruction = sysMsg.content;
      }
      const userMsgs = params.messages.filter(m => m.role !== 'system');
      contents = userMsgs.map(m => m.content).join('\n\n');
    }

    if (!responseSchema && params.response_format?.json_schema?.schema) {
      responseSchema = params.response_format.json_schema.schema;
    }

    const startTime = Date.now();
    let attempt = 0;
    const maxAttempts = options.maxAttempts || 3; // Retry for transient 5xx failures and demand spikes

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const generatePromise = client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
            temperature: options.temperature !== undefined ? options.temperature : 0.1
          }
        });

        let timeoutTimer;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutTimer = setTimeout(() => {
            const timeoutError = new Error(`Gemini request timed out after ${timeoutMs}ms.`);
            timeoutError.name = 'AbortError';
            timeoutError.code = 'AI_TIMEOUT';
            timeoutError.statusCode = 504;
            reject(timeoutError);
          }, timeoutMs);
        });

        let response;
        try {
          response = await Promise.race([generatePromise, timeoutPromise]);
        } finally {
          if (timeoutTimer) clearTimeout(timeoutTimer);
        }

        const executionTimeMs = Date.now() - startTime;
        let rawText = response.text || '';

        // Clean out any accidental markdown code fences if upstream returns ```json ... ```
        if (rawText.startsWith('```json')) {
          rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (rawText.startsWith('```')) {
          rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        let parsedData;
        try {
          parsedData = JSON.parse(rawText.trim());
        } catch (parseError) {
          logger.error('Failed to parse Gemini structured JSON response', { rawText });
          const err = new Error('Invalid structured JSON output received from Gemini');
          err.code = 'AI_MALFORMED_OUTPUT';
          err.statusCode = 502;
          err.rawResponse = rawText;
          throw err;
        }

        // Schema validation if responseSchema is provided
        if (responseSchema && typeof responseSchema === 'object') {
          const validation = this.validateAgainstSchema(parsedData, responseSchema);
          if (!validation.isValid) {
            logger.warn('Gemini response did not strictly match schema', { errors: validation.errors });
          }
        }

        // Usage metrics calculation (approximate tokens if not directly returned)
        const promptTokens = response.usageMetadata?.promptTokenCount || Math.ceil((contents?.length || 0) / 4);
        const completionTokens = response.usageMetadata?.candidatesTokenCount || Math.ceil((rawText.length || 0) / 4);

        return {
          data: parsedData,
          model,
          usage: {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens
          },
          executionTimeMs
        };
      } catch (err) {
        // 1. Timeout handling
        if (
          err.name === 'AbortError' ||
          err.code === 'AI_TIMEOUT' ||
          err.message?.toLowerCase().includes('timeout') ||
          err.message?.toLowerCase().includes('timed out')
        ) {
          const timeoutErr = new Error(`Gemini request timed out after ${timeoutMs}ms.`);
          timeoutErr.code = 'AI_TIMEOUT';
          timeoutErr.statusCode = 504;
          throw timeoutErr;
        }

        // 2. Rate Limiting (429)
        if (err.status === 429 || err.message?.includes('429')) {
          if (attempt < maxAttempts) {
            const delayMs = 3000 * attempt;
            logger.warn(`Gemini rate limited (429) on attempt ${attempt}. Retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
            continue;
          }
          const rateErr = new Error('Gemini API rate limit exceeded. Please retry after a brief delay.');
          rateErr.code = 'AI_RATE_LIMITED';
          rateErr.statusCode = 429;
          throw rateErr;
        }

        // 3. Authentication / Key failure (401, 403)
        if (
          err.status === 401 ||
          err.status === 403 ||
          err.code === 'AI_AUTH_FAILED' ||
          err.message?.includes('API key not valid') ||
          err.message?.includes('API_KEY_INVALID') ||
          err.message?.includes('sk-')
        ) {
          const authErr = new Error('Invalid or unauthorized Gemini credentials configured on the server.');
          authErr.code = 'AI_AUTH_FAILED';
          authErr.statusCode = 503;
          throw authErr;
        }

        // 4. Invalid Request (400)
        if (err.status === 400 || err.message?.includes('400')) {
          const clientErr = new Error(`Gemini request rejected: ${err.message}`);
          clientErr.code = 'AI_REQUEST_FAILED';
          clientErr.statusCode = 400;
          throw clientErr;
        }

        // 4.5. Upstream Model Deprecation (404)
        if ((err.status === 404 || err.message?.includes('no longer available')) && model !== 'gemini-3.6-flash') {
          logger.warn(`Model '${model}' is no longer available upstream. Retrying with 'gemini-3.6-flash'...`);
          model = 'gemini-3.6-flash';
          continue;
        }

        // 5. Transient Server Errors (500, 503, high demand spikes)
        const isTransient = err.status >= 500 || err.code === 503 || err.message?.includes('500') || err.message?.includes('503') || err.message?.includes('high demand') || err.message?.includes('UNAVAILABLE');
        if (isTransient && attempt < maxAttempts) {
          const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
          logger.warn(`Transient Gemini error on attempt ${attempt}. Retrying in ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }

        // Final failure
        const serverErr = new Error('Gemini external processing failed. Please try again later.');
        serverErr.code = 'AI_REQUEST_FAILED';
        serverErr.statusCode = 502;
        serverErr.technicalDetails = err.message;
        throw serverErr;
      }
    }
  }

  /**
   * Helper to perform basic structural validation against schema required fields
   */
  validateAgainstSchema(data, schema) {
    if (!schema || !data || typeof data !== 'object') return { isValid: true };
    const errors = [];
    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (data[field] === undefined || data[field] === null) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }
    return { isValid: errors.length === 0, errors };
  }
}

export const geminiService = new GeminiService();
export default geminiService;
