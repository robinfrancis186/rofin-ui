export interface PrismSettings { height?: number; angle?: number; index?: number; dispersion?: number }
export interface PrismRay { wavelength: number; index: number; state: 'missed' | 'exited' | 'trapped'; reflections: number; points: [number,number,number][]; exitAngle: number | null }
export function tracePrism(settings?: PrismSettings): PrismRay[];
export function initPrisms(root?: ParentNode): () => void;
