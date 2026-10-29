# WeMart (ApnaMarket) — Hyperlocal Neighbourhood Grocery Platform

A modern, full-stack hyperlocal grocery platform built for local commerce in **Panipat, Haryana**. Includes live GPS distance calculation, SQLite database persistence, and mobile apps for **Expo Go** and **Capacitor (Android & iOS)**.

---

## 🌟 Key Features

- **Hyperlocal Panipat Directory**: 5 authentic neighborhood grocery shops in Panipat (Model Town, GT Road, Sector 11-12, Insar Bazar Old City, Eldeco Estate One) with store owners, operating hours, landmarks, and direct store call buttons.
- **Accurate Live GPS Distance & ETA**:
  - Real-time Haversine & road network distance calculation.
  - Multi-modal travel estimates (2-Wheeler, Car/Auto, Walking).
  - Itemized tiered delivery fee calculation based on road distance.
  - Interactive distance simulator slider (0.5 km to 15.0 km).
  - 8 Panipat sector presets (Model Town, Sanjay Chowk, Sector 11-12 HUDA, Insar Bazar, Eldeco Estate, Railway Junction, Sector 18, Sector 25).
- **SQLite Database Persistence**:
  - Live orders, shop inventory, and custom locations saved to `server/wemart.sqlite`.
  - REST API endpoints for shops, products, and order management.
- **Cross-Platform Mobile Support**:
  - **Expo Go App (`expo-app/`)**: Full mobile experience with native `expo-location` GPS tracking and direct touch permission banner.
  - **Capacitor Native Apps (`android/` & `ios/`)**: Native Android Studio & Xcode projects with `@capacitor/geolocation` and `@capacitor/haptics`.
  - **Responsive Web App**: Desktop sidebar & mobile navigation with high-fidelity UI.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 8, Vanilla CSS Design System (`src/index.css`, `src/mobile.css`).
- **Mobile Native**:
  - Capacitor 8 (`@capacitor/geolocation`, `@capacitor/app`, `@capacitor/haptics`, `@capacitor/status-bar`).
  - Expo 55 (`expo-location`, `react-native-webview`).
- **Backend & Database**: Express middleware, SQLite 3 (`better-sqlite3`).

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install root web and Capacitor dependencies
npm install

# Install Expo mobile shell dependencies
cd expo-app && npm install && cd ..
```

### 2. Start Local Development

```bash
# Start Vite dev server & SQLite API on port 8443
npm run dev
```

The web app is accessible at:
- Local: `http://localhost:8443/`
- Local Network: `http://<your-lan-ip>:8443/`

### 3. Run Mobile App with Expo Go

```bash
cd expo-app
npx expo start --lan
```

Scan the displayed QR code with the **Expo Go** app on your Android or iOS device.

### 4. Build Native Android & iOS Apps (Capacitor)

```bash
# Build web bundle and sync native platforms
npm run build
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS)
npx cap open ios
```

---

## 📍 Configured Panipat Stores

1. **Verma Kirana & General Store**
   - *Owner*: Ramesh Verma · *Timing*: 7:30 AM – 10:00 PM
   - *Location*: Near Shivaji Stadium Gate 1, Model Town, Panipat (132103)
2. **Garg Supermarket & Daily Needs**
   - *Owner*: Sunil Garg · *Timing*: 8:00 AM – 10:30 PM
   - *Location*: GT Road, Opp. Sanjay Chowk Flyover, Panipat (132103)
3. **Kisan Fresh Mandi Store**
   - *Owner*: Baljeet Singh Mann · *Timing*: 6:30 AM – 9:30 PM
   - *Location*: Sector 11-12, HUDA Commercial Complex, Panipat (132103)
4. **Aggarwal Departmental Store**
   - *Owner*: Mahesh Aggarwal · *Timing*: 8:00 AM – 9:30 PM
   - *Location*: Insar Bazar Clock Tower, Old City, Panipat (132103)
5. **Puri Grocers & Gourmet**
   - *Owner*: Devender Puri · *Timing*: 8:30 AM – 10:00 PM
   - *Location*: Eldeco Estate One, Sector 40, GT Karnal Road (132108)

---

## 📄 License

MIT License. Designed and developed by **Parvinder Malik** (@Malik-Ji-02).
