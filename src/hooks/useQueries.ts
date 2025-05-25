import { getTables } from '@/services/queries/tables'
import {useQuery} from '@tanstack/react-query'

export const useTables = () => {
  const query = useQuery({
    queryKey: ['tables'],
    queryFn: () => getTables(),
  })

  return query
}