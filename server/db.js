import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'wemart.sqlite');

const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      tag TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT DEFAULT 'Panipat',
      state TEXT DEFAULT 'Haryana',
      pincode TEXT DEFAULT '132103',
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      rating REAL NOT NULL,
      time TEXT NOT NULL,
      fee TEXT NOT NULL,
      min_order INTEGER NOT NULL,
      img TEXT NOT NULL,
      badge TEXT NOT NULL,
      offer TEXT NOT NULL,
      color TEXT NOT NULL,
      is_open INTEGER DEFAULT 1,
      phone TEXT DEFAULT '+91 98120 12345'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      size TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 50,
      img TEXT NOT NULL,
      in_stock INTEGER DEFAULT 1,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      shop_name TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL,
      lng REAL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed 5 Shops in Panipat, Haryana if empty
  const shopCount = db.prepare('SELECT count(*) as count FROM shops').get().count;
  if (shopCount === 0) {
    const insertShop = db.prepare(`
      INSERT INTO shops (name, tag, address, city, state, pincode, lat, lng, rating, time, fee, min_order, img, badge, offer, color, is_open, phone)
      VALUES (@name, @tag, @address, @city, @state, @pincode, @lat, @lng, @rating, @time, @fee, @min_order, @img, @badge, @offer, @color, @is_open, @phone)
    `);

    const insertProduct = db.prepare(`
      INSERT INTO products (shop_id, name, brand, size, price, original_price, category, stock, img, in_stock)
      VALUES (@shop_id, @name, @brand, @size, @price, @original_price, @category, @stock, @img, @in_stock)
    `);

    const panipatShops = [
      {
        name: 'Verma Kirana & General Store',
        tag: 'Model Town’s neighbourhood favourite since 1998',
        address: 'Near Shivaji Stadium, Model Town, Panipat, Haryana 132103',
        city: 'Panipat',
        state: 'Haryana',
        pincode: '132103',
        lat: 29.3885,
        lng: 76.9652,
        rating: 4.9,
        time: '15–25',
        fee: 'Free',
        min_order: 199,
        img: 'photo-1542838132-92c53300491e',
        badge: 'MODEL TOWN FAVOURITE',
        offer: '₹50 off on your first order above ₹299',
        color: 'green',
        is_open: 1,
        phone: '+91 98120 44521',
      },
      {
        name: 'Garg Supermarket & Daily Needs',
        tag: 'Wholesale rates for everyday family groceries',
        address: 'GT Road, Opp. Sanjay Chowk, Panipat, Haryana 132103',
        city: 'Panipat',
        state: 'Haryana',
        pincode: '132103',
        lat: 29.3951,
        lng: 76.9723,
        rating: 4.8,
        time: '20–30',
        fee: 'Free',
        min_order: 249,
        img: 'photo-1578916171728-46686eac8d58',
        badge: 'WIDE ASSORTMENT',
        offer: 'Flat 10% off on all atta, rice & dals',
        color: 'purple',
        is_open: 1,
        phone: '+91 98960 77123',
      },
      {
        name: 'Kisan Fresh Mandi Store',
        tag: 'Direct from Panipat & Karnal farm mandis every morning',
        address: 'Sector 11-12, HUDA Commercial Market, Panipat, Haryana 132103',
        city: 'Panipat',
        state: 'Haryana',
        pincode: '132103',
        lat: 29.4021,
        lng: 76.9554,
        rating: 4.9,
        time: '15–20',
        fee: '₹15',
        min_order: 149,
        img: 'photo-1543168256-418811576931',
        badge: 'FARM FRESH PICK',
        offer: 'Complimentary fresh coriander & mint with vegetable orders',
        color: 'orange',
        is_open: 1,
        phone: '+91 94160 33890',
      },
      {
        name: 'Aggarwal Departmental Store',
        tag: 'Insar Bazar legacy store for pure spices & dry fruits',
        address: 'Insar Bazar, Old City, Panipat, Haryana 132103',
        city: 'Panipat',
        state: 'Haryana',
        pincode: '132103',
        lat: 29.3925,
        lng: 76.9782,
        rating: 4.7,
        time: '25–35',
        fee: '₹20',
        min_order: 199,
        img: 'photo-1534723452862-4c874018d66d',
        badge: 'HERITAGE STORE',
        offer: 'Earn 2× Apna loyalty points on dry fruits',
        color: 'blue',
        is_open: 1,
        phone: '+91 98130 99450',
      },
      {
        name: 'Puri Grocers & Gourmet',
        tag: 'Organic cereals, cold-pressed oils & artisanal bakery',
        address: 'Eldeco Estate One, Sector 40, GT Karnal Road, Panipat, Haryana 132108',
        city: 'Panipat',
        state: 'Haryana',
        pincode: '132108',
        lat: 29.3654,
        lng: 76.9928,
        rating: 4.8,
        time: '25–35',
        fee: 'Free',
        min_order: 299,
        img: 'photo-1604719312566-8912e9227c6a',
        badge: 'PREMIUM PICKS',
        offer: 'Free artisanal brown bread on orders above ₹399',
        color: 'green',
        is_open: 1,
        phone: '+91 97280 66100',
      },
    ];

    const productsSeed = [
      {
        name: 'Vita Pasteurized Full Cream Milk',
        brand: 'Vita Haryana',
        size: '500 ml',
        price: 33,
        original_price: 35,
        category: 'Dairy & eggs',
        img: 'photo-1563636619-e9143da7973b',
      },
      {
        name: 'Amul Taaza Toned Milk',
        brand: 'Amul',
        size: '500 ml',
        price: 28,
        original_price: 28,
        category: 'Dairy & eggs',
        img: 'photo-1550583724-b2692b85b150',
      },
      {
        name: 'Haryana Sharbati Desi Chakki Atta',
        brand: 'Panipat Mandi Fresh',
        size: '10 kg',
        price: 435,
        original_price: 460,
        category: 'Atta, rice & dal',
        img: 'photo-1509440159596-0249088772ff',
      },
      {
        name: 'Aashirvaad Shudh Chakki Atta',
        brand: 'ITC Aashirvaad',
        size: '5 kg',
        price: 245,
        original_price: 260,
        category: 'Atta, rice & dal',
        img: 'photo-1627485937980-221c88ac04f9',
      },
      {
        name: 'Kohinoor Traditional Basmati Rice',
        brand: 'Kohinoor',
        size: '1 kg',
        price: 142,
        original_price: 160,
        category: 'Atta, rice & dal',
        img: 'photo-1586201375761-83865001e31c',
      },
      {
        name: 'Farm Fresh Desi Bananas',
        brand: 'Fresh produce',
        size: '6 pcs',
        price: 40,
        original_price: 50,
        category: 'Fruits & vegetables',
        img: 'photo-1571771894821-ce9b6c11b08e',
      },
      {
        name: 'Fresh Mandi Green Peas (Matar)',
        brand: 'Kisan Fresh',
        size: '500 g',
        price: 35,
        original_price: 45,
        category: 'Fruits & vegetables',
        img: 'photo-1619566636858-adf3ef46400b',
      },
      {
        name: 'Juicy Kinnow & Oranges',
        brand: 'Sirsa Mandi Special',
        size: '1 kg',
        price: 65,
        original_price: 80,
        category: 'Fruits & vegetables',
        img: 'photo-1611080626919-7cf5a9dbab5b',
      },
      {
        name: 'Vita Pure Desi Cow Ghee',
        brand: 'Vita Haryana',
        size: '1 L',
        price: 630,
        original_price: 660,
        category: 'Dairy & eggs',
        img: 'photo-1589927986089-35812388d1f4',
      },
      {
        name: 'Tata Sampann Unpolished Toor Dal',
        brand: 'Tata Sampann',
        size: '1 kg',
        price: 168,
        original_price: 185,
        category: 'Atta, rice & dal',
        img: 'photo-1586201375761-83865001e31c',
      },
      {
        name: 'Madhur Pure Sulphurless Sugar',
        brand: 'Madhur',
        size: '1 kg',
        price: 48,
        original_price: 52,
        category: 'All essentials',
        img: 'photo-1581441363689-1f3c3c414635',
      },
      {
        name: 'Haldiram’s Nagpur Bhujia Sev',
        brand: 'Haldiram’s',
        size: '200 g',
        price: 55,
        original_price: 60,
        category: 'Snacks & drinks',
        img: 'photo-1621939514649-280e2ee25f60',
      },
      {
        name: 'Tata Tea Premium Desi Chai',
        brand: 'Tata Tea',
        size: '500 g',
        price: 275,
        original_price: 295,
        category: 'Snacks & drinks',
        img: 'photo-1576092768241-dec231879fc3',
      },
      {
        name: 'Dettol Original Liquid Handwash Refill',
        brand: 'Dettol',
        size: '175 ml',
        price: 89,
        original_price: 99,
        category: 'Personal care',
        img: 'photo-1608571423902-eed4a5ad8108',
      },
      {
        name: 'Surf Excel Easy Wash Detergent Powder',
        brand: 'Surf Excel',
        size: '1 kg',
        price: 138,
        original_price: 150,
        category: 'Home essentials',
        img: 'photo-1563453392212-326f5e854473',
      },
    ];

    const seedTransaction = db.transaction(() => {
      panipatShops.forEach((shop, index) => {
        const info = insertShop.run(shop);
        const shopId = info.lastInsertRowid;
        // Distribute and customize products across shops
        productsSeed.forEach((prod) => {
          // slight price variations per shop
          const priceVariance = (index % 3 === 0) ? 0 : (index % 2 === 0 ? -2 : 1);
          insertProduct.run({
            shop_id: shopId,
            name: prod.name,
            brand: prod.brand,
            size: prod.size,
            price: Math.max(10, prod.price + priceVariance),
            original_price: prod.original_price,
            category: prod.category,
            stock: 40 + (index * 5),
            img: prod.img,
            in_stock: 1,
          });
        });
      });
    });

    seedTransaction();
  }
}

