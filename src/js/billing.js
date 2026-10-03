import { onFormReset, uid } from './utils.js';

const fields = ['projects', 'seats', 'storageBytes'];
const fail = message => { throw Error(message); };
const text = (value, max = 100) => typeof value === 'string' && value.trim() && value.length <= max && !/[\x00-\x1f\x7f]/.test(value) ? value : fail('Invalid billing text.');
const integer = (value, min = 0) => Number.isSafeInteger(value) && value >= min && value <= 1e12 ? value : fail('Invalid billing amount or quota.');
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value ? value : fail('Invalid billing date.');
const interval = value => ['monthly', 'yearly'].includes(value) ? value : fail('Invalid billing interval.');

/** Amounts are integer minor units with an explicit display exponent; never floating prices. */
export function validateBilling(input) {
  if (!input || typeof input !== 'object') fail('Invalid billing snapshot.');
  text(input.id, 64); text(input.name, 80); integer(input.revision);
  if (typeof input.currency !== 'string' || !/^[A-Z]{3}$/.test(input.currency) || !Number.isInteger(input.fractionDigits) || input.fractionDigits < 0 || input.fractionDigits > 3) fail('Supply a currency and its display exponent.');
  if (!input.period || date(input.period.start) >= date(input.period.end)) fail('Invalid billing period.');
  if (!Array.isArray(input.plans) || !input.plans.length || input.plans.length > 10) fail('Use one to ten billing plans.');
  const ids = new Set();
  for (const plan of input.plans) {
    text(plan.id, 64); text(plan.name, 80); if (ids.has(plan.id)) fail('Duplicate plan.'); ids.add(plan.id);
    integer(plan.monthly); integer(plan.yearly);
    for (const key of fields) { if (!plan.limits || plan.limits[key] !== null && !Number.isSafeInteger(plan.limits[key])) fail('Invalid plan quota.'); if (plan.limits[key] !== null) integer(plan.limits[key]); }
  }
  if (!input.subscription || !ids.has(input.subscription.planId) || typeof input.subscription.cancelAtPeriodEnd !== 'boolean') fail('Invalid subscription.');
  interval(input.subscription.interval);
  for (const key of fields) integer(input.usage?.[key]);
  // ponytail: one currency, ten plans and 100 invoices of 30 lines; page larger ledgers in the application.
  if (!Array.isArray(input.invoices) || input.invoices.length > 100) fail('Use at most 100 invoices.');
  ids.clear();
  for (const invoice of input.invoices) {
    text(invoice.id, 64); text(invoice.number, 80); text(invoice.customer, 100); date(invoice.issued);
    if (ids.has(invoice.id) || !['paid', 'open', 'void'].includes(invoice.status) || !Array.isArray(invoice.items) || !invoice.items.length || invoice.items.length > 30) fail('Invalid invoice.'); ids.add(invoice.id);
    let subtotal = 0;
    for (const item of invoice.items) { text(item.description, 200); integer(item.quantity, 1); integer(item.unitAmount); subtotal += item.quantity * item.unitAmount; integer(subtotal); }
    integer(invoice.discount); integer(invoice.tax); integer(invoice.total); integer(invoice.paid);
    if (invoice.discount > subtotal || subtotal - invoice.discount + invoice.tax !== invoice.total || invoice.paid > invoice.total || invoice.status === 'paid' && invoice.paid !== invoice.total || invoice.status === 'void' && invoice.paid !== 0) fail('Invoice totals do not reconcile.');
  }
  return structuredClone(input);
}
export const formatBillingAmount = (snapshot, amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: snapshot.currency, minimumFractionDigits: snapshot.fractionDigits, maximumFractionDigits: snapshot.fractionDigits }).format(integer(amount) / 10 ** snapshot.fractionDigits);
export function invoiceText(input, id, { sample = false } = {}) {
  const data = validateBilling(input), invoice = data.invoices.find(item => item.id === id);
  if (!invoice) fail('Invoice not found.');
  return recordText(data, invoice, sample);
}
function recordText(data, invoice, sample) {
  const money = value => formatBillingAmount(data, value), subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);
  return `${sample ? 'SAMPLE INVOICE — no payment collected; not a tax document' : 'Invoice record'}\nCustomer: ${invoice.customer}\nInvoice: ${invoice.number}\nIssued: ${invoice.issued}\nStatus: ${invoice.status}\nCurrency: ${data.currency}; minor-unit exponent: ${data.fractionDigits}\n\n${invoice.items.map(item => `${item.description} | ${item.quantity} × ${money(item.unitAmount)} = ${money(item.quantity * item.unitAmount)}`).join('\n')}\n\nSubtotal: ${money(subtotal)}\nDiscount: ${money(invoice.discount)}\nTax: ${money(invoice.tax)}\nTotal: ${money(invoice.total)}\nPaid: ${money(invoice.paid)}\nOutstanding: ${money(invoice.status === 'void' ? 0 : invoice.total - invoice.paid)}\n`;
}

