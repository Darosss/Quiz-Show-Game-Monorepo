declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      JWT_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      SERVER_PORT: string;
      ACCESS_TOKEN_EXPIRATION_MS: string;
      REFRESH_TOKEN_EXPIRATION_MS: string;
      THROTTLE_TTL?: string;
      THROTTLE_LIMIT?: string;
      CORS_FRONTEND_ORIGIN: string;
    }
  }
}

export {};
