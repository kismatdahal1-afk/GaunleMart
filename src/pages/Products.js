// Products.js - Dynamic categories with URL state preservation
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch products from backend - UPDATED with environment variable
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      setAllProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Read category from URL query parameter on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    
    if (categoryFromUrl && categoryFromUrl !== 'All') {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All');
    }
  }, [location.search]);

  // DYNAMIC CATEGORY EXTRACTION
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(
      allProducts
        .map(product => product.category)
        .filter(cat => cat && cat.trim() !== '')
        .map(cat => cat.trim())
    )];
    uniqueCategories.sort();
    return ['All', ...uniqueCategories];
  }, [allProducts]);

  // Handle category click - updates URL and state
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    
    // Update URL with category parameter (preserve for back navigation)
    const params = new URLSearchParams();
    if (category !== 'All') {
      params.set('category', category);
    }
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  };

  // Handle search term change (doesn't affect URL)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term AND selected category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' 
      ? true 
      : (product.category || '').trim() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">All Products</h1>
        <p className="products-description">Browse our complete collection of authentic Nepali products</p>
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search products by name..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Dynamic Category Filter Bar */}
        <div className="category-bar-container">
          <div className="category-bar">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category === 'All' ? '📋 All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="products-count">
        Showing {filteredProducts.length} of {allProducts.length} products
        {selectedCategory !== 'All' && (
          <span className="active-filter-badge">
            Category: {selectedCategory}
          </span>
        )}
        {searchTerm && (
          <span className="active-filter-badge">
            Search: "{searchTerm}"
          </span>
        )}
      </div>
      
      {/* Products Grid or No Results Message */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              navigate('/products');
            }} 
            className="clear-search-btn"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;