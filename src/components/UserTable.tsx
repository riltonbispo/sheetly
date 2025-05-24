'use client'

import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table'
import { useTableStore } from '@/store/tableStore'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { MoreHorizontal } from 'lucide-react'
import { exportToExcel } from '@/utils/exportToExcel'
import { generateSchema, FormData, columnSchema, columnFormType } from "@/types/formTypes"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useSession } from "next-auth/react"

const UserTable = () => {
  const { data: session } = useSession()
  const { columns, rows, removeRow, addRow, addColumn } = useTableStore()
  const schema = generateSchema(columns)

  const rowForm = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rows, columns },
  })

  const columnForm = useForm<columnFormType>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      columnName: "",
    },
  })

  const { control } = rowForm

  const { fields: rowFields, append: appendRow, remove: removeRowForm } = useFieldArray({
    control,
    name: 'rows',
  })

  const { append: appendColumn } = useFieldArray({
    control,
    name: 'columns'
  })

  const handleAddRow = () => {
    const emptyRow = columns.reduce((acc, col) => {
      acc[col.key] = ''
      return acc
    }, {} as Record<string, string>)

    addRow(emptyRow)
    appendRow(emptyRow)
  }

  const handleAddColumn = (data: columnFormType) => {
    if (!data.columnName.trim()) return

    const newColumn = {
      key: data.columnName.trim().toLowerCase().replace(/\s+/g, '_'),
      label: data.columnName.trim()
    }

    addColumn(data.columnName.trim())
    appendColumn(newColumn)

    columnForm.reset()
  }

  const onSubmit = async (data: FormData) => {
    console.log(session?.user?.id, session?.user?.email)
    try {
      const response = await fetch('/api/table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.title,
          userId: session?.user?.id,
          columns: data.columns,
          rows: data.rows.map(row => ({ data: row })),
        }),
      })

      toast("Table has been created.",)

      exportToExcel(data.rows, 'file.xlsx')

      if (!response.ok) {
        const error = await response.json()
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <Form {...rowForm} >
        <form onSubmit={rowForm.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={rowForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Tabela</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tabela de Produtos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Form {...columnForm}>
            <form
              onSubmit={columnForm.handleSubmit(handleAddColumn)}
              className="w-1/2 space-y-6 flex items-center justify-between gap-4"
            >
              <FormField
                control={columnForm.control}
                name="columnName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Column Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" onClick={columnForm.handleSubmit(handleAddColumn)}>Create Column</Button>
            </form>
          </Form>

          {/* ROWS FORM */}
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
              {rowFields.map((field, rowIndex) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem variant='destructive'
                          onClick={() => {
                            removeRowForm(rowIndex)
                            removeRow(rowIndex)
                          }}
                        >
                          Delete Row
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              onClick={rowForm.handleSubmit(onSubmit)}
            >
              Export To Excel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UserTable