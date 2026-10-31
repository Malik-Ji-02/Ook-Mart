import { useState, useEffect, useRef } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import ShopMap from './ShopMap';
import {
  getNearbyShops,
  allProducts,
  type Shop,
  type Product,
  defaultPanipatLocation,
  panipatPresets,
  calculateRouteEstimate,
  haversineDistanceKm,
  fetchShopsFromApi,
  fetchProductsFromApi,
  saveOrderToDatabase,
} from './data/shopDatabase';

const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'selection' = 'light') => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    if (type === 'light') Haptics.impact({ style: ImpactStyle.Light });
    else if (type === 'medium') Haptics.impact({ style: ImpactStyle.Medium });
    else if (type === 'success') Haptics.notification({ type: NotificationType.Success });
    else if (type === 'selection') Haptics.selectionChanged();
  } catch {}
};

function Icon({name, size=20}: {name:string;size?:number}) {
 const paths:Record<string, React.ReactNode> = {
 profile:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
 home:<><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
 shop:<><path d="M4 10v10h16V10M3 10l2-7h14l2 7"/><path d="M3 10q3 4 6 0 3 4 6 0 3 4 6 0M9 20v-6h6v6"/></>,
 spark:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/></>,
 bag:<><path d="M5 7h14l2 14H3ZM8 8V6a4 4 0 0 1 8 0v2"/></>,
 heart:<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 3 11 8 15 5-4 13-10 8-15Z"/>,
 gift:<><path d="M3 9h18v4H3zm2 4v8h14v-8M12 9v12"/><path d="M12 9C2 9 5 0 9 4Zm0 0c10 0 7-9 3-5Z"/></>,
 list:<><path d="M8 5h12M8 12h12M8 19h12M3 5h1M3 12h1M3 19h1"/></>,
 pin:<><path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 chevron:<path d="m9 5 7 7-7 7"/>,
 down:<path d="m6 9 6 6 6-6"/>,
 bell:<><path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4ZM10 21h4"/></>,
 truck:<><path d="M2 5h12v12H2Zm12 5h4l4 5v2h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 check:<path d="m5 12 4 4L19 6"/>,
 shield:<><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
 help:<><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3v2m-1 3h.01"/></>,
 logout:<><path d="M10 3H4v18h6m4-14 5 5-5 5m-5-5h13"/></>,
 chart:<><path d="M4 3v18h18M8 16v-5m5 5V7m5 9V4"/></>,
 plus:<path d="M12 5v14M5 12h14"/>,
 leaf:<><path d="M20 3C5 1 1 12 8 17s15-2 12-14ZM5 21 16 9"/></>,
 ruler:<><path d="m21.7 6.3-5-5a2 2 0 0 0-2.8 0L2.3 12.9a2 2 0 0 0 0 2.8l5 5a2 2 0 0 0 2.8 0l11.6-11.6a2 2 0 0 0 0-2.8ZM9 12l2-2m-4 4 2-2m8-8 2-2"/></>,
 bike:<><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l4-3 3 3h4M12 17.5V14"/></>,
 car:<><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C1.5 11.1 1 11.9 1 12.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
 walk:<><circle cx="13" cy="4" r="2"/><path d="m9 20 3-6-3-2v-4l4 2 3-2m-4 6 4 4"/></>,
 navigation:<polygon points="3 11 22 2 13 21 11 13 3 11"/>,
 locate:<><circle cx="12" cy="12" r="10"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/><circle cx="12" cy="12" r="3"/></>,
 phone:<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]||paths.bag}</svg>;
}
const photo=(id:string,w=700)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const categories=[['All essentials','photo-1542838132-92c53300491e'],['Fruits & vegetables','photo-1619566636858-adf3ef46400b'],['Dairy & eggs','photo-1563636619-e9143da7973b'],['Atta, rice & dal','photo-1586201375761-83865001e31c'],['Snacks & drinks','photo-1621939514649-280e2ee25f60'],['Personal care','photo-1608571423902-eed4a5ad8108'],['Home essentials','photo-1563453392212-326f5e854473']];
const nav=[['home','Discover'],['shop','Nearby shops'],['spark','Smart Cart AI'],['bag','My orders'],['heart','Favourites'],['gift','Rewards & loyalty'],['list','Shopping lists']];

