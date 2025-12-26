export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
  },
  BOOKS: {
    CREATE_BOOK: '/api/book',
    GET_BOOK: '/api/book',
    GET_BOOK_BY_ID: '/api/book',
    UPDATE_BOOK: '/api/book',
    DELETE_BOOK: '/api/book',
    UPDATE_COVER: '/api/book/cover',
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
