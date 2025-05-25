import { NextResponse } from 'next/server'
import { prisma } from '@/services/database'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: {
        columns: true,
        rows: true,
      },
    })

    if (!table) return NextResponse.json({ error: 'Tabela não encontrada' }, { status: 404 })

    return NextResponse.json(table)
  } catch (error) {
    console.error(`[GET /api/tables/${params.id}] Erro:`, error)
    return NextResponse.json({ error: 'Erro ao buscar tabela' }, { status: 500 })
  }
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    await prisma.table.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tabela deletada com sucesso' })
  } catch (error) {
    console.error(`[DELETE /api/table/${id}] Erro:`, error)
    return NextResponse.json({ error: 'Erro ao deletar tabela' }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const body = await req.json()
    const { name } = body

    const updatedTable = await prisma.table.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json(updatedTable)
  } catch (error) {
    console.error(`[PATCH /api/table/${id}] Erro:`, error)
    return NextResponse.json({ error: 'Erro ao atualizar tabela' }, { status: 500 })
  }
}
