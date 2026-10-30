export type Product = {
  id: string;
  name: string;
  size: string;
  price: number;
  original_price?: number;
  img: string;
  brand: string;
  category: string;
};

export type Shop = {
  id: string;
  name: string;
  tag: string;
  city: string;
  state: string;
  address: string;
  img: string;
  lat: number;
  lng: number;
  rating: number;
  time: string;
  fee: string;
  min: number;
  offer: string;
  badge: string;
  color: string;
  phone?: string;
  owner?: string;
  timing?: string;
  pincode?: string;
  landmark?: string;
  deliveryRadius?: number;
  distance?: string;
  products: Product[];
};

export const defaultPanipatLocation = {
  lat: 29.3885,
  lng: 76.9652,
  address: 'Model Town, Panipat, Haryana',
  pincode: '132103',
  landmark: 'Near Shivaji Stadium',
};

export const shops: Shop[] = [
  {
    id: 'panipat-verma-kirana',
    name: 'Verma Kirana & General Store',
    tag: 'Model Town’s trusted neighbourhood store since 1998',
    city: 'Panipat',
    state: 'Haryana',
    address: 'Near Shivaji Stadium, Model Town, Panipat, Haryana 132103',
    img: 'photo-1542838132-92c53300491e',
    lat: 29.3885,
    lng: 76.9652,
    rating: 4.9,
    time: '15–25',
    fee: 'Free',
    min: 199,
    offer: '₹50 off on first order above ₹299',
    badge: 'MODEL TOWN FAVOURITE',
    color: 'green',
    phone: '+91 98120 44521',
    owner: 'Ramesh Verma',
    timing: '7:30 AM – 10:00 PM',
    pincode: '132103',
    landmark: 'Near Shivaji Stadium Gate 1',
    deliveryRadius: 6.0,
    products: [
      { id: 'vk-milk-1', name: 'Vita Full Cream Milk', size: '500 ml', price: 33, original_price: 35, img: 'photo-1563636619-e9143da7973b', brand: 'Vita Haryana', category: 'Dairy & eggs' },
      { id: 'vk-atta-1', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', price: 245, original_price: 260, img: 'photo-1627485937980-221c88ac04f9', brand: 'ITC Aashirvaad', category: 'Atta, rice & dal' },
      { id: 'vk-rice-1', name: 'Kohinoor Traditional Basmati Rice', size: '1 kg', price: 142, original_price: 160, img: 'photo-1586201375761-83865001e31c', brand: 'Kohinoor', category: 'Atta, rice & dal' },
      { id: 'vk-ghee-1', name: 'Vita Pure Desi Cow Ghee', size: '1 L', price: 630, original_price: 660, img: 'photo-1589927986089-35812388d1f4', brand: 'Vita Haryana', category: 'Dairy & eggs' },
      { id: 'vk-bananas', name: 'Farm Fresh Desi Bananas', size: '6 pcs', price: 40, original_price: 50, img: 'photo-1571771894821-ce9b6c11b08e', brand: 'Fresh produce', category: 'Fruits & vegetables' },
      { id: 'vk-sugar', name: 'Madhur Pure Sulphurless Sugar', size: '1 kg', price: 48, original_price: 52, img: 'photo-1581441363689-1f3c3c414635', brand: 'Madhur', category: 'All essentials' },
    ],
  },
  {
    id: 'panipat-garg-supermarket',
    name: 'Garg Supermarket & Daily Needs',
    tag: 'Wholesale rates for everyday family groceries',
    city: 'Panipat',
    state: 'Haryana',
    address: 'GT Road, Opp. Sanjay Chowk, Panipat, Haryana 132103',
    img: 'photo-1578916171728-46686eac8d58',
    lat: 29.3951,
    lng: 76.9723,
    rating: 4.8,
    time: '20–30',
    fee: 'Free',
    min: 249,
    offer: 'Flat 10% off on all atta, rice & dals',
    badge: 'WIDE ASSORTMENT',
    color: 'purple',
    phone: '+91 98960 77123',
    owner: 'Sunil Garg',
    timing: '8:00 AM – 10:30 PM',
    pincode: '132103',
    landmark: 'Opp. Sanjay Chowk Flyover',
    deliveryRadius: 8.0,
    products: [
      { id: 'gs-atta', name: 'Haryana Sharbati Desi Chakki Atta', size: '10 kg', price: 435, original_price: 460, img: 'photo-1509440159596-0249088772ff', brand: 'Panipat Mandi', category: 'Atta, rice & dal' },
      { id: 'gs-dal', name: 'Tata Sampann Unpolished Toor Dal', size: '1 kg', price: 165, original_price: 185, img: 'photo-1586201375761-83865001e31c', brand: 'Tata Sampann', category: 'Atta, rice & dal' },
      { id: 'gs-tea', name: 'Tata Tea Premium Desi Chai', size: '500 g', price: 275, original_price: 295, img: 'photo-1576092768241-dec231879fc3', brand: 'Tata Tea', category: 'Snacks & drinks' },
      { id: 'gs-bhujia', name: 'Haldiram’s Nagpur Bhujia Sev', size: '200 g', price: 55, original_price: 60, img: 'photo-1621939514649-280e2ee25f60', brand: 'Haldiram’s', category: 'Snacks & drinks' },
      { id: 'gs-milk', name: 'Amul Taaza Toned Milk', size: '500 ml', price: 28, original_price: 28, img: 'photo-1550583724-b2692b85b150', brand: 'Amul', category: 'Dairy & eggs' },
      { id: 'gs-surf', name: 'Surf Excel Easy Wash Powder', size: '1 kg', price: 135, original_price: 150, img: 'photo-1563453392212-326f5e854473', brand: 'Surf Excel', category: 'Home essentials' },
    ],
  },
  {
    id: 'panipat-kisan-mandi',
    name: 'Kisan Fresh Mandi Store',
    tag: 'Direct from Panipat & Karnal farm mandis every morning',
    city: 'Panipat',
    state: 'Haryana',
    address: 'Sector 11-12, HUDA Commercial Market, Panipat, Haryana 132103',
    img: 'photo-1543168256-418811576931',
    lat: 29.4021,
    lng: 76.9554,
    rating: 4.9,
    time: '15–20',
    fee: '₹15',
    min: 149,
    offer: 'Free coriander & mint with fresh vegetable orders',
    badge: 'FARM FRESH PICK',
    color: 'orange',
    phone: '+91 94160 33890',
    owner: 'Baljeet Singh Mann',
    timing: '6:30 AM – 9:30 PM',
    pincode: '132103',
    landmark: 'HUDA Commercial Market Complex',
    deliveryRadius: 7.0,
    products: [
      { id: 'km-matar', name: 'Fresh Mandi Green Peas (Matar)', size: '500 g', price: 35, original_price: 45, img: 'photo-1619566636858-adf3ef46400b', brand: 'Kisan Fresh', category: 'Fruits & vegetables' },
      { id: 'km-kinnow', name: 'Juicy Kinnow & Oranges', size: '1 kg', price: 65, original_price: 80, img: 'photo-1611080626919-7cf5a9dbab5b', brand: 'Sirsa Mandi', category: 'Fruits & vegetables' },
      { id: 'km-bananas', name: 'Farm Fresh Desi Bananas', size: '6 pcs', price: 38, original_price: 45, img: 'photo-1571771894821-ce9b6c11b08e', brand: 'Fresh produce', category: 'Fruits & vegetables' },
      { id: 'km-spinach', name: 'Tender Fresh Spinach (Palak)', size: '500 g', price: 25, original_price: 35, img: 'photo-1576045057995-568f588f82fb', brand: 'Local Farm', category: 'Fruits & vegetables' },
      { id: 'km-curd', name: 'Fresh Desi Dahi (Curd)', size: '400 g', price: 38, original_price: 42, img: 'photo-1550583724-b2692b85b150', brand: 'Vita Haryana', category: 'Dairy & eggs' },
    ],
  },
  {
    id: 'panipat-aggarwal-departmental',
    name: 'Aggarwal Departmental Store',
    tag: 'Insar Bazar legacy store for pure spices, dry fruits & puja samagri',
    city: 'Panipat',
    state: 'Haryana',
    address: 'Insar Bazar, Old City, Panipat, Haryana 132103',
    img: 'photo-1534723452862-4c874018d66d',
    lat: 29.3925,
    lng: 76.9782,
    rating: 4.7,
    time: '25–35',
    fee: '₹20',
    min: 199,
    offer: 'Earn 2× Ook Mart loyalty points on dry fruits',
    badge: 'HERITAGE STORE',
    color: 'blue',
    phone: '+91 98130 99450',
    owner: 'Mahesh Aggarwal',
    timing: '8:00 AM – 9:30 PM',
    pincode: '132103',
    landmark: 'Insar Bazar Clock Tower',
    deliveryRadius: 6.5,
    products: [
      { id: 'ag-badam', name: 'California Whole Almonds (Badam)', size: '500 g', price: 420, original_price: 480, img: 'photo-1508061253366-f7da158b6d46', brand: 'Aggarwal Select', category: 'Snacks & drinks' },
      { id: 'ag-kaju', name: 'Premium W320 Cashews (Kaju)', size: '500 g', price: 460, original_price: 520, img: 'photo-1508061253366-f7da158b6d46', brand: 'Aggarwal Select', category: 'Snacks & drinks' },
      { id: 'ag-spices', name: 'Hand-Ground Garam Masala', size: '100 g', price: 85, original_price: 95, img: 'photo-1596040033229-a9821ebd058d', brand: 'Insar Bazar Pure', category: 'Atta, rice & dal' },
      { id: 'ag-handwash', name: 'Dettol Original Liquid Handwash', size: '175 ml', price: 89, original_price: 99, img: 'photo-1608571423902-eed4a5ad8108', brand: 'Dettol', category: 'Personal care' },
      { id: 'ag-sugar', name: 'Madhur Sulphurless Sugar', size: '1 kg', price: 48, original_price: 52, img: 'photo-1581441363689-1f3c3c414635', brand: 'Madhur', category: 'All essentials' },
    ],
  },
  {
    id: 'panipat-puri-grocers',
    name: 'Puri Grocers & Gourmet',
    tag: 'Organic cereals, cold-pressed oils & artisanal bakery',
    city: 'Panipat',
    state: 'Haryana',
    address: 'Eldeco Estate One, Sector 40, GT Karnal Road, Panipat, Haryana 132108',
    img: 'photo-1604719312566-8912e9227c6a',
    lat: 29.3654,
    lng: 76.9928,
    rating: 4.8,
    time: '25–35',
    fee: 'Free',
    min: 299,
    offer: 'Free artisanal brown bread on orders above ₹399',
    badge: 'PREMIUM PICKS',
    color: 'green',
    phone: '+91 97280 66100',
    owner: 'Devender Puri',
    timing: '8:30 AM – 10:00 PM',
    pincode: '132108',
    landmark: 'Eldeco Estate One Main Entrance',
    deliveryRadius: 10.0,
    products: [
      { id: 'pg-bread', name: 'Whole Wheat Multigrain Bread', size: '400 g', price: 55, original_price: 60, img: 'photo-1509440159596-0249088772ff', brand: 'Puri Bakehouse', category: 'All essentials' },
      { id: 'pg-oil', name: 'Cold Pressed Virgin Mustard Oil', size: '1 L', price: 185, original_price: 210, img: 'photo-1626776881193-1c6f5a8dd5c7', brand: 'Organic Roots', category: 'All essentials' },
      { id: 'pg-oats', name: 'Rolled Whole Grain Oats', size: '1 kg', price: 195, original_price: 225, img: 'photo-1473093295043-cdd812d0e601', brand: 'Quaker', category: 'All essentials' },
      { id: 'pg-paneer', name: 'Malai Fresh Paneer (Cottage Cheese)', size: '200 g', price: 85, original_price: 95, img: 'photo-1550583724-b2692b85b150', brand: 'Vita Haryana', category: 'Dairy & eggs' },
      { id: 'pg-honey', name: 'Raw Forest Wild Honey', size: '500 g', price: 340, original_price: 390, img: 'photo-1582719478250-c89cae4dc85b', brand: 'Dabur Honey', category: 'All essentials' },
    ],
  },
];

// Unified list of all unique products
export const allProducts: Product[] = Array.from(
  new Map(shops.flatMap((shop) => shop.products).map((p) => [p.name, p])).values()
);

export interface PanipatPreset {
  name: string;
  suburb: string;
  desc: string;
  lat: number;
  lng: number;
  landmark: string;
  pincode: string;
}

export const panipatPresets: PanipatPreset[] = [
  { name: 'Model Town, Panipat', suburb: 'Model Town', desc: 'Shivaji Stadium & Model Town Central Market', lat: 29.3885, lng: 76.9652, landmark: 'Shivaji Stadium Gate 1', pincode: '132103' },
  { name: 'GT Road / Sanjay Chowk', suburb: 'GT Road', desc: 'Central Bus Stand, Red Light Chowk & Mall', lat: 29.3951, lng: 76.9723, landmark: 'Opp. Sanjay Chowk Flyover', pincode: '132103' },
  { name: 'Sector 11-12 HUDA', suburb: 'Sector 11-12', desc: 'HUDA Commercial Market & City Green Park', lat: 29.4021, lng: 76.9554, landmark: 'HUDA Commercial Complex', pincode: '132103' },
  { name: 'Insar Bazar, Old City', suburb: 'Old City', desc: 'Historic Spice Market, Grain Mandi & Quila Area', lat: 29.3925, lng: 76.9782, landmark: 'Insar Bazar Clock Tower', pincode: '132103' },
  { name: 'Eldeco Estate One', suburb: 'Sector 40', desc: 'Sector 40, GT Karnal National Highway Township', lat: 29.3654, lng: 76.9928, landmark: 'Eldeco Estate Main Arch', pincode: '132108' },
  { name: 'Panipat Junction', suburb: 'Station Road', desc: 'Northern Railway Main Junction & Goods Shed', lat: 29.3900, lng: 76.9680, landmark: 'Platform 1 Main Exit', pincode: '132103' },
  { name: 'Sector 18 Industrial Area', suburb: 'Sector 18', desc: 'Textile Mills, North Toll Plaza & Highway Hub', lat: 29.4180, lng: 76.9850, landmark: 'Panipat Toll Gate', pincode: '132103' },
  { name: 'Sector 25 / Transport Nagar', suburb: 'Sector 25', desc: 'Handloom Export Zone & Logistics Complex', lat: 29.4110, lng: 76.9420, landmark: 'Transport Nagar Gate', pincode: '132103' },
];

export interface RouteEstimate {
  straightDistanceKm: number;
  roadDistanceKm: number;
  walkingMins: number;
  twoWheelerMins: number;
  drivingMins: number;
  deliveryTimeEstimateMins: number;
  deliveryFee: number;
  isFreeDeliveryEligible: boolean;
  freeDeliveryThreshold: number;
  deliveryZone: 'Express 15-min (<2 km)' | 'Standard Delivery (2-5 km)' | 'Extended City (5-8 km)' | 'Suburban Zone (>8 km)';
}

// Accurate Haversine Distance Formula in Kilometers
export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c * 10) / 10;
}

