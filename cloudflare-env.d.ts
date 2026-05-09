declare module 'cloudflare:workers' {
  export const env: {
    DATABASE_URL?: string;
    [key: string]: unknown;
  };
}
