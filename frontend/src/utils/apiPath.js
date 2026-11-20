export const API_PATHS = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    GET_PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
  },
  DIARIES: {
    CREATE: '/api/diary',
    GET_MY_DIARIES: '/api/diary',
    GET_BY_ID: '/api/diary',
    GET_PUBLIC_FEED: '/api/diary/explore',
    GET_PURCHASED: '/api/diary/purchased',
    UPDATE: '/api/diary',
    DELETE: '/api/diary',
    UPDATE_COVER: '/api/diary/cover',
    UPLOAD_MEDIA: '/api/diary/upload-media',
    ENTRY: '/api/diary',
  },
  // Backwards compatibility alias
  BOOKS: {
    CREATE_BOOK: '/api/book',
    GET_BOOK: '/api/book',
    GET_BOOK_BY_ID: '/api/book',
    UPDATE_BOOK: '/api/book',
    DELETE_BOOK: '/api/book',
    UPDATE_COVER: '/api/book/cover',
  },
  PAYMENT: {
    CREATE_ORDER: '/api/payment/create-order',
    VERIFY_PAYMENT: '/api/payment/verify-payment',
    DIRECT_UPI_CONFIRM: '/api/payment/direct-upi-confirm',
    GET_HISTORY: '/api/payment/history',
    CREATOR_EARNINGS: '/api/payment/creator-earnings',
    REQUEST_PAYOUT: '/api/payment/request-payout',
    GET_PAYOUTS: '/api/payment/payouts',
  },
  AI: {
    GENERATE_OUTLINE: '/api/ai/generate-outline',
    GENERATE_CHAPTER_CONTENT: '/api/ai/generate-content',
  },
  EXPORT: {
    PDF: '/api/export',
    DOC: '/api/export',
  },
};
