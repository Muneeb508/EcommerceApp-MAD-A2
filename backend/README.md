# E-Commerce Backend API

Express.js REST API with MongoDB for the e-commerce mobile application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend directory:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas:**
- Get connection string from your cluster
- Replace `MONGODB_URI` in `.env`

### 4. Seed Database

```bash
node seed.js
```

This will populate your database with 16 sample products across different categories.

### 5. Start Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main St",
  "phone": "555-1234"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products (with filters) | No |
| GET | `/api/products/:id` | Get single product | No |
| GET | `/api/products/category/list` | Get all categories | No |
| POST | `/api/products/:id/review` | Add review to product | No |

**Query Parameters for GET /api/products:**
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name/description
- `sort` - Sort option (price-asc, price-desc, name)

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PUT | `/api/cart/:id` | Update cart item quantity | Yes |
| DELETE | `/api/cart/:id` | Remove item from cart | Yes |
| DELETE | `/api/cart` | Clear entire cart | Yes |

**Add to Cart Request:**
```json
{
  "product_id": "6123456789abcdef12345678",
  "quantity": 2
}
```

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |

**Create Order Request:**
```json
{
  "shipping_address": "123 Main St, City, State 12345",
  "payment_method": "Credit Card"
}
```

### Profile Routes (`/api/profile`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get user profile | Yes |
| PUT | `/api/profile` | Update user profile | Yes |

**Update Profile Request:**
```json
{
  "name": "John Doe Updated",
  "address": "456 New St",
  "phone": "555-5678"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**How it works:**
1. User signs up or logs in
2. Server returns a JWT token
3. Client stores token (in AsyncStorage)
4. Client includes token in Authorization header: `Bearer <token>`
5. Server validates token on protected routes

**Protected Routes:**
All routes except authentication and product viewing require a valid JWT token.

## 🗄️ Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image_url: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    date: Date
  }]
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  address: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  items: [{
    product_id: ObjectId,
    name: String,
    image_url: String,
    quantity: Number,
    price: Number
  }],
  total_amount: Number,
  status: String,
  shipping_address: String,
  payment_method: String,
  order_date: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  product_id: ObjectId,
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing with Postman/Thunder Client

### 1. Register a User
```
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Get Products
```
GET http://localhost:3000/api/products
```

### 3. Add to Cart (with token)
```
POST http://localhost:3000/api/cart
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "product_id": "<product_id>",
  "quantity": 1
}
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Enable CORS
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables

## 🛠️ Project Structure

```
backend/
├── config/
│   └── database.js        # MongoDB connection
├── models/
│   ├── Product.js         # Product model
│   ├── User.js            # User model
│   ├── Cart.js            # Cart model
│   └── Order.js           # Order model
├── routes/
│   ├── auth.js            # Auth endpoints
│   ├── products.js        # Product endpoints
│   ├── cart.js            # Cart endpoints
│   ├── orders.js          # Order endpoints
│   └── profile.js         # Profile endpoints
├── middleware/
│   └── auth.js            # JWT middleware
├── server.js              # Main server file
├── seed.js                # Database seeder
└── package.json
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | Secret key for JWT | your_secret_key |

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Check if MongoDB is running
- Verify connection string
- Check network access (for Atlas)

**Port already in use:**
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

**JWT token expired:**
- Tokens expire after 30 days
- User needs to login again

## 📝 Notes

- Passwords are hashed using bcryptjs before storing
- JWT tokens are valid for 30 days
- Cart is automatically cleared after order placement
- Product stock is automatically updated after order
- All dates are stored in UTC

## 🚀 Deployment

### Heroku
1. Create Heroku app
2. Add MongoDB Atlas connection string
3. Set environment variables
4. Deploy with Git

### Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

---

**API Version:** 1.0.0

