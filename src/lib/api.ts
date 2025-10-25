/**
 * API Utility Functions
 *
 * Centralized API calls to backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Custom error for API calls
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.message || 'API request failed',
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, error);
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

// ============================================
// Example API Endpoints
// ============================================

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products');
}

/**
 * Fetch single product
 */
export async function getProduct(id: number): Promise<Product> {
  return apiGet<Product>(`/products/${id}`);
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return apiPost<{ token: string; user: User }>('/auth/login', {
    email,
    password,
  });
}

/**
 * Get current user
 */
export async function getCurrentUser(token: string): Promise<User> {
  return apiFetch<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
