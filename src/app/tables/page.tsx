'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Download, Trash } from 'lucide-react'

import { exportToExcel } from '@/utils/exportToExcel'
import { useTableListStore } from '@/store/tableStore'
import { useDeleteTable, useTables } from '@/hooks/useQueries'
import { useEffect } from 'react'

const Page = () => {
  const { data } = useTables()
  const { tables, setTables } = useTableListStore()
  const { mutate: handleDeleteTable, isPending: isDeleting } = useDeleteTable()

  useEffect(() => {
    if (data) {
      setTables(data)
    }
  }, [data, setTables])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4 max-w-10/12 mx-auto">
      {tables.length > 0 ? (
        tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <CardTitle>{table.name}</CardTitle>
            </CardHeader>
            <CardContent className='max-h-20 overflow-y-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {table.columns.map(col => (
                      <TableHead key={col.id}>{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.rows.map(row => (
                    <TableRow key={row.id}>
                      {table.columns.map(col => (
                        <TableCell key={col.id}>
                          {row.data[col.key] ?? '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className='space-x-2 ml-auto'>
              <Button
                variant={'destructive'}
                onClick={() => handleDeleteTable(table.id)}
                disabled={isDeleting}
              >
                <Trash />
              </Button>

              <Button variant={'outline'}>Edit</Button>
              <Button
                onClick={() =>
                  exportToExcel(table.rows.map(row => row.data), `${table.name}.xlsx`)
                }
              >
                Export
                <Download />
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No data found</p>
      )}
    </div>
  )
}

export default Page
