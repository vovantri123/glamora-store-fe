/**
 * Application Constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

// App Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string | number) => `/orders/${id}`,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    REGISTER: 'Đăng ký thành công!',
    UPDATE_PROFILE: 'Cập nhật thông tin thành công!',
    ADD_TO_CART: 'Đã thêm vào giỏ hàng!',
    ORDER_PLACED: 'Đặt hàng thành công!',
  },
  ERROR: {
    GENERIC: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
    NETWORK: 'Lỗi kết nối. Vui lòng kiểm tra internet!',
    UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục!',
    NOT_FOUND: 'Không tìm thấy dữ liệu!',
    INVALID_EMAIL: 'Email không hợp lệ!',
    INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự!',
    LOGIN_FAILED: 'Email hoặc mật khẩu không đúng!',
  },
} as const;

// Time
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;
