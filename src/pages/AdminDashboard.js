// AdminDashboard.js - Complete dashboard with product and order stats
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './AdminDashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0
  });
  const [allProducts, setAllProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0
  });

  // Get API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Handle Google Analytics button click
  const handleOpenAnalytics = () => {
    window.open('https://analytics.google.com/analytics/web/', '_blank');
  };

  // Fetch order statistics from localStorage
  const fetchOrderStats = useCallback(() => {
    const storedOrders = localStorage.getItem('allOrders');
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      const totalOrdersCount = orders.length;
      const totalRevenueAmount = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      setOrderStats({ 
        totalOrders: totalOrdersCount, 
        totalRevenue: totalRevenueAmount 
      });
      // Update stats state to sync with dashboard
      setStats(prev => ({
        ...prev,
        totalOrders: totalOrdersCount,
        totalRevenue: totalRevenueAmount
      }));
    }
  }, []);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setAllProducts(data);
      
      // Calculate total revenue from products (fallback)
      const productTotalRevenue = data.reduce((sum, product) => sum + (product.price || 0), 0);
      
      // Calculate category distribution
      const categories = {};
      data.forEach(product => {
        const cat = product.category || 'General';
        categories[cat] = (categories[cat] || 0) + 1;
      });
      
      // Calculate low stock
      const lowStockCount = data.filter(p => (p.stock !== undefined ? p.stock : 10) < 5).length;
      
      // Get order stats first to use for totalOrders and totalRevenue
      const storedOrders = localStorage.getItem('allOrders');
      let ordersTotal = 0;
      let ordersRevenue = 0;
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        ordersTotal = orders.length;
        ordersRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      }
      
      setStats({
        totalProducts: data.length,
        totalOrders: ordersTotal,
        totalRevenue: ordersRevenue || productTotalRevenue,
        lowStock: lowStockCount
      });
      
      setCategoryData(categories);
      
      // Get recent products
      const recent = [...data].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }).slice(0, 5);
      setRecentProducts(recent);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch order stats on component mount and listen for storage changes
  useEffect(() => {
    fetchOrderStats();
    window.addEventListener('storage', fetchOrderStats);
    return () => window.removeEventListener('storage', fetchOrderStats);
  }, [fetchOrderStats]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  // Toggle between showing 5 recent products and all products
  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  // Pie chart data for category distribution
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ['#FF8C42', '#E67E22', '#F39C12', '#F1C40F', '#E74C3C', '#2ECC71', '#3498DB', '#9B59B6'],
        borderWidth: 0,
      },
    ],
  };

  // Bar chart data for monthly sales (dummy data)
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales (Rs.)',
        data: [12500, 18900, 15200, 22100, 19800, 26700],
        backgroundColor: '#FF8C42',
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Trend (Dummy Data)',
      },
    },
  };

  // Determine which products to display
  const displayProducts = showAllProducts ? allProducts : recentProducts;

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's your store performance overview.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Stats Cards with real order data */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
            <span className="stat-trend up">From database</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <span className="stat-trend">From orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Rs. {stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-trend">From orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.lowStock}</h3>
            <p>Low Stock Items</p>
            <span className="stat-trend down">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Category Distribution</h3>
          {Object.keys(categoryData).length > 0 ? (
            <div className="pie-chart-container">
              <Pie data={pieChartData} />
            </div>
          ) : (
            <p className="no-data">No category data available</p>
          )}
        </div>
        
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <div className="bar-chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Enhanced Recently Added Products Section */}
      <div className="recent-products-section">
        <div className="recent-products-header">
          <h2>{showAllProducts ? 'All Products' : 'Recently Added Products'}</h2>
          <span className="product-count-badge">{displayProducts.length} products</span>
        </div>
        
        <div className="recent-products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No products available</td>
                </tr>
              ) : (
                displayProducts.map(product => (
                  <tr key={product._id || product.id}>
                    <td className="product-image-cell">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="recent-product-img"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td className="product-price-cell">Rs. {product.price?.toLocaleString() || 0}</td>
                    <td>
                      <span className="category-badge">{product.category || 'General'}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                   </tr>
                ))
              )}
            </tbody>
           </table>
        </div>
        
        {/* Show More / Show Less Button */}
        <div className="show-more-container">
          <button 
            onClick={toggleShowAllProducts} 
            className="show-more-btn"
          >
            {showAllProducts ? '← Show Less' : 'Show More Products →'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div onClick={() => navigate('/admin/add-product')} className="action-card">
            <span className="action-icon">➕</span>
            <h3>Add Product</h3>
            <p>Add new products to your store</p>
          </div>
          <div onClick={() => navigate('/admin/manage-products')} className="action-card">
            <span className="action-icon">✏️</span>
            <h3>Manage Products</h3>
            <p>Edit or delete existing products</p>
          </div>
          <div onClick={() => navigate('/admin/orders')} className="action-card">
            <span className="action-icon">📋</span>
            <h3>Manage Orders</h3>
            <p>View and manage customer orders</p>
          </div>
          <div onClick={handleOpenAnalytics} className="action-card">
            <span className="action-icon">📊</span>
            <h3>Analytics Dashboard</h3>
            <p>View Google Analytics insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;