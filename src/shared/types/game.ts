// Basic response type for API calls
export type ApiResponse<T> = 
  | { status: 'success' } & T
  | { status: 'error'; message: string };

// Add BrokenCalc specific types here as needed