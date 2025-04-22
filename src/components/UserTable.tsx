'use client'

import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table'
import { useTableStore } from '@/store/tableStore'
import NewColumnsForm from './NewColumnsForm'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2 } from 'lucide-react'


const generateSchema = (columns: { key: string; label: string }[]) => {
  const shape: Record<string, z.ZodTypeAny> = {}
  columns.forEach((col) => {
    shape[col.key] = z.string().optional()
  })
  return z.object({ rows: z.array(z.object(shape)) })
}

const UserTable = () => {
  const { columns, rows, removeRow, addRow } = useTableStore()

  const schema = generateSchema(columns)
  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rows },
  })

  const { control } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  })

  const handleAddRow = () => {
    const emptyRow = columns.reduce((acc, col) => {
      acc[col.key] = ''
      return acc
    }, {} as Record<string, string>)

    addRow(emptyRow)
    append(emptyRow)
  }

  const onSubmit = (data: FormData) => {
    console.log('Enviado com sucesso:', data)
  }

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <Form {...form}>
        <NewColumnsForm />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col.key}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((field, rowIndex) => (
                <TableRow key={field.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <FormField
                        control={control}
                        name={`rows.${rowIndex}.${col.key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder={col.label} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(rowIndex)
                        removeRow(rowIndex)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-4">
            <Button onClick={handleAddRow} variant={'secondary'} type='button'>
              Add Row
            </Button>

            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </div>
        </form>

      </Form>
    </div>
  )
}

export default UserTable