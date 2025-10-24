# E-Commerce App (Online Shopping)

A full-stack mobile e-commerce application built with React Native (Expo), Express.js, and MongoDB.

## 📱 Screenshots

### Main Screens
- **Home Screen**: Product grid with search and category filters
- **Product Details**: Detailed product view with reviews and add to cart
- **Cart Screen**: Shopping cart with quantity management
- **Checkout**: Payment and shipping information
- **Order Confirmation**: Order summary and estimated delivery
- **Profile**: User information and order history
- **Categories**: Advanced filtering and sorting options

## 🚀 Features

- ✅ User authentication (Sign up / Login)
- ✅ Product browsing with search and filters
- ✅ Category-based filtering
- ✅ Price range filtering
- ✅ Product details with reviews and ratings
- ✅ Shopping cart management
- ✅ Checkout process
- ✅ Order placement and tracking
- ✅ User profile management
- ✅ Order history
- ✅ Real-time cart updates
- ✅ Responsive UI with React Native Paper

## 🛠️ Technology Stack

### Frontend
- **React Native** with Expo
- **React Navigation** (Stack + Bottom Tabs)
- **React Native Paper** (UI Components)
- **Axios** (HTTP Client)
- **AsyncStorage** (Local Storage)
- **TypeScript**

### Backend
- **Node.js** with Express.js
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **bcryptjs** (Password Hashing)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulators) OR Expo Go app (for physical device)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Munneb_App(Ecommerce)
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if it doesn't exist)
# Add the following content:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**MongoDB Setup:**

**Option A: Local MongoDB**
1. Install MongoDB on your machine
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

**Seed Database with Sample Products:**

```bash
# Run the seed script to populate products
node seed.js
```

**Start Backend Server:**

```bash
# Development mode with auto-restart
npm run dev

# OR production mode
npm start
```

Server will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

**Configure API URL:**

Edit `frontend/config/api.ts` and update the `API_URL`:

```typescript
// For Android Emulator
const API_URL = 'http://10.0.2.2:3000/api';

// For iOS Simulator
const API_URL = 'http://localhost:3000/api';

// For Physical Device (replace with your computer's IP)
const API_URL = 'http://192.168.1.x:3000/api';
```

**Start Expo Development Server:**

```bash
# Start Expo
npx expo start
```

**Run on Device/Emulator:**

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

## 🗂️ Project Structure

```
Munneb_App(Ecommerce)/
├── backend/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── Product.js          # Product schema
│   │   ├── User.js             # User schema
│   │   ├── Cart.js             # Cart schema
│   │   └── Order.js            # Order schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── products.js         # Product routes
│   │   ├── cart.js             # Cart routes
│   │   ├── orders.js           # Order routes
│   │   └── profile.js          # Profile routes
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── server.js               # Express server
│   ├── seed.js                 # Database seeder
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx       # Home screen
    │   │   ├── categories.tsx  # Categories/Filter screen
    │   │   ├── cart.tsx        # Cart screen
    │   │   └── profile.tsx     # Profile screen
    │   ├── auth/
    │   │   ├── login.tsx       # Login screen
    │   │   └── signup.tsx      # Signup screen
    │   ├── product/
    │   │   └── [id].tsx        # Product details screen
    │   ├── checkout.tsx        # Checkout screen
    │   ├── order-confirmation.tsx  # Order confirmation screen
    │   └── _layout.tsx         # Root layout
    ├── config/
    │   └── api.ts              # API configuration
    ├── context/
    │   ├── AuthContext.tsx     # Authentication context
    │   └── CartContext.tsx     # Cart context
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/review` - Add review to product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 🔐 Authentication Flow

1. User signs up with name, email, and password
2. Password is hashed using bcryptjs
3. JWT token is generated and returned
4. Token is stored in AsyncStorage
5. Token is automatically attached to all API requests
6. User stays logged in until they logout

## 🛒 Shopping Flow

1. Browse products on Home screen
2. Search or filter products by category/price
3. Click on product to view details
4. Add product to cart (login required)
5. View cart and adjust quantities
6. Proceed to checkout
7. Enter shipping address and payment method
8. Place order
9. View order confirmation
10. Check order history in Profile

## 📱 Frontend-Backend Communication

The app uses Axios for HTTP requests:

```typescript
// Example: Adding item to cart
const response = await api.post('/cart', { 
  product_id: productId, 
  quantity: 1 
});
```

- Authentication token is automatically attached via Axios interceptor
- API responses are handled with try-catch blocks
- Loading states are shown during requests
- Error messages are displayed to users

## 🎨 UI Components

The app uses **React Native Paper** for consistent Material Design UI:
- Cards
- Buttons
- Text Inputs
- Activity Indicators
- Chips
- Badges
- Dividers

## 🧪 Testing the App

### Sample Test Flow:

1. **Sign Up**
   - Create a new account
   - Email: `test@example.com`
   - Password: `password123`

2. **Browse Products**
   - View products on home screen
   - Try search functionality
   - Filter by categories

3. **Add to Cart**
   - Click on a product
   - Adjust quantity
   - Add to cart

4. **Checkout**
   - Go to cart
   - Review items
   - Click checkout
   - Enter shipping address
   - Select payment method
   - Place order

5. **View Order**
   - Check order confirmation
   - View order history in profile

## 🐛 Troubleshooting

### Backend Issues

**MongoDB connection error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for MongoDB Atlas

**Port already in use:**
```bash
# Change PORT in .env file or kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running
- Check API_URL in `frontend/config/api.ts`
- Use correct IP address for physical device
- Ensure device and computer are on same network

**Package installation errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Expo issues:**
```bash
# Clear Expo cache
npx expo start -c
```

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1"
}
```

### Frontend Dependencies
```json
{
  "expo": "~54.0.13",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-paper": "^5.12.3",
  "axios": "^1.6.2",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@react-navigation/native": "^7.1.8",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "@react-navigation/native-stack": "^7.2.0"
}
```

## 🚀 Future Enhancements

- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multiple payment gateway integration
- [ ] Push notifications
- [ ] Order tracking with status updates
- [ ] Admin panel for product management
- [ ] Social media login (Google, Facebook)
- [ ] Product image upload
- [ ] Advanced search with filters
- [ ] Customer support chat

## 📄 License

This project is created for educational purposes.

## 👤 Author

**Munneb**

---

## 📝 Notes

- Make sure to change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Handle edge cases and errors gracefully

---

**Happy Shopping! 🛍️**

