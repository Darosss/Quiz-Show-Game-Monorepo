declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      JWT_SECRET: string;
      SERVER_PORT: string;
      ACCESS_TOKEN_EXPIRATION_MS: string;
      THROTTLE_TTL?: string;
      THROTTLE_LIMIT?: string;
    }
  }
}

export {};
