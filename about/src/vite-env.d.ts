/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEWSLETTER_CONFIRMATION_REQUIRED?: string;
  readonly VITE_NEWSLETTER_LIST_UUIDS?: string;
  readonly VITE_NEWSLETTER_SUBSCRIBE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
