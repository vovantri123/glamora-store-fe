// Base API Response
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}