export default function App(){
 const [shopFilter,setShopFilter]=useState('All shops');
 const [page,setPage]=useState('Landing'),[role,setRole]=useState('Customer'),[modal,setModal]=useState(''),[search,setSearch]=useState(''),[category,setCategory]=useState('All essentials'),[cart,setCart]=useState<Record<string,number>>({}),[delivery,setDelivery]=useState('Delivery'),[userLocation,setUserLocation]=useState<{lat:number;lng:number}>(defaultPanipatLocation),[liveCoords,setLiveCoords]=useState<{lat:number;lng:number} | null>(null),[isLocating,setIsLocating]=useState(false),[shops,setShops]=useState<Shop[]>(() => getNearbyShops(defaultPanipatLocation)),[products,setProducts]=useState<Product[]>(allProducts),[selectedShop,setSelectedShop]=useState<Shop>(() => getNearbyShops(defaultPanipatLocation)[0]),[preference,setPreference]=useState('Balanced value'),[compared,setCompared]=useState(false),[saved,setSaved]=useState<string[]>([]),[toast,setToast]=useState(''),[address,setAddress]=useState('Model Town, Panipat'),[ordered,setOrdered]=useState(false);

 // Auth & Role State
 const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
 const [authRole, setAuthRole] = useState<'customer' | 'shopkeeper' | 'delivery guy' | 'wholesale shopkeeper'>('customer');
 const [authPhone, setAuthPhone] = useState('9812345678');
 const [authPassword, setAuthPassword] = useState('••••••••');
 const [authName, setAuthName] = useState('Ananya Sharma');
 const [authShopName, setAuthShopName] = useState('Sharma General Store');
 const [authVehicle, setAuthVehicle] = useState('Hero Splendor (HR-06-AB-1234)');
 const [authGst, setAuthGst] = useState('06AAAAA0000A1Z5');
 const [deliveryOnline, setDeliveryOnline] = useState(true);
 const [pickedUpDeliveries, setPickedUpDeliveries] = useState<string[]>([]);
 const [completedDeliveries, setCompletedDeliveries] = useState<string[]>([]);

 function loginWithRole(rKey: 'customer' | 'shopkeeper' | 'delivery guy' | 'wholesale shopkeeper', customName?: string) {
   triggerHaptic('success');
   setAuthRole(rKey);
   if (rKey === 'customer') {
     setRole('Customer');
     setAuthName(customName || 'Ananya Sharma');
     notify(`Welcome back, ${customName || 'Ananya'}! Logged in as Customer.`);
   } else if (rKey === 'shopkeeper') {
     setRole('Shopkeeper');
     setAuthName(customName || 'Ramesh Sharma');
     notify(`Welcome, ${customName || 'Ramesh ji'}! Sharma General Store dashboard active.`);
   } else if (rKey === 'delivery guy') {
     setRole('Delivery Guy');
     setAuthName(customName || 'Vikas Kumar');
     notify(`Welcome, ${customName || 'Vikas'}! Delivery fleet navigation active.`);
   } else if (rKey === 'wholesale shopkeeper') {
     setRole('Wholesale Shopkeeper');
     setAuthName(customName || 'Bharat Aggarwal');
     notify(`Welcome, ${customName || 'Bharat ji'}! Bharat Wholesale portal active.`);
   }
   go('Discover');
 }

 // Distance Calculator State
 const [calcShop, setCalcShop] = useState<Shop>(() => getNearbyShops(defaultPanipatLocation)[0]);
 const [travelMode, setTravelMode] = useState<'bike' | 'car' | 'walk'>('bike');
 const [simulatedKm, setSimulatedKm] = useState<number | null>(null);
 const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
 const [gpsLockTime, setGpsLockTime] = useState<string | null>(null);
 const [isGpsActive, setIsGpsActive] = useState<boolean>(false);

 const count=Object.values(cart).reduce((a,b)=>a+b,0),total=products.reduce((sum,p)=>sum+p.price*(cart[p.name]||0),0);

 // Sync products and shops from SQLite database API
 useEffect(() => {
   fetchProductsFromApi().then(prods => {
     if (prods && prods.length > 0) setProducts(prods);
   });
   fetchShopsFromApi(defaultPanipatLocation.lat, defaultPanipatLocation.lng).then(dbShops => {
     if (dbShops && dbShops.length > 0) {
       setShops(dbShops);
       setSelectedShop(dbShops[0]);
       setCalcShop(dbShops[0]);
     }
   });
 }, []);

 async function updateLocationAndShops(coords: { lat: number; lng: number }, label?: string, accuracy?: number, isGps: boolean = false) {
   setUserLocation(coords);
   setLiveCoords(coords);
   setIsGpsActive(isGps);
   if (accuracy) setGpsAccuracy(accuracy);
   setGpsLockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
   if (label) setAddress(label);
   const dbShops = await fetchShopsFromApi(coords.lat, coords.lng);
   setShops(dbShops);
 }

 // Listen for native GPS messages from Expo Go WebView & direct callbacks
 useEffect(() => {
   // Check if Expo shell injected coords already
   if ((window as any).__EXPO_COORDS__) {
     const data = (window as any).__EXPO_COORDS__;
     if (data?.coords) {
       updateLocationAndShops(data.coords, data.address, data.coords.accuracy, true);
     }
   }

   (window as any).__ON_GPS_COORDS__ = (data: any) => {
     if (data?.coords) {
       setIsLocating(false);
       updateLocationAndShops(data.coords, data.address, data.coords.accuracy, true);
       notify(`📍 Live GPS Lock: ${data.address || 'Panipat, Haryana'}`);
     }
   };

   const handleNativeMessage = (event: any) => {
     try {
       const raw = event.data;
       const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
       if (data && data.type === 'NATIVE_GPS_COORDS' && data.coords) {
         const coords = { lat: Number(data.coords.lat), lng: Number(data.coords.lng) };
         setIsLocating(false);
         updateLocationAndShops(coords, data.address || `Live GPS (${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°)`, data.coords.accuracy, true);
         notify(`📍 Live GPS connected: ${data.address || 'Panipat, Haryana'}`);
       }
     } catch (e) {}
   };

   window.addEventListener('message', handleNativeMessage);
   document.addEventListener('message' as any, handleNativeMessage);

   if ((window as any).ReactNativeWebView) {
     (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'PING_NATIVE' }));
   }

   return () => {
     window.removeEventListener('message', handleNativeMessage);
     document.removeEventListener('message' as any, handleNativeMessage);
   };
 }, []);

 // Hash navigation support for direct linking and tabs
 useEffect(() => {
   function syncHash() {
     const h = (window.location.hash || '').toLowerCase();
     if (h === '#auth' || h === '#login') {
       setPage('Auth');
       setAuthMode('login');
     } else if (h === '#signup') {
       setPage('Auth');
       setAuthMode('signup');
     } else if (h === '#landing' || h === '#home' || h === '#welcome') {
       setPage('Landing');
     } else if (h === '#discover') {
       setPage('Discover');
     } else if (h === '#shops') {
       setPage('Nearby shops');
     } else if (h === '#smartcart') {
       setPage('Smart Cart AI');
     } else if (h === '#orders') {
       setPage('My orders');
     } else if (h === '#delivery') {
       setPage('Discover');
       setRole('Delivery Guy');
     } else if (h === '#wholesale') {
       setPage('Discover');
       setRole('Wholesale Shopkeeper');
     }
   }
   syncHash();
   window.addEventListener('hashchange', syncHash);
   return () => window.removeEventListener('hashchange', syncHash);
 }, []);

 async function requestLiveLocation() {
   setIsLocating(true);
   notify('📍 Requesting live GPS location in Panipat...');

   // 1. If running on Capacitor Native (iOS / Android)
   if (Capacitor.isNativePlatform()) {
     try {
       const perm = await Geolocation.requestPermissions();
       if (perm.location === 'granted' || perm.coarseLocation === 'granted') {
         const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
         setIsLocating(false);
         await updateLocationAndShops(coords, `Live GPS (${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°)`, pos.coords.accuracy, true);
         notify('📍 Live GPS position acquired!');
         return;
       }
     } catch (err) {
       console.warn('Capacitor geolocation request failed:', err);
     }
   }

   // 2. If running inside Expo Go WebView shell
   if ((window as any).ReactNativeWebView) {
     (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'REQUEST_LIVE_LOCATION' }));
     setTimeout(() => setIsLocating(false), 3500);
     return;
   }

   // 3. Browser Geolocation API
   if (navigator.geolocation) {
     const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
     if (!window.isSecureContext && !isLocal) {
       setIsLocating(false);
       setModal('Location Permission');
       return;
     }

     navigator.geolocation.getCurrentPosition(
       async (pos) => {
         setIsLocating(false);
         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
         let resolvedLabel = `Live GPS (${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°)`;
         try {
           const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`, { signal: AbortSignal.timeout(3000) });
           if (res.ok) {
             const data = await res.json();
             const sub = data.address?.suburb || data.address?.neighbourhood || data.address?.road || 'Live Location';
             const city = data.address?.city || data.address?.town || data.address?.county || 'Panipat';
             resolvedLabel = `${sub}, ${city}`;
           }
         } catch {}
         await updateLocationAndShops(coords, resolvedLabel, pos.coords.accuracy, true);
         notify(`📍 Live location detected: ${resolvedLabel}`);
       },
       (err) => {
         setIsLocating(false);
         console.warn('Geolocation denied or unavailable:', err);
         notify('GPS permission not available. Switched to Model Town, Panipat');
         updateLocationAndShops(defaultPanipatLocation, 'Model Town, Panipat', 15, false);
         setModal('Delivery location');
       },
       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
     );
   } else {
     setIsLocating(false);
     notify('Geolocation not supported. Using Model Town, Panipat');
     updateLocationAndShops(defaultPanipatLocation, 'Model Town, Panipat', 15, false);
     setModal('Delivery location');
   }
 }

 // Route estimate calculations for the active distance calculator target
 const activeCalcShop = calcShop || selectedShop || shops[0];
 const realRouteEstimate = activeCalcShop ? calculateRouteEstimate(userLocation, { lat: activeCalcShop.lat, lng: activeCalcShop.lng }, total) : null;
 const activeRoadKm = simulatedKm !== null ? simulatedKm : (realRouteEstimate?.roadDistanceKm ?? 1.2);
 const activeStraightKm = simulatedKm !== null ? Math.round((simulatedKm / 1.25) * 10) / 10 : (realRouteEstimate?.straightDistanceKm ?? 1.0);
 const walkingMins = Math.max(1, Math.round((activeRoadKm / 4.5) * 60));
 const bikeMins = Math.max(2, Math.round((activeRoadKm / 18) * 60));
 const drivingMins = Math.max(3, Math.round((activeRoadKm / 26) * 60));
 const deliveryEta = 10 + bikeMins;
 const deliveryFee = activeRoadKm <= 2.2 ? (total >= 199 ? 0 : 15) : activeRoadKm <= 5.0 ? (total >= 299 ? 0 : 25) : activeRoadKm <= 8.5 ? (total >= 499 ? 0 : 40) : 60;

 // Detect live location on startup
 useEffect(() => {
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
       async (pos) => {
         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
         await updateLocationAndShops(coords, 'Live GPS (Panipat, Haryana)');
       },
       () => {},
       { enableHighAccuracy: true, timeout: 6000 }
     );
   }
 }, []);

 useEffect(() => {
   if (shops.length && !shops.some(shop => shop.name === selectedShop?.name)) {
     setSelectedShop(shops[0]);
   }
 }, [shops, selectedShop]);

 const currentShops = shops.length ? shops : getNearbyShops(defaultLocation);

 const modalRef = useRef(modal);
 modalRef.current = modal;
 const pageRef = useRef(page);
 pageRef.current = page;

 useEffect(() => {
   if (Capacitor.isNativePlatform()) {
     SplashScreen.hide().catch(() => {});
     StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
     StatusBar.setBackgroundColor({ color: '#285c3c' }).catch(() => {});
   }
 }, []);

 useEffect(() => {
   if (!Capacitor.isNativePlatform()) return;
   let handler: { remove: () => void } | null = null;
   CapApp.addListener('backButton', () => {
     if (modalRef.current) {
       setModal('');
     } else if (pageRef.current !== 'Discover') {
       go('Discover');
     } else {
       CapApp.exitApp();
     }
   }).then(h => { handler = h; }).catch(() => {});
   return () => {
     if (handler) handler.remove();
   };
 }, []);

 function notify(s:string){
   triggerHaptic('success');
   setToast(s);
   setTimeout(()=>setToast(''),3000);
 }
 function add(name:string){
   triggerHaptic('medium');
   setCart(c=>({...c,[name]:(c[name]||0)+1}));
 }
 function go(s:string){
    triggerHaptic('light');
    setPage(s);
    setSearch('');
    window.scrollTo(0,0);
  }
  const heading=(title:string,sub:string,action?:string,fn?:()=>void)=><div className="section-heading"><div><h2>{title}</h2><p>{sub}</p></div>{action&&<button className="text-button" onClick={fn}>{action}<Icon name="arrow" size={16}/></button>}</div>;
  function productCards(limit?: number){const filtered=products.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()));const displayed=limit?filtered.slice(0,limit):filtered;return <div className="products">{displayed.map(p=><article className="product" key={p.name}><button className="product-image" onClick={()=>{setModal(p.name)}}><img src={photo(p.img,350)} alt={p.name}/><span className="tiny-badge">In stock</span></button><small>{p.brand}</small><h3 onClick={()=>setModal(p.name)}>{p.name}</h3><p>{p.size}</p><div className="product-bottom"><strong>₹{p.price}</strong><button className="add" onClick={()=>add(p.name)}>{cart[p.name]?`${cart[p.name]} added`:'ADD'}<Icon name="plus" size={14}/></button></div></article>)}</div>}
  function shopCards(limit?: number){const filtered=shops.filter(s=>(!search||s.name.toLowerCase().includes(search.toLowerCase()))&&(page!=='Favourites'||saved.includes(s.name))&&(shopFilter!=='Free delivery'||s.fee==='Free')&&(shopFilter!=='Top rated'||Number(s.rating)>=4.7));const displayed=limit?filtered.slice(0,limit):filtered;return <div className="shop-grid">{displayed.map(s=><article className="shop-card" key={s.name}><div className="shop-image" onClick={()=>{setSelectedShop(s);go('Shop')}}><img src={photo(s.img)} alt={s.name}/><span className={'shop-badge '+s.color}>{s.badge}</span><button className={'save '+(saved.includes(s.name)?'saved':'')} aria-label="Save shop" onClick={e=>{e.stopPropagation();setSaved(v=>v.includes(s.name)?v.filter(x=>x!==s.name):[...v,s.name])}}><Icon name="heart" size={17}/></button><span className="open">● Open now</span></div><div className="shop-body"><div className="shop-title"><h3 onClick={()=>{setSelectedShop(s);go('Shop')}}>{s.name}</h3><span className="rating">★ {s.rating}</span></div>{s.landmark&&<div style={{fontSize:'10px',color:'#718362',marginTop:'-2px',marginBottom:'6px',display:'flex',alignItems:'center',gap:'3px'}}><Icon name="pin" size={11}/><span>{s.landmark} (PIN {s.pincode||'132103'})</span></div>}<div className="shop-distance-bar" onClick={(e)=>{e.stopPropagation();setCalcShop(s);setModal('Distance Calculator');}}><span className="distance-badge"><Icon name="pin" size={13}/><b>{s.distance} km away</b></span><span className="calc-route-btn">Route & ETA ➔</span></div><div className="delivery-details"><span><Icon name="clock" size={14}/>{s.time} min</span><span><Icon name="truck" size={15}/><b>{s.fee==='Free'?'Free delivery':s.fee+' delivery'}</b></span><span>Min. ₹{s.min}</span></div><div className="offer"><Icon name="gift" size={15}/>{s.offer}</div><div className="shop-card-extra"><span>{s.owner?`Owner: ${s.owner} · ${s.timing||'7:30 AM–10 PM'}`:(s.timing||'Open 7:30 AM–10 PM')}</span>{s.phone&&<a href={`tel:${s.phone}`} className="shop-call-btn" onClick={e=>e.stopPropagation()}><Icon name="phone" size={12}/> Call</a>}</div><div className="freshness"><span/>Inventory updated 5 min ago<Icon name="shield" size={12}/></div></div></article>)}</div>}
  return <div className="app"><aside className="sidebar"><button className="brand" onClick={()=>go('Discover')}><span className="brand-mark"><img src="/ook-mart-logo.svg" alt="Ook Mart" className="brand-mascot-img"/></span>Ook <span>Mart</span><i/></button><div className="workspace-label">YOUR NEIGHBOURHOOD, CONNECTED</div><button className="role-selector" onClick={()=>setModal('Switch account')}><span className="role-icon"><Icon name="bag"/></span><span><small>You’re shopping as</small><strong>{role}</strong></span><Icon name="down" size={15}/></button><div className="nav-label">EXPLORE</div><nav><button className={page==='Landing'?'active':''} onClick={()=>go('Landing')}><Icon name="home"/><span>Welcome & Login</span></button>{nav.map(([icon,label])=><button key={label} className={page===label?'active':''} onClick={()=>go(label)}>{label==='Smart Cart AI'?<img src="/ook-mart-logo.svg" alt="" className="sidebar-mascot-icon"/>:<Icon name={icon}/>}<span>{label}</span>{label==='Smart Cart AI'&&<b className="ai-tag">AI</b>}{label==='Rewards & loyalty'&&<i className="nav-dot"/>}</button>)}</nav><div className="sidebar-bottom"><div className="local-card"><span className="local-icon"><Icon name="shop" size={22}/></span><h4>Small shops. Big impact.</h4><p>Every local purchase helps your neighbourhood thrive.</p><button onClick={()=>setModal('The local difference')}>The local difference <Icon name="arrow" size={14}/></button></div><button className="help" onClick={()=>setModal('Help & support')}><Icon name="help" size={18}/>Help & support</button><button className="profile" onClick={()=>setModal('Switch account')}><span className="avatar">AS</span><span><strong>Ananya Sharma</strong><small>Personal account</small></span><Icon name="down" size={15}/></button></div></aside>
 <div className="main-shell"><header className="topbar"><button className="location" onClick={()=>setModal('Delivery location')}><span className="pin-circle"><Icon name="pin"/></span><span><small>YOUR NEIGHBOURHOOD</small><strong>{address}<Icon name="down" size={13}/></strong></span></button><div className="global-search"><Icon name="search" size={19}/><input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setPage('Search')}} placeholder="Search products, brands or nearby shops"/><kbd>⌘ K</kbd></div><div className="top-actions"><button className="notification" aria-label="Notifications" onClick={()=>setModal('Notifications')}><Icon name="bell"/><i/></button><span className="top-divider"/><button className="basket-button" onClick={()=>setModal('Your basket')}><Icon name="bag" size={18}/>My basket<span>{count}</span></button></div></header>
 {page === 'Landing' ? (
    <div className="landing-page">
      <div className="landing-top-nav">
        <div className="landing-brand">
          <img src="/ook-mart-logo.svg" alt="Ook Mart" className="landing-brand-logo"/>
          <span>Ook <strong>Mart</strong><i></i></span>
        </div>
        <button className="landing-guest-link" onClick={() => go('Discover')}>
          Browse as Guest →
        </button>
      </div>

      <div className="landing-hero">
        <div className="landing-mascot-spotlight">
          <img src="/ook-mart-logo.svg" alt="Ook Mart Mascot" />
        </div>
        <div className="landing-kicker"><span/> YOUR NEIGHBOURHOOD, CONNECTED</div>
        <h1>A little more local.<br/>A lot more <em>savings.</em></h1>
        <p>Fresh groceries, familiar shops, Smart Cart AI comparison, and real-time live GPS distance in Panipat.</p>
      </div>

      <div className="landing-perks-grid">
        <div className="landing-perk-card">
          <div className="perk-icon-box"><Icon name="shop" size={18}/></div>
          <strong>Local Shops</strong>
          <span>Direct access to trusted stores around your corner</span>
        </div>
        <div className="landing-perk-card">
          <div className="perk-icon-box"><Icon name="spark" size={18}/></div>
          <strong>Smart Cart AI</strong>
          <span>Compare complete basket totals across shops</span>
        </div>
        <div className="landing-perk-card">
          <div className="perk-icon-box"><Icon name="ruler" size={18}/></div>
          <strong>Live Distance</strong>
          <span>Accurate road distance & delivery times in Panipat</span>
        </div>
        <div className="landing-perk-card">
          <div className="perk-icon-box"><Icon name="truck" size={18}/></div>
          <strong>Fast Delivery</strong>
          <span>Neighbourhood delivery right to your doorstep in 20-30m</span>
        </div>
      </div>

      <div className="landing-actions">
        <button className="btn-landing-login" onClick={() => { setAuthMode('login'); go('Auth'); }}>
          <Icon name="profile" size={18}/>
          <span>Log In to Ook Mart</span>
          <Icon name="arrow" size={16}/>
        </button>
        <button className="btn-landing-signup" onClick={() => { setAuthMode('signup'); go('Auth'); }}>
          <Icon name="plus" size={18}/>
          <span>Create Account / Sign Up</span>
        </button>
        <button className="btn-landing-browse" onClick={() => go('Discover')}>
          <span>Explore Marketplace as Guest</span>
          <Icon name="arrow" size={14}/>
        </button>
      </div>

      <div className="landing-role-portal-box">
        <div className="role-portal-header">
          <strong>Log in directly by role:</strong>
          <small>1-tap demo sign in</small>
        </div>
        <div className="landing-role-chips">
          <button className="role-chip-btn" onClick={() => loginWithRole('customer')}>
            <span className="role-chip-icon">🛒</span>
            <span>Customer</span>
          </button>
          <button className="role-chip-btn" onClick={() => loginWithRole('shopkeeper')}>
            <span className="role-chip-icon">🏪</span>
            <span>Shopkeeper</span>
          </button>
          <button className="role-chip-btn" onClick={() => loginWithRole('delivery guy')}>
            <span className="role-chip-icon">🛵</span>
            <span>Delivery Guy</span>
          </button>
          <button className="role-chip-btn" onClick={() => loginWithRole('wholesale shopkeeper')}>
            <span className="role-chip-icon">📦</span>
            <span>Wholesale Shop</span>
          </button>
        </div>
      </div>
    </div>
  ) : page === 'Auth' ? (
    <div className="auth-page">
      <div className="auth-top-bar">
        <button className="auth-back-btn" onClick={() => go('Landing')}>
          <Icon name="chevron" size={14} style={{transform:'rotate(180deg)'}}/> Back to Home
        </button>
        <div className="auth-brand-pill">
          <img src="/ook-mart-logo.svg" alt="Ook Mart"/>
          <span>Ook <strong>Mart</strong></span>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-mode-switch">
          <button
            type="button"
            className={`auth-mode-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            <Icon name="profile" size={15}/> Log In
          </button>
          <button
            type="button"
            className={`auth-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => setAuthMode('signup')}
          >
            <Icon name="plus" size={15}/> Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); loginWithRole(authRole, authName); }}>
          <div className="auth-field">
            <label htmlFor="auth-role-select">
              <strong>Select Account Role</strong>
              <small>Choose the role you are {authMode === 'login' ? 'logging in' : 'signing up'} for</small>
            </label>
            <div className="auth-select-wrapper">
              <select
                id="auth-role-select"
                value={authRole}
                onChange={(e) => setAuthRole(e.target.value as any)}
                className="auth-role-dropdown"
              >
                <option value="customer">🛒 customer</option>
                <option value="shopkeeper">🏪 shopkeeper</option>
                <option value="delivery guy">🛵 delivery guy</option>
                <option value="wholesale shopkeeper">📦 wholesale shopkeeper</option>
              </select>
              <Icon name="down" size={16}/>
            </div>
          </div>

          <div className="auth-role-info-card">
            <span className="role-info-emoji">
              {authRole === 'customer' ? '🛒' : authRole === 'shopkeeper' ? '🏪' : authRole === 'delivery guy' ? '🛵' : '📦'}
            </span>
            <div className="role-info-text">
              <strong>{authRole.toUpperCase()} ROLE</strong>
              <p>
                {authRole === 'customer' && 'Shop fresh daily essentials, compare prices with Smart Cart AI, and track live deliveries.'}
                {authRole === 'shopkeeper' && 'Manage your store inventory, accept customer orders, and set live delivery radius.'}
                {authRole === 'delivery guy' && 'Receive delivery pickup requests, view distance & navigation route to shops, and earn per drop.'}
                {authRole === 'wholesale shopkeeper' && 'Supply bulk inventory to retail stores, manage B2B trade orders, and issue GST invoices.'}
              </p>
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="auth-field">
              <label><strong>Full Name</strong></label>
              <input
                className="auth-input"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                required
              />
            </div>
          )}

          {authMode === 'signup' && authRole === 'shopkeeper' && (
            <div className="auth-field">
              <label><strong>Store Name & Area</strong></label>
              <input
                className="auth-input"
                value={authShopName}
                onChange={(e) => setAuthShopName(e.target.value)}
                placeholder="e.g. Sharma General Store, Model Town"
                required
              />
            </div>
          )}

          {authMode === 'signup' && authRole === 'delivery guy' && (
            <div className="auth-field">
              <label><strong>Vehicle & License</strong></label>
              <input
                className="auth-input"
                value={authVehicle}
                onChange={(e) => setAuthVehicle(e.target.value)}
                placeholder="e.g. Motorcycle (Hero Splendor HR-06)"
                required
              />
            </div>
          )}

          {authMode === 'signup' && authRole === 'wholesale shopkeeper' && (
            <div className="auth-field">
              <label><strong>Wholesale Firm & GSTIN</strong></label>
              <input
                className="auth-input"
                value={authGst}
                onChange={(e) => setAuthGst(e.target.value)}
                placeholder="e.g. Bharat Wholesale (06AAAAA0000A1Z5)"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label><strong>Mobile Phone Number</strong></label>
            <div className="auth-input-wrapper">
              <span className="auth-input-prefix">+91</span>
              <input
                type="tel"
                className="auth-input with-prefix"
                value={authPhone}
                onChange={(e) => setAuthPhone(e.target.value)}
                placeholder="98123 45678"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label><strong>Password</strong></label>
            <input
              type="password"
              className="auth-input"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="auth-options-row">
            <label className="auth-remember-label">
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button type="button" className="auth-forgot-link" onClick={() => notify('Password reset link sent via SMS')}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-submit-btn">
            <span>{authMode === 'login' ? `Log In as ${authRole}` : `Create ${authRole} Account`}</span>
            <Icon name="arrow" size={16}/>
          </button>
        </form>

        <div className="auth-divider">
          <span>OR 1-CLICK DEMO ACCESS</span>
        </div>

        <div className="auth-demo-grid">
          <button type="button" className="auth-demo-btn" onClick={() => loginWithRole('customer')}>
            <strong>🛒 Customer</strong>
            <small>Ananya Sharma</small>
          </button>
          <button type="button" className="auth-demo-btn" onClick={() => loginWithRole('shopkeeper')}>
            <strong>🏪 Shopkeeper</strong>
            <small>Sharma General Store</small>
          </button>
          <button type="button" className="auth-demo-btn" onClick={() => loginWithRole('delivery guy')}>
            <strong>🛵 Delivery Guy</strong>
            <small>Vikas Kumar</small>
          </button>
          <button type="button" className="auth-demo-btn" onClick={() => loginWithRole('wholesale shopkeeper')}>
            <strong>📦 Wholesale Shop</strong>
            <small>Bharat Wholesale</small>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <>
 <div className="mobile-header">
   <div className="mobile-header-top">
     <button className="mobile-wordmark" onClick={()=>go('Discover')} aria-label="Ook Mart home"><span><img src="/ook-mart-logo.svg" alt="Ook Mart" className="mobile-mascot-img"/></span>Ook <strong>Mart</strong><i/></button>
     <div className="mobile-header-actions">
       <button 
         className="mobile-header-calc-btn" 
         aria-label="Distance Calculator" 
         title="Calculate distance from live location to shops" 
         onClick={() => { setCalcShop(selectedShop || shops[0]); setModal('Distance Calculator'); }}
       >
         <Icon name="ruler" size={19}/>
       </button>
       <button aria-label="Notifications" onClick={()=>setModal('Notifications')}><Icon name="bell" size={21}/><i/></button>
       <button className="mobile-avatar" aria-label="Your account" onClick={()=>go('Account')}>
         {role === 'Customer' ? 'AS' : role === 'Shopkeeper' ? 'RS' : role === 'Delivery Guy' ? 'VK' : 'BA'}
       </button>
     </div>
   </div>
   <button className="mobile-location" onClick={()=>setModal('Delivery location')}><Icon name="pin" size={16}/><span><small>DELIVERING TO HOME</small><strong>{address}</strong></span><Icon name="down" size={15}/><span className="delivery-estimate"><Icon name="clock" size={13}/>20–30 min</span></button>
   <div className="mobile-search"><Icon name="search" size={20}/><input aria-label="Search products and shops" value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setPage('Search')}} placeholder="Search for milk, atta, your local shop…"/>{search&&<button aria-label="Clear search" onClick={()=>setSearch('')}>×</button>}<span><Icon name="list" size={19}/><button aria-label="Open shopping lists" onClick={()=>go('Shopping lists')}/></span></div>
   {!isGpsActive ? (
     <div className="location-permission-banner" onClick={requestLiveLocation}>
       <div className="lpb-icon-box"><Icon name="locate" size={20}/></div>
       <div className="lpb-content">
         <div className="lpb-title"><strong>Enable Live GPS Location</strong><span className="lpb-badge">RECOMMENDED</span></div>
         <p>Currently showing <b>{address}</b>. Tap to grant GPS permission for live distance & route.</p>
       </div>
       <button className="lpb-action-btn" disabled={isLocating} onClick={(e)=>{ e.stopPropagation(); requestLiveLocation(); }}>
         {isLocating ? 'Detecting...' : 'START GPS'}
       </button>
     </div>
   ) : (
     <div className="live-gps-active-strip">
       <span className="live-pulse-dot active"/>
       <span>Live GPS Active: <b>{address}</b> ({userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°) · ±{gpsAccuracy ? Math.round(gpsAccuracy) : 8}m precision</span>
       <button onClick={() => setModal('Distance Calculator')}>CALCULATE</button>
     </div>
   )}
 </div>
 <main><div className="breadcrumb">Your neighbourhood <Icon name="chevron" size={12}/> <span>{page==='Discover'?'Discover':page}</span></div>
 {role==='Delivery Guy'&&page!=='Account' ? (
  <div className="delivery-fleet-panel">
    <div className="page-heading">
      <div>
        <div className="eyebrow">OOK MART DELIVERY FLEET</div>
        <h1>Fleet Dispatch & Active Orders</h1>
        <p>Delivery Partner: {authName || 'Vikas Kumar'} · Panipat Fleet</p>
      </div>
      <button className="primary" onClick={() => { setCalcShop(selectedShop || shops[0]); setModal('Distance Calculator'); }}>
        <Icon name="ruler" size={16}/> Distance Route
      </button>
    </div>

    <div className="fleet-status-banner">
      <div className="fleet-status-left">
        <span className={`fleet-online-dot ${deliveryOnline ? 'active' : ''}`}/>
        <div>
          <strong>{deliveryOnline ? 'Online & Available for Orders' : 'Offline'}</strong>
          <small>{deliveryOnline ? 'Receiving deliveries in Model Town & Sector 11' : 'Tap to go online'}</small>
        </div>
      </div>
      <button className="fleet-toggle-btn" onClick={() => { setDeliveryOnline(!deliveryOnline); notify(deliveryOnline ? 'You are now offline' : 'You are now online & accepting orders!'); }}>
        {deliveryOnline ? 'GO OFFLINE' : 'GO ONLINE'}
      </button>
    </div>

    <div className="fleet-stat-strip">
      <div className="fleet-stat-card">
        <span>Today's Drops</span>
        <strong>{14 + completedDeliveries.length}</strong>
      </div>
      <div className="fleet-stat-card">
        <span>Earnings</span>
        <strong>₹{1240 + completedDeliveries.length * 45}</strong>
      </div>
      <div className="fleet-stat-card">
        <span>Rating</span>
        <strong>4.9 ★</strong>
      </div>
    </div>

    {heading('Assigned Orders for Delivery','Pick up from shops and drop to customer doorstep')}

    <div className="delivery-order-card">
      <div className="doc-top">
        <div>
          <strong>Order #OOK-1042</strong>
          <small style={{display:'block',color:'#7d8f71',fontSize:'10px'}}>4 items · Total ₹450 (Prepaid UPI)</small>
        </div>
        <span className="doc-payout">+ ₹45 Payout</span>
      </div>
      <div className="doc-route">
        <div className="doc-point pickup">
          <Icon name="shop" size={16}/>
          <div>
            <b>PICKUP: Sharma General Store</b>
            <span style={{display:'block',fontSize:'9.5px',color:'#718365'}}>Model Town, Panipat · 0.8 km from you</span>
          </div>
        </div>
        <div className="doc-point drop">
          <Icon name="pin" size={16}/>
          <div>
            <b>DELIVER TO: Ananya Sharma</b>
            <span style={{display:'block',fontSize:'9.5px',color:'#718365'}}>House 42, Sector 11, Panipat · 1.8 km from shop</span>
          </div>
        </div>
      </div>
      <div className="doc-actions">
        <a 
          className="doc-btn maps" 
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=29.3909,76.9635`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Icon name="navigation" size={14}/> GPS Navigation
        </a>
        <button 
          className="doc-btn status" 
          onClick={() => {
            if (!pickedUpDeliveries.includes('1042')) {
              setPickedUpDeliveries([...pickedUpDeliveries, '1042']);
              notify('✓ Order #OOK-1042 marked as Picked Up from store!');
            } else if (!completedDeliveries.includes('1042')) {
              setCompletedDeliveries([...completedDeliveries, '1042']);
              notify('🎉 Order #OOK-1042 delivered to Ananya Sharma! +₹45 credited.');
            }
          }}
        >
          <Icon name="check" size={14}/>
          {completedDeliveries.includes('1042') ? 'Delivered ✓' : pickedUpDeliveries.includes('1042') ? 'Mark Delivered' : 'Confirm Pickup'}
        </button>
      </div>
    </div>

    <div className="delivery-order-card">
      <div className="doc-top">
        <div>
          <strong>Order #OOK-1045</strong>
          <small style={{display:'block',color:'#7d8f71',fontSize:'10px'}}>2 items · Total ₹290 (Cash on Delivery)</small>
        </div>
        <span className="doc-payout">+ ₹55 Payout</span>
      </div>
      <div className="doc-route">
        <div className="doc-point pickup">
          <Icon name="shop" size={16}/>
          <div>
            <b>PICKUP: Gupta Supermarket</b>
            <span style={{display:'block',fontSize:'9.5px',color:'#718365'}}>GT Road, Panipat · 1.4 km from you</span>
          </div>
        </div>
        <div className="doc-point drop">
          <Icon name="pin" size={16}/>
          <div>
            <b>DELIVER TO: Priya Nair</b>
            <span style={{display:'block',fontSize:'9.5px',color:'#718365'}}>Assandh Road, Panipat · 2.4 km from shop</span>
          </div>
        </div>
      </div>
      <div className="doc-actions">
        <a 
          className="doc-btn maps" 
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=29.3980,76.9750`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Icon name="navigation" size={14}/> GPS Navigation
        </a>
        <button 
          className="doc-btn status" 
          onClick={() => {
            if (!pickedUpDeliveries.includes('1045')) {
              setPickedUpDeliveries([...pickedUpDeliveries, '1045']);
              notify('✓ Order #OOK-1045 marked as Picked Up!');
            } else if (!completedDeliveries.includes('1045')) {
              setCompletedDeliveries([...completedDeliveries, '1045']);
              notify('🎉 Order #OOK-1045 delivered! +₹55 credited.');
            }
          }}
        >
          <Icon name="check" size={14}/>
          {completedDeliveries.includes('1045') ? 'Delivered ✓' : pickedUpDeliveries.includes('1045') ? 'Mark Delivered' : 'Confirm Pickup'}
        </button>
      </div>
    </div>

    <div className="local-card" style={{marginTop:'4px'}}>
      <h4>Fleet Partner Vehicle</h4>
      <p>Vehicle: <strong>{authVehicle}</strong> · Hub: <strong>Model Town, Panipat</strong></p>
      <button onClick={() => setModal('Switch account')}>Switch role or account <Icon name="arrow" size={14}/></button>
    </div>
  </div>
) : role==='Wholesale Shopkeeper'&&page!=='Account' ? (
  <>
    <div className="page-heading">
      <div>
        <div className="eyebrow">OOK MART B2B WHOLESALE</div>
        <h1>Wholesale Supply & Bulk Trading</h1>
        <p>Welcome back, Bharat ji. Bharat Wholesale Traders, Panipat Hub.</p>
      </div>
      <button className="primary" onClick={()=>setModal('Add product')}>Add bulk SKU <Icon name="plus" size={17}/></button>
    </div>
    <div className="metric-grid">
      {[
        ['B2B Volume today','₹1,42,800','18.4% from last week'],
        ['Retailer orders','18','4 ready for truck dispatch'],
        ['Bulk inventory','850 sacks','Wheat, Rice & Oil in stock'],
        ['Partner Stores','34 shops','Active Panipat accounts']
      ].map(([a,b,c])=><div className="metric" key={a}><Icon name="chart"/><p>{a}</p><h2>{b}</h2><small>{c}</small></div>)}
    </div>
    {heading('Pending wholesale restock requests','Retail stores requesting bulk supply')}
    <div className="data-table">
      <div className="table-row table-head">
        <span>Retail Shop</span>
        <span>Bulk Items</span>
        <span>Invoice Amount</span>
        <span>Action</span>
      </div>
      {[
        ['Sharma General Store','10x 50kg Atta, 5x 15L Oil','₹42,500'],
        ['Sri Balaji Stores','20x 25kg Basmati Rice','₹38,200'],
        ['Aggarwal Daily Needs','15x Sugar Quintal Bags','₹62,100']
      ].map(([shop,items,amt])=><div className="table-row" key={shop}>
        <span><strong>{shop}</strong><small>{items}</small></span>
        <span>{items}</span>
        <span><strong>{amt}</strong></span>
        <button className="text-button" onClick={()=>notify(`GST invoice generated for ${shop}`)}>Dispatch & Bill <Icon name="check" size={15}/></button>
      </div>)}
    </div>
    {heading('Wholesale Bulk Catalogue','Standard sack & case wholesale rates for merchants')}
    {productCards()}
  </>
) : role!=='Customer'&&page!=='Account'?<><div className="page-heading"><div><div className="eyebrow">OOK MART FOR BUSINESS</div><h1>Your business, at a glance.</h1><p>Welcome back. Here’s what’s happening at {role==='Shopkeeper'||role==='Retail Shopkeeper'?'Sharma General Store':role==='Wholesale Shopkeeper'||role==='Wholesaler / Distributor'?'Bharat Wholesale Traders':'Prakash Foods Pvt. Ltd.'}.</p></div><button className="primary" onClick={()=>setModal('Add product')}>Add product <Icon name="plus" size={17}/></button></div><div className="metric-grid">{[['Revenue today','₹24,580','12.8% from yesterday'],['Active orders','28','8 awaiting fulfilment'],['Products in stock','342','12 running low'],['Business customers','186','6 new this week']].map(([a,b,c])=><div className="metric" key={a}><Icon name="chart"/><p>{a}</p><h2>{b}</h2><small>{c}</small></div>)}</div>{heading('Recent orders','Manage your latest customer orders')}<div className="data-table"><div className="table-row table-head"><span>Order / Customer</span><span>Amount</span><span>Status</span><span>Action</span></div>{['Ananya Sharma','Sri Balaji Stores','Priya Nair','Aarav Patel'].map((n,i)=><div className="table-row" key={n}><span><strong>#OOK-{1042+i}</strong><small>{n}</small></span><span>₹{[845,12450,1320,4580][i]}</span><span className="status"> {i===0?'New order':'Processing'}</span><button className="text-button" onClick={()=>notify('Order marked ready for fulfilment')}>Mark ready <Icon name="check" size={15}/></button></div>)}</div>{heading('Your product catalogue','Keep your inventory fresh and up to date')}{productCards()}</>:
 <>
 {(page==='Discover'||page==='Nearby shops')&&<><div className="page-heading"><div><h1>{page==='Discover'?'Good morning, Ananya':'Discover your neighbourhood'}<span className="greeting-sun"><Icon name="sun" size={25}/></span></h1><p>Your favourite local shops. A smarter way to shop.</p></div><div className="segmented"><button className={delivery==='Delivery'?'selected':''} onClick={()=>setDelivery('Delivery')}><Icon name="truck" size={16}/>Delivery</button><button className={delivery==='Visit store'?'selected':''} onClick={()=>setDelivery('Visit store')}><Icon name="shop" size={16}/>Visit store</button></div></div>
 {page==='Discover'&&<><section className="hero"><div className="hero-content"><span className="hero-kicker"><span/>GOOD FOR YOU. GREAT FOR YOUR NEIGHBOURHOOD.</span><h2>A little more local.<br/>A lot more <em>caring.</em></h2><p>Fresh essentials, familiar faces, and better value.<br/>Discover the best of your neighbourhood, all in one place with Ook Mart.</p><button onClick={()=>go('Nearby shops')}>Explore nearby shops<Icon name="arrow" size={17}/></button><div className="hero-proof"><span className="mini-avatars"><b>RK</b><b>PS</b><b>AM</b></span><span>Join <strong>2,400+</strong> neighbours shopping local</span></div></div><div className="hero-photo"/><div className="photo-note"><span className="note-icon"><Icon name="leaf" size={21}/></span><div><strong>Fresh from your neighbourhood</strong><small>Not a warehouse miles away.</small></div></div><span className="hero-pagination"><b/><i/><i/></span></section>
 <section className="smart-strip"><div className="smart-strip-main"><span className="spark-box"><img src="/ook-mart-logo.svg" alt="Ook Mart logo" className="smart-strip-mascot"/></span><div className="smart-strip-copy"><div className="smart-strip-header"><h3>Your list. The best local deal.</h3><span className="smart-strip-badge">SMART CART AI</span></div><p>Compare your entire shopping list across nearby shops. Save money, not just time.</p></div></div><div className="smart-strip-action"><button onClick={()=>go('Smart Cart AI')} className="btn-smart-cart"><img src="/ook-mart-logo.svg" alt="" className="btn-mascot-inline"/><span>Build my smart cart</span><Icon name="arrow" size={17}/></button></div></section>
 <section className="category-section">{heading('What’s on your list?','Everyday essentials, just around the corner.')}<div className="categories">{categories.map(([name,img])=><button className={category===name?'category chosen':'category'} key={name} onClick={()=>{setCategory(name);if(name!=='All essentials')go('Search')}}><div><img src={photo(img,250)} alt=""/></div><span>{name}</span></button>)}</div></section></>}
 <section className="nearby">{heading('Good shops. Great neighbours.','Trusted local shops, ready to serve you.',page==='Discover'?'View all shops':undefined,()=>go('Nearby shops'))}<div className="filter-row"><div className="filter-buttons">{['All shops','Free delivery','Top rated','Open now'].map((f,i)=><button key={f} onClick={()=>setShopFilter(f)} className={shopFilter===f?'selected':''}>{i===0&&<Icon name="shop" size={14}/>} {f}{i===2&&' 4.7+'}</button>)}</div><span className="shop-count"><span/>{page==='Discover'?`Showing 2 of ${shops.length} shops`:`${shops.length} shops near you`}</span></div>{shopCards(page==='Discover'?2:undefined)}{page==='Discover'&&<div className="show-more-row"><button className="btn-show-all-shops" onClick={()=>go('Nearby shops')}><Icon name="shop" size={17}/><span>Show all {shops.length} shops nearby</span><Icon name="arrow" size={16}/></button></div>}</section>
 {page==='Discover'&&<><section className="lower-grid"><div className="reward-banner"><span className="reward-symbol"><Icon name="gift" size={34}/></span><div><span className="eyebrow">A LITTLE THANK YOU FOR SHOPPING LOCAL</span><h3>Your neighbourhood gives back.</h3><p>You’ve earned <strong>240 Ook Points.</strong> There’s more in store.</p><button onClick={()=>go('Rewards & loyalty')}>Explore your rewards <Icon name="arrow" size={15}/></button></div><span className="points-art">240<small>OOK POINTS</small></span></div><div className="list-banner"><Icon name="list" size={29}/><div><h3>Forgot something? Not anymore.</h3><p>Make a list. Leave the remembering to us.</p><button onClick={()=>go('Shopping lists')}>Create a shopping list <Icon name="arrow" size={15}/></button></div></div></section><section className="home-products-section">{heading('Your everyday favourites','A little less searching. A little more living.','Explore all products',()=>go('Search'))}{productCards(10)}<div className="show-more-row"><button className="btn-find-more-products" onClick={()=>{setSearch('');setCategory('All essentials');go('Search')}}><Icon name="bag" size={17}/><span>Find more products ({products.length > 10 ? products.length - 10 : '+'} more essentials)</span><Icon name="arrow" size={16}/></button></div></section></>}
 </>}
 {page==='Smart Cart AI'&&<><div className="page-heading"><div><span className="eyebrow">LESS GUESSWORK. MORE SAVINGS.</span><h1>Meet your smarter cart.</h1><p>One shopping list. The best of your neighbourhood, compared.</p></div><span className="feature-pill"><img src="/ook-mart-logo.svg" alt="" className="pill-mascot-img"/>Smart Cart AI</span></div><div className="smart-layout"><section className="panel"><h2>Your shopping list</h2><p className="muted">Add your essentials to find a better local deal.</p>{products.map(p=><div className="basket-line" key={p.name}><img src={photo(p.img,100)} alt=""/><div><strong>{p.name}</strong><small>{p.size} · {p.brand}</small></div><button className="quantity" onClick={()=>add(p.name)}>{cart[p.name]||1} <Icon name="plus" size={13}/></button></div>)}<button className="text-button" onClick={()=>setModal('Add to shopping list')}><Icon name="plus" size={16}/>Add another item</button><hr/><h3>What matters most?</h3><div className="preference-grid">{['Balanced value','Lowest price','Quality evidence','Premium brands'].map(x=><button className={preference===x?'selected':''} onClick={()=>setPreference(x)} key={x}>{x}</button>)}</div><label className="check-label"><input type="checkbox" defaultChecked/> Prefer the convenience of one shop</label><button className="primary wide" onClick={()=>setCompared(true)}><span className="btn-mascot-badge"><img src="/ook-mart-logo.svg" alt="" /></span>Compare nearby shops</button><small className="muted evidence-note">Illustrative comparison using sample inventory. Not live AI analysis.</small></section><section className="comparison"><h2>{compared?'Your local options, compared.':'Great value is closer than you think.'}</h2><p className="muted">{compared?`Ranked for ${preference.toLowerCase()}. Prices include delivery.`:'Choose your preferences and compare your basket.'}</p>{compared?shops.map((s,i)=><article className={'compare-card '+(!i?'best':'')} key={s.name}>{!i&&<span className="recommended"><Icon name="spark" size={14}/>{preference==='Lowest price'?'Lowest total price':'Best overall value'}</span>}<div className="compare-top"><div><h3>{s.name}</h3><p>{s.distance} km away · {s.time} min</p></div><strong>₹{[450,482,506][i]}</strong></div><div className="compare-facts"><span><Icon name="check" size={15}/>4 of 4 items available</span><span>Delivery {s.fee}</span></div><p className="recommendation">{i===0?'Lowest sample basket total, with free delivery and all preferred brands in stock. Save ₹56 compared with Gupta Supermarket.':'All your essentials in one shop. Sample inventory updated 5 minutes ago.'}</p><button className={!i?'primary wide':'outline wide'} onClick={()=>{setSelectedShop(s);products.forEach(p=>add(p.name));setModal('Your basket')}}>Choose this shop<Icon name="arrow" size={16}/></button></article>):<div className="comparison-empty"><img src="/ook-mart-logo.svg" alt="" className="empty-mascot-img"/><h3>Small list. Big possibilities.</h3><p>We’ll compare item prices, delivery charges and availability — so you see the whole picture.</p><div><Icon name="shield" size={16}/>Transparent prices. Explained recommendations.</div></div>}<div className="evidence-box"><Icon name="shield" size={20}/><p><strong>Evidence, not assumptions.</strong> Brand reputation is not proof of product quality. Quality evidence is insufficient for these sample products; shop ratings and prices are illustrative.</p></div></section></div></>}
 {page==='Shop'&&<><div className="shop-detail-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(15,49,35,.92),rgba(15,49,35,.25)),url(${photo(selectedShop.img,1400)})`}}><span className="feature-pill">Open now · Closes at 10 pm</span><h1>{selectedShop.name}</h1><p>{selectedShop.tag}</p><p>{selectedShop.address} · {selectedShop.distance} km from your live location</p><div className="shop-meta"><span>★ {selectedShop.rating} (128 reviews)</span><span>{selectedShop.time} min delivery</span><span>Min. order ₹{selectedShop.min}</span></div></div><div className="smart-strip"><Icon name="gift" size={26}/><div><h3>{selectedShop.offer}</h3><p>Fresh stock updated 5 minutes ago · Delivery and pickup available</p></div><button onClick={()=>setModal('Shop information')}>Shop details <Icon name="arrow" size={16}/></button></div><div style={{margin:'14px 0'}}><button type="button" className="primary wide" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'12px',borderRadius:'11px'}} onClick={()=>{setCalcShop(selectedShop);setModal('Distance Calculator')}}><Icon name="ruler" size={17}/><span>📐 Calculate Route & Delivery Time ({selectedShop.distance} km)</span></button></div><ShopMap name={selectedShop.name}/>{heading('Shop everyday essentials','Current listed prices. Subject to availability.')}{productCards()}</>}
 {page==='Search'&&<>{heading(search?`Results for “${search}”`:category,search?'Find your favourites around the corner.':'Fresh picks from your local shops.')}<div className="filter-row"><span className="feature-pill">Products & nearby shops</span><button className="text-button" onClick={()=>{setSearch('');setCategory('All essentials')}}>Clear filters</button></div>{productCards()}{shops.some(s=>s.name.toLowerCase().includes(search.toLowerCase()))&&shopCards()}{search&&!products.some(p=>p.name.toLowerCase().includes(search.toLowerCase()))&&!shops.some(s=>s.name.toLowerCase().includes(search.toLowerCase()))&&<div className="empty-state"><Icon name="search" size={40}/><h2>No matches just yet.</h2><p>Try “Amul”, “rice”, or “Sharma” to discover something local.</p></div>}</>}
 {page==='Rewards & loyalty'&&<>{heading('A little local love, just for you.','Your everyday shopping deserves a little something back.')}<div className="rewards-hero"><Icon name="gift" size={42}/><span>YOUR OOK POINTS</span><h1>240</h1><p>Silver neighbour · 260 points to Gold</p><progress value="240" max="500"/></div>{heading('Make your points go further','Rewards from the shops you love.')}<div className="metric-grid">{[['₹25 off your basket','100 points'],['Free neighbourhood delivery','150 points'],['₹50 at Sharma General Store','200 points']].map(([a,b])=><div className="metric" key={a}><Icon name="gift" size={26}/><h3>{a}</h3><p>{b}</p><button className="outline" onClick={()=>notify('Reward redeemed! Use LOCAL25 on your next basket.')}>Redeem reward</button></div>)}</div></>}
 {page==='Favourites'&&<>{heading('Your familiar favourites','The local shops you keep coming back to.')}{saved.length?shopCards():<div className="empty-state"><Icon name="heart" size={42}/><h2>A little space for your favourites.</h2><p>Tap the heart on a shop to keep it close.</p><button className="primary" onClick={()=>go('Nearby shops')}>Discover local shops</button></div>}</>}
 {page==='Shopping lists'&&<>{heading('A place for every little essential.','Plan your shop. Compare your list. Make it local.','Create a list',()=>setModal('Add to shopping list'))}<div className="panel"><div className="section-heading"><div><h2>Weekly essentials</h2><p>4 products · Updated today</p></div><button className="primary" onClick={()=>go('Smart Cart AI')}><span className="btn-mascot-badge"><img src="/ook-mart-logo.svg" alt="" /></span>Compare with Smart Cart <Icon name="arrow" size={16}/></button></div>{products.map(p=><div className="basket-line" key={p.name}><Icon name="check" size={16}/><strong>{p.name}</strong><span>{p.size}</span></div>)}</div></>}
 {page==='My orders'&&<>{heading('Your orders, all together.','From your neighbourhood to your doorstep.')}<div className="panel"><span className="status">{ordered?'Order confirmed':'Delivered · 18 October'}</span><div className="section-heading"><div><h2>Sharma General Store</h2><p>Order #OOK-1042 · 4 items · ₹450</p></div><button className="primary" onClick={()=>{products.forEach(p=>add(p.name));setModal('Your basket')}}>Order again <Icon name="arrow" size={16}/></button></div>{products.map(p=><div className="basket-line" key={p.name}><img src={photo(p.img,80)} alt=""/><strong>{p.name}</strong><span>₹{p.price}</span></div>)}</div></>}
 </>}
 {page==='Account'&&<section className="mobile-account"><span className="account-avatar">AS</span><h1>Your little local world.</h1><p>Ananya Sharma · {role}</p><div className="account-points"><Icon name="gift" size={24}/><div><strong>240 Ook Points</strong><small>A thank you for keeping it local.</small></div><button onClick={()=>go('Rewards & loyalty')} aria-label="View rewards"><Icon name="arrow"/></button></div><div className="account-menu">{[['heart','Favourites'],['list','Shopping lists'],['gift','Rewards & loyalty'],['bag','My orders']].map(([icon,label])=><button key={label} onClick={()=>go(label)}><Icon name={icon}/><span>{label}</span><Icon name="chevron" size={16}/></button>)}<button onClick={()=>go('Landing')}><Icon name="home"/><span>Welcome & Login Portal</span><Icon name="chevron" size={16}/></button><button onClick={()=>setModal('Switch account')}><Icon name="shop"/><span>Switch account or business role</span><Icon name="chevron" size={16}/></button><button onClick={()=>setModal('Delivery location')}><Icon name="pin"/><span>Delivery address</span><Icon name="chevron" size={16}/></button><button onClick={()=>setModal('Help & support')}><Icon name="help"/><span>Help & support</span><Icon name="chevron" size={16}/></button><button onClick={()=>{loginWithRole('customer');go('Landing');notify('Logged out. Welcome to Ook Mart!');}}><Icon name="logout"/><span>Log out</span><Icon name="chevron" size={16}/></button></div><p className="account-demo">Ook Mart · Interactive mobile prototype</p></section>}
 <footer><span className="footer-brand"><Icon name="shop" size={16}/> A little local makes a big difference.</span><span>Made for your neighbourhood. Made for you.</span><span><Icon name="shield" size={14}/> Secure & trusted</span></footer></main></>)}</div>
 {page!=='Landing'&&page!=='Auth'&&count>0&&<button className="mobile-cart" onClick={()=>setModal('Your basket')}><span className="cart-count"><Icon name="bag" size={18}/>{count}</span><span><strong>{count} {count===1?'item':'items'} in your basket</strong><small>₹{total} · {total>=199?'Free delivery unlocked':'Fresh from your local shop'}</small></span><b>View basket</b><Icon name="arrow" size={17}/></button>}
 {page!=='Landing'&&page!=='Auth'&&<nav className="mobile-bottom-nav" aria-label="Main navigation">{[['home','Discover','Home'],['shop','Nearby shops','Shops'],['spark','Smart Cart AI','Smart cart'],['bag','My orders','Orders'],['profile','Account','You']].map(([icon,target,label])=><button key={target} aria-current={page===target?'page':undefined} className={(page===target?'active ':'')+(target==='Smart Cart AI'?'smart-tab':'')} onClick={()=>go(target)}><span>{target==='Smart Cart AI'?<img src="/ook-mart-logo.svg" alt="Smart Cart" className="smart-cart-nav-logo"/>:<Icon name={icon} size={22}/>}</span><small>{label}</small>{page===target&&<i/>}</button>)}</nav>}
 {page!=='Landing'&&page!=='Auth'&&<button className="assistant-fab" onClick={()=>setModal('Your local shopping assistant')}><span className="fab-mascot-badge"><img src="/ook-mart-logo.svg" alt="" /></span><span>Ask Ook AI</span></button>}
 {toast&&<div className="toast"><Icon name="check" size={18}/>{toast}</div>}
 {modal&&<div className="modal-backdrop" onClick={()=>setModal('')}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setModal('')} aria-label="Close">×</button><span className="modal-icon"><Icon name={modal==='Your basket'?'bag':modal==='Distance Calculator'?'ruler':modal==='Delivery location'||modal==='Location Permission'?'pin':'spark'} size={26}/></span><h2>{modal}</h2>
 {modal==='Switch account'?<><p>One neighbourhood. Many ways to belong.</p><div className="account-options">{([['Customer','customer','bag','Personal account','Shop local with Smart Cart AI'],['Shopkeeper','shopkeeper','shop','Sharma General Store','Manage store inventory & orders'],['Delivery Guy','delivery guy','truck','Panipat Fleet Partner','Pick up orders & deliver to neighbours'],['Wholesale Shopkeeper','wholesale shopkeeper','chart','Bharat Wholesale Traders','Supply bulk goods to retail shops']] as const).map(([label,rKey,icon,sub,desc])=><button className={role===label?'selected':''} onClick={()=>{loginWithRole(rKey as any);setModal('')}} key={label}><Icon name={icon}/><span><strong>{label}</strong><small>{sub} · {desc}</small></span><Icon name="chevron" size={16}/></button>)}</div><div style={{marginTop:'12px',textAlign:'center'}}><button type="button" className="outline wide" onClick={()=>{setModal('');go('Landing');}}><Icon name="home" size={15}/> <span>Go to Welcome & Login Page</span></button></div><small className="muted">Interactive demo accounts for all 4 roles. 1-tap switch.</small></>:
 modal==='Your basket'?<>{count?products.filter(p=>cart[p.name]).map(p=><div className="basket-line" key={p.name}><img src={photo(p.img,100)} alt=""/><div><strong>{p.name}</strong><small>{p.size} × {cart[p.name]}</small></div><strong>₹{p.price*cart[p.name]}</strong><button className="remove" aria-label={`Remove ${p.name}`} onClick={()=>setCart(c=>({...c,[p.name]:Math.max(0,(c[p.name]||0)-1)}))}>−</button></div>):<p>Your basket is ready for something local. Add a few essentials to begin.</p>}<div className="total"><span>Item total</span><strong>₹{total}</strong></div><div className="total"><span>Delivery</span><strong>{total>=199?'Free':'₹20'}</strong></div>{count>0&&<><div className="total grand"><strong>Total</strong><strong>₹{total+(total>=199?0:20)}</strong></div><p className="muted">Delivering to {address}. Order is saved to live SQLite database.</p><button className="primary wide" onClick={async ()=>{setOrdered(true);const items=Object.keys(cart).filter(k=>cart[k]>0).map(k=>({name:k,qty:cart[k],price:products.find(p=>p.name===k)?.price||0}));await saveOrderToDatabase({customer_name:'Ananya Sharma',shop_name:selectedShop.name,address,total:total+(total>=199?0:20),items,lat:userLocation?.lat,lng:userLocation?.lng});setCart({});setModal('');go('My orders');notify('Demo order placed & saved to database!');}}>Place demo order <Icon name="arrow" size={17}/></button></>}</>:
 modal==='Location Permission'?<div className="location-permission-modal">
    <div className="perm-modal-icon">📍</div>
    <h3>GPS Permission & Panipat Location</h3>
    <p>Mobile browsers (Chrome / Safari) require an HTTPS connection to prompt for native GPS permissions over local Wi-Fi. Your app is locked to <strong>Panipat, Haryana</strong> (never routed to Delhi).</p>

    <div className="perm-options-box">
      <div className="perm-option-card">
        <strong>Option 1: Quick Panipat Locality Selector</strong>
        <p>Tap your area below to calculate instant distances to all 5 shops:</p>
        <div className="quick-sector-grid">
          {panipatPresets.map(p => (
            <button
              key={p.name}
              type="button"
              className="quick-sector-btn"
              onClick={() => {
                updateLocationAndShops({ lat: p.lat, lng: p.lng }, p.name, 10, true);
                setModal('');
                notify(`📍 Location set to ${p.name}`);
              }}
            >
              <b>{p.name.split(',')[0]}</b>
              <small>{p.landmark}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="perm-option-card">
        <strong>Option 2: Native Device GPS (Expo Go / Capacitor)</strong>
        <p>Open the app in Expo Go or as an installed APK to enable continuous native GPS with accuracy down to ±5 meters.</p>
      </div>
    </div>

    <button type="button" className="primary wide" onClick={() => { setModal(''); requestLiveLocation(); }}>
      <Icon name="locate" size={16}/> Retry Browser GPS Permission
    </button>
 </div>:
 modal==='Distance Calculator'?<div className="distance-calc-container">
    <div className="calc-hero-badge">
      <div className={`live-pulse-dot ${isGpsActive ? 'active' : ''}`}/>
      <div>
        <strong>{isGpsActive ? 'Live GPS Location' : 'Current Origin (Panipat)'}</strong>
        <p>{address} ({userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°){gpsAccuracy ? ` · ±${Math.round(gpsAccuracy)}m accuracy` : ''}{gpsLockTime ? ` · ${gpsLockTime}` : ''}</p>
      </div>
      <button
        style={{marginLeft:'auto',background:'#285c3c',color:'#fff',fontSize:'10px',padding:'6px 10px',borderRadius:'7px',border:0,cursor:'pointer'}}
        onClick={requestLiveLocation}
        disabled={isLocating}
      >
        {isLocating ? 'Locating...' : '📍 Refresh GPS'}
      </button>
    </div>

    <div className="calc-section-label">Select Destination Shop (Panipat)</div>
    <div className="shop-selector-scroll">
      {shops.map(s => <button
        key={s.name}
        className={`shop-pill ${calcShop.name === s.name ? 'active' : ''}`}
        onClick={() => { setCalcShop(s); setSimulatedKm(null); }}
      >
        <span>{s.name.split(' ')[0]}</span>
        <small>({s.distance} km)</small>
      </button>)}
    </div>

    <div className="distance-metric-cards">
      <div className="metric-card highlight">
        <span className="metric-val">{activeRoadKm} km</span>
        <span className="metric-sub">Est. Road Distance</span>
      </div>
      <div className="metric-card">
        <span className="metric-val">{activeStraightKm} km</span>
        <span className="metric-sub">Straight Line (Haversine)</span>
      </div>
    </div>

    <div className="calc-section-label">Estimated Travel Time</div>
    <div className="travel-mode-tabs">
      <button className={`travel-mode-tab ${travelMode==='bike'?'active':''}`} onClick={()=>setTravelMode('bike')}>
        <Icon name="bike" size={15}/> 2-Wheeler ({bikeMins} min)
      </button>
      <button className={`travel-mode-tab ${travelMode==='car'?'active':''}`} onClick={()=>setTravelMode('car')}>
        <Icon name="car" size={15}/> Car/Auto ({drivingMins} min)
      </button>
      <button className={`travel-mode-tab ${travelMode==='walk'?'active':''}`} onClick={()=>setTravelMode('walk')}>
        <Icon name="walk" size={15}/> Walk ({walkingMins} min)
      </button>
    </div>

    <div className="delivery-rule-card">
      <Icon name="truck" size={24}/>
      <div>
        <strong>Doorstep Delivery from {calcShop.name}</strong>
        <p>Estimated Arrival: <b>~{deliveryEta} mins</b> (10m prep + {bikeMins}m route transit)</p>
        <span className="delivery-rule-badge">
          {deliveryFee === 0 ? '🎉 Free Delivery Unlocked' : `Delivery Fee: ₹${deliveryFee} (Free above ₹${activeRoadKm <= 2.2 ? 199 : activeRoadKm <= 5 ? 299 : 499})`}
        </span>
        {calcShop.phone && (
          <div style={{marginTop:'6px'}}>
            <a href={`tel:${calcShop.phone}`} style={{fontSize:'10px',color:'#285c3c',fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'4px'}}>
              <Icon name="phone" size={11}/> Call Store: {calcShop.phone}
            </a>
          </div>
        )}
      </div>
    </div>

    <div className="distance-slider-box">
      <div className="slider-header">
        <span>Interactive Distance Simulator</span>
        <b>{activeRoadKm} km</b>
      </div>
      <input
        type="range"
        min="0.5"
        max="15.0"
        step="0.1"
        className="distance-slider-input"
        value={activeRoadKm}
        onChange={(e) => setSimulatedKm(parseFloat(e.target.value))}
      />
      <div className="slider-scale">
        <span>0.5 km (Hyperlocal)</span>
        <span>7.5 km (City)</span>
        <span>15 km (Outskirts)</span>
      </div>
      {simulatedKm !== null && <button
        style={{marginTop:'8px',background:'none',border:0,color:'#285c3c',fontSize:'10px',fontWeight:700,cursor:'pointer'}}
        onClick={() => setSimulatedKm(null)}
      >
        ↺ Reset to Live GPS Distance ({realRouteEstimate?.roadDistanceKm} km)
      </button>}
    </div>

    <div className="calc-section-label">All 5 Panipat Shops By Proximity</div>
    <div className="shops-distance-matrix">
      {shops.map((s, idx) => {
        const est = calculateRouteEstimate(userLocation, { lat: s.lat, lng: s.lng }, total);
        return (
          <div
            key={s.name}
            className={`matrix-shop-row ${calcShop.name === s.name ? 'selected' : ''}`}
            onClick={() => { setCalcShop(s); setSimulatedKm(null); }}
          >
            <div className="matrix-shop-left">
              <strong>{idx + 1}. {s.name}</strong>
              <small>{s.landmark ? `${s.landmark} · ` : ''}{s.address.split(',')[1] || s.address.split(',')[0]}</small>
              {s.owner && <small style={{color:'#678058',fontSize:'9px',marginTop:'2px',display:'block'}}>Owner: {s.owner} · {s.timing}</small>}
            </div>
            <div className="matrix-shop-right">
              <span className="matrix-shop-dist">{est.roadDistanceKm} km</span>
              <div className="matrix-shop-time">~{est.deliveryTimeEstimateMins}m delivery</div>
            </div>
          </div>
        );
      })}
    </div>

    <a
      className="maps-nav-btn"
      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${calcShop.lat},${calcShop.lng}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="navigation" size={16}/>
      <span>Open Directions in Google Maps</span>
    </a>

    <button
      className="primary wide"
      style={{marginTop:'4px'}}
      onClick={() => {
        setSelectedShop(calcShop);
        setModal('');
        go('Shop');
      }}
    >
      Shop at {calcShop.name} <Icon name="arrow" size={16}/>
    </button>
  </div>:
  modal==='Delivery location'?<div className="location-modal-body">
     <div className="live-location-banner">
       <div className="live-indicator-dot"/>
       <div>
         <strong>Live Location Active</strong>
         <p>{address} {liveCoords ? `(${liveCoords.lat.toFixed(4)}°, ${liveCoords.lng.toFixed(4)}°)` : 'Panipat, Haryana'}</p>
       </div>
     </div>
     <button
       type="button"
       className="primary wide live-locate-btn"
       onClick={()=>{ requestLiveLocation(); setModal(''); }}
       disabled={isLocating}
     >
       <Icon name="pin" size={18}/>
       {isLocating ? 'Detecting GPS coordinates...' : '📍 Use Current Live Location (GPS)'}
     </button>
     <div className="divider-or"><span>OR SELECT PANIPAT LOCALITY</span></div>
     <div className="panipat-presets">
       {panipatPresets.map(p=><button
         key={p.name}
         type="button"
         className={`preset-area-card ${address.includes(p.name.split(',')[0]) ? 'active' : ''}`}
         onClick={()=>{
           updateLocationAndShops({ lat: p.lat, lng: p.lng }, p.name, 10, true);
           setModal('');
           notify(`Location set to ${p.name}`);
         }}
       >
         <span className="preset-icon"><Icon name="shop" size={18}/></span>
         <div className="preset-info">
           <strong>{p.name}</strong>
           <small>{p.desc} · Landmark: {p.landmark} (PIN {p.pincode})</small>
         </div>
         <Icon name="arrow" size={15}/>
       </button>)}
     </div>
     <button
       type="button"
       className="outline wide"
       style={{marginBottom:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}
       onClick={()=>{ setCalcShop(selectedShop || shops[0]); setModal('Distance Calculator'); }}
     >
       <Icon name="ruler" size={16}/>
       <span>Open Distance & Route Calculator</span>
     </button>
     <form onSubmit={e=>{e.preventDefault();setModal('');notify('Custom location saved')}}>
       <label>Custom neighbourhood address
         <input className="field" value={address} onChange={e=>setAddress(e.target.value)} required/>
       </label>
       <button className="outline wide">Save location</button>
     </form>
   </div>:
 products.some(p=>p.name===modal)?(()=>{const p=products.find(p=>p.name===modal)!;return <><img className="detail-product" src={photo(p.img,500)} alt={p.name}/><p>{p.brand} · {p.size} · ₹{p.price}</p><div className="evidence-box"><Icon name="shield"/><p><strong>Quality evidence: insufficient</strong><br/>Sample product information. Manufacturer specifications and independent test results have not been verified. Brand reputation is separate from product quality.</p></div><p className="muted">Packaging condition is confirmed on delivery. Shop rating reflects shop service, not product quality. No live recall data is available in this prototype.</p><button className="primary wide" onClick={()=>{add(p.name);notify('Added to your basket')}}>Add to basket · ₹{p.price}</button></>})():
 modal==='Add to shopping list'||modal==='Add product'?<form onSubmit={e=>{e.preventDefault();notify('Item added to your demo list');setModal('')}}><p>Keep your everyday essentials in one place.</p><label>Product name<input className="field" placeholder="e.g. Toor dal" required/></label><label>Quantity<input className="field" placeholder="e.g. 1 kg" required/></label><button className="primary wide">Add item</button></form>:
 modal==='Your local shopping assistant'?<><p>Your helpful shortcut to a better local basket.</p><div className="assistant-message">Hello, Ananya. Planning your weekly shop? Ook Mart AI can help you compare your essentials across nearby shops, with transparent prices and explained recommendations.</div><button className="outline wide" onClick={()=>{go('Smart Cart AI');setModal('')}}><img src="/ook-mart-logo.svg" alt="" className="btn-mascot-inline"/>Compare with Smart Cart <Icon name="arrow" size={16}/></button><small className="muted">Demo assistant · Uses illustrative local inventory.</small></>:
 modal==='Notifications'?<><div className="basket-line"><Icon name="gift"/><div><strong>Your local loyalty is adding up.</strong><small>You have 240 Ook Points ready to use.</small></div></div><div className="basket-line"><Icon name="shop"/><div><strong>Fresh arrivals at Sharma General Store</strong><small>Your daily essentials are back in stock.</small></div></div></>:
 modal==='Shop information'?<><ShopMap name={selectedShop.name}/><p>Open daily, 7 am – 10 pm<br/>Delivery: {selectedShop.fee} · Minimum order ₹{selectedShop.min}<br/>Store pickup available.</p></>:
 <><p>{modal==='Help & support'?'Need a hand? We’re here for your neighbourhood.':"Behind every local shop is a familiar face, a family, and a neighbourhood that thrives together."}</p><div className="evidence-box"><Icon name="shop" size={24}/><p>{modal==='Help & support'?'For order questions, contact your local shop. For platform support, email help@ookmart.com. This is an interactive prototype.':'Discover nearby businesses, compare your basket fairly, and turn everyday essentials into everyday impact.'}</p></div><button className="primary wide" onClick={()=>{setModal('');go('Nearby shops')}}>Explore your neighbourhood <Icon name="arrow" size={16}/></button></>}
 </section></div>}</div>
}
