import { EmailRecipient } from '../types/transformation';
import { simulateDelay, createApiResponse, ApiResponse } from './api';

export interface DispatchResult {
  transformationId: string;
  sentAt: string;
  recipientCount: number;
  messageId: string;
  dispatchStatus: 'DELIVERED_SIMULATED';
}

export class DeliveryService {
  async sendCommunication(
    transformationId: string,
    payload: {
      recipients: EmailRecipient[];
      subject: string;
      message: string;
    }
  ): Promise<ApiResponse<DispatchResult>> {
    await simulateDelay(900);
    const result: DispatchResult = {
      transformationId,
      sentAt: new Date().toISOString(),
      recipientCount: payload.recipients.length,
      messageId: `MSG-SF-${Date.now().toString().slice(-6)}`,
      dispatchStatus: 'DELIVERED_SIMULATED'
    };
    return createApiResponse(result);
  }
}

export const deliveryService = new DeliveryService();
