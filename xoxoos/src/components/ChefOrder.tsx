'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChefOrder.css';

export interface Order {
  id: string;
  dish: string;
  description: string;
  specialRequests: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

interface ChefOrderProps {
  role: 'chef' | 'customer';
}

export function ChefOrder({ role }: ChefOrderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dish, setDish] = useState('');
  const [description, setDescription] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('chefOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('chefOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish.trim()) return;

    const newOrder: Order = {
      id: `${Date.now()}-${Math.random()}`,
      dish: dish.trim(),
      description: description.trim(),
      specialRequests: specialRequests.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setDish('');
    setDescription('');
    setSpecialRequests('');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt,
            }
          : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chef-orders-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importOrders = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedOrders = JSON.parse(event.target?.result as string);
            if (Array.isArray(importedOrders)) {
              setOrders(importedOrders);
              alert('Orders imported successfully!');
            } else {
              alert('Invalid file format');
            }
          } catch (error) {
            alert('Error importing orders. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inProgressOrders = orders.filter((o) => o.status === 'in-progress');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <>
      {/* Chef Order Button */}
      <motion.button
        className="chef-order-trigger"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="chef-order-icon">🍳</span>
        <span className="chef-order-text">Chef Order</span>
      </motion.button>

      {/* Chef Order Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chef-order-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <motion.div
              className="chef-order-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="chef-order-header">
                <h2 className="chef-order-title">
                  {role === 'chef' ? '👨‍🍳 Chef Dashboard' : '🍽️ Place an Order'}
                </h2>
                <div className="chef-order-actions">
                  <button
                    className="chef-order-action-btn"
                    onClick={exportOrders}
                    title="Export Orders"
                  >
                    📥 Export
                  </button>
                  <button
                    className="chef-order-action-btn"
                    onClick={importOrders}
                    title="Import Orders"
                  >
                    📤 Import
                  </button>
                  <button
                    className="chef-order-close-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="chef-order-content">
                {/* Order Form (Customer View) */}
                {role === 'customer' && (
                  <form className="chef-order-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="dish">Dish Name *</label>
                      <input
                        id="dish"
                        type="text"
                        value={dish}
                        onChange={(e) => setDish(e.target.value)}
                        placeholder="e.g., Spaghetti Carbonara"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Any details about the dish..."
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="specialRequests">Special Requests</label>
                      <textarea
                        id="specialRequests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Dietary restrictions, preferences, etc."
                        rows={2}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="chef-order-submit-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Place Order
                    </motion.button>
                  </form>
                )}

                {/* Orders List */}
                <div className="chef-orders-list">
                  {orders.length === 0 ? (
                    <div className="chef-order-empty">
                      <p>No orders yet. {role === 'customer' ? 'Place your first order above!' : 'Waiting for orders...'}</p>
                    </div>
                  ) : (
                    <>
                      {/* Pending Orders */}
                      {pendingOrders.length > 0 && (
                        <div className="orders-section">
                          <h3 className="orders-section-title">Pending ({pendingOrders.length})</h3>
                          {pendingOrders.map((order) => (
                            <OrderCard
                              key={order.id}
                              order={order}
                              role={role}
                              onUpdateStatus={updateOrderStatus}
                              onDelete={deleteOrder}
                            />
                          ))}
                        </div>
                      )}

                      {/* In Progress Orders */}
                      {inProgressOrders.length > 0 && (
                        <div className="orders-section">
                          <h3 className="orders-section-title">In Progress ({inProgressOrders.length})</h3>
                          {inProgressOrders.map((order) => (
                            <OrderCard
                              key={order.id}
                              order={order}
                              role={role}
                              onUpdateStatus={updateOrderStatus}
                              onDelete={deleteOrder}
                            />
                          ))}
                        </div>
                      )}

                      {/* Completed Orders */}
                      {completedOrders.length > 0 && (
                        <div className="orders-section">
                          <h3 className="orders-section-title">Completed ({completedOrders.length})</h3>
                          {completedOrders.map((order) => (
                            <OrderCard
                              key={order.id}
                              order={order}
                              role={role}
                              onUpdateStatus={updateOrderStatus}
                              onDelete={deleteOrder}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface OrderCardProps {
  order: Order;
  role: 'chef' | 'customer';
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDelete: (id: string) => void;
}

function OrderCard({ order, role, onUpdateStatus, onDelete }: OrderCardProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in-progress':
        return '#3b82f6';
      case 'completed':
        return '#22c55e';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      className="order-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="order-card-header">
        <h4 className="order-card-title">{order.dish}</h4>
        <span
          className="order-card-status"
          style={{ color: getStatusColor(order.status) }}
        >
          {order.status.replace('-', ' ')}
        </span>
      </div>

      {order.description && (
        <p className="order-card-description">{order.description}</p>
      )}

      {order.specialRequests && (
        <div className="order-card-special">
          <strong>Special Requests:</strong> {order.specialRequests}
        </div>
      )}

      <div className="order-card-footer">
        <span className="order-card-date">
          Ordered: {formatDate(order.createdAt)}
        </span>
        {order.completedAt && (
          <span className="order-card-date">
            Completed: {formatDate(order.completedAt)}
          </span>
        )}
      </div>

      {role === 'chef' && (
        <div className="order-card-actions">
          {order.status === 'pending' && (
            <button
              className="order-action-btn start"
              onClick={() => onUpdateStatus(order.id, 'in-progress')}
            >
              Start Cooking
            </button>
          )}
          {order.status === 'in-progress' && (
            <button
              className="order-action-btn complete"
              onClick={() => onUpdateStatus(order.id, 'completed')}
            >
              Mark Complete
            </button>
          )}
          {order.status !== 'completed' && (
            <button
              className="order-action-btn cancel"
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
            >
              Cancel
            </button>
          )}
          <button
            className="order-action-btn delete"
            onClick={() => onDelete(order.id)}
          >
            Delete
          </button>
        </div>
      )}

      {role === 'customer' && order.status !== 'completed' && (
        <button
          className="order-action-btn cancel"
          onClick={() => onUpdateStatus(order.id, 'cancelled')}
        >
          Cancel Order
        </button>
      )}
    </motion.div>
  );
}
