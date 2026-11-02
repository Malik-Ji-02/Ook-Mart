import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface DeliveryRouteItem {
  id: string;
  orderNumber: string;
  shopName: string;
  shopAddress: string;
  shopCoords: [number, number];
  shopPhone: string;
  customerName: string;
  customerAddress: string;
  customerCoords: [number, number];
  customerPhone: string;
  payout: number;
  paymentType: 'Prepaid UPI' | 'Cash on Delivery' | 'Prepaid Card';
  orderTotal: number;
  itemsSummary: string;
  distanceKm: number;
  etaMins: number;
  specialNote?: string;
  routeCoords: [number, number][];
}

export const panipatDeliveries: DeliveryRouteItem[] = [
  {
    id: '1042',
    orderNumber: '#OOK-1042',
    shopName: 'Sharma General Store',
    shopAddress: 'Model Town Market, Panipat',
    shopCoords: [29.3909, 76.9635],
    shopPhone: '+919812011223',
    customerName: 'Ananya Sharma',
    customerAddress: 'House 42, Sector 11, Panipat',
    customerCoords: [29.3820, 76.9540],
    customerPhone: '+919812345678',
    payout: 45,
    paymentType: 'Prepaid UPI',
    orderTotal: 450,
    itemsSummary: '4 items · Amul Butter, Wheat Atta, Fresh Milk, Salt',
    distanceKm: 2.1,
    etaMins: 12,
    specialNote: 'Leave at security gate if no answer on intercom',
    routeCoords: [
      [29.3955, 76.9685], // Rider origin
      [29.3935, 76.9660],
      [29.3909, 76.9635], // Shop
      [29.3875, 76.9595],
      [29.3845, 76.9565],
      [29.3820, 76.9540], // Drop
    ],
  },
  {
    id: '1045',
    orderNumber: '#OOK-1045',
    shopName: 'Gupta Supermarket',
    shopAddress: 'GT Road Near Bus Stand, Panipat',
    shopCoords: [29.3980, 76.9750],
    shopPhone: '+919812122334',
    customerName: 'Priya Nair',
    customerAddress: 'Flat 302, Assandh Road, Panipat',
    customerCoords: [29.3880, 76.9850],
    customerPhone: '+919812567890',
    payout: 55,
    paymentType: 'Cash on Delivery',
    orderTotal: 290,
    itemsSummary: '2 items · Basmati Rice 5kg, Fortune Sunflower Oil',
    distanceKm: 3.2,
    etaMins: 18,
    specialNote: 'Collect ₹290 Cash on Delivery upon drop-off',
    routeCoords: [
      [29.3955, 76.9685], // Rider origin
      [29.3970, 76.9715],
      [29.3980, 76.9750], // Shop
      [29.3945, 76.9790],
      [29.3915, 76.9820],
      [29.3880, 76.9850], // Drop
    ],
  },
  {
    id: '1048',
    orderNumber: '#OOK-1048',
    shopName: 'Fresh Farm Dairy & Bakery',
    shopAddress: 'Sukhdev Nagar Main Road, Panipat',
    shopCoords: [29.4040, 76.9610],
    shopPhone: '+919812233445',
    customerName: 'Rohan Verma',
    customerAddress: 'Villa 88, HUDA Sector 12, Panipat',
    customerCoords: [29.4120, 76.9720],
    customerPhone: '+919812789012',
    payout: 65,
    paymentType: 'Prepaid Card',
    orderTotal: 520,
    itemsSummary: '5 items · Organic Paneer, Brown Eggs, Bread, Curd, Milk',
    distanceKm: 2.8,
    etaMins: 15,
    specialNote: 'Fragile: Fresh eggs & bakery bread in package',
    routeCoords: [
      [29.3955, 76.9685], // Rider origin
      [29.3995, 76.9650],
      [29.4040, 76.9610], // Shop
      [29.4075, 76.9655],
      [29.4100, 76.9690],
      [29.4120, 76.9720], // Drop
    ],
  },
  {
    id: '1051',
    orderNumber: '#OOK-1051',
    shopName: 'Aggarwal Sweets & Snacks',
    shopAddress: 'Railway Road, Panipat',
    shopCoords: [29.3940, 76.9700],
    shopPhone: '+919812344556',
    customerName: 'Kavita Mehta',
    customerAddress: 'Block C, Ansals Sushant City, Panipat',
    customerCoords: [29.4150, 76.9890],
    customerPhone: '+919812901234',
    payout: 70,
    paymentType: 'Prepaid UPI',
    orderTotal: 680,
    itemsSummary: '3 items · Samosa 6-pack, Gulab Jamun Box, Dhokla',
    distanceKm: 4.1,
    etaMins: 22,
    specialNote: 'Keep bag upright for warm syrupy sweets',
    routeCoords: [
      [29.3955, 76.9685], // Rider origin
      [29.3940, 76.9700], // Shop
      [29.4010, 76.9770],
      [29.4085, 76.9835],
      [29.4150, 76.9890], // Drop
    ],
  },
];

