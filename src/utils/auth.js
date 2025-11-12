// Authentication utility functions - Database Only

const API_BASE_URL = 'http://localhost:5000/api';

// API helper function
const apiCall = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('API Call:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    hasToken: !!token,
    headers: config.headers
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log('API Response status:', response.status);
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      // Store only token in sessionStorage (temporary)
      sessionStorage.setItem('token', response.token);
      // Store user data in localStorage as fallback
      localStorage.setItem('userData', JSON.stringify(response.user));
      console.log('Token stored in sessionStorage:', response.token);
      console.log('User data stored in localStorage:', response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    // Backend expects: { name, email, password }
    const { firstName, lastName, email, password } = userData;
    const name = `${firstName} ${lastName}`.trim();
    
    const response = await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.message === "Account created successfully") {
      // After successful registration, automatically login
      const user = await loginUser(email, password);
      return user;
    }
    throw new Error(response.message || 'Registration failed');
  } catch (error) {
    throw error;
  }
};

// Get current user from database
export const getCurrentUser = async () => {
  try {
    console.log('Fetching current user from API...');
    const token = sessionStorage.getItem('token');
    console.log('Using token:', token ? token.substring(0, 20) + '...' : 'No token');
    
    const response = await apiCall('/profile');
    console.log('API response:', response);
    if (response.success) {
      return response.user;
    }
    throw new Error(response.message || 'Failed to get user data');
  } catch (error) {
    console.error('Error fetching current user:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (response.success) {
      return response.user;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await apiCall('/wishlist');
    if (response.success) {
      return response.wishlist;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

// Wishlist functions
export const addToWishlist = async (productId) => {
  try {
    const response = await apiCall('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });

    if (response.success) {
      return response.wishlist;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiCall(`/wishlist/${productId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      return response.wishlist;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

// Get user's cart
export const getCart = async () => {
  try {
    const response = await apiCall('/cart');
    if (response.success) {
      return response.cart;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

// Cart functions
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });

    if (response.success) {
      return response.cart;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await apiCall(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });

    if (response.success) {
      return response.cart;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await apiCall(`/cart/${productId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      return response.cart;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

// Check if user is logged in (has valid token)
export const isLoggedIn = () => {
  const token = sessionStorage.getItem('token');
  console.log('Checking if logged in, token exists:', !!token);
  return !!token;
};

// Logout user
export const logout = () => {
  sessionStorage.removeItem('token');
  localStorage.removeItem('userData');
};

// Demo user for testing (fallback when backend is not available)
export const setDemoUser = () => {
  const demoUser = {
    _id: "demo-user-id",
    name: {
      first: "John",
      last: "Doe"
    },
    email: "john.doe@example.com",
    phone: {
      countryCode: "+91",
      number: "9876543210"
    },
    profilePicture: "",
    points: 100,
    wishlist: [],
    cart: [],
    addresses: [],
    purchases: [],
    fullName: "John Doe"
  };
  
  sessionStorage.setItem('token', 'demo-token-123');
  return demoUser;
};
