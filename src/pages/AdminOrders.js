// AdminOrders.js - Complete order management with CSS isolation
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import './AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all orders from localStorage (NOT from backend API)
  const fetchOrders = useCallback(() => {
    try {
      const storedOrders = localStorage.getItem('allOrders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Listen for storage events (when new order is placed from another tab)
    window.addEventListener('storage', fetchOrders);
    return () => window.removeEventListener('storage', fetchOrders);
  }, [fetchOrders]);

  const showNotificationMessage = (type, text) => {
    setMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setMessage('');
      setError('');
    }, 3000);
  };

  // Update order status - NO CONFIRMATION POPUP (direct update)
  const updateOrderStatus = (orderId, currentStatus) => {
    const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    const currentIndex = statuses.indexOf(currentStatus);
    let nextStatus = '';
    
    if (currentStatus === 'Delivered') {
      nextStatus = 'Cancelled';
    } else if (currentStatus === 'Cancelled') {
      nextStatus = 'Processing';
    } else {
      nextStatus = statuses[currentIndex + 1];
    }
    
    // Update localStorage directly (no API call for demo)
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status: nextStatus } : order
    );
    localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    showNotificationMessage('success', `Order status updated to ${nextStatus}`);
  };

  // Delete order - WITH CONFIRMATION POPUP
  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const confirmDeleteOrder = () => {
    if (!orderToDelete) return;
    
    setIsDeleting(true);
    
    const updatedOrders = orders.filter(order => order.orderId !== orderToDelete.orderId);
    localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    
    showNotificationMessage('success', `Order ${orderToDelete.orderId} deleted successfully`);
    
    setIsDeleting(false);
    closeDeleteModal();
  };

  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  // Calculate statistics from current orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Format Order ID - 2 lines
  const formatOrderId = (orderId) => {
    if (!orderId) return { line1: 'N/A', line2: '' };
    const parts = orderId.split('-');
    if (parts.length >= 2) {
      return {
        line1: parts.slice(0, -1).join('-'),
        line2: parts[parts.length - 1]
      };
    }
    return { line1: orderId, line2: '' };
  };

  // Format date - 2 lines
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      line1: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      line2: date.getFullYear().toString()
    };
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing': return 'status-processing';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Render product details
  const renderProductDetails = (items) => {
    if (!items || items.length === 0) {
      return <div className="product-detail-row">—</div>;
    }
    
    return items.map((item, idx) => (
      <div key={idx} className="product-detail-row">
        <span className="product-detail-name">{item.name}</span>
        <span className="product-detail-qty">{item.quantity}</span>
        <span className="product-detail-price">Rs. {item.price.toLocaleString()}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="manage-orders-page">
      <div className="admin-orders">
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteOrder}
          itemName={orderToDelete?.orderId}
          isDeleting={isDeleting}
          title="Delete Order"
          confirmText="Delete Order"
          itemType="order"
        />

        {showNotification && (
          <div className={`order-notification ${notificationType}`}>
            <span>{message || error}</span>
          </div>
        )}

        <div className="orders-header-top">
          <button onClick={goBackToAdmin} className="back-to-admin-btn">
            ← Back to Admin Dashboard
          </button>
        </div>

        <div className="orders-container">
          <div className="orders-header">
            <h1>Manage Orders</h1>
            <p>View and manage all customer orders</p>
          </div>

          {/* 6 Stats Cards in One Row */}
          <div className="order-stats-grid">
            <div className="order-stat-card">
              <div className="order-stat-icon">📦</div>
              <div className="order-stat-info">
                <h3>{totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="order-stat-card">
              <div className="order-stat-icon">⏳</div>
              <div className="order-stat-info">
                <h3>{pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="order-stat-card">
              <div className="order-stat-icon">✅</div>
              <div className="order-stat-info">
                <h3>{confirmedOrders}</h3>
                <p>Confirmed Orders</p>
              </div>
            </div>
            <div className="order-stat-card">
              <div className="order-stat-icon">🚚</div>
              <div className="order-stat-info">
                <h3>{shippedOrders}</h3>
                <p>Shipped Orders</p>
              </div>
            </div>
            <div className="order-stat-card">
              <div className="order-stat-icon">🎁</div>
              <div className="order-stat-info">
                <h3>{deliveredOrders}</h3>
                <p>Delivered Orders</p>
              </div>
            </div>
            <div className="order-stat-card">
              <div className="order-stat-icon">💰</div>
              <div className="order-stat-info">
                <h3>Rs. {totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th className="col-sn">SN</th>
                  <th className="col-order-id">Order ID</th>
                  <th className="col-date">Date</th>
                  <th className="col-customer">Customer</th>
                  <th className="col-email">Email</th>
                  <th className="col-phone">Phone</th>
                  <th className="col-address">Address</th>
                  <th className="col-products">
                    Products
                    <div className="products-sub-header">
                      <span>Name</span>
                      <span>Qty</span>
                      <span>Price</span>
                    </div>
                  </th>
                  <th className="col-amount">Amount</th>
                  <th className="col-status">Status</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="no-data">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const formattedOrderId = formatOrderId(order.orderId);
                    const formattedDate = formatDate(order.orderDate || order.createdAt);
                    const address = `${order.address || order.deliveryDetails?.address || ''}, ${order.city || order.deliveryDetails?.city || ''}`.replace(/^,\s|,\s$/, '') || '—';
                    
                    return (
                      <tr key={order.orderId || index}>
                        <td className="col-sn">{index + 1}</td>
                        <td className="col-order-id">
                          <div className="order-id-line1">{formattedOrderId.line1}</div>
                          <div className="order-id-line2">{formattedOrderId.line2}</div>
                        </td>
                        <td className="col-date">
                          <div className="date-line1">{formattedDate.line1}</div>
                          <div className="date-line2">{formattedDate.line2}</div>
                        </td>
                        <td className="col-customer">{order.customerName}</td>
                        <td className="col-email">{order.email || order.deliveryDetails?.email || '—'}</td>
                        <td className="col-phone">{order.phone || order.deliveryDetails?.phone || '—'}</td>
                        <td className="col-address">{address}</td>
                        <td className="col-products">
                          <div className="products-list-container">
                            {renderProductDetails(order.items)}
                          </div>
                        </td>
                        <td className="col-amount amount-cell">Rs. {(order.grandTotal || 0).toLocaleString()}</td>
                        <td className="col-status">
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                        <td className="col-actions">
                          <button
                            onClick={() => updateOrderStatus(order.orderId, order.status || 'Processing')}
                            className="update-status-btn"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => openDeleteModal(order)}
                            className="delete-order-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;