import { Column, Row } from '@/types/table'
import { create } from 'zustand'

type TableState = {
  columns: Column[]
  rows: Row[]
  addColumn: (label: string) => void
  addRow: (row: Row) => void
  updateCell: (rowIndex: number, key: string, value: string) => void,
  removeRow: (index: number) => void
}

export const useTableStore = create<TableState>((set) => ({
  columns: [],
  rows: [],

  addColumn: (label: string) =>
    set((state) => {
      const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '')
      if (state.columns.some((col) => col.key === key)) return state

      return {
        columns: [...state.columns, { key, label }],
        rows: state.rows.map((invoice) => ({
          ...invoice,
          [key]: '',
        })),
      }
    }),

  addRow: (newRow: Row) =>
    set((state) => ({
      rows: [...state.rows, newRow],
    })),

  updateCell: (rowIndex, key, value) => set((state) => {
    const updated = [...state.rows]
    updated[rowIndex] = { ...updated[rowIndex], [key]: value }
    return { rows: updated }
  }),

  removeRow: (index: number) => set(state => ({rows: state.rows.filter((_, i) => i !== index)}))
}))
