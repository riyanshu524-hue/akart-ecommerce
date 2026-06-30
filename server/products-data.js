// Real products with accurate pricing
export const productsData = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    price: 139999,
    description: "Latest Apple iPhone with A17 Pro chip, 6.7-inch display, advanced camera system",
    image: "📱",
    stock: 15,
    rating: 4.8,
    reviews: 2341,
    vendor: "Apple Store",
    variants: [
      { id: "1-1", name: "256GB Black", price: 139999 },
      { id: "1-2", name: "512GB Silver", price: 149999 },
      { id: "1-3", name: "1TB Gold", price: 159999 }
    ]
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    price: 129999,
    description: "Flagship Android phone with 200MP camera, 6.8-inch AMOLED display",
    image: "📱",
    stock: 20,
    rating: 4.7,
    reviews: 1856,
    vendor: "Samsung India",
    variants: [
      { id: "2-1", name: "256GB Phantom Black", price: 129999 },
      { id: "2-2", name: "512GB Titanium Gray", price: 139999 }
    ]
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    price: 29999,
    description: "Premium noise-cancelling wireless headphones with 30-hour battery",
    image: "🎧",
    stock: 45,
    rating: 4.9,
    reviews: 5234,
    vendor: "Sony Electronics",
    variants: [
      { id: "3-1", name: "Black", price: 29999 },
      { id: "3-2", name: "Silver", price: 29999 }
    ]
  },
  {
    id: 4,
    name: "MacBook Pro 16-inch M3 Max",
    category: "Electronics",
    price: 249999,
    description: "Powerful laptop with M3 Max chip, 16GB RAM, 512GB SSD",
    image: "💻",
    stock: 8,
    rating: 4.9,
    reviews: 3421,
    vendor: "Apple Store",
    variants: [
      { id: "4-1", name: "16GB/512GB Space Gray", price: 249999 },
      { id: "4-2", name: "24GB/1TB Silver", price: 299999 }
    ]
  },
  {
    id: 5,
    name: "Nike Air Max 90",
    category: "Fashion",
    price: 8999,
    description: "Classic Nike sneakers with Air cushioning technology",
    image: "👟",
    stock: 60,
    rating: 4.6,
    reviews: 4123,
    vendor: "Nike India",
    variants: [
      { id: "5-1", name: "Size 6 - White", price: 8999 },
      { id: "5-2", name: "Size 7 - Black", price: 8999 },
      { id: "5-3", name: "Size 8 - Red", price: 8999 },
      { id: "5-4", name: "Size 9 - Blue", price: 8999 }
    ]
  },
  {
    id: 6,
    name: "Adidas Ultraboost 22",
    category: "Fashion",
    price: 12999,
    description: "High-performance running shoes with Boost technology",
    image: "👟",
    stock: 50,
    rating: 4.7,
    reviews: 3456,
    vendor: "Adidas India",
    variants: [
      { id: "6-1", name: "Size 7 - Black", price: 12999 },
      { id: "6-2", name: "Size 8 - White", price: 12999 },
      { id: "6-3", name: "Size 9 - Blue", price: 12999 }
    ]
  },
  {
    id: 7,
    name: "Samsung 55-inch 4K Smart TV",
    category: "Electronics",
    price: 49999,
    description: "55-inch 4K QLED TV with HDR support and smart features",
    image: "📺",
    stock: 12,
    rating: 4.8,
    reviews: 2876,
    vendor: "Samsung India",
    variants: [
      { id: "7-1", name: "55-inch Q70C", price: 49999 },
      { id: "7-2", name: "65-inch Q70C", price: 74999 }
    ]
  },
  {
    id: 8,
    name: "LG OLED 65-inch TV",
    category: "Electronics",
    price: 99999,
    description: "Premium 65-inch OLED TV with perfect blacks and vibrant colors",
    image: "📺",
    stock: 6,
    rating: 4.9,
    reviews: 1234,
    vendor: "LG India",
    variants: [
      { id: "8-1", name: "65-inch C3 OLED", price: 99999 },
      { id: "8-2", name: "77-inch C3 OLED", price: 149999 }
    ]
  },
  {
    id: 9,
    name: "Dyson V15 Detect Vacuum",
    category: "Home & Kitchen",
    price: 74999,
    description: "Cordless vacuum with laser dust detection and 60-minute runtime",
    image: "🧹",
    stock: 18,
    rating: 4.8,
    reviews: 2145,
    vendor: "Dyson India",
    variants: [
      { id: "9-1", name: "V15 Detect", price: 74999 }
    ]
  },
  {
    id: 10,
    name: "Instant Pot Duo 7-in-1",
    category: "Home & Kitchen",
    price: 7999,
    description: "Multi-cooker: pressure cooker, slow cooker, rice cooker, steamer",
    image: "🍳",
    stock: 80,
    rating: 4.7,
    reviews: 5678,
    vendor: "Instant Brands",
    variants: [
      { id: "10-1", name: "6L Duo", price: 7999 },
      { id: "10-2", name: "8L Duo Plus", price: 9999 }
    ]
  },
  {
    id: 11,
    name: "Atomic Habits Book",
    category: "Books",
    price: 599,
    description: "Bestselling book by James Clear on building good habits",
    image: "📚",
    stock: 200,
    rating: 4.9,
    reviews: 12456,
    vendor: "Amazon Books",
    variants: [
      { id: "11-1", name: "Hardcover", price: 599 },
      { id: "11-2", name: "Paperback", price: 399 }
    ]
  },
  {
    id: 12,
    name: "The Midnight Library Book",
    category: "Books",
    price: 449,
    description: "Fiction novel by Matt Haig - A journey through infinite possibilities",
    image: "📚",
    stock: 150,
    rating: 4.8,
    reviews: 8934,
    vendor: "Amazon Books",
    variants: [
      { id: "12-1", name: "Hardcover", price: 449 },
      { id: "12-2", name: "Paperback", price: 299 }
    ]
  },
  {
    id: 13,
    name: "Decathlon Running Shoes",
    category: "Sports",
    price: 3999,
    description: "Lightweight running shoes for daily training and marathons",
    image: "👟",
    stock: 100,
    rating: 4.5,
    reviews: 3421,
    vendor: "Decathlon India",
    variants: [
      { id: "13-1", name: "Size 6 - Black", price: 3999 },
      { id: "13-2", name: "Size 7 - Blue", price: 3999 },
      { id: "13-3", name: "Size 8 - Red", price: 3999 }
    ]
  },
  {
    id: 14,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 2499,
    description: "Non-slip yoga mat with carrying strap, 6mm thickness",
    image: "🧘",
    stock: 120,
    rating: 4.6,
    reviews: 4567,
    vendor: "Fitness Pro",
    variants: [
      { id: "14-1", name: "Purple", price: 2499 },
      { id: "14-2", name: "Blue", price: 2499 },
      { id: "14-3", name: "Black", price: 2499 }
    ]
  },
  {
    id: 15,
    name: "Lakme Makeup Kit",
    category: "Beauty",
    price: 1999,
    description: "Complete makeup kit with foundation, lipstick, eyeshadow",
    image: "💄",
    stock: 200,
    rating: 4.7,
    reviews: 6789,
    vendor: "Lakme Beauty",
    variants: [
      { id: "15-1", name: "Fair", price: 1999 },
      { id: "15-2", name: "Medium", price: 1999 },
      { id: "15-3", name: "Dark", price: 1999 }
    ]
  },
  {
    id: 16,
    name: "Loreal Hair Care Set",
    category: "Beauty",
    price: 1499,
    description: "Shampoo and conditioner set for all hair types",
    image: "💆",
    stock: 180,
    rating: 4.6,
    reviews: 5432,
    vendor: "L'Oreal India",
    variants: [
      { id: "16-1", name: "Normal Hair", price: 1499 },
      { id: "16-2", name: "Dry Hair", price: 1499 },
      { id: "16-3", name: "Oily Hair", price: 1499 }
    ]
  }
];

export default productsData;
