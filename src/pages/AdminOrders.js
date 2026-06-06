// AdminOrders.js - Order management with consistent fonts
import React, { useState, useEffect } from 'react';
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
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('allOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      setOrders(parsedOrders);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const saveOrders = (updatedOrders) => {
    localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    window.dispatchEvent(new Event('storage'));
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
    
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status: nextStatus } : order
    );
    saveOrders(updatedOrders);
    showNotificationMessage('success', 'Order status updated to ' + nextStatus);
  };

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
    setTimeout(() => {
      const updatedOrders = orders.filter(order => order.orderId !== orderToDelete.orderId);
      saveOrders(updatedOrders);
      showNotificationMessage('success', 'Order ' + orderToDelete.orderId + ' deleted successfully');
      setIsDeleting(false);
      closeDeleteModal();
    }, 500);
  };

  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const getFullAddress = (order) => {
    const address = order.address || order.deliveryDetails?.address || '';
    const city = order.city || order.deliveryDetails?.city || '';
    if (address && city) {
      return address + ', ' + city;
    }
    return address || city || '—';
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  
  let totalRevenue = 0;
  for (let i = 0; i < orders.length; i++) {
    totalRevenue = totalRevenue + (orders[i].grandTotal || 0);
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  // Render product details with consistent font class
  const renderProductDetails = (items) => {
    if (!items || items.length === 0) {
      return <div className="product-detail-row">—</div>;
    }
    
    return items.map((item, idx) => (
      <div key={idx} className="product-detail-row">
        <span className="product-detail-name">{item.name}</span>
        <span className="product-detail-qty">{item.quantity} ×</span>
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
        <div className={'order-notification ' + notificationType}>
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
                    <span>Product Name</span>
                    <span>Qty</span>
                    <span>Price</span>
                  </div>
                </th>
                <th className="col-amount">Amount</th>
                <th className="col-notes">Order Notes</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">No orders found</td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.orderId}>
                    <td className="col-sn">{index + 1}</td>
                    <td className="col-order-id order-id-cell">{order.orderId}</td>
                    <td className="col-date">{formatDate(order.orderDate)}</td>
                    <td className="col-customer">{order.customerName}</td>
                    <td className="col-email email-cell">{order.email || order.deliveryDetails?.email || '—'}</td>
                    <td className="col-phone">{order.phone || order.deliveryDetails?.phone || '—'}</td>
                    <td className="col-address address-cell">{getFullAddress(order)}</td>
                    <td className="col-products products-cell">
                      <div className="products-list-container">
                        {renderProductDetails(order.items)}
                      </div>
                    </td>
                    <td className="col-amount amount-cell">Rs. {(order.grandTotal || 0).toLocaleString()}</td>
                    <td className="col-notes notes-cell">
                      <div className="notes-text-full" title={order.notes || 'No notes'}>
                        {order.notes || '—'}
                      </div>
                    </td>
                    <td className="col-status">
                      <span className={'order-status ' + getStatusClass(order.status)}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="col-actions actions-cell">
                      <button
                        onClick={() => updateOrderStatus(order.orderId, order.status || 'Processing')}
                        className="update-status-btn"
                        title="Update Status"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="delete-order-btn"
                        title="Delete Order"
                      >
                        Delete
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