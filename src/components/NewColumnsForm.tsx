"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTableStore } from "@/store/tableStore"


const FormSchema = z.object({
  columnName: z.string().min(2, {
    message: "Column Name must be at least 2 characters.",
  }),
})

const NewColumnsForm = () => {
  const { addColumn } = useTableStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      columnName: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    if (!data.columnName.trim()) return
    addColumn(data.columnName)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 space-y-6 flex items-center justify-between gap-4">
        <FormField
          control={form.control}
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
        <Button type="submit">Create Column</Button>
      </form>
    </Form>
  )
}

export default NewColumnsForm