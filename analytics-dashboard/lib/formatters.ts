export const CATEGORY_LABELS: Record<string, string> = {
  suculentas: 'Suculentas',
  plantas_de_interior: 'Plantas de Interior',
  aromaticas: 'Aromáticas',
  frutales: 'Frutales',
  cactus: 'Cactus',
  colecciones_raras: 'Colecciones Raras',
  macetas_y_kits: 'Macetas y Kits',
};

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}