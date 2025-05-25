export interface Table {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
  rows: Row[];
}

export interface Row {
  id: string;
  data: Record<string, string>;
  tableId: string;
  createdAt: string;
}
export interface Column {
  id: string;
  key: string;
  label: string;
  tableId: string;
  createdAt: string;
}