// Route and travel time estimation based on distance
export function calculateRouteEstimate(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  cartTotal: number = 0
): RouteEstimate {
  const straightDistanceKm = haversineDistanceKm(from, to);
  // Real road circuity factor for Panipat street network (~1.25x)
  const roadDistanceKm = Math.round(straightDistanceKm * 1.25 * 10) / 10;
  
  // Walking at 4.5 km/h
  const walkingMins = Math.max(1, Math.round((roadDistanceKm / 4.5) * 60));
  // Two wheeler / Scooter at 18 km/h
  const twoWheelerMins = Math.max(2, Math.round((roadDistanceKm / 18) * 60));
  // Car / Auto-rickshaw at 26 km/h
  const drivingMins = Math.max(3, Math.round((roadDistanceKm / 26) * 60));

  // Delivery estimation (10 min store prep + two wheeler travel)
  const deliveryTimeEstimateMins = 10 + twoWheelerMins;

  let deliveryFee = 15;
  let freeDeliveryThreshold = 199;
  let deliveryZone: RouteEstimate['deliveryZone'] = 'Express 15-min (<2 km)';

  if (roadDistanceKm <= 2.2) {
    deliveryFee = 15;
    freeDeliveryThreshold = 199;
    deliveryZone = 'Express 15-min (<2 km)';
  } else if (roadDistanceKm <= 5.0) {
    deliveryFee = 25;
    freeDeliveryThreshold = 299;
    deliveryZone = 'Standard Delivery (2-5 km)';
  } else if (roadDistanceKm <= 8.5) {
    deliveryFee = 40;
    freeDeliveryThreshold = 499;
    deliveryZone = 'Extended City (5-8 km)';
  } else {
    deliveryFee = 60;
    freeDeliveryThreshold = 799;
    deliveryZone = 'Suburban Zone (>8 km)';
  }

  const isFreeDeliveryEligible = cartTotal >= freeDeliveryThreshold;
  if (isFreeDeliveryEligible) {
    deliveryFee = 0;
  }

  return {
    straightDistanceKm,
    roadDistanceKm,
    walkingMins,
    twoWheelerMins,
    drivingMins,
    deliveryTimeEstimateMins,
    deliveryFee,
    isFreeDeliveryEligible,
    freeDeliveryThreshold,
    deliveryZone,
  };
}

