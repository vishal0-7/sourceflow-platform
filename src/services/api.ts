// Shared Mock API client helper
export const simulateDelay = (ms: number = 400): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

export const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: new Date().toISOString()
});
