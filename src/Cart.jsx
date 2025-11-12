import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";
import { isLoggedIn, getCart, updateCartQuantity, removeFromCart } from "./utils/auth";
import { getImageUrl } from "./utils/imageUtils";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      console.log('Cart component: Checking authentication...');
      
      if (!isLoggedIn()) {
        console.log('Cart component: User not logged in, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Cart component: Fetching cart data...');
        const cartData = await getCart();
        console.log('Cart component: Received cart data:', cartData);
        
        // Transform the data to match the expected format
        const transformedCart = cartData.map(item => ({
          _id: item.productId?._id || item._id,
          title: item.productId?.title || 'Product Title',
          price: item.productId?.price || 0,
          originalPrice: item.productId?.originalPrice || null,
          discount: item.productId?.discount || 0,
          quantity: item.quantity || 1,
          images: item.productId?.images || [],
          sellerId: item.productId?.sellerId || { name: { first: 'Unknown', last: 'Seller' } },
          addedAt: item.addedAt
        }));
        
        setCartItems(transformedCart);
      } catch (error) {
        console.error('Cart component: Error fetching cart:', error);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await handleRemoveFromCart(productId);
        return;
      }
      
      console.log('Updating cart quantity:', productId, newQuantity);
      await updateCartQuantity(productId, newQuantity);
      setCartItems(prev => 
        prev.map(item => 
          item._id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      console.log('Cart quantity updated successfully');
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      console.log('Removing product from cart:', productId);
      await removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item._id !== productId));
      console.log('Product removed from cart successfully');
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const finalPrice = item.discount > 0 ? item.price - (item.price * item.discount / 100) : item.price;
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice && item.discount > 0) {
        const savings = (item.originalPrice - item.price) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const proceedToCheckout = () => {
    alert("Proceeding to checkout...");
  };

  if (loading) {
    return (
      <div className="cart-root">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-root">
        <Header />
        <div className="cart-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-root">
      <Header />
      
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">
              <FaShoppingBag />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some items to get started</p>
            <Link to="/" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => {
                const primaryImage = item.images?.[0];
                const imageUrl = getImageUrl(primaryImage?.url);
                const finalPrice = item.discount > 0 ? item.price - (item.price * item.discount / 100) : item.price;
                const itemTotal = finalPrice * item.quantity;

                return (
                  <div key={item._id} className="cart-item">
                    <div className="item-image-container">
                      <img src={imageUrl} alt={item.title} className="item-image" />
                      {item.discount > 0 && (
                        <div className="discount-badge">
                          -{Math.round(item.discount)}%
                        </div>
                      )}
                    </div>

                    <div className="item-details">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-seller">by {item.sellerId?.name?.first} {item.sellerId?.name?.last}</p>
                      
                      <div className="item-price-info">
                        <div className="price-row">
                          <span className="current-price">₹{finalPrice}</span>
                          {item.originalPrice && item.originalPrice > finalPrice && (
                            <span className="original-price">₹{item.originalPrice}</span>
                          )}
                        </div>
                        <div className="item-total">Total: ₹{itemTotal}</div>
                      </div>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item._id)}
                      >
                        <FaTrash />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                
                {calculateSavings() > 0 && (
                  <div className="summary-row savings">
                    <span>You Save</span>
                    <span>-₹{calculateSavings()}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free">FREE</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                
                <button className="checkout-btn" onClick={proceedToCheckout}>
                  Proceed to Checkout
                </button>
                
                <div className="security-badge">
                  <span>🔒</span>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
