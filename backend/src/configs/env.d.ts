declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      JWT_SECRET: string;
      SERVER_PORT: string;
    }
  }
}

export {};
