// Deep linking utilities untuk membuka wallet APK
export interface WalletApp {
  name: string;
  packageName: string;
  deepLink: string;
  fallbackUrl: string;
}

// Daftar wallet APK yang didukung
export const SUPPORTED_WALLETS: WalletApp[] = [
  {
    name: 'Phantom',
    packageName: 'app.phantom',
    deepLink: 'phantom://v1/connect',
    fallbackUrl: 'https://phantom.app/download'
  },
  {
    name: 'Solflare',
    packageName: 'com.solflare.mobile',
    deepLink: 'solflare://connect',
    fallbackUrl: 'https://solflare.com/download'
  },
  {
    name: 'Backpack',
    packageName: 'com.backpack.app',
    deepLink: 'backpack://connect',
    fallbackUrl: 'https://backpack.app/download'
  },
  {
    name: 'Trust Wallet',
    packageName: 'com.wallet.crypto.trustapp',
    deepLink: 'trust://open_url?url=',
    fallbackUrl: 'https://trustwallet.com/download'
  }
];

// Fungsi untuk membuka wallet APK
export const openWalletApp = async (wallet: WalletApp, message?: string): Promise<boolean> => {
  try {
    // Coba buka dengan deep link
    const deepLinkUrl = message ? `${wallet.deepLink}?message=${encodeURIComponent(message)}` : wallet.deepLink;
    
    // Untuk mobile web atau Capacitor
    if (window.location.protocol === 'capacitor:' || isMobileDevice()) {
      // Gunakan window.open untuk mobile
      window.open(deepLinkUrl, '_blank');
      return true;
    } else {
      // Untuk desktop, buka di tab baru
      window.open(deepLinkUrl, '_blank');
      return true;
    }
  } catch (error) {
    console.error(`Failed to open ${wallet.name}:`, error);
    return false;
  }
};

// Fungsi untuk deteksi device mobile
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
};

// Fungsi untuk deteksi apakah aplikasi berjalan di Capacitor
export const isCapacitorApp = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).Capacitor;
};

// Fungsi untuk membuka Phantom APK
export const openPhantomApp = async (message?: string): Promise<boolean> => {
  const phantom = SUPPORTED_WALLETS.find(w => w.name === 'Phantom');
  if (!phantom) return false;
  
  return await openWalletApp(phantom, message);
};

// Fungsi untuk membuka Solflare APK
export const openSolflareApp = async (message?: string): Promise<boolean> => {
  const solflare = SUPPORTED_WALLETS.find(w => w.name === 'Solflare');
  if (!solflare) return false;
  
  return await openWalletApp(solflare, message);
};

// Fungsi untuk membuka Backpack APK
export const openBackpackApp = async (message?: string): Promise<boolean> => {
  const backpack = SUPPORTED_WALLETS.find(w => w.name === 'Backpack');
  if (!backpack) return false;
  
  return await openWalletApp(backpack, message);
};

// Fungsi untuk menampilkan daftar wallet yang tersedia
export const getAvailableWallets = (): WalletApp[] => {
  return SUPPORTED_WALLETS;
};

// Fungsi untuk membuka wallet dengan nama
export const openWalletByName = async (walletName: string, message?: string): Promise<boolean> => {
  const wallet = SUPPORTED_WALLETS.find(w => w.name.toLowerCase() === walletName.toLowerCase());
  if (!wallet) {
    console.error(`Wallet ${walletName} not found`);
    return false;
  }
  
  return await openWalletApp(wallet, message);
};
