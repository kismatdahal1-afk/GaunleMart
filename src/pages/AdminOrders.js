// AdminOrders.js - Order management page for admin (FIXED - no dependency warning)
import React, { useState, useEffect, useCallback } from 'react';
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all orders - defined with useCallback to prevent recreation
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setLoading(false);
    }
  }, [API_URL]);

  // useEffect with fetchOrders in dependency array
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Show notification
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

  // Update order status
  const updateOrderStatus = async (orderId, currentStatus) => {
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
    
    if (window.confirm(`Change order status from "${currentStatus}" to "${nextStatus}"?`)) {
      try {
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus })
        });
        
        if (response.ok) {
          showNotificationMessage('success', `Order status updated to ${nextStatus}`);
          fetchOrders();
        } else {
          showNotificationMessage('error', 'Failed to update order status');
        }
      } catch (error) {
        console.error('Error updating order:', error);
        showNotificationMessage('error', 'Network error');
      }
    }
  };

  // Delete order
  const deleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order ${orderNumber}?`)) {
      try {
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          showNotificationMessage('success', `Order ${orderNumber} deleted successfully`);
          fetchOrders();
        } else {
          showNotificationMessage('error', 'Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        showNotificationMessage('error', 'Network error');
      }
    }
  };

  // Go back to admin dashboard
  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Format date
  const formatDate = (dateString) => {
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
      {/* Notification */}
      {showNotification && (
        <div className={`order-notification ${notificationType}`}>
          <span>{message || error}</span>
        </div>
      )}

      {/* Back Button */}
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

        {/* Stats Cards */}
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
                <th>SN</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">No orders found</td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td className="order-id-cell">{order.orderId}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phone}</td>
                    <td className="products-cell">
                      {order.items && order.items.length} items
                    </td>
                    <td className="amount-cell">Rs. {(order.grandTotal || 0).toLocaleString()}</td>
                    <td>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => updateOrderStatus(order._id, order.status)}
                        className="update-status-btn"
                        title="Update Status"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id, order.orderId)}
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