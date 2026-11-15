(() => {
  'use strict';

  // ---------- Constanten ----------
  const STORE = 'bordje:v1';
  const MEALS = [
    { id: 'breakfast', name: 'Ontbijt' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Avondeten' },
    { id: 'snack', name: 'Tussendoor' }
  ];
  const MACROS = [
    { id: 'carbs', name: 'Koolhydraten', short: 'Koolh.', color: 'var(--carbs)', kcal: 4 },
    { id: 'protein', name: 'Eiwit', short: 'Eiwit', color: 'var(--protein)', kcal: 4 },
    { id: 'fat', name: 'Vet', short: 'Vet', color: 'var(--fat)', kcal: 9 }
  ];
  const PRESETS = [
    { name: 'Gebalanceerd', carbs: 50, protein: 20, fat: 30 },
    { name: 'Eiwitrijk', carbs: 40, protein: 30, fat: 30 },
    { name: 'Sportief', carbs: 55, protein: 25, fat: 20 },
    { name: 'Koolhydraatarm', carbs: 25, protein: 30, fat: 45 },
    { name: 'Keto', carbs: 5, protein: 25, fat: 70 }
  ];
  const ACTIVITY = [
    { f: 1.2, name: 'Zittend (weinig of geen sport)' },
    { f: 1.375, name: 'Licht actief (1–3× per week sport)' },
    { f: 1.55, name: 'Gemiddeld actief (3–5× per week)' },
    { f: 1.725, name: 'Zeer actief (6–7× per week)' },
    { f: 1.9, name: 'Extreem actief (fysiek werk + sport)' }
  ];
  const GOALS = [
    { d: -750, name: 'Snel afvallen (±0,75 kg/week)' },
    { d: -500, name: 'Afvallen (±0,5 kg/week)' },
    { d: -250, name: 'Rustig afvallen (±0,25 kg/week)' },
    { d: 0, name: 'Gewicht behouden' },
    { d: 250, name: 'Rustig aankomen (±0,25 kg/week)' },
    { d: 500, name: 'Aankomen (±0,5 kg/week)' }
  ];
  const NUTRIENTS = [
    { id: 'kcal', name: 'Energie', unit: 'kcal' },
    { id: 'carbs', name: 'Koolhydraten', unit: 'g' },
    { id: 'sugar', name: 'waarvan suikers', unit: 'g', sub: true },
    { id: 'protein', name: 'Eiwit', unit: 'g' },
    { id: 'fat', name: 'Vet', unit: 'g' },
    { id: 'satfat', name: 'waarvan verzadigd', unit: 'g', sub: true },
    { id: 'fiber', name: 'Vezels', unit: 'g' },
    { id: 'salt', name: 'Zout', unit: 'g' }
  ];
  const OFF_FIELDS = 'code,product_name,product_name_nl,product_name_en,generic_name,generic_name_nl,brands,quantity,product_quantity,serving_size,serving_quantity,nutriments,image_front_small_url,image_small_url,countries_tags';

  const ICON = {
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    barcode: '<svg viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M10 8v8M13 8v8M17 8v8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 3 0-3 0-5.5 1-8.5Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" fill="none"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" fill="none"/></svg>'
  };

  // ---------- Helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 0) => (n == null || !isFinite(n)) ? '–' : Number(n).toLocaleString('nl-NL', { maximumFractionDigits: d });
  const fmtG = (n) => (n == null || !isFinite(n)) ? '–' : fmt(n, Math.abs(n) < 10 ? 1 : 0);
  const num = (v) => {
    if (v == null || v === '') return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9% ]+/g, ' ').trim();
  const pad = (n) => String(n).padStart(2, '0');
  const dkey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
  const mealName = (id) => (MEALS.find((m) => m.id === id) || MEALS[0]).name;
  const defaultMeal = () => {
    const h = new Date().getHours();
    return h < 11 ? 'breakfast' : h < 15 ? 'lunch' : h < 17 ? 'snack' : h < 21 ? 'dinner' : 'snack';
  };

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // ---------- Opslag ----------
  const defaults = () => ({
    version: 1,
    settings: { kcal: 2000, macro: { carbs: 50, protein: 20, fat: 30 }, profile: null, setupDone: false },
    diary: {},
    recents: [],
    custom: []
  });
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE));
      if (d && d.settings) {
        const base = defaults();
        return { ...base, ...d, settings: { ...base.settings, ...d.settings, macro: { ...base.settings.macro, ...(d.settings.macro || {}) } } };
      }
    } catch (e) { /* leeg */ }
    return defaults();
  }
  let db = load();
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(db)); }
    catch (e) { toast('Opslaan mislukt – opslag vol?'); }
  }
  let persistAsked = false;
  function askPersist() {
    if (persistAsked) return;
    persistAsked = true;
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* ok */ }
  }

  // ---------- Voedingsmodel ----------
  // food = { key, source, name, brand, image, code, n: {kcal, carbs, ...} per 100 g, units: [{name, g, label?}] }
  const BASE = (window.BASE_FOODS || []).map(([name, kcal, protein, carbs, fat, fiber, units]) => ({
    key: 'base:' + name,
    source: 'base',
    name,
    n: { kcal, carbs, protein, fat, fiber, sugar: null, satfat: null, salt: null },
    units: [{ name: 'gram', g: 1 }, ...Object.entries(units || {}).map(([u, g]) => ({ name: u, g }))]
  }));
  BASE.forEach((f) => { f._s = norm(f.name); });

  function nutrientsFor(food, grams) {
    const out = {};
    NUTRIENTS.forEach(({ id }) => {
      const v = food.n ? food.n[id] : null;
      out[id] = v == null ? null : (v * grams) / 100;
    });
    return out;
  }
  function entryNutrients(e) { return nutrientsFor(e.food, e.grams); }
  function unitLabel(u) { return u.label || (u.g === 1 ? 'gram' : `${u.name} (${fmt(u.g, 1)} g)`); }
  function amountText(e) {
    if (e.food.source === 'quick') return 'Snel toegevoegd';
    const u = e.food.units[e.unit] || e.food.units[0];
    if (u.g === 1) return `${fmt(e.qty, 1)} g`;
    return `${fmt(e.qty, 2)} ${u.name} · ${fmt(e.grams)} g`;
  }
  function defaultGrams(food) {
    if (food.lastUnit != null && food.units[food.lastUnit] && food.lastQty) {
      return Math.round(food.lastQty * food.units[food.lastUnit].g * 10) / 10;
    }
    return 100;
  }
  function defaultAmount(food) {
    if (food.lastUnit != null && food.units[food.lastUnit]) return { unit: food.lastUnit, qty: food.lastQty || 1 };
    const i = food.units.findIndex((u) => u.g !== 1);
    if (i > 0) return { unit: i, qty: 1 };
    return { unit: 0, qty: 100 };
  }
  function cleanFood(food) {
    const { _s, lastUnit, lastQty, ...rest } = food;
    return JSON.parse(JSON.stringify(rest));
  }
  function remember(food, unit, qty) {
    if (food.source === 'quick') return;
    const f = cleanFood(food);
    f.lastUnit = unit;
    f.lastQty = qty;
    db.recents = [f, ...db.recents.filter((r) => r.key !== f.key)].slice(0, 40);
  }

  // ---------- Open Food Facts ----------
  function pickText(v) {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.filter(Boolean).join(', ');
    if (typeof v === 'object') return v.nl || v.main || v.en || Object.values(v)[0] || '';
    return String(v);
  }
  function parseOFF(p) {
    if (!p) return null;
    const nu = p.nutriments || {};
    let kcal = num(nu['energy-kcal_100g']);
    if (kcal == null) {
      const kj = num(nu['energy-kj_100g'] ?? nu['energy_100g']);
      if (kj != null) kcal = kj / 4.184;
    }
    const name = pickText(p.product_name_nl) || pickText(p.product_name) || pickText(p.product_name_en) || pickText(p.generic_name_nl) || pickText(p.generic_name);
    if (kcal == null || !name) return null;
    const units = [{ name: 'gram', g: 1 }];
    const sq = num(p.serving_quantity);
    const ss = pickText(p.serving_size);
    if (sq && sq > 0) units.push({ name: 'portie', g: sq, label: `portie${ss ? ' · ' + ss : ''} (${fmt(sq, 1)} g)` });
    const pq = num(p.product_quantity);
    const qty = pickText(p.quantity);
    if (pq && pq > 0 && pq !== sq && pq <= 5000) units.push({ name: 'verpakking', g: pq, label: `hele verpakking${qty ? ' · ' + qty : ''} (${fmt(pq)} g)` });
    const brand = pickText(p.brands).split(',')[0].trim();
    const countries = Array.isArray(p.countries_tags) ? p.countries_tags : [];
    return {
      key: 'off:' + (p.code || name),
      source: 'off',
      code: p.code ? String(p.code) : '',
      name: name.trim(),
      brand,
      quantity: qty,
      image: p.image_front_small_url || p.image_small_url || '',
      local: countries.includes('en:netherlands') || countries.includes('en:belgium'),
      n: {
        kcal,
        carbs: num(nu.carbohydrates_100g),
        sugar: num(nu.sugars_100g),
        protein: num(nu.proteins_100g),
        fat: num(nu.fat_100g),
        satfat: num(nu['saturated-fat_100g']),
        fiber: num(nu.fiber_100g),
        salt: num(nu.salt_100g)
      },
      units
    };
  }
  function fetchTimeout(url, ms, signal) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
    return fetch(url, { signal: ctl.signal, headers: { Accept: 'application/json' } }).finally(() => clearTimeout(t));
  }
  function rankOFF(list, q) {
    const nq = norm(q);
    const seen = new Set();
    return list
      .filter((f) => { if (seen.has(f.key)) return false; seen.add(f.key); return true; })
      .map((f, i) => {
        const nn = norm(f.name + ' ' + (f.brand || ''));
        let s = i;
        if (f.local) s -= 40;
        if (nn.startsWith(nq)) s -= 15;
        else if (nn.includes(nq)) s -= 8;
        return [s, f];
      })
      .sort((a, b) => a[0] - b[0])
      .map((x) => x[1]);
  }
  const offCache = new Map();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const aborted = () => new DOMException('Aborted', 'AbortError');
  // Open Food Facts geeft regelmatig even "503 tijdelijk niet beschikbaar" terug.
  // Daarom proberen we het een paar keer (afwisselend via de NL- en wereldserver).
  async function offGetJSON(urls, signal, onRetry) {
    let lastErr;
    for (let i = 0; i < urls.length; i++) {
      if (i) {
        if (onRetry) onRetry(i);
        await sleep(Math.min(350 * i, 1500));
      }
      if (signal && signal.aborted) throw aborted();
      try {
        const r = await fetchTimeout(urls[i], 12000, signal);
        if (r.status === 404) return { notFound: true };
        if (!r.ok) { lastErr = new Error('HTTP ' + r.status); continue; }
        return await r.json();
      } catch (e) {
        if (signal && signal.aborted) throw e;
        lastErr = e;
      }
    }
    throw lastErr || new Error('mislukt');
  }
  async function offSearch(q, signal, onRetry) {
    const key = norm(q);
    if (offCache.has(key)) return offCache.get(key);
    const qs = `search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=40&fields=${OFF_FIELDS}`;
    const urls = ['nl', 'world', 'nl', 'world', 'nl', 'world', 'nl'].map((h) => `https://${h}.openfoodfacts.org/cgi/search.pl?${qs}&lc=nl`);
    let results;
    try {
      const j = await offGetJSON(urls, signal, onRetry);
      results = (j.products || []).map(parseOFF).filter(Boolean);
    } catch (e) {
      if (signal && signal.aborted) throw e;
      // Laatste redmiddel: de nieuwe zoekmachine (werkt alleen als die browsers toelaat)
      const r = await fetchTimeout(`https://search.openfoodfacts.org/search?q=${encodeURIComponent(q)}&page_size=40&langs=nl,en&fields=${OFF_FIELDS}`, 8000, signal);
      if (!r.ok) throw e;
      const j = await r.json();
      results = (j.hits || []).map(parseOFF).filter(Boolean);
    }
    results = rankOFF(results, q).slice(0, 30);
    offCache.set(key, results);
    return results;
  }
  async function offProduct(code) {
    const path = `/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`;
    const j = await offGetJSON(['world', 'nl', 'world', 'nl'].map((h) => `https://${h}.openfoodfacts.org${path}`));
    if (j.notFound || !j.product || j.status === 0) return { found: false };
    const food = parseOFF({ code, ...j.product });
    return { found: true, food, raw: j.product };
  }

  // ---------- Lokaal zoeken ----------
  function localSearch(q) {
    const tokens = norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const pool = [
      ...db.custom.map((f) => ({ ...f, _s: norm(f.name + ' ' + (f.brand || '') + ' ' + (f.code || '')) })),
      ...db.recents.filter((f) => f.source === 'off').map((f) => ({ ...f, _s: norm(f.name + ' ' + (f.brand || '')) })),
      ...BASE
    ];
    const seen = new Set();
    const out = [];
    for (const f of pool) {
      if (seen.has(f.key)) continue;
      if (!tokens.every((t) => f._s.includes(t))) continue;
      seen.add(f.key);
      let score = 0;
      if (f._s.startsWith(tokens[0])) score -= 10;
      if (f._s.split(' ').some((w) => w === tokens[0])) score -= 5;
      if (f.source === 'custom') score -= 3;
      score += f._s.length / 40;
      out.push([score, f]);
    }
    return out.sort((a, b) => a[0] - b[0]).slice(0, 25).map((x) => x[1]);
  }

  // ---------- Sheets ----------
  const stack = [];
  function openSheet({ title, left = 'close', foot = true }) {
    const el = document.createElement('section');
    el.className = 'sheet';
    el.innerHTML = `
      <header class="sheet-head">
        <button class="iconbtn" data-close aria-label="${left === 'back' ? 'Terug' : 'Sluiten'}">${left === 'back' ? ICON.back : ICON.close}</button>
        <h2>${esc(title)}</h2>
        <div class="spacer"></div>
      </header>
      <div class="sheet-body"></div>
      ${foot ? '<div class="sheet-foot"></div>' : ''}`;
    $('#sheets').appendChild(el);
    const s = { el, body: $('.sheet-body', el), foot: $('.sheet-foot', el), onClose: null, setTitle: (t) => { $('h2', el).textContent = t; } };
    $('[data-close]', el).addEventListener('click', () => closeSheet(s));
    stack.push(s);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    return s;
  }
  function closeSheet(s) {
    const i = stack.indexOf(s);
    if (i < 0) return;
    stack.splice(i, 1);
    if (s.onClose) s.onClose();
    s.el.classList.remove('in');
    setTimeout(() => s.el.remove(), 320);
  }
  function closeAll() { [...stack].reverse().forEach(closeSheet); }

  // ---------- App-weergave ----------
  const ui = { tab: 'diary', date: dkey(new Date()) };

  function render() {
    $$('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === ui.tab));
    if (ui.tab === 'diary') renderDiary();
    else renderSettings();
  }

  function macroTargets() {
    const k = db.settings.kcal;
    const m = db.settings.macro;
    return {
      carbs: (k * m.carbs) / 100 / 4,
      protein: (k * m.protein) / 100 / 4,
      fat: (k * m.fat) / 100 / 9
    };
  }
  function sumEntries(list) {
    const t = { kcal: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, fiber: 0, satfat: 0, salt: 0 };
    const has = {};
    list.forEach((e) => {
      const n = entryNutrients(e);
      Object.keys(t).forEach((k) => { if (n[k] != null) { t[k] += n[k]; has[k] = true; } });
    });
    t.has = has;
    return t;
  }
  function dayTitle(k) {
    const today = dkey(new Date());
    if (k === today) return 'Vandaag';
    if (k === addDays(today, -1)) return 'Gisteren';
    if (k === addDays(today, 1)) return 'Morgen';
    return parseKey(k).toLocaleDateString('nl-NL', { weekday: 'long' }).replace(/^./, (c) => c.toUpperCase());
  }

  function renderDiary() {
    const entries = db.diary[ui.date] || [];
    const tot = sumEntries(entries);
    const target = db.settings.kcal;
    const left = target - tot.kcal;
    const over = left < 0;
    const R = 62;
    const C = 2 * Math.PI * R;
    const prog = Math.min(tot.kcal / target, 1) || 0;
    const mt = macroTargets();
    const full = parseKey(ui.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

    const extras = [];
    if (tot.has.fiber) extras.push(`Vezels <b>${fmtG(tot.fiber)} g</b>`);
    if (tot.has.sugar) extras.push(`Suikers <b>${fmtG(tot.sugar)} g</b>`);
    if (tot.has.satfat) extras.push(`Verz. vet <b>${fmtG(tot.satfat)} g</b>`);
    if (tot.has.salt) extras.push(`Zout <b>${fmtG(tot.salt)} g</b>`);

    $('#app').innerHTML = `
      <div class="datebar">
        <button class="iconbtn" data-day="-1" aria-label="Vorige dag">${ICON.back}</button>
        <h1 data-today>${esc(dayTitle(ui.date))}<small>${esc(full)}</small></h1>
        <button class="iconbtn" data-day="1" aria-label="Volgende dag">${ICON.next}</button>
      </div>

      ${!db.settings.setupDone ? `
        <div class="card">
          <h3>Welkom 👋</h3>
          <p class="muted" style="margin:0 0 12px">Stel eerst je dagelijkse caloriedoel in. Vul zelf een getal in, of laat het berekenen op basis van lengte, gewicht en activiteit.</p>
          <div class="grid2"><button class="btn secondary" data-setup-manual>Zelf invullen</button><button class="btn" data-setup>Berekenen</button></div>
        </div>` : ''}

      <div class="card">
        <div class="summary">
          <div class="ring ${over ? 'over' : ''}">
            <svg viewBox="0 0 150 150"><circle class="track" cx="75" cy="75" r="${R}"/><circle class="bar" cx="75" cy="75" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - prog)}"/></svg>
            <div class="center"><div class="big">${fmt(Math.abs(left))}</div><div class="lbl">${over ? 'kcal te veel' : 'kcal over'}</div></div>
          </div>
          <div class="kstats">
            <div class="kstat"><span>Gegeten</span><b>${fmt(tot.kcal)}</b></div>
            <div class="kstat"><span>Doel</span><b>${fmt(target)}</b></div>
            <div class="kstat"><span>${over ? 'Te veel' : 'Over'}</span><b>${fmt(Math.abs(left))}</b></div>
          </div>
        </div>
        <div class="macros">
          ${MACROS.map((m) => {
            const v = tot[m.id];
            const t = mt[m.id];
            const pct = t ? Math.min(100, (v / t) * 100) : 0;
            return `<div class="macro ${v > t * 1.05 ? 'over' : ''}">
              <div class="name"><span class="dot" style="background:${m.color}"></span>${m.name === 'Koolhydraten' ? 'Koolh.' : m.name}</div>
              <div class="track"><div class="fill" style="width:${pct}%;background:${m.color}"></div></div>
              <div class="val"><b>${fmt(v)}</b><small> / ${fmt(t)} g</small></div>
            </div>`;
          }).join('')}
        </div>
        ${extras.length ? `<div class="extras">${extras.map((x) => `<span>${x}</span>`).join('')}</div>` : ''}
      </div>

      ${MEALS.map((meal) => {
        const list = entries.filter((e) => e.meal === meal.id);
        const mt2 = sumEntries(list);
        return `<section class="card meal">
          <div class="meal-head">
            <div><h2>${meal.name}</h2><div class="sub">${list.length ? `${fmt(mt2.kcal)} kcal` : 'Nog niets toegevoegd'}</div></div>
            <button class="addbtn" data-add="${meal.id}" aria-label="Toevoegen aan ${meal.name}">${ICON.plus}</button>
          </div>
          ${list.length ? `
            <div class="meal-macros">
              ${MACROS.map((m) => `<i style="--c:${m.color}">${m.short} ${fmtG(mt2[m.id])} g</i>`).join('')}
            </div>
            <ul class="items">${list.map((e) => `
              <li><button class="item" data-entry="${e.id}">
                ${thumb(e.food)}
                <div class="main"><div class="t">${esc(e.food.name)}</div><div class="s">${esc([e.food.brand, amountText(e)].filter(Boolean).join(' · '))}</div></div>
                <div class="k">${fmt(entryNutrients(e).kcal)} <small>kcal</small></div>
              </button></li>`).join('')}
            </ul>` : ''}
        </section>`;
      }).join('')}
    `;

    $$('[data-day]').forEach((b) => b.addEventListener('click', () => { ui.date = addDays(ui.date, +b.dataset.day); renderDiary(); }));
    $('[data-today]').addEventListener('click', () => { ui.date = dkey(new Date()); renderDiary(); });
    const setup = $('[data-setup]');
    if (setup) setup.addEventListener('click', () => openCalculator());
    const setupManual = $('[data-setup-manual]');
    if (setupManual) setupManual.addEventListener('click', openManualTarget);
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => openAdd(b.dataset.add)));
    $$('[data-entry]').forEach((b) => b.addEventListener('click', () => {
      const e = (db.diary[ui.date] || []).find((x) => x.id === b.dataset.entry);
      if (!e) return;
      if (e.food.source === 'quick') openQuickAdd(e.meal, e);
      else openDetail(e.food, { entry: e });
    }));
  }

  function thumb(food) {
    if (food.image) return `<img class="thumb" src="${esc(food.image)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb',textContent:'${esc((food.name || '?')[0].toUpperCase())}'}))">`;
    if (food.source === 'quick') return `<div class="thumb">${ICON.flame.replace('<svg', '<svg width="20" height="20"')}</div>`;
    return `<div class="thumb">${esc((food.name || '?')[0].toUpperCase())}</div>`;
  }

  // ---------- Toevoegen: zoeken ----------
  function openAdd(meal) {
    const s = openSheet({ title: `Toevoegen aan ${mealName(meal)}`, foot: false });
    const st = { q: '', online: null, status: 'idle', ctl: null, timer: null, meal };
    s.body.innerHTML = `
      <div class="searchrow">
        <label class="search">${ICON.search}<input type="search" placeholder="Zoek product of merk" autocomplete="off" autocorrect="off" enterkeyhint="search"></label>
        <button class="scanbtn" aria-label="Barcode scannen">${ICON.barcode}</button>
      </div>
      <div data-results></div>`;
    const input = $('input', s.body);
    const box = $('[data-results]', s.body);

    function list(foods, emptyText) {
      if (!foods.length) return `<div class="list"><div class="empty">${emptyText}</div></div>`;
      return `<div class="list">${foods.map((f, i) => {
        const grams = defaultGrams(f);
        const kc = (f.n.kcal * grams) / 100;
        const sub = [f.brand, `${fmt(grams, 1)} g`].filter(Boolean).join(' · ');
        return `<button class="item" data-food="${i}">
          ${thumb(f)}
          <div class="main"><div class="t">${esc(f.name)}${f.source === 'custom' ? '<span class="badge">eigen</span>' : ''}</div><div class="s">${esc(sub)}</div></div>
          <div class="k">${fmt(kc)} <small>kcal</small></div>
        </button>`;
      }).join('')}</div>`;
    }
    function bind(foods, root) {
      $$('[data-food]', root).forEach((b) => b.addEventListener('click', () => openDetail(foods[+b.dataset.food], { meal: st.meal, parent: s })));
    }

    function draw() {
      if (!st.q.trim()) {
        box.innerHTML = `
          <div class="quick">
            <button class="chipbtn" data-quick>${ICON.flame}Snel calorieën toevoegen</button>
            <button class="chipbtn" data-new>${ICON.edit}Eigen product maken</button>
          </div>
          <div class="section-label">Recent</div><div data-recent></div>
          ${db.custom.length ? '<div class="section-label">Mijn producten</div><div data-custom></div>' : ''}
          <p class="note">Zoek in de ingebouwde basislijst én in Open Food Facts (miljoenen merkproducten). Of scan de barcode op de verpakking.</p>`;
        const rec = $('[data-recent]', box);
        rec.innerHTML = list(db.recents.slice(0, 20), 'Producten die je toevoegt verschijnen hier.');
        bind(db.recents.slice(0, 20), rec);
        const cu = $('[data-custom]', box);
        if (cu) { cu.innerHTML = list(db.custom, ''); bind(db.custom, cu); }
        $('[data-quick]', box).addEventListener('click', () => openQuickAdd(st.meal, null, s));
        $('[data-new]', box).addEventListener('click', () => openCustom(null, { meal: st.meal, parent: s }));
        return;
      }
      const local = localSearch(st.q);
      let onlineHtml;
      if (st.status === 'loading') onlineHtml = '<div class="list"><div class="loading"><div class="spinner"></div>Zoeken in Open Food Facts…</div></div>';
      else if (st.status === 'error') onlineHtml = '<div class="list"><div class="empty">Online zoeken lukt niet (geen internet of de database is druk).<br><button class="linkbtn" data-retry>Opnieuw proberen</button></div></div>';
      else if (st.status === 'done') onlineHtml = st.online.length ? '<div data-online></div>' : '<div class="list"><div class="empty">Niets gevonden. Probeer een andere zoekterm of het merk.</div></div>';
      else onlineHtml = '<div class="list"><button class="linkbtn" data-go>Zoek “' + esc(st.q) + '” online</button></div>';
      box.innerHTML = `
        ${local.length ? `<div class="section-label">Basis & eigen<span class="src">${local.length}</span></div><div data-local></div>` : ''}
        <div class="section-label">Open Food Facts<span class="src">merkproducten</span></div>
        ${onlineHtml}
        <div class="list" style="margin-top:14px"><button class="linkbtn" data-new>+ Niet gevonden? Maak een eigen product</button></div>`;
      const lb = $('[data-local]', box);
      if (lb) { lb.innerHTML = list(local, ''); bind(local, lb); }
      const ob = $('[data-online]', box);
      if (ob) { ob.innerHTML = list(st.online, ''); bind(st.online, ob); }
      const go = $('[data-go]', box) || $('[data-retry]', box);
      if (go) go.addEventListener('click', () => runOnline());
      $('[data-new]', box).addEventListener('click', () => openCustom({ name: st.q }, { meal: st.meal, parent: s }));
    }

    async function runOnline() {
      const q = st.q.trim();
      if (q.length < 2) return;
      if (st.ctl) st.ctl.abort();
      const ctl = new AbortController();
      st.ctl = ctl;
      st.status = 'loading';
      draw();
      try {
        const res = await offSearch(q, ctl.signal, () => {
          const l = $('.loading', box);
          if (l && !ctl.signal.aborted) l.lastChild.textContent = 'Database is druk, nog even proberen…';
        });
        if (ctl.signal.aborted || st.q.trim() !== q) return;
        st.online = res;
        st.status = 'done';
      } catch (e) {
        if (ctl.signal.aborted) return;
        st.status = 'error';
      }
      draw();
    }

    input.addEventListener('input', () => {
      st.q = input.value;
      st.status = 'idle';
      st.online = null;
      if (st.ctl) st.ctl.abort();
      clearTimeout(st.timer);
      if (st.q.trim().length >= 3) st.timer = setTimeout(runOnline, 1100);
      draw();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); clearTimeout(st.timer); input.blur(); runOnline(); }
    });
    $('.scanbtn', s.body).addEventListener('click', () => openScanner(st.meal, s));
    s.onClose = () => { if (st.ctl) st.ctl.abort(); clearTimeout(st.timer); };
    s.refresh = draw;
    draw();
  }

  // ---------- Productdetail / portie ----------
  function openDetail(food, { meal, entry, parent } = {}) {
    const editing = !!entry;
    const s = openSheet({ title: editing ? 'Bewerken' : 'Product', left: editing ? 'close' : 'back' });
    const g0 = editing ? Math.round(entry.grams * 10) / 10 : defaultGrams(food);
    const st = { meal: editing ? entry.meal : (meal || defaultMeal()) };

    s.body.innerHTML = `
      <div class="prod-head">
        ${food.image ? `<img src="${esc(food.image)}" alt="">` : `<div class="thumb" style="width:64px;height:64px;font-size:26px">${esc((food.name || '?')[0].toUpperCase())}</div>`}
        <div><h3>${esc(food.name)}</h3><p>${esc([food.brand, food.quantity].filter(Boolean).join(' · ')) || (food.source === 'base' ? 'Basisvoedingsmiddel' : food.source === 'custom' ? 'Eigen product' : '')}</p></div>
      </div>
      <label class="gram-field">
        <input type="text" inputmode="decimal" enterkeyhint="done" value="${fmt(g0, 1)}" aria-label="Hoeveelheid in gram" data-qty>
        <span>gram</span>
      </label>
      <div class="mealpick" style="margin-top:10px">${MEALS.map((m) => `<button data-meal="${m.id}" class="${m.id === st.meal ? 'on' : ''}">${m.name}</button>`).join('')}</div>
      <div data-nutri></div>
      <div class="card" style="margin-top:4px">
        <table class="nt"><thead><tr><th>Voedingswaarde</th><th>per 100 g</th><th>jouw hoeveelheid</th></tr></thead><tbody data-table></tbody></table>
      </div>
      <p class="note">${food.source === 'off' ? `Bron: Open Food Facts${food.code ? ' · barcode ' + esc(food.code) : ''}. Waarden komen van de verpakking zoals ingevoerd door gebruikers.` : food.source === 'base' ? 'Gemiddelde waarden voor dit voedingsmiddel. Voor merkproducten: zoek online of scan de barcode.' : 'Eigen product.'}</p>
      ${food.source === 'custom' ? `<div class="btnrow" style="margin-top:12px"><button class="btn secondary" data-editcustom>Product bewerken</button></div>` : ''}`;

    s.foot.innerHTML = `<div class="btnrow">
      <button class="btn" data-save>${editing ? 'Opslaan' : 'Toevoegen'}</button>
      ${editing ? '<button class="btn danger" data-del>Verwijderen uit dagboek</button>' : ''}
    </div>`;

    const qtyIn = $('[data-qty]', s.body);
    function grams() { return num(qtyIn.value) || 0; }
    function update() {
      const g = grams();
      const n = nutrientsFor(food, g);
      const mk = MACROS.map((m) => (n[m.id] || 0) * m.kcal);
      const tk = mk.reduce((a, b) => a + b, 0) || 1;
      $('[data-nutri]', s.body).innerHTML = `
        <div class="nutri-big">
          <div><b>${fmt(n.kcal)}</b><span>kcal</span></div>
          ${MACROS.map((m) => `<div><b>${fmtG(n[m.id])}</b><span><i style="background:${m.color}"></i>${m.short} g</span></div>`).join('')}
        </div>
        <div class="split">${MACROS.map((m, i) => `<div style="width:${(mk[i] / tk) * 100}%;background:${m.color}" title="${m.name}"></div>`).join('')}</div>`;
      $('[data-table]', s.body).innerHTML = NUTRIENTS.map((x) => `
        <tr class="${x.sub ? 'sub' : ''}"><td>${x.name}</td>
        <td>${food.n[x.id] == null ? '–' : (x.id === 'kcal' ? fmt(food.n[x.id]) : fmtG(food.n[x.id])) + ' ' + x.unit}</td>
        <td>${n[x.id] == null ? '–' : (x.id === 'kcal' ? fmt(n[x.id]) : fmtG(n[x.id])) + ' ' + x.unit}</td></tr>`).join('');
      $('[data-save]', s.foot).disabled = !(g > 0);
    }
    qtyIn.addEventListener('input', update);
    qtyIn.addEventListener('focus', () => setTimeout(() => qtyIn.select(), 0));
    qtyIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('[data-save]', s.foot).click(); } });
    $$('[data-meal]', s.body).forEach((b) => b.addEventListener('click', () => {
      st.meal = b.dataset.meal;
      $$('[data-meal]', s.body).forEach((x) => x.classList.toggle('on', x === b));
    }));
    const ec = $('[data-editcustom]', s.body);
    if (ec) ec.addEventListener('click', () => { closeSheet(s); openCustom(food, { meal: st.meal, parent }); });

    $('[data-save]', s.foot).addEventListener('click', () => {
      const g = grams();
      if (!(g > 0)) return;
      const qty = g;
      const unit = 0;
      const day = (db.diary[ui.date] = db.diary[ui.date] || []);
      if (editing) {
        Object.assign(entry, { qty, unit, grams: g, meal: st.meal });
      } else {
        day.push({ id: uid(), meal: st.meal, food: cleanFood(food), qty, unit, grams: g, at: Date.now() });
      }
      remember(food, unit, qty);
      save();
      askPersist();
      closeSheet(s);
      renderDiary();
      if (parent && parent.refresh) parent.refresh();
      toast(editing ? 'Opgeslagen' : `✓ ${food.name} toegevoegd aan ${mealName(st.meal).toLowerCase()}`);
    });
    const del = $('[data-del]', s.foot);
    if (del) del.addEventListener('click', () => {
      db.diary[ui.date] = (db.diary[ui.date] || []).filter((x) => x.id !== entry.id);
      save();
      closeSheet(s);
      renderDiary();
      toast('Verwijderd');
    });
    update();
    qtyIn.focus();
  }

  // ---------- Snel toevoegen ----------
  function openQuickAdd(meal, entry, parent) {
    const s = openSheet({ title: entry ? 'Snel toegevoegd' : 'Snel calorieën toevoegen', left: parent ? 'back' : 'close' });
    const n = entry ? entry.food.n : {};
    const st = { meal: entry ? entry.meal : meal };
    s.body.innerHTML = `
      <label class="field"><span>Omschrijving (optioneel)</span><input type="text" data-f="name" value="${esc(entry ? entry.food.name : '')}" placeholder="Bijv. verjaardagstaart"></label>
      <label class="field"><span>Calorieën (kcal)</span><input type="text" inputmode="decimal" data-f="kcal" value="${entry ? fmt(n.kcal, 1) : ''}" placeholder="0"></label>
      <div class="grid2" style="grid-template-columns:1fr 1fr 1fr">
        ${MACROS.map((m) => `<label class="field"><span>${m.short} (g)</span><input type="text" inputmode="decimal" data-f="${m.id}" value="${entry && n[m.id] != null ? fmt(n[m.id], 1) : ''}" placeholder="–"></label>`).join('')}
      </div>
      <div class="mealpick">${MEALS.map((m) => `<button data-meal="${m.id}" class="${m.id === st.meal ? 'on' : ''}">${m.name}</button>`).join('')}</div>
      <p class="note">Handig als je de exacte producten niet weet. Macro's mag je leeg laten.</p>`;
    s.foot.innerHTML = `<div class="btnrow"><button class="btn" data-save>${entry ? 'Opslaan' : 'Toevoegen'}</button>${entry ? '<button class="btn danger" data-del>Verwijderen</button>' : ''}</div>`;
    $$('[data-meal]', s.body).forEach((b) => b.addEventListener('click', () => {
      st.meal = b.dataset.meal;
      $$('[data-meal]', s.body).forEach((x) => x.classList.toggle('on', x === b));
    }));
    const val = (k) => num($(`[data-f="${k}"]`, s.body).value);
    $('[data-save]', s.foot).addEventListener('click', () => {
      let kcal = val('kcal');
      const c = val('carbs'), p = val('protein'), f = val('fat');
      if (kcal == null && (c || p || f)) kcal = (c || 0) * 4 + (p || 0) * 4 + (f || 0) * 9;
      if (!kcal || kcal <= 0) { toast('Vul het aantal kcal in'); return; }
      const food = {
        key: 'quick', source: 'quick',
        name: $('[data-f="name"]', s.body).value.trim() || 'Snel toegevoegd',
        n: { kcal, carbs: c, protein: p, fat: f, sugar: null, satfat: null, fiber: null, salt: null },
        units: [{ name: 'portie', g: 100 }]
      };
      if (entry) Object.assign(entry, { food, meal: st.meal });
      else (db.diary[ui.date] = db.diary[ui.date] || []).push({ id: uid(), meal: st.meal, food, qty: 1, unit: 0, grams: 100, at: Date.now() });
      save();
      closeSheet(s);
      renderDiary();
      toast(entry ? 'Opgeslagen' : `✓ ${fmt(kcal)} kcal toegevoegd`);
    });
    const del = $('[data-del]', s.foot);
    if (del) del.addEventListener('click', () => {
      db.diary[ui.date] = (db.diary[ui.date] || []).filter((x) => x.id !== entry.id);
      save(); closeSheet(s); renderDiary(); toast('Verwijderd');
    });
  }

  // ---------- Eigen product ----------
  function openCustom(existing, { meal, parent } = {}) {
    const isEdit = !!(existing && existing.source === 'custom');
    const e = existing || {};
    const n = e.n || {};
    const s = openSheet({ title: isEdit ? 'Product bewerken' : 'Eigen product', left: parent ? 'back' : 'close' });
    const f = (id, label, val, ph = '–', mode = 'decimal') => `<label class="field"><span>${label}</span><input type="text" ${mode ? `inputmode="${mode}"` : ''} data-f="${id}" value="${val == null || val === '' ? '' : esc(typeof val === 'number' ? fmt(val, 2) : val)}" placeholder="${ph}"></label>`;
    s.body.innerHTML = `
      ${f('name', 'Naam', e.name || '', 'Bijv. Proteïne pannenkoek', '')}
      <div class="grid2">${f('brand', 'Merk (optioneel)', e.brand || '', '', '')}${f('code', 'Barcode (optioneel)', e.code || '', '', 'numeric')}</div>
      <div class="section-label" style="margin-top:6px">Voedingswaarde per 100 g</div>
      <div class="grid2">
        ${f('kcal', 'Energie (kcal)', n.kcal, '0')}
        ${f('carbs', 'Koolhydraten (g)', n.carbs)}
        ${f('sugar', 'waarvan suikers (g)', n.sugar)}
        ${f('protein', 'Eiwit (g)', n.protein)}
        ${f('fat', 'Vet (g)', n.fat)}
        ${f('satfat', 'waarvan verzadigd (g)', n.satfat)}
        ${f('fiber', 'Vezels (g)', n.fiber)}
        ${f('salt', 'Zout (g)', n.salt)}
      </div>
      <p class="note">Tip: neem de waarden over van het etiket (kolom “per 100 g”). Laat je kcal leeg, dan wordt die berekend uit de macro's.</p>`;
    s.foot.innerHTML = `<div class="btnrow"><button class="btn" data-save>${isEdit ? 'Opslaan' : 'Opslaan en kiezen'}</button>${isEdit ? '<button class="btn danger" data-del>Verwijderen uit mijn producten</button>' : ''}</div>`;
    const v = (k) => $(`[data-f="${k}"]`, s.body).value.trim();
    const vn = (k) => num(v(k));
    $('[data-save]', s.foot).addEventListener('click', () => {
      const name = v('name');
      if (!name) { toast('Vul een naam in'); return; }
      let kcal = vn('kcal');
      if (kcal == null) {
        const c = vn('carbs'), p = vn('protein'), fa = vn('fat');
        if (c != null || p != null || fa != null) kcal = (c || 0) * 4 + (p || 0) * 4 + (fa || 0) * 9;
      }
      if (kcal == null) { toast('Vul minstens de kcal in'); return; }
      const units = [{ name: 'gram', g: 1 }];
      const food = {
        key: isEdit ? e.key : 'custom:' + uid(),
        source: 'custom',
        name, brand: v('brand'), code: v('code').replace(/\D/g, ''),
        n: { kcal, carbs: vn('carbs'), sugar: vn('sugar'), protein: vn('protein'), fat: vn('fat'), satfat: vn('satfat'), fiber: vn('fiber'), salt: vn('salt') },
        units
      };
      if (isEdit) db.custom = db.custom.map((x) => (x.key === food.key ? food : x));
      else db.custom.unshift(food);
      db.recents = db.recents.map((r) => (r.key === food.key ? { ...food, lastUnit: 0, lastQty: defaultGrams(r) } : r));
      save();
      closeSheet(s);
      if (parent && parent.refresh) parent.refresh();
      openDetail(food, { meal, parent });
    });
    const del = $('[data-del]', s.foot);
    if (del) del.addEventListener('click', () => {
      if (!confirm(`“${e.name}” verwijderen uit je eigen producten? Je dagboek blijft intact.`)) return;
      db.custom = db.custom.filter((x) => x.key !== e.key);
      db.recents = db.recents.filter((x) => x.key !== e.key);
      save();
      closeSheet(s);
      if (parent && parent.refresh) parent.refresh();
      toast('Product verwijderd');
    });
  }

  // ---------- Barcode scanner ----------
  let zxingLoading;
  function loadZXing() {
    if (window.ZXing) return Promise.resolve();
    if (!zxingLoading) {
      zxingLoading = new Promise((res, rej) => {
        const sc = document.createElement('script');
        sc.src = 'vendor/zxing.min.js';
        sc.onload = () => res();
        sc.onerror = () => { zxingLoading = null; rej(new Error('scanner laden mislukt')); };
        document.head.appendChild(sc);
      });
    }
    return zxingLoading;
  }

  function openScanner(meal, parent) {
    const s = openSheet({ title: 'Barcode scannen', left: 'back', foot: false });
    s.body.innerHTML = `
      <div class="scanner"><video playsinline muted autoplay></video><div class="frame"></div><div class="laser"></div></div>
      <p class="muted" data-status style="text-align:center">Camera starten…</p>
      <div class="searchrow" style="position:static">
        <label class="search">${ICON.barcode}<input type="text" inputmode="numeric" placeholder="Of typ de barcode" data-code enterkeyhint="search"></label>
        <button class="scanbtn" data-lookup aria-label="Zoeken">${ICON.search}</button>
      </div>`;
    const video = $('video', s.body);
    const status = $('[data-status]', s.body);
    let reader = null;
    let stream = null;
    let busy = false;

    function stop() {
      try { if (reader) reader.reset(); } catch (e) { /* ok */ }
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (video.srcObject) { video.srcObject.getTracks().forEach((t) => t.stop()); video.srcObject = null; }
    }
    s.onClose = stop;

    async function lookup(code) {
      code = String(code).replace(/\D/g, '');
      if (code.length < 6 || busy) return;
      busy = true;
      status.innerHTML = `<span class="loading" style="padding:8px"><span class="spinner"></span>Product ${esc(code)} opzoeken…</span>`;
      const mine = db.custom.find((f) => f.code === code);
      if (mine) { stop(); closeSheet(s); openDetail(mine, { meal, parent }); return; }
      try {
        const r = await offProduct(code);
        if (r.found && r.food) {
          stop(); closeSheet(s); openDetail(r.food, { meal, parent });
          return;
        }
        const nm = r.found && r.raw ? (pickText(r.raw.product_name_nl) || pickText(r.raw.product_name)) : '';
        status.innerHTML = `${r.found ? 'Dit product staat in Open Food Facts, maar zonder voedingswaarden.' : `Barcode ${esc(code)} niet gevonden in Open Food Facts.`}<br><button class="linkbtn" data-make>Zelf toevoegen met de waarden van het etiket</button>`;
        $('[data-make]', status).addEventListener('click', () => {
          stop(); closeSheet(s);
          openCustom({ name: nm, brand: r.raw ? pickText(r.raw.brands).split(',')[0] : '', code }, { meal, parent });
        });
      } catch (e) {
        status.innerHTML = 'Opzoeken mislukt. Controleer je internetverbinding.<br><button class="linkbtn" data-again>Opnieuw</button>';
        $('[data-again]', status).addEventListener('click', () => lookup(code));
      }
      busy = false;
    }

    $('[data-lookup]', s.body).addEventListener('click', () => lookup($('[data-code]', s.body).value));
    $('[data-code]', s.body).addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); lookup(e.target.value); } });

    (async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'Camera is niet beschikbaar. Typ de barcode hieronder in.';
        return;
      }
      try {
        await loadZXing();
        if (!stack.includes(s)) return;
        const Z = window.ZXing;
        const hints = new Map();
        hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E, Z.BarcodeFormat.CODE_128]);
        hints.set(Z.DecodeHintType.TRY_HARDER, true);
        reader = new Z.BrowserMultiFormatReader(hints, 150);
        await reader.decodeFromConstraints(
          { audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } },
          video,
          (result) => {
            if (result && !busy) {
              if (navigator.vibrate) navigator.vibrate(60);
              try { reader.reset(); } catch (e) { /* ok */ }
              lookup(result.getText());
            }
          }
        );
        stream = video.srcObject;
        if (!stack.includes(s)) { stop(); return; }
        status.textContent = 'Richt de camera op de barcode';
      } catch (e) {
        const denied = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
        status.textContent = denied
          ? 'Geen toegang tot de camera. Sta cameratoegang toe (Instellingen › Safari › Camera) of typ de barcode in.'
          : 'Camera starten lukt niet. Typ de barcode hieronder in.';
      }
    })();
  }

  // ---------- Doelen / instellingen ----------
  function renderSettings() {
    const m = db.settings.macro;
    const mt = macroTargets();
    const p = db.settings.profile;
    $('#app').innerHTML = `
      <h1 class="page-title">Doelen</h1>
      <div class="card target-hero">
        <div class="unit">Dagelijks caloriedoel</div>
        <label class="hero-edit">
          <input class="hero-input" type="text" inputmode="numeric" enterkeyhint="done" value="${db.settings.kcal}" aria-label="Caloriedoel in kcal" data-kcal-inline>
          <span class="pencil">${ICON.edit}</span>
        </label>
        <div class="unit">kcal per dag · tik op het getal om het te wijzigen</div>
        <div class="grid2" style="margin-top:16px">
          <button class="btn secondary" data-manual>Zelf invullen</button>
          <button class="btn" data-calc>Berekenen</button>
        </div>
        ${p ? `<p class="note" style="text-align:center">Berekend voor ${p.sex === 'm' ? 'man' : 'vrouw'}, ${p.age} jaar, ${fmt(p.height)} cm, ${fmt(p.weight, 1)} kg</p>` : ''}
      </div>

      <div class="card">
        <h3>Macroverdeling</h3>
        <p class="muted" style="margin:0 0 10px">Hoe je calorieën verdeeld worden over koolhydraten, eiwit en vet.</p>
        <div class="presets">${PRESETS.map((x, i) => `<button data-preset="${i}" class="${x.carbs === m.carbs && x.protein === m.protein && x.fat === m.fat ? 'on' : ''}">${x.name}</button>`).join('')}</div>
        <div data-sliders>
          ${MACROS.map((x) => `
            <div class="mrow" style="--c:${x.color}">
              <div class="name"><span class="dot" style="background:${x.color}"></span>${x.name}</div>
              <div class="g"><b data-pct="${x.id}">${m[x.id]}%</b> · <span data-gram="${x.id}">${fmt(mt[x.id])} g</span></div>
              <input type="range" min="0" max="80" step="1" value="${m[x.id]}" data-range="${x.id}" aria-label="${x.name} percentage">
            </div>`).join('')}
        </div>
        <div class="sumline" data-sum>Totaal 100%</div>
        <p class="note">Eiwit ${fmt(mt.protein)} g ≈ ${p ? fmt(mt.protein / p.weight, 1) + ' g per kg lichaamsgewicht' : 'tip: 1,2–2 g per kg lichaamsgewicht bij afvallen of sporten'}.</p>
      </div>

      <div class="card">
        <h3>Gegevens</h3>
        <p class="muted" style="margin:0 0 12px">Alles wordt alleen op deze iPhone bewaard. Maak af en toe een back-up (bijv. naar Bestanden of iCloud Drive).</p>
        <div class="btnrow">
          <button class="btn secondary" data-export>Back-up maken</button>
          <button class="btn secondary" data-import>Back-up terugzetten</button>
          <button class="btn danger" data-reset>Alle gegevens wissen</button>
        </div>
        <input type="file" accept="application/json,.json" data-file hidden>
      </div>
      <p class="note" style="text-align:center">Voedingsdata: <b>Open Food Facts</b> (open database, ODbL) + ingebouwde basislijst.<br>Bordje · versie 1.2</p>`;

    $('[data-manual]').addEventListener('click', openManualTarget);
    const inl = $('[data-kcal-inline]');
    inl.addEventListener('focus', () => setTimeout(() => inl.select(), 0));
    inl.addEventListener('keydown', (e) => { if (e.key === 'Enter') inl.blur(); });
    inl.addEventListener('change', () => {
      const k = Math.round(num(inl.value) || 0);
      if (k < 800 || k > 8000) { toast('Kies een waarde tussen 800 en 8000 kcal'); inl.value = db.settings.kcal; return; }
      db.settings.kcal = k; db.settings.setupDone = true; save(); renderSettings(); toast(`Doel: ${fmt(k)} kcal per dag`);
    });
    $('[data-calc]').addEventListener('click', () => openCalculator());
    $$('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      const x = PRESETS[+b.dataset.preset];
      db.settings.macro = { carbs: x.carbs, protein: x.protein, fat: x.fat };
      save(); renderSettings();
    }));
    const draft = { ...m };
    function refreshMacros() {
      const sum = draft.carbs + draft.protein + draft.fat;
      MACROS.forEach((x) => {
        $(`[data-pct="${x.id}"]`).textContent = draft[x.id] + '%';
        $(`[data-gram="${x.id}"]`).textContent = fmt((db.settings.kcal * draft[x.id]) / 100 / x.kcal) + ' g';
      });
      const el = $('[data-sum]');
      el.textContent = sum === 100 ? 'Totaal 100% ✓' : `Totaal ${sum}% – moet precies 100% zijn`;
      el.classList.toggle('bad', sum !== 100);
      if (sum === 100) {
        db.settings.macro = { ...draft };
        save();
        $$('[data-preset]').forEach((b) => {
          const x = PRESETS[+b.dataset.preset];
          b.classList.toggle('on', x.carbs === draft.carbs && x.protein === draft.protein && x.fat === draft.fat);
        });
      }
    }
    $$('[data-range]').forEach((r) => r.addEventListener('input', () => { draft[r.dataset.range] = +r.value; refreshMacros(); }));
    refreshMacros();

    $('[data-export]').addEventListener('click', exportData);
    const file = $('[data-file]');
    $('[data-import]').addEventListener('click', () => file.click());
    file.addEventListener('change', () => importData(file.files[0]));
    $('[data-reset]').addEventListener('click', () => {
      if (!confirm('Weet je het zeker? Je dagboek, eigen producten en doelen worden gewist.')) return;
      db = defaults(); save(); ui.tab = 'diary'; render(); toast('Alles gewist');
    });
  }

  function openManualTarget() {
    const s = openSheet({ title: 'Caloriedoel' });
    s.body.innerHTML = `
      <label class="field" style="margin-top:12px"><span>Calorieën per dag (kcal)</span>
        <input type="text" inputmode="numeric" value="${db.settings.kcal}" data-kcal style="font-size:28px;font-weight:700;text-align:center"></label>
      <p class="note">Weet je het niet zeker? Gebruik dan “Berekenen”. Voor de meeste volwassenen ligt het doel tussen 1.400 en 3.000 kcal.</p>`;
    s.foot.innerHTML = '<button class="btn" data-save>Opslaan</button>';
    const inp = $('[data-kcal]', s.body);
    setTimeout(() => { inp.focus(); inp.select(); }, 350);
    $('[data-save]', s.foot).addEventListener('click', () => {
      const k = Math.round(num(inp.value) || 0);
      if (k < 800 || k > 8000) { toast('Kies een waarde tussen 800 en 8000'); return; }
      db.settings.kcal = k; db.settings.setupDone = true; save(); closeSheet(s); render(); toast('Doel opgeslagen');
    });
  }

  function openCalculator() {
    const p = db.settings.profile || { sex: 'v', age: 35, height: 170, weight: 70, activity: 1, goal: 1 };
    const st = { ...p };
    const s = openSheet({ title: 'Caloriedoel berekenen' });
    s.body.innerHTML = `
      <div class="seg" style="margin-top:8px">
        <button data-sex="v" class="${st.sex === 'v' ? 'on' : ''}">Vrouw</button>
        <button data-sex="m" class="${st.sex === 'm' ? 'on' : ''}">Man</button>
      </div>
      <div class="grid2" style="grid-template-columns:1fr 1fr 1fr">
        <label class="field"><span>Leeftijd</span><input type="text" inputmode="numeric" data-f="age" value="${st.age}"></label>
        <label class="field"><span>Lengte (cm)</span><input type="text" inputmode="numeric" data-f="height" value="${st.height}"></label>
        <label class="field"><span>Gewicht (kg)</span><input type="text" inputmode="decimal" data-f="weight" value="${fmt(st.weight, 1)}"></label>
      </div>
      <label class="field"><span>Activiteit</span><select data-f="activity">${ACTIVITY.map((a, i) => `<option value="${i}" ${i === st.activity ? 'selected' : ''}>${a.name}</option>`).join('')}</select></label>
      <label class="field"><span>Doel</span><select data-f="goal">${GOALS.map((g, i) => `<option value="${i}" ${i === st.goal ? 'selected' : ''}>${g.name}</option>`).join('')}</select></label>
      <div class="result-box" data-result></div>
      <label class="field"><span>Gebruik als doel (pas gerust zelf aan)</span>
        <input type="text" inputmode="numeric" data-final style="font-size:22px;font-weight:700;text-align:center"></label>
      <p class="note">Berekend met de Mifflin-St Jeor-formule (rustverbruik) × activiteitsfactor, plus of min je doel. Een schatting: kijk na een paar weken hoe je gewicht reageert en stel bij.</p>`;
    s.foot.innerHTML = '<button class="btn" data-save>Gebruik dit doel</button>';
    let result = 0;
    function calc() {
      const age = num($('[data-f="age"]', s.body).value);
      const h = num($('[data-f="height"]', s.body).value);
      const w = num($('[data-f="weight"]', s.body).value);
      st.activity = +$('[data-f="activity"]', s.body).value;
      st.goal = +$('[data-f="goal"]', s.body).value;
      const box = $('[data-result]', s.body);
      if (!age || !h || !w || age < 12 || age > 110 || h < 100 || h > 250 || w < 30 || w > 350) {
        box.innerHTML = '<small>Vul leeftijd, lengte en gewicht in</small>';
        result = 0; $('[data-save]', s.foot).disabled = true; return;
      }
      Object.assign(st, { age, height: h, weight: w });
      const bmr = 10 * w + 6.25 * h - 5 * age + (st.sex === 'm' ? 5 : -161);
      const tdee = bmr * ACTIVITY[st.activity].f;
      const floor = st.sex === 'm' ? 1500 : 1200;
      result = Math.max(floor, Math.round((tdee + GOALS[st.goal].d) / 10) * 10);
      box.innerHTML = `<b>${fmt(result)} kcal</b><small>per dag · rustverbruik ${fmt(bmr)} · onderhoud ${fmt(tdee)} kcal</small>${result === floor && tdee + GOALS[st.goal].d < floor ? '<br><small>Afgerond naar het veilige minimum</small>' : ''}`;
      $('[data-final]', s.body).value = result;
      $('[data-save]', s.foot).disabled = false;
    }
    $$('[data-sex]', s.body).forEach((b) => b.addEventListener('click', () => {
      st.sex = b.dataset.sex;
      $$('[data-sex]', s.body).forEach((x) => x.classList.toggle('on', x === b));
      calc();
    }));
    $$('input:not([data-final]), select', s.body).forEach((el) => el.addEventListener('input', calc));
    $('[data-save]', s.foot).addEventListener('click', () => {
      if (!result) return;
      const fin = Math.round(num($('[data-final]', s.body).value) || 0);
      if (fin < 800 || fin > 8000) { toast('Kies een waarde tussen 800 en 8000 kcal'); return; }
      result = fin;
      db.settings.kcal = result;
      db.settings.profile = { sex: st.sex, age: st.age, height: st.height, weight: st.weight, activity: st.activity, goal: st.goal };
      db.settings.setupDone = true;
      save(); closeSheet(s); render(); toast(`Doel: ${fmt(result)} kcal per dag`);
    });
    calc();
  }

  // ---------- Back-up ----------
  async function exportData() {
    const name = `bordje-backup-${dkey(new Date())}.json`;
    const blob = new Blob([JSON.stringify(db)], { type: 'application/json' });
    try {
      const file = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Bordje back-up' });
        return;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  function importData(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || !d.settings || typeof d.diary !== 'object') throw new Error('ongeldig');
        if (!confirm('Back-up terugzetten? Je huidige gegevens worden vervangen.')) return;
        localStorage.setItem(STORE, JSON.stringify(d));
        db = load();
        render();
        toast('Back-up teruggezet');
      } catch (e) {
        toast('Dit is geen geldig back-upbestand');
      }
    };
    r.readAsText(file);
  }

  // ---------- Start ----------
  $$('#tabbar button').forEach((b) => b.addEventListener('click', () => {
    ui.tab = b.dataset.tab;
    closeAll();
    render();
    window.scrollTo(0, 0);
  }));
  // Na middernacht automatisch naar de nieuwe dag als de app weer geopend wordt
  let lastToday = dkey(new Date());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const t = dkey(new Date());
    if (t !== lastToday) { if (ui.date === lastToday) ui.date = t; lastToday = t; render(); }
  });
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Alleen voor tests
  window.__bordje = { parseOFF, localSearch, get db() { return db; } };
})();
