import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'
import { Column, Row } from '@/types/table'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, userId, columns, rows } = body

    const newTable = await prisma.table.create({
      data: {
        name,
        userId,
        columns: {
          create: columns.map((col: Column) => ({
            key: col.key,
            label: col.label,
          })),
        },
        rows: {
          create: (rows as Row[]).map((row) => ({
            data: row.data,
          })),
        },
      },
      include: {
        columns: true,
        rows: true,
      },
    })

    return NextResponse.json(newTable, { status: 201 })
  } catch (error) {
    console.error('[POST /api/tables] Erro:', error)
    return NextResponse.json({ error: 'Erro ao criar tabela' }, { status: 500 })
  }
}
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        columns: true,
        rows: true,
      },
    })
    return NextResponse.json(tables)
  } catch (error) {
    console.error('[GET /api/tables] Erro:', error)
    return NextResponse.json({ error: 'Erro ao buscar tabelas' }, { status: 500 })
  }
}