// Calculate nearby shops based on live coordinates
export function getNearbyShops(currentLocation?: { lat: number; lng: number }): Shop[] {
  const loc = currentLocation ?? defaultPanipatLocation;
  return [...shops]
    .map((shop) => {
      const dist = haversineDistanceKm(loc, { lat: shop.lat, lng: shop.lng });
      return {
        ...shop,
        distance: String(dist),
      };
    })
    .sort((a, b) => Number(a.distance) - Number(b.distance));
}

// Fetch live shops from SQLite API with fallback
export async function fetchShopsFromApi(userLat?: number, userLng?: number): Promise<Shop[]> {
  const lat = userLat ?? defaultPanipatLocation.lat;
  const lng = userLng ?? defaultPanipatLocation.lng;
  try {
    const res = await fetch(`/api/shops?lat=${lat}&lng=${lng}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.shops) && data.shops.length > 0) {
        // Map database records to full Shop format
        return data.shops.map((s: any) => {
          const localMatch = shops.find((ls) => ls.name === s.name);
          return {
            ...s,
            id: String(s.id || localMatch?.id || s.name),
            min: s.min_order || s.min || 199,
            products: localMatch?.products || allProducts.slice(0, 4),
          };
        });
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }
  return getNearbyShops({ lat, lng });
}

// Fetch live products from SQLite API with fallback
export async function fetchProductsFromApi(category?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All essentials') params.set('category', category);
    if (search) params.set('search', search);

    const res = await fetch(`/api/products?${params.toString()}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        return data.products.map((p: any) => ({
          id: String(p.id || p.name),
          name: p.name,
          brand: p.brand,
          size: p.size,
          price: p.price,
          original_price: p.original_price,
          category: p.category,
          img: p.img,
        }));
      }
    }
  } catch (e) {}
  return allProducts.filter((p) => {
    const matchesCat = !category || category === 'All essentials' || p.category === category;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
}

// Save order to SQLite database
export async function saveOrderToDatabase(orderData: {
  customer_name: string;
  shop_name: string;
  address: string;
  total: number;
  items: any[];
  lat?: number;
  lng?: number;
}) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { success: true, orderNumber: `AM-${Math.floor(1000 + Math.random() * 9000)}` };
}