interface DeliveryRouteMapProps {
  riderName?: string;
  riderCoords?: { lat: number; lng: number };
  activeDeliveryId: string | null;
  setActiveDeliveryId: (id: string | null) => void;
  pickedUpDeliveries: string[];
  setPickedUpDeliveries: React.Dispatch<React.SetStateAction<string[]>>;
  completedDeliveries: string[];
  setCompletedDeliveries: React.Dispatch<React.SetStateAction<string[]>>;
  notify: (msg: string) => void;
  go: (page: string) => void;
}

export default function DeliveryRouteMap({
  riderName = 'Vikas Kumar',
  riderCoords = { lat: 29.3955, lng: 76.9685 },
  activeDeliveryId,
  setActiveDeliveryId,
  pickedUpDeliveries,
  setPickedUpDeliveries,
  completedDeliveries,
  setCompletedDeliveries,
  notify,
  go,
}: DeliveryRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter state
  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'active'>('all');
  const [selectedInspectId, setSelectedInspectId] = useState<string>(activeDeliveryId || '1042');
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [audioNavEnabled, setAudioNavEnabled] = useState<boolean>(true);
  const [sheetCollapsed, setSheetCollapsed] = useState<boolean>(false);

  // Selected delivery object for card inspector
  const inspectedDelivery = panipatDeliveries.find((d) => d.id === selectedInspectId) || panipatDeliveries[0];
  const activeDelivery = panipatDeliveries.find((d) => d.id === activeDeliveryId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [riderCoords.lat, riderCoords.lng],
      zoom: 13.5,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean modern vector-styled map tiles (CartoDB Positron / Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control on top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const polylinesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    polylinesLayerRef.current = polylinesLayer;
    markersLayerRef.current = markersLayer;

    // Initial render of routes & markers
    renderRoutesAndMarkers(map, polylinesLayer, markersLayer);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Re-render routes and markers when activeDeliveryId, selectedInspectId, or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !polylinesLayerRef.current || !markersLayerRef.current) return;
    renderRoutesAndMarkers(mapInstanceRef.current, polylinesLayerRef.current, markersLayerRef.current);
  }, [activeDeliveryId, selectedInspectId, filterMode, completedDeliveries]);

  function renderRoutesAndMarkers(map: L.Map, polyGroup: L.LayerGroup, markGroup: L.LayerGroup) {
    polyGroup.clearLayers();
    markGroup.clearLayers();

    // 1. Add Rider Marker (Pulsing 2-wheeler)
    const riderDiv = L.divIcon({
      className: 'rider-custom-icon',
      html: `
        <div class="rider-marker-wrapper">
          <div class="rider-pulse-ring"></div>
          <div class="rider-vehicle-bubble">🛵</div>
          <div class="rider-name-tag">You (${riderName.split(' ')[0]})</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
    L.marker([riderCoords.lat, riderCoords.lng], { icon: riderDiv, zIndexOffset: 1000 }).addTo(markGroup);

    // Filter deliveries based on filterMode
    const displayDeliveries = panipatDeliveries.filter((d) => {
      if (filterMode === 'active') return d.id === activeDeliveryId;
      if (filterMode === 'high') return d.payout >= 60;
      return true;
    });

    displayDeliveries.forEach((d) => {
      const isCompleted = completedDeliveries.includes(d.id);
      const isMainActive = d.id === activeDeliveryId;
      const isInspected = d.id === selectedInspectId;

      // Polyline styling
      if (isMainActive) {
        // Glowing Emerald Green Underlay
        L.polyline(d.routeCoords, {
          color: '#10b981',
          weight: 12,
          opacity: 0.38,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(polyGroup);

        // Core Solid Neon Green Route Line
        const mainLine = L.polyline(d.routeCoords, {
          color: '#059669',
          weight: 6.5,
          opacity: 1.0,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(polyGroup);

        mainLine.on('click', () => {
          setSelectedInspectId(d.id);
        });
      } else {
        // Available Delivery: Vibrant Electric Blue Polyline
        const availableLine = L.polyline(d.routeCoords, {
          color: isInspected ? '#1d4ed8' : '#2563eb',
          weight: isInspected ? 6.5 : (activeDeliveryId ? 4 : 5.5),
          opacity: isCompleted ? 0.3 : (activeDeliveryId ? 0.55 : 0.9),
          dashArray: isCompleted ? '4, 8' : (activeDeliveryId ? '6, 6' : undefined),
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(polyGroup);

        availableLine.on('click', () => {
          setSelectedInspectId(d.id);
          notify(`📍 Inspected ${d.orderNumber}: ${d.shopName} ➔ ${d.customerName} (+₹${d.payout})`);
        });
      }

      // 2. Add Shop Marker (Pickup Point)
      const shopDiv = L.divIcon({
        className: 'shop-custom-icon',
        html: `
          <div class="map-node-marker shop-node ${isMainActive ? 'is-green-active' : 'is-blue-avail'} ${isInspected ? 'is-inspected' : ''}">
            <div class="node-icon">🏪</div>
            <div class="node-pill">
              <b>PICKUP</b>
              <span>${d.shopName.split(' ')[0]}</span>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
      const shopMarker = L.marker(d.shopCoords, { icon: shopDiv, zIndexOffset: isMainActive ? 800 : 400 }).addTo(markGroup);
      shopMarker.on('click', () => {
        setSelectedInspectId(d.id);
      });

      // 3. Add Customer Drop Marker
      const dropDiv = L.divIcon({
        className: 'drop-custom-icon',
        html: `
          <div class="map-node-marker drop-node ${isMainActive ? 'is-green-active' : 'is-blue-avail'} ${isInspected ? 'is-inspected' : ''}">
            <div class="node-icon">📍</div>
            <div class="node-payout-badge">+₹${d.payout}</div>
            <div class="node-drop-name">${d.customerName.split(' ')[0]}</div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 42],
      });
      const dropMarker = L.marker(d.customerCoords, { icon: dropDiv, zIndexOffset: isMainActive ? 900 : 500 }).addTo(markGroup);
      dropMarker.on('click', () => {
        setSelectedInspectId(d.id);
      });
    });
  }

  // Action: Claim & Make This Delivery the Main Active Green Route
  function handleClaimRoute(delivery: DeliveryRouteItem) {
    setActiveDeliveryId(delivery.id);
    setSelectedInspectId(delivery.id);
    notify(`🟢 Route Locked! Following Main Green Route for ${delivery.orderNumber} (+₹${delivery.payout})`);

    // Zoom map smoothly to bounds of this active route
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(delivery.routeCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [70, 70], maxZoom: 15 });
    }
  }

  // Action: Recenter on Rider Location
  function handleRecenterRider() {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([riderCoords.lat, riderCoords.lng], 14.5, { duration: 1.2 });
      notify('📍 Centered on your live Panipat GPS position');
    }
  }

  // Action: Fit All Deliveries
  function handleFitAllRoutes() {
    if (mapInstanceRef.current) {
      const allPoints = panipatDeliveries.flatMap((d) => d.routeCoords);
      allPoints.push([riderCoords.lat, riderCoords.lng]);
      mapInstanceRef.current.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50] });
    }
  }

  // Leg status for active delivery
  const isPickedUp = activeDelivery ? pickedUpDeliveries.includes(activeDelivery.id) : false;
  const isDelivered = activeDelivery ? completedDeliveries.includes(activeDelivery.id) : false;

  return (
    <div className="delivery-map-page-wrapper">
      {/* 1. TOP NAVIGATION / HUD HEADER OVERLAY */}
      <header className="map-hud-topbar">
        <div className="hud-top-row">
          <button className="hud-back-btn" onClick={() => go('Discover')} title="Back to Fleet Dispatch">
            ← Fleet
          </button>

          <div className="hud-status-chip">
            <span className={`live-pulse-dot ${activeDelivery ? 'active' : ''}`} />
            <span>
              {activeDelivery
                ? `Main Route: ${activeDelivery.orderNumber} (Green)`
                : `4 Available Routes (Blue)`}
            </span>
          </div>

          <div className="hud-controls-group">
            <button
              className={`hud-icon-btn ${audioNavEnabled ? 'active' : ''}`}
              title="Voice navigation chime"
              onClick={() => {
                setAudioNavEnabled(!audioNavEnabled);
                notify(audioNavEnabled ? 'Audio alerts muted' : '🔊 Voice prompts enabled');
              }}
            >
              {audioNavEnabled ? '🔊' : '🔇'}
            </button>
            <button
              className={`hud-icon-btn ${trafficEnabled ? 'active' : ''}`}
              title="Toggle Panipat traffic overlay"
              onClick={() => {
                setTrafficEnabled(!trafficEnabled);
                notify(trafficEnabled ? 'Live traffic hidden' : '🚦 Live Panipat traffic active');
              }}
            >
              🚦
            </button>
          </div>
        </div>

        {/* Turn-by-turn guidance banner when active route is green */}
        {activeDelivery && !isDelivered ? (
          <div className="hud-turn-banner">
            <div className="turn-arrow-badge">
              {!isPickedUp ? '↰' : '↱'}
            </div>
            <div className="turn-directions-copy">
              <strong>
                {!isPickedUp
                  ? `In 250m turn left towards ${activeDelivery.shopName}`
                  : `In 400m turn right towards ${activeDelivery.customerName}'s doorstep`}
              </strong>
              <small>
                {!isPickedUp
                  ? `Step 1: Pick up ${activeDelivery.orderNumber} · 0.8 km remaining`
                  : `Step 2: Drop off at ${activeDelivery.customerAddress} · 1.8 km`}
              </small>
            </div>
            <div className="turn-eta-pill">
              <b>{activeDelivery.etaMins}m</b>
              <small>{activeDelivery.distanceKm} km</small>
            </div>
          </div>
        ) : (
          <div className="hud-instruction-banner">
            <span className="hud-spark-icon">🗺️</span>
            <div>
              <strong>All Available Deliveries Marked in Blue</strong>
              <small>Tap any route line or choose an order below to lock your Main Route (turns Green)</small>
            </div>
          </div>
        )}

        {/* 4. ROUTE FILTER CHIP PILLS */}
        <div className="map-route-filter-bar">
          <button
            className={`filter-chip ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Routes (4)
          </button>
          <button
            className={`filter-chip ${filterMode === 'high' ? 'active' : ''}`}
            onClick={() => setFilterMode('high')}
          >
            High Payout (₹60+)
          </button>
          {activeDelivery && (
            <button
              className={`filter-chip green-active ${filterMode === 'active' ? 'active' : ''}`}
              onClick={() => setFilterMode('active')}
            >
              🟢 Main Route Only
            </button>
          )}
        </div>
      </header>

      {/* 2. FULL-PAGE LEAFLET MAP CANVAS */}
      <div className="delivery-map-canvas" ref={mapContainerRef} />

      {/* 3. FLOATING MAP ACTION BUTTONS (Right Side) */}
      <div className="map-floating-fab-stack">
        <button className="map-fab-btn recenter" onClick={handleRecenterRider} title="My Location">
          📍
        </button>
        <button className="map-fab-btn fit-all" onClick={handleFitAllRoutes} title="Show All 4 Routes">
          🗺️
        </button>
        {activeDelivery && (
          <a
            className="map-fab-btn gmaps"
            href={`https://www.google.com/maps/dir/?api=1&origin=${riderCoords.lat},${riderCoords.lng}&destination=${
              !isPickedUp ? activeDelivery.shopCoords.join(',') : activeDelivery.customerCoords.join(',')
            }`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps Navigation"
          >
            🧭
          </a>
        )}
      </div>

      {/* 5. INTERACTIVE BOTTOM SHEET / ORDER CAROUSEL */}
      <section className={`map-bottom-sheet ${sheetCollapsed ? 'collapsed' : ''}`}>
        <div className="sheet-handle-row" onClick={() => setSheetCollapsed(!sheetCollapsed)}>
          <span className="sheet-pill-handle" />
          <span className="sheet-toggle-label">
            {sheetCollapsed ? '▲ Tap to view order details' : '▼ Drag to minimize map sheet'}
          </span>
        </div>

        {/* Horizontal Mini Route Selector Carousel */}
        <div className="routes-horizontal-scroller">
          {panipatDeliveries.map((d) => {
            const isMain = d.id === activeDeliveryId;
            const isInspected = d.id === selectedInspectId;
            return (
              <button
                key={d.id}
                type="button"
                className={`route-card-mini ${isMain ? 'active-green-card' : ''} ${isInspected ? 'is-selected' : ''}`}
                onClick={() => {
                  setSelectedInspectId(d.id);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo(d.shopCoords);
                  }
                }}
              >
                <div className="mini-card-head">
                  <span className={`route-color-indicator ${isMain ? 'green-dot' : 'blue-dot'}`} />
                  <strong>{d.orderNumber}</strong>
                  <span className="mini-payout">+₹{d.payout}</span>
                </div>
                <div className="mini-card-body">
                  <p className="mini-shop">{d.shopName.split(' ')[0]} ➔ {d.customerName.split(' ')[0]}</p>
                  <span className="mini-meta">{d.distanceKm} km · {d.etaMins}m</span>
                </div>
                {isMain && <span className="mini-active-tag">Active Route</span>}
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector for the Selected / Inspected Delivery */}
        <div className="inspected-delivery-detail-card">
          <div className="detail-header-row">
            <div className="detail-title-group">
              <div className="detail-badge-line">
                <span className={`status-route-pill ${inspectedDelivery.id === activeDeliveryId ? 'main-green' : 'avail-blue'}`}>
                  {inspectedDelivery.id === activeDeliveryId ? '🟢 Main Route (Active)' : '🔵 Available Delivery'}
                </span>
                <span className="detail-payment-type">{inspectedDelivery.paymentType}</span>
              </div>
              <h3>{inspectedDelivery.orderNumber} · {inspectedDelivery.itemsSummary}</h3>
            </div>
            <div className="detail-payout-box">
              <small>RIDER PAYOUT</small>
              <strong>+₹{inspectedDelivery.payout}</strong>
            </div>
          </div>

          {/* Pickup & Drop Leg Details */}
          <div className="detail-legs-timeline">
            {/* Leg 1: Store */}
            <div className="leg-point-item pickup">
              <div className="leg-marker-icon shop">🏪</div>
              <div className="leg-text-content">
                <div className="leg-sub">PICKUP FROM STORE</div>
                <strong>{inspectedDelivery.shopName}</strong>
                <p>{inspectedDelivery.shopAddress}</p>
              </div>
              <a href={`tel:${inspectedDelivery.shopPhone}`} className="leg-call-btn" title="Call Shop">
                📞 Call
              </a>
            </div>

            {/* Leg 2: Doorstep */}
            <div className="leg-point-item drop">
              <div className="leg-marker-icon drop">📍</div>
              <div className="leg-text-content">
                <div className="leg-sub">DELIVER TO DOORSTEP</div>
                <strong>{inspectedDelivery.customerName}</strong>
                <p>{inspectedDelivery.customerAddress}</p>
                {inspectedDelivery.specialNote && (
                  <span className="leg-note-tag">📝 {inspectedDelivery.specialNote}</span>
                )}
              </div>
              <a href={`tel:${inspectedDelivery.customerPhone}`} className="leg-call-btn" title="Call Customer">
                📞 Call
              </a>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="detail-action-footer">
            {inspectedDelivery.id === activeDeliveryId ? (
              <div className="active-route-workflow-buttons">
                {!isPickedUp ? (
                  <button
                    type="button"
                    className="btn-workflow confirm-pickup"
                    onClick={() => {
                      setPickedUpDeliveries((prev) => [...prev, inspectedDelivery.id]);
                      notify(`✓ Order ${inspectedDelivery.orderNumber} picked up from ${inspectedDelivery.shopName}! Head to customer drop.`);
                    }}
                  >
                    Confirm Store Pickup ✓
                  </button>
                ) : !isDelivered ? (
                  <button
                    type="button"
                    className="btn-workflow confirm-deliver"
                    onClick={() => {
                      setCompletedDeliveries((prev) => [...prev, inspectedDelivery.id]);
                      notify(`🎉 ${inspectedDelivery.orderNumber} Delivered to ${inspectedDelivery.customerName}! +₹${inspectedDelivery.payout} credited.`);
                    }}
                  >
                    Complete Delivery (Credit +₹{inspectedDelivery.payout}) 🎉
                  </button>
                ) : (
                  <div className="workflow-completed-tag">
                    ✓ Delivery Completed & Earnings Added!
                  </div>
                )}

                <button
                  type="button"
                  className="btn-secondary-switch"
                  onClick={() => {
                    setActiveDeliveryId(null);
                    notify('⏸️ Active route released. You can now select any available route.');
                  }}
                >
                  Switch Route
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-claim-route"
                onClick={() => handleClaimRoute(inspectedDelivery)}
              >
                <span>🛵 Pick Up Delivery & Follow Route</span>
                <span className="claim-arrow">➔</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
