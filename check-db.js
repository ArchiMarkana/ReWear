// Simple script to check database users
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ReWearDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Error:', err));

// User Schema (same as backend)
const userSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, default: "" }
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: {
    countryCode: { type: String, default: "+91" },
    number: { type: String, default: "" }
  },
  profilePicture: { type: String, default: "" },
  points: { type: Number, default: 0 },
  wishlist: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  purchases: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: Number,
    price: Number,
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("users", userSchema);

// Check all users
async function checkUsers() {
  try {
    const users = await User.find({});
    console.log('Found users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('ID:', user._id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Phone:', user.phone);
      console.log('Points:', user.points);
      console.log('Wishlist:', user.wishlist?.length || 0, 'items');
      console.log('Cart:', user.cart?.length || 0, 'items');
      console.log('Addresses:', user.addresses?.length || 0, 'items');
      console.log('Purchases:', user.purchases?.length || 0, 'items');
      console.log('Created:', user.createdAt);
    });
    
    // Update users that don't have the new fields
    const usersToUpdate = await User.find({
      $or: [
        { cart: { $exists: false } },
        { wishlist: { $exists: false } },
        { addresses: { $exists: false } },
        { purchases: { $exists: false } },
        { points: { $exists: false } }
      ]
    });
    
    if (usersToUpdate.length > 0) {
      console.log(`\nFound ${usersToUpdate.length} users that need updating...`);
      
      for (const user of usersToUpdate) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            wishlist: user.wishlist || [],
            cart: user.cart || [],
            addresses: user.addresses || [],
            purchases: user.purchases || [],
            points: user.points || 0,
            updatedAt: new Date()
          }
        });
        console.log(`Updated user: ${user.email}`);
      }
      
      console.log('All users updated successfully!');
    } else {
      console.log('\nAll users are up to date!');
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();



