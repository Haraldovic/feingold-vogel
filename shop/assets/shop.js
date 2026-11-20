/* Feingold Vogel shop preview. No order, payment or customer data is transmitted. */
(function () {
  'use strict';
  const STORAGE_KEY = 'fv-shop-preview-v1';
  const MAX_QUANTITY = 9;

  function productMap(products) {
    const map = new Map();
    for (const product of Array.isArray(products) ? products : []) {
      if (product && typeof product.slug === 'string' && product.slug &&
          Number.isInteger(product.priceCents) && product.priceCents >= 0) {
        map.set(product.slug, product);
      }
    }
    return map;
  }
  function optionValues(product) {
    return product && product.option && Array.isArray(product.option.values)
      ? product.option.values.map(String) : [];
  }
  function lineKey(line) { return JSON.stringify([line.slug, line.option]); }
  function sanitizeCart(raw, products) {
    const map = products instanceof Map ? products : productMap(products);
    const source = raw && raw.version === 1 && Array.isArray(raw.items) ? raw.items : [];
    const clean = new Map();
    for (const item of source.slice(0, 150)) {
      if (!item || typeof item.slug !== 'string') continue;
      const product = map.get(item.slug);
      if (!product || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_QUANTITY) continue;
      const choices = optionValues(product);
      const selected = typeof item.option === 'string' ? item.option : '';
      if (choices.length ? !choices.includes(selected) : selected !== '') continue;
      const line = { slug: item.slug, option: selected, qty: item.qty };
      const key = lineKey(line);
      if (clean.has(key)) clean.get(key).qty = Math.min(MAX_QUANTITY, clean.get(key).qty + line.qty);
      else clean.set(key, line);
    }
    return Array.from(clean.values());
  }
  function cartTotal(items, products) {
    const map = products instanceof Map ? products : productMap(products);
    return sanitizeCart({ version: 1, items: items }, map)
      .reduce((total, line) => total + map.get(line.slug).priceCents * line.qty, 0);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productMap, sanitizeCart, cartTotal, lineKey, MAX_QUANTITY };
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const products = productMap(window.ShopData && window.ShopData.products);
  const shopRoot = document.body.dataset.shopRoot || './';
  const money = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const formatMoney = cents => money.format(cents / 100);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const cartDialog = document.getElementById('cart-drawer');
  const checkoutDialog = document.getElementById('checkout-note');
  const dialogOpeners = new WeakMap();
  let cart = [];
  try {
    cart = sanitizeCart(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null'), products);
  } catch (_) { /* Storage is optional; the cart still works for this page. */ }

  function announce(message) {
    const output = document.querySelector('[data-product-feedback]');
    if (output) output.textContent = message;
    const cartOutput = document.querySelector('[data-cart-feedback]');
    if (cartOutput) cartOutput.textContent = message;
  }
  function persistCart() {
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items: cart })); }
    catch (_) { /* Private browsing or disabled storage: retain the in-memory cart. */ }
  }
  function syncModalState() {
    document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
  }
  function showDialog(dialog, opener) {
    if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return;
    dialogOpeners.set(dialog, opener || document.activeElement);
    dialog.showModal();
    syncModalState();
  }
  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }
  all('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      syncModalState();
      const opener = dialogOpeners.get(dialog);
      if (opener && opener.isConnected && opener.getClientRects().length) opener.focus();
      else {
        const fallback = document.querySelector('[data-cart-open]');
        if (fallback && !document.querySelector('dialog[open]')) fallback.focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
        closeDialog(dialog);
      }
    });
  });
  all('[data-dialog-close]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
  all('[data-cart-open]').forEach(button => button.addEventListener('click', () => showDialog(cartDialog, button)));
  all('[data-demo-checkout]').forEach(button => button.addEventListener('click', () => {
    closeDialog(cartDialog);
    showDialog(checkoutDialog, document.querySelector('[data-cart-open]'));
  }));

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function actionButton(text, label, action, line, disabled) {
    const button = element('button', 'cart-quantity-button', text);
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.dataset.cartAction = action;
    button.dataset.lineKey = lineKey(line);
    button.disabled = Boolean(disabled);
    return button;
  }
  function renderCart(focusKey, focusAction) {
    const count = cart.reduce((sum, line) => sum + line.qty, 0);
    all('[data-cart-count]').forEach(node => { node.textContent = String(count); });
    all('[data-cart-total]').forEach(node => { node.textContent = formatMoney(cartTotal(cart, products)); });
    all('[data-cart-empty]').forEach(node => { node.hidden = count > 0; });
    all('[data-cart-filled]').forEach(node => { node.hidden = count === 0; });
    const holder = document.querySelector('[data-cart-items]');
    if (!holder) return;
    const fragment = document.createDocumentFragment();
    for (const line of cart) {
      const product = products.get(line.slug);
      const row = element('li', 'cart-item');
      const pictureLink = element('a', 'cart-item-picture');
      pictureLink.href = shopRoot + 'products/' + encodeURIComponent(product.slug) + '/';
      pictureLink.tabIndex = -1;
      pictureLink.setAttribute('aria-hidden', 'true');
      if (product.images && product.images[0]) {
        const image = element('img', 'cart-item-image');
        image.src = shopRoot + '../' + product.images[0].src;
        image.alt = '';
        image.width = 90;
        image.height = 112;
        image.loading = 'lazy';
        pictureLink.append(image);
      }
      const copy = element('div', 'cart-item-copy');
      const name = element('a', 'cart-item-name', product.name);
      name.href = pictureLink.href;
      copy.append(name);
      if (line.option) copy.append(element('p', 'cart-item-option', (product.option.name || 'Auswahl') + ': ' + line.option));
      copy.append(element('p', 'cart-item-price', formatMoney(product.priceCents * line.qty)));
      const controls = element('div', 'cart-item-controls');
      const quantity = element('div', 'cart-item-quantity');
      quantity.setAttribute('role', 'group');
      quantity.setAttribute('aria-label', 'Menge für ' + product.name + (line.option ? ', ' + line.option : ''));
      quantity.append(actionButton('−', 'Menge von ' + product.name + ' verringern', 'decrease', line, line.qty === 1));
      const quantityValue = element('span', 'cart-quantity-value', String(line.qty));
      quantityValue.setAttribute('aria-label', 'Menge ' + line.qty);
      quantity.append(quantityValue);
      quantity.append(actionButton('+', 'Menge von ' + product.name + ' erhöhen', 'increase', line, line.qty === MAX_QUANTITY));
      const remove = actionButton('Entfernen', product.name + (line.option ? ', ' + line.option : '') + ' aus dem Warenkorb entfernen', 'remove', line);
      remove.className = 'cart-item-remove';
      controls.append(quantity, remove);
      copy.append(controls);
      row.append(pictureLink, copy);
      fragment.append(row);
    }
    holder.replaceChildren(fragment);
    if (focusKey && focusAction) {
      const next = Array.from(holder.querySelectorAll('[data-cart-action]'))
        .find(button => button.dataset.lineKey === focusKey && button.dataset.cartAction === focusAction && !button.disabled);
      if (next) next.focus();
      else {
        const fallback = holder.querySelector('[data-cart-action]:not(:disabled)') || (cartDialog && cartDialog.querySelector('[data-dialog-close]'));
        if (fallback) fallback.focus();
      }
    }
  }
  const cartItems = document.querySelector('[data-cart-items]');
  if (cartItems) cartItems.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button || !cartItems.contains(button)) return;
    const key = button.dataset.lineKey;
    const action = button.dataset.cartAction;
    const index = cart.findIndex(line => lineKey(line) === key);
    if (index < 0) return;
    const name = products.get(cart[index].slug).name;
    if (action === 'remove') cart.splice(index, 1);
    else if (action === 'increase') cart[index].qty = Math.min(MAX_QUANTITY, cart[index].qty + 1);
    else if (action === 'decrease') cart[index].qty = Math.max(1, cart[index].qty - 1);
    else return;
    persistCart();
    renderCart(key, action);
    announce(action === 'remove' ? name + ' wurde entfernt.' : 'Die Menge wurde aktualisiert.');
  });
  all('[data-product-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const product = products.get(form.dataset.slug);
    if (!product) { announce('Dieses Musterprodukt ist nicht verfügbar.'); return; }
    const select = form.querySelector('[name="option"]');
    const selected = select ? select.value : '';
    const line = { slug: product.slug, option: selected, qty: 1 };
    if (!sanitizeCart({ version: 1, items: [line] }, products).length) {
      announce('Bitte wählen Sie eine gültige Variante.');
      if (select) select.focus();
      return;
    }
    const found = cart.find(item => lineKey(item) === lineKey(line));
    if (found && found.qty === MAX_QUANTITY) {
      announce('In der Vorschau sind höchstens neun Exemplare je Variante möglich.');
      showDialog(cartDialog, form.querySelector('[type="submit"]'));
      return;
    }
    if (found) found.qty += 1;
    else cart.push(line);
    persistCart();
    renderCart();
    announce(product.name + ' wurde zum Vorschau-Warenkorb hinzugefügt.');
    showDialog(cartDialog, form.querySelector('[type="submit"]'));
  }));
  renderCart();

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('shop-nav');
  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }
  if (menu && menuToggle) {
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true' && !document.querySelector('dialog[open]')) {
        setMenu(false); menuToggle.focus();
      }
    });
  }

  const galleryButtons = all('[data-gallery-src]');
  const mainImage = document.getElementById('product-main-image');
  const caption = document.getElementById('gallery-caption');
  galleryButtons.forEach(button => button.addEventListener('click', () => {
    if (!mainImage) return;
    const src = button.dataset.gallerySrc;
    if (!src) return;
    mainImage.removeAttribute('srcset');
    mainImage.src = src;
    mainImage.alt = button.dataset.galleryAlt || '';
    galleryButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    if (caption) caption.textContent = button.dataset.galleryLabel || '';
  }));
  const viewer = document.getElementById('image-viewer');
  const viewerImage = document.getElementById('viewer-image');
  all('[data-view-image]').forEach(button => button.addEventListener('click', () => {
    if (!mainImage || !viewer || !viewerImage) return;
    viewerImage.src = mainImage.currentSrc || mainImage.src;
    viewerImage.alt = mainImage.alt;
    showDialog(viewer, button);
  }));

  const collection = document.querySelector('main[data-collection]');
  const grid = document.getElementById('product-grid');
  const filterForm = document.getElementById('shop-filters');
  const search = document.getElementById('shop-search');
  const material = document.getElementById('shop-material');
  const price = document.getElementById('shop-price');
  const sort = document.getElementById('shop-sort');
  const filterToggle = document.querySelector('[data-filter-toggle]');
  if (filterToggle && filterForm) filterToggle.addEventListener('click', () => {
    const open = filterToggle.getAttribute('aria-expanded') !== 'true';
    filterToggle.setAttribute('aria-expanded', String(open));
    filterForm.classList.toggle('is-open', open);
  });
  if (!collection || !grid || !filterForm) return;
  const cards = Array.from(grid.querySelectorAll('[data-product-card]'));
  const normalize = value => String(value || '').toLocaleLowerCase('de-DE').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
  const categoryHandle = value => ({ ringe: 'ringe', ketten: 'ketten', armbander: 'armbaender', armbaender: 'armbaender', edelsteine: 'edelsteine' })[normalize(value)] || normalize(value);
  const coll = categoryHandle(collection.dataset.collection || 'all');
  function validSelect(select, value) {
    if (!select) return;
    select.value = Array.from(select.options).some(option => option.value === value) ? value : select.options[0].value;
  }
  const params = new URLSearchParams(window.location.search);
  if (search) search.value = (params.get('q') || '').slice(0, 120);
  validSelect(material, params.get('material') || 'all');
  validSelect(price, params.get('price') || 'all');
  validSelect(sort, params.get('sort') || 'featured');
  function revealSearch(focusSearch) {
    filterForm.classList.add('is-open');
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'true');
    if (focusSearch && search) {
      search.focus({ preventScroll: true });
      search.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }
  function followSearchAnchor() {
    if (window.location.hash === '#shop-search') revealSearch(true);
  }
  if ((search && search.value.trim()) || (material && material.value !== 'all') ||
      (price && price.value !== 'all') || (sort && sort.value !== 'featured')) {
    revealSearch(false);
  }
  followSearchAnchor();
  window.addEventListener('hashchange', followSearchAnchor);
  function applyFilters(saveURL) {
    const query = normalize(search && search.value).trim().slice(0, 120);
    const selectedMaterial = material ? material.value : 'all';
    const selectedPrice = price ? price.value : 'all';
    const selectedSort = sort ? sort.value : 'featured';
    const arranged = cards.map((card, index) => ({ card, index, product: products.get(card.dataset.slug) }));
    arranged.sort((a, b) => {
      if (!a.product || !b.product) return a.index - b.index;
      if (selectedSort === 'price-asc') return a.product.priceCents - b.product.priceCents || a.index - b.index;
      if (selectedSort === 'price-desc') return b.product.priceCents - a.product.priceCents || a.index - b.index;
      if (selectedSort === 'name') return a.product.name.localeCompare(b.product.name, 'de');
      return a.index - b.index;
    });
    const fragment = document.createDocumentFragment();
    let count = 0;
    for (const item of arranged) {
      const product = item.product;
      let visible = Boolean(product);
      if (visible && coll !== 'all') visible = categoryHandle(product.category) === coll;
      if (visible && selectedMaterial !== 'all') visible = product.material === selectedMaterial;
      if (visible && query) visible = normalize([product.name, product.category, product.material, product.gemstone || ''].join(' ')).includes(query);
      if (visible && selectedPrice === 'under1000') visible = product.priceCents < 100000;
      if (visible && selectedPrice === '1000to2000') visible = product.priceCents >= 100000 && product.priceCents <= 200000;
      if (visible && selectedPrice === 'over2000') visible = product.priceCents > 200000;
      item.card.hidden = !visible;
      if (visible) count += 1;
      fragment.append(item.card);
    }
    grid.append(fragment);
    const countLabel = document.getElementById('result-count');
    if (countLabel) countLabel.textContent = count === 1 ? '1 Schmuckstück' : count + ' Schmuckstücke';
    const empty = document.getElementById('empty-results');
    if (empty) empty.hidden = count > 0;
    if (saveURL) {
      const url = new URL(window.location.href);
      url.search = '';
      if (search && search.value.trim()) url.searchParams.set('q', search.value.trim().slice(0, 120));
      if (selectedMaterial !== 'all') url.searchParams.set('material', selectedMaterial);
      if (selectedPrice !== 'all') url.searchParams.set('price', selectedPrice);
      if (selectedSort !== 'featured') url.searchParams.set('sort', selectedSort);
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }
  let searchTimer;
  if (search) search.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => applyFilters(true), 120);
  });
  [material, price, sort].filter(Boolean).forEach(select => select.addEventListener('change', () => applyFilters(true)));
  filterForm.addEventListener('submit', event => { event.preventDefault(); applyFilters(true); });
  all('[data-reset-filters]').forEach(button => button.addEventListener('click', () => {
    window.clearTimeout(searchTimer);
    if (search) search.value = '';
    validSelect(material, 'all'); validSelect(price, 'all'); validSelect(sort, 'featured');
    applyFilters(true);
  }));
  applyFilters(false);
})();
