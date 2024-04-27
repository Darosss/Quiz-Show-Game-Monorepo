declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      JWT_SECRET: string;
      SERVER_PORT: string;
      ACCESS_TOKEN_EXPIRATION_SECONDS: string;
    }
  }
}

export {};
