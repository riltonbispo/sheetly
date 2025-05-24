import { z } from "zod"
import { Column, Row } from "@/types/table";

export const generateSchema = (columns: { key: string; label: string }[]) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  columns.forEach((col) => {
    shape[col.key] = z.string().min(1, `${col.label} is required`)
  })

  return z.object({
    title: z.string().min(2, "Title is required."),
    rows: z.array(z.object(shape)),
    columns: z.array(z.object({
      key: z.string(),
      label: z.string(),
    })),
  })
}

export const columnSchema = z.object({
  columnName: z.string().min(2, {
    message: "Column Name must be at least 2 characters.",
  }),
})

export type columnFormType = z.infer<typeof columnSchema>

export type FormData = {
  title: string,
  rows: Row[],
  columns: Column[]
}
