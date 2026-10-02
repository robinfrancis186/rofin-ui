// Public, generated sample records for browser and local HTTP paging demos.
export const sampleGridColumns = [
  { field: 'name', label: 'Project', type: 'text', editable: true, width: 260, maxLength: 80 },
  { field: 'owner', label: 'Owner', type: 'text', editable: true, width: 180, maxLength: 50 },
  { field: 'status', label: 'Status', type: 'text', editable: true, width: 180, options: ['Draft', 'In progress', 'Published'] },
  { field: 'tasks', label: 'Tasks', type: 'number', editable: true, width: 140, min: 0, max: 1000, step: 1 },
  { field: 'updated', label: 'Updated', type: 'date', editable: true, width: 180 }
];
export function sampleGridRows(count = 10000) {
  const names = ['Atlas launch', 'Mobile journal', 'Brand refresh', 'Component library', 'Customer portal', 'Onboarding flow'];
  return Array.from({ length: count }, (_, i) => ({ id: `project-${i + 1}`, name: names[i] || `Project ${String(i + 1).padStart(5, '0')}`, owner: ['Robin', 'Jamie', 'Alex'][i % 3], status: ['Draft', 'In progress', 'Published'][i % 3], tasks: i % 101, updated: `2026-09-${String(i % 30 + 1).padStart(2, '0')}` }));
}
