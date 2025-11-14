/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    QABUM_WEBHOOK_URL?: string;
    QABUM_ENABLED?: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BANK_NAME: string;
  readonly VITE_BANK_ACCOUNT_TYPE: string;
  readonly VITE_BANK_ACCOUNT_NUMBER: string;
  readonly VITE_BANK_ACCOUNT_HOLDER: string;
  readonly VITE_BANK_ACCOUNT_RUC: string;
  readonly VITE_WHATSAPP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
