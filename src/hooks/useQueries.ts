import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTable, deleteTable, getTableById, getTables, updateTable } from '@/services/queries/tables'
import { toast } from 'sonner'
import { useTableListStore } from '@/store/tableStore'

export const useCreateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export const useTables = () => {
  const query = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
  })

  return query
}

export const useTable = (id: string) => {
  return useQuery({
    queryKey: ['table', id],
    queryFn: () => getTableById(id),
    enabled: !!id,
  })
}

export const useDeleteTable = () => {
  const queryClient = useQueryClient()
  const removeTable = useTableListStore(state => state.removeTable)

  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      removeTable(id)
      toast.success('Tabela excluída com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir tabela.')
    },
  })
}

export const useUpdateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) => updateTable(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['table', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}