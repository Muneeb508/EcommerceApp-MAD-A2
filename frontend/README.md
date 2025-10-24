# E-Commerce Frontend (React Native)

React Native mobile app with Expo for the e-commerce platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Edit `config/api.ts` and set the correct API URL:

```typescript
// For Android Emulator
const API_URL = 'http://10.0.2.2:3000/api';

// For iOS Simulator
const API_URL = 'http://localhost:3000/api';

// For Physical Device (replace with your IP)
const API_URL = 'http://192.168.1.x:3000/api';
```

**Finding your IP address:**
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` or `ip addr`

### 3. Start Expo

```bash
npx expo start
```

### 4. Run on Device/Emulator

- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## 📱 Screens

### Bottom Tab Navigation

1. **Home** (`index.tsx`)
   - Product grid layout
   - Search functionality
   - Category chips
   - Pull to refresh

2. **Categories** (`categories.tsx`)
   - Category filtering
   - Price range filtering
   - Sort options
   - List view with details

3. **Cart** (`cart.tsx`)
   - Cart items with quantities
   - Add/remove items
   - Price calculations
   - Checkout button

4. **Profile** (`profile.tsx`)
   - User information
   - Edit profile
   - Order history
   - Logout

### Stack Navigation

5. **Product Details** (`product/[id].tsx`)
   - Product images
   - Description
   - Reviews and ratings
   - Add to cart with quantity

6. **Checkout** (`checkout.tsx`)
   - Shipping address
   - Payment method selection
   - Order summary
   - Place order

7. **Order Confirmation** (`order-confirmation.tsx`)
   - Success message
   - Order details
   - Estimated delivery
   - Continue shopping

8. **Login** (`auth/login.tsx`)
   - Email/password login
   - Form validation
   - Navigate to signup

9. **Signup** (`auth/signup.tsx`)
   - User registration
   - Password confirmation
   - Navigate to login

## 🎨 UI Components

Built with **React Native Paper** (Material Design):

- `Card` - Product cards, info sections
- `Button` - Actions, navigation
- `TextInput` - Forms, search
- `Searchbar` - Product search
- `Chip` - Categories, filters
- `Badge` - Cart count
- `ActivityIndicator` - Loading states
- `Divider` - Section separators
- `IconButton` - Quantity controls

## 🔐 Authentication Flow

### Context Providers

**AuthContext** (`context/AuthContext.tsx`):
- Manages user state
- Login/signup/logout functions
- Token storage with AsyncStorage
- Automatic token loading on app start

**CartContext** (`context/CartContext.tsx`):
- Manages cart state
- Add/update/remove cart items
- Cart count and total calculation
- Automatic cart refresh on user change

### Protected Features

Features requiring authentication:
- Adding items to cart
- Viewing cart
- Checkout
- Order placement
- Profile management
- Order history

Users are prompted to login when accessing protected features.

## 📡 API Integration

### Axios Configuration

**Base Setup** (`config/api.ts`):
```typescript
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Calls Example

```typescript
// Fetch products
const response = await api.get('/products', { 
  params: { category: 'Electronics' } 
});

// Add to cart
await api.post('/cart', { 
  product_id: productId, 
  quantity: 1 
});

// Place order
await api.post('/orders', {
  shipping_address: address,
  payment_method: 'Credit Card'
});
```

## 🧭 Navigation Structure

```
Stack Navigator (Root)
├── Tabs Navigator
│   ├── Home (index)
│   ├── Categories
│   ├── Cart
│   └── Profile
├── Auth
│   ├── Login
│   └── Signup
├── Product Details [id]
├── Checkout
└── Order Confirmation
```

**Navigation Usage:**

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to product
router.push(`/product/${productId}`);

// Navigate to checkout
router.push('/checkout');

// Replace screen (no back button)
router.replace('/(tabs)');
```

## 💾 State Management

### Global State

- **AuthContext** - User authentication
- **CartContext** - Shopping cart

### Local State

- Component state with `useState`
- Loading states for async operations
- Error handling with try-catch

### Data Flow

1. User performs action (e.g., add to cart)
2. Component calls context function
3. Context makes API request
4. API updates database
5. Context updates state
6. UI re-renders with new data

## 🎯 Key Features Implementation

### Search Functionality

```typescript
const [searchQuery, setSearchQuery] = useState('');

