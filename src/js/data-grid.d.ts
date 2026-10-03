export type GridRow = { id: string | number; version?: number; [field: string]: string | number | boolean | undefined };
export type GridColumn = { field: string; label: string; type?: 'text' | 'number' | 'date'; editable?: boolean; options?: string[]; width?: number; min?: string | number; max?: string | number; step?: string | number; maxLength?: number };
export type GridQuery = { page: number; pageSize: number; search: string; filters: { field: string; operator: 'contains' | 'equals' | 'starts' | 'gte' | 'lte' | 'empty'; value: string }[]; filterMode: 'all' | 'any'; sort: { field: string; descending: boolean } | null };
export type GridState = GridQuery & { virtual: boolean; columns: { field: string; visible: boolean; pinned: boolean; width: number }[] };
export type GridPage = { rows: GridRow[]; total: number; page?: number };
export type GridEdit = { id: string; field: string; value: string | number; previousValue: string | number | boolean | undefined; row: GridRow };
export type GridLoader = (query: GridQuery, context: { signal: AbortSignal }) => Promise<GridPage>;
export function queryGridRows(rows: GridRow[], columns: GridColumn[], query?: Partial<GridQuery>): GridPage & { page: number; pageSize: number; all: GridRow[] };
export function createDataGrid(element: HTMLElement, options?: { columns?: GridColumn[]; rows?: GridRow[]; storageKey?: string; loadPage?: GridLoader; saveCell?: (edit: GridEdit, context: { signal: AbortSignal }) => Promise<GridRow> }): { getState(): GridState; getRows(): GridRow[]; refresh(): Promise<void>; setRows(rows: GridRow[]): Promise<void>; setLoader(loader: GridLoader | null): Promise<void>; destroy(): void };
