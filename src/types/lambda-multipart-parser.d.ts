declare module 'lambda-multipart-parser' {
  export function parse(event: {
    body: string | null
    isBase64Encoded?: boolean
    headers: Record<string, string | undefined>
    encoding?: string
  }): Promise<{
    files: Array<{
      filename: string
      content: Buffer
      contentType: string
      encoding: string
      fieldname: string
    }>
    [key: string]: unknown
  }>
}
