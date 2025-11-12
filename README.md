# ReWear - E-commerce Platform

A complete beginner-friendly e-commerce website with both user and seller sides, built with React, Node.js, Express.js, and MongoDB.

## 🚀 Features

### User Side
- Browse products by categories (Clothing, Footwear, Bags, Jewelry, Accessories, Watches, Eyewear)
- Product search and filtering
- Product detail pages
- User registration and login
- Shopping cart functionality
- Order placement
- Responsive design

### Seller Side
- Seller registration and login
- Product management (Add, Edit, Delete)
- Order management
- Dashboard with statistics
- Image upload for products
- Inventory management

## 🛠️ Technology Stack

- **Frontend**: React.js, CSS3, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
ReWear/
├── backend/
│   ├── routes/
│   │   ├── sellerRoutes.js    # Seller API routes
│   │   └── userRoutes.js      # User API routes
│   └── server.js              # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx     # Navigation header
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   ├── Home.jsx       # Home page
│   │   │   ├── Login.jsx      # User login/signup
│   │   │   ├── BuyNow.jsx     # Product purchase page
│   │   │   ├── SellerLogin.jsx # Seller login/register
│   │   │   ├── SellerDashboard.jsx # Seller dashboard
│   │   │   └── ProductDetail.jsx   # Product detail page
│   │   └── App.jsx            # Main app component
│   └── package.json
├── MONGODB_SETUP.js           # Database setup script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ReWear
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Setup Database
1. Make sure MongoDB is running on your system
2. Open MongoDB shell or MongoDB Compass
3. Run the setup script:
```bash
# In MongoDB shell
load("MONGODB_SETUP.js")
```

Or copy and paste the contents of `MONGODB_SETUP.js` into MongoDB Compass.

### 5. Start the Application

#### Start Backend Server
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## 📊 Database Collections

### 1. Users Collection
- User registration and login data
- Profile information
- Wishlist and addresses

### 2. Sellers Collection
- Seller registration and login data
- Business information
- Category specialization

### 3. Products Collection
- Product details (title, description, price, etc.)
- Images and specifications
- Stock and status information
- Seller reference

### 4. Orders Collection
- Order details and items
- Customer and seller information
- Order status and timeline

## 🎯 API Endpoints

### User Routes (`/api/user`)
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `GET /products/category/:category` - Get products by category
- `POST /orders` - Place order
- `GET /orders` - Get user orders
- `GET /categories` - Get all categories

### Seller Routes (`/api/seller`)
- `POST /register` - Seller registration
- `POST /login` - Seller login
- `GET /profile` - Get seller profile
- `POST /products` - Add product
- `GET /products` - Get seller's products
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /orders` - Get seller's orders
- `PUT /orders/:id/status` - Update order status
- `GET /dashboard` - Get dashboard statistics

## 🎨 Categories Available

1. **Clothing** - Tops, Bottoms, Dresses, Outerwear, Activewear
2. **Footwear** - Sneakers, Boots, Sandals, Heels, Flats
3. **Bags & Purses** - Handbags, Backpacks, Clutches, Totes, Crossbody
4. **Jewelry** - Necklaces, Earrings, Rings, Bracelets, Watches
5. **Accessories** - Belts, Scarves, Hats, Sunglasses, Wallets
6. **Watches** - Analog, Digital, Smart, Sports, Luxury
7. **Eyewear** - Sunglasses, Prescription, Reading, Sports, Fashion

## 🔐 Authentication

- **JWT Tokens**: Used for both user and seller authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Token Expiry**: 7 days for sellers, 1 hour for users
- **Protected Routes**: Middleware to verify authentication

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Getting Started as a Seller

1. Visit `http://localhost:3000/seller/register`
2. Fill in your details (name, email, mobile, category)
3. Complete registration
4. Login to access your dashboard
5. Add products with images and details
6. Manage orders from customers

## 🛒 Getting Started as a User

1. Visit `http://localhost:3000`
2. Browse products by category
3. Click on any product to view details
4. Register/Login to place orders
5. View your order history

## 🔧 Configuration

### Environment Variables
Create a `key.env` file in the backend directory:
```
JWT_SECRET=your_secret_key_here
PORT=5000
```

### MongoDB Connection
The application connects to MongoDB at `mongodb://localhost:27017/ReWearDB`

## 📝 Sample Data

The setup script includes:
- 4 sample sellers
- 8 sample products across different categories
- Proper database indexes for performance

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on port 27017
   - Check if the database name is correct

2. **Port Already in Use**
   - Change the PORT in your environment variables
   - Kill existing processes using the port

3. **CORS Issues**
   - Ensure the frontend is running on port 3000
   - Check CORS configuration in server.js

4. **Image Upload Issues**
   - Ensure the uploads directory exists
   - Check file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console for error messages
4. Ensure all dependencies are installed correctly

## 🎉 Features Implemented

✅ User registration and login  
✅ Seller registration and login  
✅ Product browsing by categories  
✅ Product detail pages  
✅ Seller dashboard  
✅ Product management (CRUD)  
✅ Order management  
✅ Responsive design  
✅ Image upload for products  
✅ Search functionality  
✅ Shopping cart (basic)  
✅ Order placement  
✅ Database setup with sample data  

## 🚀 Future Enhancements

- Payment gateway integration
- Advanced search and filtering
- Product reviews and ratings
- Email notifications
- Admin panel
- Advanced analytics
- Mobile app
- Social media integration

---

**Happy Coding! 🎉**

Built with ❤️ for beginners to learn e-commerce development.

