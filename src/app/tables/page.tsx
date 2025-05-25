'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { useTables } from '@/hooks/useQueries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react';
import { Trash } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel'

const Page = () => {
  const { data } = useTables()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {data?.length ? data?.map((table) => (
        <Card key={table.id}>
          <CardHeader>
            <CardTitle>{table.name}</CardTitle>
            <CardDescription>Preview Table</CardDescription>
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
          <CardFooter className='space-x-2 mt-auto'>
            <Button variant={'destructive'}>
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

      )) : <p>No data found</p>}

    </div>
  )
}

export default Page