// Haversine formula to compute distance in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Database query helpers
export function getAllShops(userLat = null, userLng = null) {
  initDb();
  const shops = db.prepare('SELECT * FROM shops').all();
  return shops.map((s) => {
    let distance = '0.5';
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      distance = String(calculateDistance(Number(userLat), Number(userLng), s.lat, s.lng));
    }
    return {
      ...s,
      distance,
    };
  }).sort((a, b) => Number(a.distance) - Number(b.distance));
}

export function getShopById(id, userLat = null, userLng = null) {
  initDb();
  const shop = db.prepare('SELECT * FROM shops WHERE id = ?').get(id);
  if (!shop) return null;
  let distance = '0.5';
  if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
    distance = String(calculateDistance(Number(userLat), Number(userLng), shop.lat, shop.lng));
  }
  const products = db.prepare('SELECT * FROM products WHERE shop_id = ?').all(id);
  return { ...shop, distance, products };
}

export function getAllProducts(category = null, search = null) {
  initDb();
  let query = 'SELECT DISTINCT name, brand, size, min(price) as price, original_price, category, img FROM products WHERE in_stock = 1';
  const params = [];

  if (category && category !== 'All essentials') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR brand LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' GROUP BY name ORDER BY id ASC';
  return db.prepare(query).all(...params);
}

export function createOrder(orderData) {
  initDb();
  const orderNumber = `AM-${Math.floor(1000 + Math.random() * 9000)}`;
  const stmt = db.prepare(`
    INSERT INTO orders (order_number, customer_name, shop_name, address, lat, lng, total, status, items_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    orderNumber,
    orderData.customer_name || 'Ananya Sharma',
    orderData.shop_name || 'Verma Kirana & General Store',
    orderData.address || 'Model Town, Panipat',
    orderData.lat || 29.3885,
    orderData.lng || 76.9652,
    orderData.total,
    'Confirmed',
    JSON.stringify(orderData.items || [])
  );
  return { success: true, orderNumber };
}

export function getOrders() {
  initDb();
  return db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 20').all();
}

export { db };
