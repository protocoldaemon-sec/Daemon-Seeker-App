# 🚀 Quick Start - Build APK

## ✅ **Setup Selesai!**

Aplikasi Daemon Seeker sudah dikonfigurasi untuk build APK. Berikut cara build:

## 📋 **Prerequisites (Yang Harus Diinstall)**

### 1. **Android Studio** (WAJIB)
- Download dari: https://developer.android.com/studio
- Install dengan default settings
- Android SDK akan terinstall otomatis

### 2. **Java Development Kit (JDK)**
- Download JDK 8 atau lebih tinggi dari: https://adoptium.net/
- Atau install melalui Android Studio

## 🔧 **Setup Android SDK Path**

Setelah install Android Studio:

1. **Buka Android Studio**
2. **File → Settings → Appearance & Behavior → System Settings → Android SDK**
3. **Copy path SDK** (biasanya: `C:\Users\[Username]\AppData\Local\Android\Sdk`)
4. **Edit file `android/local.properties`**:
   ```
   sdk.dir=C\:\\Users\\[YourUsername]\\AppData\\Local\\Android\\Sdk
   ```

## 🎨 **Generate App Icons**

1. **Buka file `create-app-icon.html`** di browser
2. **Klik tombol generate** untuk setiap ukuran:
   - 48x48 (mdpi)
   - 72x72 (hdpi) 
   - 96x96 (xhdpi)
   - 144x144 (xxhdpi)
   - 192x192 (xxxhdpi)
3. **Save icon** dengan nama `ic_launcher.png` di folder:
   - `android/app/src/main/res/mipmap-mdpi/`
   - `android/app/src/main/res/mipmap-hdpi/`
   - `android/app/src/main/res/mipmap-xhdpi/`
   - `android/app/src/main/res/mipmap-xxhdpi/`
   - `android/app/src/main/res/mipmap-xxxhdpi/`

## 📱 **Build APK**

### **Method 1: Android Studio (Recommended)**

1. **Open Android Studio**
2. **File → Open**
3. **Pilih folder `android`** dari project ini
4. **Wait for Gradle sync** (pertama kali agak lama)
5. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
6. **APK akan tersimpan** di: `android/app/build/outputs/apk/debug/`

### **Method 2: Command Line**

```bash
# 1. Setup Android SDK path di local.properties dulu!

# 2. Build APK
cd android
.\gradlew.bat assembleDebug

# 3. APK location
# android/app/build/outputs/apk/debug/app-debug.apk
```

## 🧪 **Test APK**

1. **Install APK** di Android device atau emulator
2. **Enable Developer Options** di device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"
3. **Connect device** via USB atau gunakan emulator

## 📦 **Release APK (Untuk Play Store)**

```bash
# Build release APK
cd android
.\gradlew.bat assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

**Note**: Release APK perlu di-sign dengan keystore untuk upload ke Play Store.

## 🚀 **Upload ke Google Play Store**

### **1. Buat Google Play Console Account**
- Kunjungi: https://play.google.com/console
- Bayar $25 registration fee (sekali bayar)

### **2. Upload APK**
- Login ke Play Console
- Create new app
- Upload APK file
- Fill store listing information

### **3. Required Information**
- **App Name**: Daemon Seeker App
- **Short Description**: Advanced blockchain security analysis platform
- **Screenshots**: Ambil screenshot dari app yang running
- **App Icon**: 512x512px PNG
- **Privacy Policy**: Buat privacy policy untuk data collection

## 🔧 **Troubleshooting**

### **Error: SDK location not found**
```bash
# Edit android/local.properties
sdk.dir=C\:\\Users\\[YourUsername]\\AppData\\Local\\Android\\Sdk
```

### **Error: Gradle sync failed**
- Pastikan internet connection baik
- Restart Android Studio
- File → Invalidate Caches and Restart

### **Error: Build failed**
```bash
# Clean dan rebuild
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

### **APK tidak bisa install**
- Pastikan device support minimum SDK (24)
- Enable "Install from unknown sources"
- Check device storage space

## 📞 **Need Help?**

- **Android Studio Docs**: https://developer.android.com/studio
- **Gradle Docs**: https://gradle.org/docs/
- **Play Console Help**: https://support.google.com/googleplay/android-developer/

---

## 🎉 **Success!**

Setelah APK berhasil dibuat, Anda bisa:
1. **Test** di device/emulator
2. **Share** APK ke teman untuk testing
3. **Upload** ke Google Play Store
4. **Distribute** ke users worldwide!

**Happy Building!** 🚀
