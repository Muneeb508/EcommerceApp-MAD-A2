const mongoose = require('mongoose');
const Product = require('./models/Product');

// MongoDB connection string (no .env file needed)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const sampleProducts = [
  {
    name: "iPhone 14 Pro",
    description: "Latest Apple smartphone with A16 Bionic chip, 48MP camera, and Dynamic Island.",
    price: 999.99,
    image_url: "https://images.unsplash.com/photo-1678652197831-534a85862aff?w=400",
    category: "Electronics",
    stock: 50,
    rating: 4.8
  },
  {
    name: "Samsung Galaxy S23",
    description: "Premium Android phone with Snapdragon 8 Gen 2, 50MP camera.",
    price: 799.99,
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    category: "Electronics",
    stock: 45,
    rating: 4.6
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones.",
    price: 399.99,
    image_url: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
    category: "Electronics",
    stock: 30,
    rating: 4.9
  },
  {
    name: "MacBook Pro 14",
    description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for professionals.",
    price: 1999.99,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    category: "Electronics",
    stock: 20,
    rating: 4.9
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning.",
    price: 150.00,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Sports",
    stock: 100,
    rating: 4.5
  },
  {
    name: "Adidas Ultraboost",
    description: "Premium running shoes with responsive Boost cushioning.",
    price: 180.00,
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    category: "Sports",
    stock: 80,
    rating: 4.7
  },
  {
    name: "Levi's 501 Jeans",
    description: "Classic straight fit jeans. Original since 1873.",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    category: "Clothing",
    stock: 150,
    rating: 4.3
  },
  {
    name: "H&M Cotton T-Shirt",
    description: "Comfortable cotton t-shirt available in multiple colors.",
    price: 19.99,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Clothing",
    stock: 200,
    rating: 4.0
  },
  {
    name: "Zara Leather Jacket",
    description: "Genuine leather jacket with modern fit.",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    category: "Clothing",
    stock: 40,
    rating: 4.6
  },
  {
    name: "The Great Gatsby",
    description: "Classic American novel by F. Scott Fitzgerald.",
    price: 14.99,
    image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    category: "Books",
    stock: 100,
    rating: 4.8
  },
  {
    name: "Atomic Habits",
    description: "Life-changing book about building good habits by James Clear.",
    price: 16.99,
    image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    category: "Books",
    stock: 120,
    rating: 4.9
  },
  {
    name: "IKEA Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    category: "Home",
    stock: 35,
    rating: 4.4
  },
  {
    name: "Phillips Smart Bulb",
    description: "Wi-Fi enabled LED bulb with color changing options.",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400",
    category: "Home",
    stock: 150,
    rating: 4.5
  },
  {
    name: "Dyson V11 Vacuum",
    description: "Cordless stick vacuum with powerful suction.",
    price: 599.99,
    image_url: "https://images.unsplash.com/photo-1558317374-067fb12c3fb7?w=400",
    category: "Home",
    stock: 25,
    rating: 4.8
  },
  {
    name: "L'Oreal Face Cream",
    description: "Anti-aging face cream with SPF 30.",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
    category: "Beauty",
    stock: 200,
    rating: 4.2
  },
  {
    name: "LEGO Star Wars Set",
    description: "Build the Millennium Falcon with 1,351 pieces.",
    price: 159.99,
    image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
    category: "Toys",
    stock: 40,
    rating: 4.9
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected to:', MONGODB_URI);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products added');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

