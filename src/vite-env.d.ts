/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_ENDPOINT: string;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
