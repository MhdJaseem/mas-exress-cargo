/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the tracking / pickup / careers API, e.g. https://api.masexpresscargo.com */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
