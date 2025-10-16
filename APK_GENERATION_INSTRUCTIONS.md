# Cara Generate APK dari Daemon Seeker App

## Status Build
✅ **PWA (Progressive Web App) telah berhasil dibuat dan berjalan di http://localhost:3000**

## Opsi untuk Generate APK

### 1. Menggunakan PWA Builder (Microsoft) - **RECOMMENDED**
1. Buka https://www.pwabuilder.com/
2. Masukkan URL: `http://localhost:3000` (pastikan server berjalan)
3. Klik "Start" untuk analisis PWA
4. Pilih "Android" dan klik "Generate Package"
5. Download APK yang dihasilkan

### 2. Menggunakan Bubblewrap (Google)
```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Generate APK
bubblewrap init --manifest=http://localhost:3000/manifest.json
bubblewrap build
```

### 3. Menggunakan Capacitor (Ionic)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize
npx cap init "Daemon Seeker" "com.daemonseeker.app"

# Add Android platform
npx cap add android

# Build
npx cap build android
```

### 4. Menggunakan TWA (Trusted Web Activity)
1. Download Android Studio
2. Setup Android SDK
3. Gunakan template TWA dari Google
4. Build APK menggunakan Gradle

## File yang Telah Dibuat
- `dist/spa/` - Build PWA yang siap digunakan
- `dist/spa/manifest.json` - Web App Manifest
- `dist/spa/sw.js` - Service Worker untuk offline support
- `serve-pwa.js` - Server lokal untuk testing

## Cara Menggunakan
1. Pastikan server berjalan: `node serve-pwa.js`
2. Buka http://localhost:3000 di browser
3. Gunakan salah satu metode di atas untuk generate APK

## Catatan
- PWA sudah memiliki offline support
- Manifest sudah dikonfigurasi untuk mobile
- Service Worker sudah aktif untuk caching
- App dapat diinstall sebagai "Add to Home Screen"

## Troubleshooting
- Jika server tidak berjalan, jalankan: `node serve-pwa.js`
- Pastikan port 3000 tidak digunakan aplikasi lain
- Untuk production, deploy ke hosting seperti Netlify atau Vercel

