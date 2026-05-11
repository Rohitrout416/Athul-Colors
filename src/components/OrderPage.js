import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../assets/orderpage.css";

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // const [loading, setLoading] = useState(true); // Unused
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  // ... (useEffects)

  // ...

  const handleConfirmPurchase = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/checkout/${id}`,
        { items: consolidatedOrders },
        { headers: { "Authorization": token } }
      );

      setShowModal(false);
      setOrders([]); // Clear local cart
      setShowSuccess(true); // Show success screen
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Failed to process checkout. Please try again.");
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/order/${id}`, { headers: { "Authorization": token } })
      .then((response) => {
        // Consolidate orders on fetch if needed, or just set raw
        // We will handle consolidation in the render or a helper
        setOrders(response.data.orders || []);
        // setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching orders:", err);
        // setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch available products from backend
    axios.get(`${API_URL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Please select a product from the list.");
      return;
    }
    const payload = {
      userId: id,
      orders: [{ productName: selectedProduct.name, quantity: Number(quantity) }],
    };

    const token = localStorage.getItem("token");
    axios
      .post(`${API_URL}/order/${id}`, payload, { headers: { "Authorization": token } })
      .then((response) => {
        setOrders(response.data.order.orders);
        toast.success("Order line created successfully.");
        setQuantity(1);
        setSelectedProduct(null);
      })
      .catch((err) => {
        console.log("Error creating order:", err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(`Error: ${err.response.data.error}`);
        } else {
          toast.error("Failed to add line item.");
        }
      });
  };



  // Helper to check if string is a valid hex color for display style
  const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  };

  // Determine unit based on product name
  const getUnit = (name) => name?.toLowerCase().includes('pigment') ? 'kg' : 'L';

  // Consolidate orders for display
  const consolidatedOrders = Object.values(orders.reduce((acc, order) => {
    if (!acc[order.productName]) {
      acc[order.productName] = {
        productName: order.productName,
        quantity: 0,
        customHex: order.customHex || null,
        ids: [],
        _id: order._id
      };
    }
    acc[order.productName].quantity += Number(order.quantity);
    acc[order.productName].ids.push(order._id);
    // Keep the most recent customHex
    if (order.customHex) acc[order.productName].customHex = order.customHex;
    return acc;
  }, {}));



  // Calculate totals
  const totalItems = consolidatedOrders.length;
  const totalUnits = consolidatedOrders.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleProceedToCheckout = () => {
    setShowModal(true);
  };

  if (showSuccess) {
    return (
      <div className="userpage-container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ color: '#10B981', fontSize: '2.5rem', marginBottom: '20px' }}>Order Placed!</h2>
        <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '40px' }}>
          Thank you for purchasing from Athul Colours! <br />
          We have received your order and will get back to you soon.
        </p>
        <button
          onClick={() => { setShowSuccess(false); navigate(0); }}
          className="checkout-btn"
          style={{ margin: '0 auto', maxWidth: '250px' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }



  return (
    <>
      <div className="header-section">
        <div className="title-block">
          <h2>Order Requisition</h2>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>PO #{id}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="logout-button" style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>
              Admin Dashboard
            </button>
          )}
          <button onClick={handleHome} className="logout-button">Home</button>
          <button onClick={handleLogout} className="logout-button" style={{ color: '#dc2626', borderColor: '#dc2626' }}>Sign Out</button>
        </div>
      </div>

      <div className="userpage-container">
        {isAdmin ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Welcome, Admin</h2>
            <p style={{ color: '#64748b', marginBottom: '40px' }}>
              Create orders or manage inventory via the dashboard.
            </p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Left Column: Picker */}
            <div className="picker-card">
              <h3>Product Configuration</h3>
              <form onSubmit={handleCreateOrder}>

                <div className="form-group">
                  <label className="form-label">Select Pigment</label>
                  <div className="pigment-grid">
                    {products.map(p => (
                      <div
                        key={p._id}
                        className={`pigment-option ${selectedProduct?._id === p._id ? 'selected' : ''}`}
                        onClick={() => setSelectedProduct(p)}
                        title={p.name}
                        style={{
                          background: p.hex || (p.name.startsWith('#') ? p.name : '#ccc')
                        }}
                      >
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="hex-display" style={{
                    background: selectedProduct?.hex || '#f1f5f9',
                    color: selectedProduct ? '#ffffff' : 'inherit',
                    textShadow: selectedProduct ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
                  }}>
                    {selectedProduct ? `${selectedProduct.name}` : "No Product Selected"}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity (in {selectedProduct && getUnit(selectedProduct.name) === 'kg' ? 'kilograms' : 'litres'})</label>
                  <div className="quantity-wrapper">
                    <button type="button" className="qty-btn" onClick={decrementQty}>-</button>
                    <input
                      type="number"
                      className="qty-input"
                      value={quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') setQuantity('');
                        else setQuantity(Math.max(1, parseInt(val) || 1));
                      }}
                      onBlur={() => {
                        if (quantity === '' || quantity < 1) setQuantity(1);
                      }}
                    />
                    <button type="button" className="qty-btn" onClick={incrementQty}>+</button>
                  </div>
                </div>

                <button type="submit" className="add-btn" disabled={!selectedProduct} style={{ opacity: !selectedProduct ? 0.5 : 1, cursor: !selectedProduct ? 'not-allowed' : 'pointer' }}>
                  Add to Cart
                </button>
              </form>
            </div>

            {/* Right Column: List */}
            <div className="orders-container">
              <div className="order-header-row">
                <span>Swatch</span>
                <span>Product Code</span>
                <span>Qty</span>
                <span style={{ textAlign: 'right' }}>Action</span>
              </div>
              {consolidatedOrders.length > 0 ? (
                <div className="order-list">
                  {consolidatedOrders.map((order, index) => {
                    const swatchColor = order.customHex || (products.find(p => p.name === order.productName)?.hex) || (isColor(order.productName) ? order.productName : '#ccc');
                    return (
                      <div key={order._id || index} className="order-item" style={{ position: 'relative' }}>
                        <div
                          className="swatch-preview"
                          style={{ backgroundColor: swatchColor }}
                        ></div>
                        <span className="product-code">{order.productName}</span>
                        <span className="qty-badge">{order.quantity} {getUnit(order.productName)}</span>
                        <button
                          className="remove-link"
                          onClick={() => setDeleteTarget(order)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No line items in this requisition.</p>
                  <small>Use the configuration panel to add products.</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="order-summary-text">
          {totalItems} items
        </div>
        <button
          className="checkout-btn"
          disabled={totalItems === 0}
          onClick={handleProceedToCheckout}
        >
          Proceed to Checkout
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div >

      {/* Confirmation Modal */}
      {
        showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Confirm Purchase</h3>
              <div className="summary-list">
                {consolidatedOrders.map((order, idx) => (
                  <div key={idx} className="summary-item">
                    <span>{order.productName}</span>
                    <strong>{order.quantity} {getUnit(order.productName)}</strong>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={handleConfirmPurchase}>Confirm Purchase</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Remove Item</h3>
            <p style={{ color: '#475569', margin: '16px 0' }}>
              Remove all <strong>{deleteTarget.quantity} {getUnit(deleteTarget.productName)}</strong> of <strong>{deleteTarget.productName}</strong>?
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="confirm-btn" style={{ background: '#dc2626' }} onClick={handleConfirmDelete}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const token = localStorage.getItem("token");
    Promise.all(deleteTarget.ids.map(itemId => axios.delete(`${API_URL}/order/${id}/${itemId}`, { headers: { "Authorization": token } })))
      .then(() => {
        setOrders(prev => prev.filter(o => o.productName !== deleteTarget.productName));
        toast.info("Line item removed.");
        setDeleteTarget(null);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to remove items.");
        setDeleteTarget(null);
      });
  }
}
