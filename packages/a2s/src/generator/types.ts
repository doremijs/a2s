export interface GenerateFile {
  fileName: string
  content: string
  forceOverwrite?: boolean
}

export type GenerateFiles = GenerateFile[]