const instances = new WeakMap();
const node = (tag, className, value) => { const element = document.createElement(tag); if (className) element.className = className; if (value != null) element.textContent = value; return element; };
async function bounded(callback, context) {
  if (context.signal.aborted) fail('Billing request cancelled.');
  let timer, stop;
  try {
    return await Promise.race([Promise.resolve().then(() => callback(context)), new Promise((resolve, reject) => {
      stop = () => reject(Error('Billing request cancelled.')); context.signal.addEventListener('abort', stop, { once: true });
      timer = setTimeout(() => reject(Error('Billing confirmation timed out.')), 8000);
    })]);
  } finally { clearTimeout(timer); context.signal.removeEventListener('abort', stop); }
}

/** Applications confirm operations using authorized server/provider state; the library makes no requests. */
export function createBillingManager(element, options) {
  if (instances.has(element)) return instances.get(element);
  let snapshot = validateBilling(options.snapshot), busy = false, destroyed = false, uncertain = false, request, generation = 0, pending;
  const controller = new AbortController(), form = element.querySelector('[data-rf-plan-form]'), status = element.querySelector('[data-rf-billing-status]'), dialog = element.querySelector('[data-rf-billing-confirm]');
  const errors = [...new Set([element.querySelector('[data-rf-billing-error]'), dialog?.querySelector('[data-rf-billing-error]')].filter(Boolean))];
  for (const note of element.querySelectorAll('[data-rf-billing-sample-note]')) note.hidden = !options.sample;
  for (const note of element.querySelectorAll('[data-rf-billing-provider-note]')) note.hidden = !!options.sample;
  const hideErrors = () => errors.forEach(error => error.hidden = true), showError = message => errors.forEach(error => { error.textContent = message; error.hidden = false; });
  const money = amount => formatBillingAmount(snapshot, amount), current = () => snapshot.plans.find(plan => plan.id === snapshot.subscription.planId);
  const blocked = () => !!element.closest('fieldset[disabled]') || element.getAttribute('aria-disabled') === 'true';
  const announce = message => { if (status) status.textContent = message; };
  function controls() {
    if (busy) element.setAttribute('aria-busy', 'true'); else element.removeAttribute('aria-busy');
    for (const control of element.querySelectorAll('[data-rf-billing-action], [data-rf-billing-apply]')) control.disabled = destroyed || busy || uncertain || blocked() || !options.change;
    for (const control of element.querySelectorAll('[data-rf-billing-dismiss]')) control.disabled = destroyed || busy;
    if (form) {
      for (const control of form.elements) control.disabled = destroyed || busy || uncertain || blocked() || !options.change;
      const chosen = form.elements.plan.value, selectedInterval = form.elements.interval.value;
      form.querySelector('[type="submit"]').disabled ||= chosen === snapshot.subscription.planId && selectedInterval === snapshot.subscription.interval;
    }
    const cancel = element.querySelector('[data-rf-billing-action="cancel"]');
    if (cancel) { cancel.textContent = snapshot.subscription.cancelAtPeriodEnd ? 'Keep subscription' : 'Schedule cancellation'; cancel.disabled ||= current().monthly === 0 && current().yearly === 0; }
    for (const refresh of element.querySelectorAll('[data-rf-billing-refresh]')) refresh.disabled = destroyed || busy || blocked() || !options.load;
    for (const control of element.querySelectorAll('[data-rf-invoice-search], [data-rf-invoice-filter]')) control.disabled = destroyed || busy || blocked();
    const apply = element.querySelector('[data-rf-billing-apply]'); if (apply) apply.textContent = options.sample ? 'Apply sample change' : 'Request billing change';
    const draftInterval = form?.elements.interval.value || snapshot.subscription.interval;
    for (const price of element.querySelectorAll('[data-rf-plan-price]')) { const plan = snapshot.plans.find(item => item.id === price.dataset.rfPlanPrice); price.textContent = `${money(plan[draftInterval])} / ${draftInterval === 'monthly' ? 'month' : 'year'}`; }
  }
  function filterInvoices() {
    const query = element.querySelector('[data-rf-invoice-search]')?.value.trim().toLocaleLowerCase() || '', filter = element.querySelector('[data-rf-invoice-filter]')?.value || '';
    let count = 0;
    for (const row of element.querySelectorAll('[data-rf-invoice-row]')) { const invoice = snapshot.invoices.find(item => item.id === row.dataset.rfInvoiceRow); row.hidden = !!filter && invoice.status !== filter || !`${invoice.number} ${invoice.issued} ${invoice.status}`.toLocaleLowerCase().includes(query); if (!row.hidden) count++; }
    const empty = element.querySelector('[data-rf-invoice-empty]'); if (empty) empty.hidden = count > 0;
  }
  function render() {
    element.querySelectorAll('[data-rf-billing-name]').forEach(item => item.textContent = snapshot.name);
    const subscription = element.querySelector('[data-rf-subscription-current]');
    if (subscription) subscription.textContent = `${current().name} · ${money(current()[snapshot.subscription.interval])} / ${snapshot.subscription.interval === 'monthly' ? 'month' : 'year'}`;
    const period = element.querySelector('[data-rf-billing-period]'); if (period) period.textContent = `Current period: ${snapshot.period.start} through ${snapshot.period.end} (end exclusive).`;
    const ending = element.querySelector('[data-rf-subscription-state]'); if (ending) ending.textContent = snapshot.subscription.cancelAtPeriodEnd ? `Cancellation scheduled for ${snapshot.period.end}.` : 'No cancellation scheduled.';
    if (form) {
      form.elements.plan.replaceChildren(...snapshot.plans.map(plan => { const option = node('option', '', plan.name); option.value = plan.id; option.defaultSelected = plan.id === snapshot.subscription.planId; return option; }));
      for (const radio of form.querySelectorAll('[name="interval"]')) radio.checked = radio.defaultChecked = radio.value === snapshot.subscription.interval;
      const cards = element.querySelector('[data-rf-plan-cards]'); cards.replaceChildren();
      for (const plan of snapshot.plans) { const card = node('article', 'rf-card rf-stack'), price = node('strong', 'rf-price'); price.dataset.rfPlanPrice = plan.id; card.append(node('h4', 'rf-card__title', plan.name), price, node('p', 'rf-help', fields.map(key => `${key === 'storageBytes' ? 'Storage bytes' : key}: ${plan.limits[key] === null ? 'Unlimited' : plan.limits[key].toLocaleString('en-US')}`).join(' · '))); cards.append(card); }
    }
    const body = element.querySelector('[data-rf-invoice-rows]');
    if (body) {
      const expanded = new Set([...body.querySelectorAll('[data-rf-invoice-row]:has(details[open])')].map(row => row.dataset.rfInvoiceRow));
      body.replaceChildren();
      for (const invoice of [...snapshot.invoices].sort((a, b) => b.issued.localeCompare(a.issued))) {
        const row = node('tr'), heading = node('th'), details = node('details'), download = node('a', 'rf-button rf-button--outline rf-button--small', 'Download invoice text'); row.dataset.rfInvoiceRow = invoice.id; heading.scope = 'row';
        const contents = recordText(snapshot, invoice, options.sample); details.open = expanded.has(invoice.id);
        download.href = `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`; download.download = `invoice-${invoice.id.replace(/[^\w-]/g, '_')}.txt`; download.setAttribute('aria-label', `Download invoice ${invoice.number} as text`);
        details.append(node('summary', '', invoice.number), node('pre', 'rf-billing-invoice', contents), download); heading.append(details); row.append(heading, node('td', '', invoice.issued), node('td', '', money(invoice.total)), node('td', '', invoice.status)); body.append(row);
      }
      filterInvoices();
    }
    const usage = element.querySelector('[data-rf-usage-values]');
    if (usage) {
      usage.replaceChildren();
      for (const key of fields) {
        const used = snapshot.usage[key], limit = current().limits[key], label = key === 'storageBytes' ? 'Storage bytes' : key === 'projects' ? 'Projects' : 'Seats', card = node('article', 'rf-card rf-stack'), heading = node('h4', 'rf-card__title', label), caption = node('p', 'rf-help'), meter = node('meter', 'rf-meter'); card.dataset.rfUsage = key; heading.id = uid('rf-quota'); meter.setAttribute('aria-labelledby', heading.id); meter.min = 0; meter.max = Math.max(1, limit ?? used); meter.value = Math.min(meter.max, used);
        caption.textContent = `${used.toLocaleString('en-US')} of ${limit === null ? 'unlimited' : limit.toLocaleString('en-US')} ${key === 'storageBytes' ? 'bytes' : label.toLowerCase()}.`;
        const state = limit === null ? 'No quota limit.' : used > limit ? `Over limit by ${(used - limit).toLocaleString('en-US')}.` : used === limit ? 'At limit.' : `${(limit - used).toLocaleString('en-US')} remaining.`;
        meter.setAttribute('aria-valuetext', `${caption.textContent} ${state}`);
        card.append(heading, caption); if (limit !== null) card.append(meter); card.append(node('p', 'rf-help', state)); if (limit !== null && (limit === 0 || used / limit >= .8)) card.append(node('p', 'rf-alert', used > limit ? 'Usage exceeds this plan. Review capacity before continuing.' : 'Close to the limit. Make room or review your plan.')); usage.append(card);
      }
    }
    controls();
  }
  async function run(operation) {
    if (destroyed || busy || uncertain || blocked() || !options.change) return;
    busy = true; request = new AbortController(); const version = ++generation; hideErrors(); controls();
    try {
      const next = validateBilling(await bounded(context => options.change(structuredClone(operation), context), { signal: request.signal, revision: snapshot.revision }));
      if (destroyed || version !== generation || request.signal.aborted) return;
      if (next.id !== snapshot.id || next.revision <= snapshot.revision) fail('The application did not confirm a newer snapshot for this workspace.');
      snapshot = next; dialog?.close(); render(); announce(options.sample ? 'Sample change applied for this page session. No payment collected.' : 'Billing change confirmed by the application.'); element.dispatchEvent(new CustomEvent('rf:billing-change', { bubbles: true, detail: { operation: structuredClone(operation), snapshot: structuredClone(snapshot) } }));
    } catch (cause) { if (!destroyed && version === generation && !request.signal.aborted) { uncertain = true; request.abort(); showError(`${cause.message || 'Billing could not be confirmed.'} Refresh to confirm current state before another change.`); } }
    finally { if (!destroyed && version === generation) { busy = false; controls(); if (!dialog?.open) form?.elements.plan.focus({ preventScroll: true }); } }
  }
  function review(operation) {
    if (!dialog || busy || destroyed || uncertain || blocked() || !options.change) return;
    pending = operation;
    const plan = operation.type === 'plan' ? snapshot.plans.find(plan => plan.id === operation.planId) : current(); if (!plan || operation.type === 'plan' && !['monthly', 'yearly'].includes(operation.interval)) return;
    dialog.querySelector('[data-rf-billing-review]').textContent = operation.type === 'plan' ? `Requested plan: ${plan.name}, ${money(plan[operation.interval])} per ${operation.interval === 'monthly' ? 'month' : 'year'}.` : operation.type === 'cancel' ? `Schedule cancellation for ${snapshot.period.end}.` : 'Keep the current subscription beyond this period.';
    hideErrors(); dialog.showModal();
  }
  form?.addEventListener('submit', event => { event.preventDefault(); if (form.checkValidity() && !form.querySelector('[type="submit"]').disabled) review({ type: 'plan', planId: form.elements.plan.value, interval: form.elements.interval.value }); }, { signal: controller.signal });
  element.addEventListener('change', controls, { signal: controller.signal });
  element.addEventListener('input', filterInvoices, { signal: controller.signal });
  element.addEventListener('change', filterInvoices, { signal: controller.signal });
  element.addEventListener('click', event => {
    const action = event.target.closest('[data-rf-billing-action]');
    if (action && !action.disabled) review({ type: snapshot.subscription.cancelAtPeriodEnd ? 'resume' : 'cancel' });
    const confirm = event.target.closest('[data-rf-billing-apply]'); if (confirm && !confirm.disabled && pending) run(pending);
    if (event.target.closest('[data-rf-billing-dismiss]') && !busy) dialog?.close();
    if (event.target.closest('[data-rf-billing-refresh]')) manager.refresh();
  }, { signal: controller.signal });
  dialog?.addEventListener('cancel', event => { if (busy) event.preventDefault(); }, { signal: controller.signal });
  const stopReset = onFormReset(form, () => { controls(); if (!uncertain) hideErrors(); announce('Plan selection reset. Confirmed billing data is unchanged.'); }, controller.signal);
  const manager = {
    getSnapshot: () => structuredClone(snapshot),
    update(input) {
      if (destroyed) return false; const next = validateBilling(input); if (next.id !== snapshot.id || next.revision < snapshot.revision) fail('Cannot replace billing with a stale or different workspace.');
      const draft = form && !uncertain && JSON.stringify(next.subscription) === JSON.stringify(snapshot.subscription) ? { plan: form.elements.plan.value, interval: form.elements.interval.value } : null;
      generation++; request?.abort(); busy = false; uncertain = false; dialog?.close(); snapshot = next; hideErrors(); render();
      if (draft && snapshot.plans.some(plan => plan.id === draft.plan)) { form.elements.plan.value = draft.plan; form.elements.interval.value = draft.interval; controls(); }
      return true;
    },
    async refresh() {
      if (destroyed || busy || blocked() || !options.load) return; busy = true; request = new AbortController(); const version = ++generation; controls();
      try { const next = await bounded(options.load, { signal: request.signal }); if (destroyed || version !== generation || request.signal.aborted) return; manager.update(next); announce('Billing data refreshed.'); }
      catch (cause) { if (!destroyed && version === generation && !request.signal.aborted) { request.abort(); showError(cause.message || 'Billing data could not be refreshed.'); } }
      finally { if (!destroyed && version === generation) { busy = false; controls(); } }
    },
    destroy() { if (destroyed) return; destroyed = true; generation++; request?.abort(); controller.abort(); stopReset(); dialog?.close(); busy = false; const search = element.querySelector('[data-rf-invoice-search]'), filter = element.querySelector('[data-rf-invoice-filter]'); if (search) { search.value = ''; search.disabled = true; } if (filter) { filter.value = ''; filter.disabled = true; } filterInvoices(); controls(); instances.delete(element); }
  };
  instances.set(element, manager); hideErrors(); announce(''); render(); return manager;
}
