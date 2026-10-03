/** Opt-in interaction patterns. Initialize each root once; tear down before removal. */
export function initPatterns(root?: Document | HTMLElement): () => void;

export interface LineChartPoint { label: string; values: Record<string, number>; }
/** Atomic replacement or bounded append; requires initPatterns and fixed series markup. */
export function updateLineChart(element: HTMLElement, rows: LineChartPoint[], options?: { append?: boolean }): boolean;
