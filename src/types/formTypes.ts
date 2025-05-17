import { z } from "zod"


export const generateSchema = (columns: { key: string; label: string }[]) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  columns.forEach((col) => {
    shape[col.key] = z.string().optional()
  })

  return z.object({
    rows: z.array(z.object(shape)),
    columns: z.array(z.object({
      key: z.string(),
      label: z.string(),
    })),
  })
}


export type FormData = {
  rows: Array<Record<string, string>>,
  columns: Array<{
    key: string
    label: string
  }>
}
