import { createBillingManager, validateBilling } from '../src/js/billing.js';
import { matches } from '../src/js/utils.js';

export function sampleBilling(id = 'studio', name = 'Studio') {
  const planId = id === 'personal' ? 'personal' : 'studio';
  return { id, name, revision: 0, currency: 'USD', fractionDigits: 2, period: { start: '2026-10-01', end: '2026-11-01' }, plans: [
    { id: 'personal', name: 'Personal', monthly: 0, yearly: 0, limits: { projects: 3, seats: 1, storageBytes: 5000000 } },
    { id: 'studio', name: 'Studio', monthly: 1900, yearly: 18240, limits: { projects: 30, seats: 5, storageBytes: 50000000 } },
    { id: 'organization', name: 'Organization', monthly: 4900, yearly: 47040, limits: { projects: null, seats: 20, storageBytes: 200000000 } }
  ], subscription: { planId, interval: 'monthly', cancelAtPeriodEnd: false }, usage: { projects: id === 'personal' ? 2 : 6, seats: id === 'personal' ? 1 : 3, storageBytes: id === 'personal' ? 0 : 12000000 }, invoices: planId === 'personal' ? [] : [
    { id: `${id}-sep`, number: `${id.toUpperCase()}-2026-09`, customer: name, issued: '2026-09-01', status: 'paid', items: [{ description: 'Studio plan', quantity: 1, unitAmount: 1900 }], discount: 0, tax: 190, total: 2090, paid: 2090 },
    { id: `${id}-oct`, number: `${id.toUpperCase()}-2026-10`, customer: name, issued: '2026-10-01', status: 'open', items: [{ description: 'Studio plan', quantity: 1, unitAmount: 1900 }], discount: 0, tax: 0, total: 1900, paid: 500 },
    { id: `${id}-aug`, number: `${id.toUpperCase()}-2026-08`, customer: name, issued: '2026-08-01', status: 'void', items: [{ description: 'Studio plan', quantity: 1, unitAmount: 1900 }], discount: 0, tax: 0, total: 1900, paid: 0 }
  ] };
}
/** Preview changes only; applications use verified provider state instead. */
export function applySampleBilling(input, operation) {
  const data = validateBilling(input);
  if (operation.type === 'plan') {
    if (!data.plans.some(plan => plan.id === operation.planId) || !['monthly', 'yearly'].includes(operation.interval)) throw Error('Unknown sample plan or interval.');
    data.subscription.planId = operation.planId; data.subscription.interval = operation.interval;
    const end = new Date(`${data.period.start}T00:00:00Z`), day = end.getUTCDate();
    end.setUTCMonth(end.getUTCMonth() + (operation.interval === 'monthly' ? 1 : 12), 1);
    const last = new Date(end); last.setUTCMonth(last.getUTCMonth() + 1, 0); end.setUTCDate(Math.min(day, last.getUTCDate())); data.period.end = end.toISOString().slice(0, 10);
  }
  else if (['cancel', 'resume'].includes(operation.type)) data.subscription.cancelAtPeriodEnd = operation.type === 'cancel';
  else throw Error('Unknown sample billing action.');
  data.revision++; return validateBilling(data);
}
export function initBillingExamples(root) {
  const cleanups = [];
  const workspaces = matches(root, '[data-rf-billing-workspace]');
  for (const element of workspaces.length ? workspaces : matches(root, '[data-rf-billing-demo]')) {
    const controller = new AbortController(); let data = sampleBilling();
    const manager = createBillingManager(element, { snapshot: data, sample: true, change: async operation => data = applySampleBilling(data, operation), load: async () => data });
    const scenario = element.querySelector('[data-rf-usage-scenario]');
    if (scenario) { scenario.disabled = false; scenario.addEventListener('change', () => { const initial = sampleBilling(), plan = data.plans.find(plan => plan.id === data.subscription.planId); for (const key of Object.keys(data.usage)) data.usage[key] = scenario.value === 'empty' ? 0 : scenario.value === 'normal' ? initial.usage[key] : scenario.value === 'near' ? Math.ceil((plan.limits[key] ?? 100) * .9) : (plan.limits[key] ?? 100) + 1; data.revision++; manager.update(data); }, { signal: controller.signal }); }
    cleanups.push(() => { controller.abort(); manager.destroy(); if (scenario) scenario.disabled = true; });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
