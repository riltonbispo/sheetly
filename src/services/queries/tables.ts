import { Table } from '@/types/table'
import axios from 'axios'
const baseURL = 'http://localhost:3000'

const req = axios.create({
  baseURL
})

export const getTables = async (): Promise<Table[]> => {
  const response = await req.get('api/tables')

  return response.data
}