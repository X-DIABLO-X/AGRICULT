// Base URLs
export const DEV_BASE_URL = 'http://10.0.2.2:5000'; // For Android emulator
export const PROD_BASE_URL = 'https://your-production-url.com';

// Current environment
export const BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_BASE_URL;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  BUYER_REGISTER: `${BASE_URL}/register`,
  BUYER_LOGIN: `${BASE_URL}/login`,
  VERIFY_OTP: `${BASE_URL}/verify-otp`,
};

// Profile endpoints
export const PROFILE_ENDPOINTS = {
  UPDATE_PROFILE: `${BASE_URL}/update-profile`,
  GET_PROFILE: `${BASE_URL}/profile`,
  UPLOAD_PHOTO: `${BASE_URL}/upload-photo`,
};

// Product endpoints
export const PRODUCT_ENDPOINTS = {
  GET_PRODUCTS: `${BASE_URL}/products`,
  ADD_PRODUCT: `${BASE_URL}/add-product`,
  UPDATE_PRODUCT: `${BASE_URL}/update-product`,
};

// Image assets
export const IMAGES = {
  DEFAULT_PROFILE: 'default-profile.png',
  LOGO: 'logo.png',
};