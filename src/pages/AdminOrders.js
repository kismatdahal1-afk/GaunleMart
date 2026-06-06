// AdminOrders.js - Order management page with enhanced UI
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

  // Open delete confirmation modal
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
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
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

  // Format address as "address, city"
  const getFullAddress = (order) => {
    const address = order.address || order.deliveryDetails?.address || '';
    const city = order.city || order.deliveryDetails?.city || '';
    if (address && city) {
      return address + ', ' + city;
    }
    return address || city || '—';
  };

  // Render product details with structured sub-table
  const renderProductDetails = (items) => {
    if (!items || items.length === 0) {
      return <div className="product-sub-row">—</div>;
    }
    
    return (
      <div className="product-sub-table">
        <div className="product-sub-header">
          <span>Name</span>
          <span>Qty</span>
          <span>Price</span>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="product-sub-row">
            <span className="product-name-cell">{item.name}</span>
            <span className="product-qty-cell">{item.quantity}</span>
            <span className="product-price-cell">Rs. {item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
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
                  <th>SN</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Order Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="no-data">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td className="order-id-cell">{order.orderId}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.customerName}</td>
                      <td className="email-cell">{order.email || order.deliveryDetails?.email || '—'}</td>
                      <td>{order.phone || order.deliveryDetails?.phone || '—'}</td>
                      <td className="address-cell">{getFullAddress(order)}</td>
                      <td className="products-cell">
                        {renderProductDetails(order.items)}
                      </td>
                      <td className="amount-cell">Rs. {(order.grandTotal || 0).toLocaleString()}</td>
                      <td className="notes-cell">
                        <div className="notes-text" title={order.notes || 'No notes'}>
                          {order.notes || '—'}
                        </div>
                      </td>
                      <td>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
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
                        </div>
                      </td>
                    </tr>
                  ))
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