// Same JS logic as before
(async function(){
  const PRODUCTS_URL = '/content/products.json';
  const productsContainer = document.getElementById('products');
  const pageTitle = document.getElementById('page-title');
  let products = [];

  function escapeHTML(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  async function loadProducts(){
    try {
      const res = await fetch(PRODUCTS_URL, {cache: 'no-cache'});
      if(!res.ok) throw new Error('products file not found (status ' + res.status + ')');
      const json = await res.json();
      products = Array.isArray(json.items) ? json.items : [];
      renderProducts('all');
    } catch(err) {
      productsContainer.innerHTML = `<div class="error">Failed to load products: ${escapeHTML(err.message)}</div>`;
    }
  }

  function renderProducts(category){
    const catTitle = category === 'all' ? 'All Category' : category;
    pageTitle.textContent = catTitle;
    productsContainer.innerHTML = '';
    let filtered = category === 'all' ? products : products.filter(p => p.category === category);
    if(filtered.length === 0){
      productsContainer.innerHTML = `<div class="empty">No items in "${escapeHTML(catTitle)}".</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    filtered.forEach(p => {
      const a = document.createElement('a');
      a.href = p.url || '#';
      a.target = p.url ? '_blank' : '_self';
      a.rel = 'noopener noreferrer';
      a.className = 'product-link';
      const article = document.createElement('article');
      article.className = 'product';
      article.innerHTML = `
        <div class="thumb"><img src="${escapeHTML(p.image || '/assets/images/placeholder.png')}" alt="${escapeHTML(p.title)}"></div>
        <div class="meta">
          <h3>${escapeHTML(p.title)}</h3>
          <div class="price">${p.price ? 'RM ' + Number(p.price).toFixed(2) : ''}</div>
          <p class="desc">${escapeHTML(p.description || '')}</p>
        </div>
      `;
      a.appendChild(article);
      frag.appendChild(a);
    });
    productsContainer.appendChild(frag);
  }

  function setupNav(){
    document.querySelectorAll('.nav-btn').forEach(el => {
      el.addEventListener('click', e => {
        const cat = el.getAttribute('data-category') || null;
        if(!cat) return;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        const normalized = cat.toLowerCase() === 'all' ? 'all' : cat;
        renderProducts(normalized === 'all' ? 'all' : cat);
        if(el.tagName === 'BUTTON') e.preventDefault();
      });
    });
  }

  setupNav();
  await loadProducts();
})();