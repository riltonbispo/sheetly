import { Column, Row, Table } from '@/types/table'
import axios from 'axios'
const baseURL = 'http://localhost:3000'

const req = axios.create({
  baseURL
})

export const getTables = async (): Promise<Table[]> => {
  const response = await req.get('api/tables')

  return response.data
}

export const getTableById = async (id: string): Promise<Table> => {
  const response = await req.get(`/api/tables/${id}`)
  return response.data
}

export const deleteTable = async (id: string): Promise<void> => {
  await req.delete(`/api/tables/${id}`)
}

export const updateTable = async (id: string, data: { name: string }): Promise<Table> => {
  const response = await req.patch(`/api/tables/${id}`, data)
  return response.data
}

export const createTable = async (data: {
  name: string
  userId: string
  columns: Column[]
  rows: Row[]
}): Promise<Table> => {
  const response = await req.post('/api/tables', data)
  return response.data
}