const fetchProducts = async () => {
  const params: any = {};
  if (searchQuery) params.search = searchQuery;
  const response = await api.get('/products', { params });
};
```

### Category Filtering

```typescript
const [selectedCategory, setSelectedCategory] = useState('All');

<Chip
  selected={selectedCategory === category}
  onPress={() => setSelectedCategory(category)}
>
  {category}
</Chip>
```

### Cart Badge

```typescript
const { cartCount } = useCart();

<Badge style={{ position: 'absolute', top: -4, right: -10 }}>
  {cartCount}
</Badge>
```

### Pull to Refresh

```typescript
const [refreshing, setRefreshing] = useState(false);

<FlatList
  data={products}
  refreshControl={
    <RefreshControl 
      refreshing={refreshing} 
      onRefresh={onRefresh} 
    />
  }
/>
```

## 🔧 Configuration Files

### `app.json`
- Expo configuration
- App name, version
- Icons and splash screen

### `tsconfig.json`
- TypeScript configuration
- Path aliases (`@/`)

### `package.json`
- Dependencies
- Scripts

## 📦 Dependencies

### Core
- `expo` - Framework
- `react-native` - Mobile framework
- `react` - UI library

### Navigation
- `expo-router` - File-based routing
- `@react-navigation/native` - Navigation core
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation

### UI & UX
- `react-native-paper` - Material Design components
- `@expo/vector-icons` - Icon library

### Utilities
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage

## 🐛 Common Issues

### Cannot connect to backend

**Issue:** "Network Error" when making API calls

**Solutions:**
1. Check backend is running
2. Verify API_URL in `config/api.ts`
3. Use correct IP for physical device
4. Ensure device and computer on same WiFi

### Token expired

**Issue:** "Token is not valid" error

**Solution:**
```typescript
// User needs to logout and login again
await logout();
router.push('/auth/login');
```

### Module not found

**Issue:** Import errors

**Solution:**
```bash
# Clear cache and restart
npx expo start -c
```

### AsyncStorage warning

**Issue:** AsyncStorage deprecation warning

**Note:** Using `@react-native-async-storage/async-storage` package (not deprecated)

## 🎨 Styling

**StyleSheet API:**

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
});
```

**Theme Colors:**
- Primary: `#1976d2` (Blue)
- Success: `#4caf50` (Green)
- Error: `#d32f2f` (Red)
- Background: `#f5f5f5` (Light Gray)

## 📱 Device Testing

### Android Emulator
- API URL: `http://10.0.2.2:3000/api`
- Install Android Studio
- Create virtual device (Pixel 5, API 31+)

### iOS Simulator
- API URL: `http://localhost:3000/api`
- Install Xcode (Mac only)
- Open simulator from Xcode

### Physical Device
- API URL: `http://<YOUR_IP>:3000/api`
- Install Expo Go app
- Scan QR code
- Must be on same WiFi as computer

## 🚀 Build for Production

### Android APK

```bash
# Build APK
eas build --platform android --profile preview

# Or local build
npx expo run:android
```

### iOS IPA

```bash
# Build IPA (requires Mac & Apple Developer account)
eas build --platform ios --profile preview
```

## 📝 Development Tips

1. **Hot Reload:** Save files to see changes instantly
2. **Debug Menu:** Shake device or `Cmd+D`/`Ctrl+D`
3. **Console Logs:** Use `console.log()` for debugging
4. **React DevTools:** Install React Native Debugger
5. **Error Boundaries:** Wrap components for error handling

## 🔍 TypeScript

Type definitions help catch errors:

```typescript
interface Product {
  _id: string;
  name: string;
  price: number;
  // ...
}

const [products, setProducts] = useState<Product[]>([]);
```

## 📚 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

**App Version:** 1.0.0
