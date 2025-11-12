// MongoDB Setup Script for ReWear E-commerce
// Run this script in MongoDB shell or MongoDB Compass

// Switch to ReWearDB database
use ReWearDB;

// Create Sellers Collection
db.createCollection("sellers");

// Create Products Collection
db.createCollection("products");

// Create Orders Collection
db.createCollection("orders");

// Insert Sample Sellers
db.sellers.insertMany([
  {
    name: {
      first: "Priya",
      last: "Sharma"
    },
    email: "priya.sharma@example.com",
    mobile: "9876543210",
    gstin: "29ABCDE1234F1Z5",
    category: "clothing",
    password: "$2a$10$example_hashed_password_1",
    createdAt: new Date()
  },
  {
    name: {
      first: "Raj",
      last: "Kumar"
    },
    email: "raj.kumar@example.com",
    mobile: "9876543211",
    gstin: "29ABCDE1234F1Z6",
    category: "footwear",
    password: "$2a$10$example_hashed_password_2",
    createdAt: new Date()
  },
  {
    name: {
      first: "Sneha",
      last: "Patel"
    },
    email: "sneha.patel@example.com",
    mobile: "9876543212",
    gstin: "29ABCDE1234F1Z7",
    category: "jewelry",
    password: "$2a$10$example_hashed_password_3",
    createdAt: new Date()
  },
  {
    name: {
      first: "Amit",
      last: "Singh"
    },
    email: "amit.singh@example.com",
    mobile: "9876543213",
    gstin: "29ABCDE1234F1Z8",
    category: "bags",
    password: "$2a$10$example_hashed_password_4",
    createdAt: new Date()
  }
]);

// Insert Sample Products
db.products.insertMany([
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Elegant Cotton Kurta",
    description: "Beautiful handcrafted cotton kurta perfect for casual and formal occasions. Made with premium quality cotton fabric.",
    category: "clothing",
    subcategory: "Kurtas",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    size: "M",
    color: "Blue",
    condition: "new",
    material: "Cotton",
    gender: "women",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
        isPrimary: false
      }
    ],
    stock: 15,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Classic Leather Sneakers",
    description: "Comfortable and stylish leather sneakers for everyday wear. Perfect for both casual and semi-formal occasions.",
    category: "footwear",
    subcategory: "Sneakers",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    size: "9",
    color: "White",
    condition: "new",
    material: "Leather",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 8,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Gold Plated Necklace Set",
    description: "Elegant gold plated necklace set with matching earrings. Perfect for special occasions and celebrations.",
    category: "jewelry",
    subcategory: "Necklaces",
    price: 1899,
    originalPrice: 2299,
    discount: 17,
    size: "One Size",
    color: "Gold",
    condition: "new",
    material: "Gold Plated",
    gender: "women",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 5,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Designer Handbag",
    description: "Stylish and spacious designer handbag perfect for daily use. Multiple compartments for organized storage.",
    category: "bags",
    subcategory: "Handbags",
    price: 1799,
    originalPrice: 2199,
    discount: 18,
    size: "Medium",
    color: "Black",
    condition: "new",
    material: "Synthetic Leather",
    gender: "women",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 12,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Casual Denim Jacket",
    description: "Trendy denim jacket perfect for layering. Made with comfortable denim fabric and modern fit.",
    category: "clothing",
    subcategory: "Jackets",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    size: "L",
    color: "Blue",
    condition: "new",
    material: "Denim",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 10,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Sports Running Shoes",
    description: "High-performance running shoes with excellent cushioning and breathable material. Perfect for athletes.",
    category: "footwear",
    subcategory: "Sports Shoes",
    price: 3299,
    originalPrice: 3999,
    discount: 18,
    size: "10",
    color: "Red",
    condition: "new",
    material: "Mesh & Rubber",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 6,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Silver Bracelet Set",
    description: "Beautiful silver bracelet set with intricate designs. Perfect gift for special occasions.",
    category: "jewelry",
    subcategory: "Bracelets",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    size: "Adjustable",
    color: "Silver",
    condition: "new",
    material: "Sterling Silver",
    gender: "women",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 20,
    status: "active",
    createdAt: new Date()
  },
  {
    sellerId: ObjectId(), // Replace with actual seller ID from above
    title: "Laptop Backpack",
    description: "Durable and spacious laptop backpack with multiple compartments. Perfect for work and travel.",
    category: "bags",
    subcategory: "Backpacks",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    size: "Large",
    color: "Gray",
    condition: "new",
    material: "Nylon",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        isPrimary: true
      }
    ],
    stock: 8,
    status: "active",
    createdAt: new Date()
  }
]);

// Create Indexes for better performance
db.sellers.createIndex({ email: 1 }, { unique: true });
db.sellers.createIndex({ mobile: 1 });
db.sellers.createIndex({ category: 1 });

