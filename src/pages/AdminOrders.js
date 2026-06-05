// AdminOrders.js - Order management page with 6 status cards and instant status update
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');

  // Load orders from localStorage
  const loadOrders = () => {
    const storedOrders = localStorage.getItem('allOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Save orders to localStorage
  const saveOrders = (updatedOrders) => {
    localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

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

  // Update order status - WITHOUT confirmation popup
  const updateOrderStatus = (orderId, currentStatus) => {
    const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    const currentIndex = statuses.indexOf(currentStatus);
    let nextStatus = '';
    
    if (currentStatus === 'Delivered') {
      nextStatus = 'Cancelled';
    } else if (currentStatus === 'Cancelled') {
      nextStatus = 'Processing';
    } else if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
      nextStatus = statuses[currentIndex + 1];
    } else {
      nextStatus = currentStatus;
    }
    
    // Direct update without confirmation
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status: nextStatus } : order
    );
    saveOrders(updatedOrders);
    showNotificationMessage('success', `Order status updated to ${nextStatus}`);
  };

  // Delete order (keep confirmation for safety)
  const deleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updatedOrders = orders.filter(order => order.orderId !== orderId);
      saveOrders(updatedOrders);
      showNotificationMessage('success', `Order ${orderId} deleted successfully`);
    }
  };

  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
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

        {/* Stats Cards - 6 Cards in One Row */}
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
                <th className="col-phone">Phone</th>
                <th className="col-products">Products</th>
                <th className="col-amount">Amount</th>
                <th className="col-notes">Order Notes</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">No orders found</td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.orderId}>
                    <td className="col-sn">{index + 1}</td>
                    <td className="col-order-id order-id-cell">{order.orderId}</td>
                    <td className="col-date">{formatDate(order.orderDate)}</td>
                    <td className="col-customer">{order.customerName}</td>
                    <td className="col-phone">{order.phone}</td>
                    <td className="col-products products-cell">
                      {order.totalItems || (order.items ? order.items.length : 0)} items
                    </td>
                    <td className="col-amount amount-cell">Rs. {(order.grandTotal || 0).toLocaleString()}</td>
                    <td className="col-notes notes-cell">
                      <span className="notes-text" title={order.notes || 'No notes'}>
                        {order.notes && order.notes.length > 30 
                          ? order.notes.substring(0, 30) + '...' 
                          : order.notes || '—'}
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="col-actions actions-cell">
                      <button
                        onClick={() => updateOrderStatus(order.orderId, order.status || 'Processing')}
                        className="update-status-btn"
                        title="Update Status"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => deleteOrder(order.orderId)}
                        className="delete-order-btn"
                        title="Delete Order"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;