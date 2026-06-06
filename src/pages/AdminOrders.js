// AdminOrders.js - Complete order management with improved UI
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

  // Fetch all orders
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

  useEffect(() => {
    fetchOrders();
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

  // Update order status - opens modal (kept as popup)
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
    
    if (window.confirm(`Change order status from "${currentStatus}" to "${nextStatus}"?`)) {
      updateOrderStatusAPI(orderId, nextStatus);
    }
  };

  const updateOrderStatusAPI = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        showNotificationMessage('success', `Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        showNotificationMessage('error', 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showNotificationMessage('error', 'Network error');
    }
  };

  // Delete order
  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderToDelete._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotificationMessage('success', `Order ${orderToDelete.orderId} deleted successfully`);
        fetchOrders();
      } else {
        showNotificationMessage('error', 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotificationMessage('error', 'Network error');
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Format date - 2 lines: Month Day / Year
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      line1: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      line2: date.getFullYear().toString()
    };
  };

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

  // Render product details with 3 sub-columns
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
                  const formattedDate = formatDate(order.createdAt);
                  const address = `${order.address || order.deliveryDetails?.address || ''}, ${order.city || order.deliveryDetails?.city || ''}`.replace(/^,\s|,\s$/, '') || '—';
                  
                  return (
                    <tr key={order._id}>
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
                          onClick={() => updateOrderStatus(order._id, order.status || 'Processing')}
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
  );
};

export default AdminOrders;