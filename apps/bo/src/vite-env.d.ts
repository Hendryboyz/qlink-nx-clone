/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly MODE: string
  // more env variables...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
