declare module 'swagger2openapi' {
  export function convertObj(
    obj: object,
    options: object,
    callback: (err: Error, options: { openapi: string }) => void
  ): void
}
