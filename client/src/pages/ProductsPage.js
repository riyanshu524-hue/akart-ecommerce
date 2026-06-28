/**
 * ProductsPage - Product listing with filtering, sorting, and pagination
 */

import { BasePage } from './BasePage.js';
import { api } from '../js/api.js';
import { uiManager } from '../js/ui.js';

export default class ProductsPage extends BasePage {
  constructor(params) {
    super(params);
    this.title = 'Products - Akart';
    this.description = 'Browse all products on Akart';
    this.products = [];
    this.categories = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.filters = {
      category: null,
      search: null,
      minPrice: null,
      maxPrice: null,
      sort: 'created_at',
      order: 'desc',
    };
  }

  async render() {
    try {
      // Parse URL params
      const params = new URLSearchParams(window.location.search);
      this.filters.category = params.get('category');
      this.filters.search = params.get('search');
      this.currentPage = parseInt(params.get('page')) || 1;

      // Fetch data
      await Promise.all([
        this.fetchProducts(),
        this.fetchCategories(),
      ]);

      return `
        ${this.createNavbar()}
        ${this.createHeader('Products')}
        
        <div class="container mb-8">
          <div class="grid-4-1">
            <!-- Sidebar Filters -->
            <aside class="card" style="height: fit-content; position: sticky; top: 100px;">
              <h3 class="mb-4">Filters</h3>
              
              <!-- Category Filter -->
              <div class="mb-6">
                <h4 class="text-small font-semibold mb-2">Category</h4>
                <select class="input" id="categoryFilter" style="width: 100%;">
                  <option value="">All Categories</option>
                  ${this.categories.map(cat => `
                    <option value="${cat.id}" ${this.filters.category === cat.id ? 'selected' : ''}>
                      ${this.escapeHtml(cat.name)}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Price Filter -->
              <div class="mb-6">
                <h4 class="text-small font-semibold mb-2">Price Range</h4>
                <div class="flex gap-2 mb-2">
                  <input type="number" class="input" id="minPrice" placeholder="Min" style="flex: 1;">
                  <input type="number" class="input" id="maxPrice" placeholder="Max" style="flex: 1;">
                </div>
                <button class="btn btn-sm" style="width: 100%;" onclick="document.getElementById('priceFilterBtn').click()">Apply</button>
                <button id="priceFilterBtn" style="display: none;"></button>
              </div>

              <!-- Sort -->
              <div class="mb-6">
                <h4 class="text-small font-semibold mb-2">Sort By</h4>
                <select class="input" id="sortFilter" style="width: 100%;">
                  <option value="created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <button class="btn btn-primary" style="width: 100%;" onclick="location.reload()">Reset Filters</button>
            </aside>

            <!-- Products Grid -->
            <main>
              <!-- Search Bar -->
              <div class="mb-6">
                <input type="search" class="input" id="searchInput" placeholder="Search products..." style="width: 100%;">
              </div>

              <!-- Results Info -->
              <div class="flex-between mb-4">
                <p class="text-muted">Showing ${(this.currentPage - 1) * 20 + 1} - ${Math.min(this.currentPage * 20, this.totalPages * 20)} products</p>
              </div>

              <!-- Products Grid -->
              <div class="grid-3">
                ${this.products.length > 0 ? this.products.map(product => `
                  <a href="/product/${product.id}" style="text-decoration: none; color: inherit;">
                    ${this.createProductCard(product)}
                  </a>
                `).join('') : this.showEmpty('No Products', 'No products match your filters')}
              </div>

              <!-- Pagination -->
              ${this.totalPages > 1 ? `
                <div class="flex-center gap-2 mt-8">
                  ${this.currentPage > 1 ? `<a href="/products?page=${this.currentPage - 1}" class="btn btn-outline btn-sm">← Previous</a>` : ''}
                  <span class="text-muted">Page ${this.currentPage} of ${this.totalPages}</span>
                  ${this.currentPage < this.totalPages ? `<a href="/products?page=${this.currentPage + 1}" class="btn btn-outline btn-sm">Next →</a>` : ''}
                </div>
              ` : ''}
            </main>
          </div>
        </div>

        ${this.createFooter()}
      `;
    } catch (error) {
      console.error('Error rendering products page:', error);
      return uiManager.showEmpty('Failed to Load', 'Please refresh the page');
    }
  }

  async init() {
    super.init();

    // Add event listeners
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    const priceFilterBtn = document.getElementById('priceFilterBtn');

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        const category = categoryFilter.value;
        window.location.href = category ? `/products?category=${category}` : '/products';
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', () => {
        const sort = sortFilter.value;
        if (sort === 'price-desc') {
          this.filters.sort = 'price';
          this.filters.order = 'asc';
        } else {
          this.filters.sort = sort;
          this.filters.order = 'desc';
        }
        this.applyFilters();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value;
          window.location.href = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
        }
      });
    }

    if (priceFilterBtn) {
      priceFilterBtn.addEventListener('click', () => {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        let url = '/products';
        if (minPrice || maxPrice) {
          url += `?minPrice=${minPrice}&maxPrice=${maxPrice}`;
        }
        window.location.href = url;
      });
    }
  }

  async fetchProducts() {
    try {
      const params = new URLSearchParams();
      params.append('page', this.currentPage);
      params.append('limit', 20);

      if (this.filters.category) params.append('category', this.filters.category);
      if (this.filters.search) params.append('search', this.filters.search);
      if (this.filters.minPrice) params.append('minPrice', this.filters.minPrice);
      if (this.filters.maxPrice) params.append('maxPrice', this.filters.maxPrice);
      params.append('sort', this.filters.sort);
      params.append('order', this.filters.order);

      const data = await api.get(`/products?${params.toString()}`);
      this.products = data.products || [];
      this.totalPages = data.pagination?.pages || 1;
    } catch (error) {
      console.error('Error fetching products:', error);
      this.products = [];
    }
  }

  async fetchCategories() {
    try {
      const data = await api.get('/categories');
      this.categories = data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      this.categories = [];
    }
  }

  applyFilters() {
    let url = '/products';
    const params = [];
    if (this.filters.category) params.push(`category=${this.filters.category}`);
    if (this.filters.search) params.push(`search=${encodeURIComponent(this.filters.search)}`);
    if (this.filters.minPrice) params.push(`minPrice=${this.filters.minPrice}`);
    if (this.filters.maxPrice) params.push(`maxPrice=${this.filters.maxPrice}`);
    if (params.length > 0) url += '?' + params.join('&');
    window.location.href = url;
  }

  createProductCard(product) {
    const rating = product.rating || 0;
    const stars = '⭐'.repeat(Math.floor(rating));
    const image = product.product_images?.[0]?.image_url || '/placeholder.jpg';
    
    return `
      <div class="card-product hover-lift">
        <img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(product.name)}" class="card-product-image" style="object-fit: cover;">
        <div class="card-product-body">
          <h4 style="margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(product.name)}</h4>
          <p class="text-muted text-small" style="margin-bottom: 0.5rem;">${this.escapeHtml(product.vendor?.store_name || 'Seller')}</p>
          <div class="flex-between mb-2">
            <span style="font-weight: bold; color: var(--brand-primary); font-size: 1.1rem;">${this.formatCurrency(product.price)}</span>
            <span class="text-small">${stars || '★'}</span>
          </div>
          ${product.compare_price ? `
            <p class="text-small text-muted" style="text-decoration: line-through; margin-bottom: 0.5rem;">
              ${this.formatCurrency(product.compare_price)}
            </p>
          ` : ''}
          <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Add to Cart</button>
        </div>
      </div>
    `;
  }
}