db.products.createIndex({ sellerId: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ status: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ createdAt: -1 });
db.products.createIndex({ title: "text", description: "text" });

db.orders.createIndex({ orderId: 1 }, { unique: true });
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ sellerId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

// Drop existing users collection if it exists and create new one with validation
db.users.drop();
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name"],
      properties: {
        name: {
          bsonType: "object",
          required: ["first", "last"],
          properties: {
            first: { 
              bsonType: "string",
              minLength: 1,
              maxLength: 50
            },
            last: { 
              bsonType: "string",
              minLength: 1,
              maxLength: 50
            }
          }
        },
        email: { 
          bsonType: "string", 
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "unique user email" 
        },
        password: { 
          bsonType: "string", 
          minLength: 6,
          description: "bcrypt hashed password" 
        },
        phone: {
          bsonType: "object",
          properties: {
            countryCode: { 
              bsonType: "string"
            },
            number: { 
              bsonType: "string"
            }
          }
        },
        profilePicture: { 
          bsonType: "string"
        },
        points: { 
          bsonType: "int",
          minimum: 0
        },
        wishlist: { 
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "addedAt"],
            properties: {
              productId: {
                bsonType: "objectId"
              },
              addedAt: {
                bsonType: "date"
              }
            }
          }
        },
        cart: { 
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productId", "quantity", "addedAt"],
            properties: {
              productId: {
                bsonType: "objectId"
              },
              quantity: {
                bsonType: "int",
                minimum: 1
              },
              addedAt: {
                bsonType: "date"
              }
            }
          }
        },
        addresses: { 
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: {
                bsonType: "string",
                enum: ["home", "work", "other"]
              },
              street: { bsonType: "string" },
              city: { bsonType: "string" },
              state: { bsonType: "string" },
              zipCode: { bsonType: "string" },
              country: { 
                bsonType: "string"
              },
              isDefault: { 
                bsonType: "bool"
              }
            }
          }
        },
        purchases: { 
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              orderId: {
                bsonType: "objectId"
              },
              productId: {
                bsonType: "objectId"
              },
              quantity: {
                bsonType: "int"
              },
              price: {
                bsonType: "number"
              },
              purchaseDate: {
                bsonType: "date"
              },
              status: {
                bsonType: "string"
              }
            }
          }
        },
        isActive: {
          bsonType: "bool"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "wishlist.productId": 1 });
db.users.createIndex({ "cart.productId": 1 });
db.users.createIndex({ "purchases.productId": 1 });
db.users.createIndex({ "purchases.orderId": 1 });
db.users.createIndex({ points: -1 });
db.users.createIndex({ createdAt: -1 });

// Insert Sample Users
db.users.insertMany([
  {
    name: {
      first: "John",
      last: "Doe"
    },
    email: "john.doe@example.com",
    password: "$2a$10$example_hashed_password_user_1",
    phone: {
      countryCode: "+91",
      number: "9876543210"
    },
    profilePicture: "https://example.com/profile.jpg",
    points: 150,
    wishlist: [],
    cart: [],
    addresses: [
      {
        type: "home",
        street: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        country: "India",
        isDefault: true
      }
    ],
    purchases: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: {
      first: "Jane",
      last: "Smith"
    },
    email: "jane.smith@example.com",
    password: "$2a$10$example_hashed_password_user_2",
    phone: {
      countryCode: "+91",
      number: "9876543211"
    },
    profilePicture: "https://example.com/profile.jpg",
    points: 75,
    wishlist: [],
    cart: [],
    addresses: [
      {
        type: "home",
        street: "456 Park Avenue",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110001",
        country: "India",
        isDefault: true
      },
      {
        type: "work",
        street: "789 Business Center",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110002",
        country: "India",
        isDefault: false
      }
    ],
    purchases: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: {
      first: "Amit",
      last: "Kumar"
    },
    email: "amit.kumar@example.com",
    password: "$2a$10$example_hashed_password_user_3",
    phone: {
      countryCode: "+91",
      number: "9876543212"
    },
    profilePicture: "https://example.com/profile.jpg",
    points: 200,
    wishlist: [],
    cart: [],
    addresses: [
      {
        type: "home",
        street: "321 Garden Road",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
        isDefault: true
      }
    ],
    purchases: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ MongoDB setup completed successfully!");
print("📊 Collections created: sellers, products, orders, users");
print("👥 Sample sellers added: 4");
print("📦 Sample products added: 8");
print("👤 Sample users added: 3");
print("🔍 Indexes created for better performance");
print("");
print("🚀 You can now start your ReWear application!");
print("💡 Remember to replace ObjectId() with actual seller IDs when adding products");
print("💡 Users collection includes wishlist, cart, addresses, and purchases arrays");

