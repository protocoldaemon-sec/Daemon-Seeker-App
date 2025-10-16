import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Smartphone } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import WalletConnectionModal from "@/components/WalletConnectionModal";
import WalletSuccessModal from "@/components/WalletSuccessModal";
import { openPhantomApp, openSolflareApp, openBackpackApp, isMobileDevice } from "@/utils/walletDeepLink";
import PhantomLogo from "@/assets/logo/phantom-logo.svg";
import SolflareLogo from "@/assets/logo/solflare-logo.svg";
import DaemonLogo from "@/assets/logo/daemon-logo-black.svg";
import Sphere from "@/components/Sphere"; 
import DaemonLogoGif from "@/assets/logo/daemon-logo-blink.gif";

export default function WalletConnection() {
  const navigate = useNavigate();
  const { connectPhantom, connectSolflare, connectBackpack, isConnecting, error, clearError } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isInConnectionFlow, setIsInConnectionFlow] = useState(false);

  const handleConnectWallet = async (walletType: string) => {
    setConnectingWallet(walletType);
    setShowConnectionModal(true);
    setIsInConnectionFlow(true);
    localStorage.setItem('isInConnectionFlow', 'true');
    clearError();
    
    try {
      // Cek apakah di mobile device
      if (isMobileDevice()) {
        // Untuk mobile, buka wallet APK
        let success = false;
        switch (walletType) {
          case "phantom":
            success = await openPhantomApp("Connect to Daemon Protocol");
            break;
          case "solflare":
            success = await openSolflareApp("Connect to Daemon Protocol");
            break;
          case "backpack":
            success = await openBackpackApp("Connect to Daemon Protocol");
            break;
          default:
            throw new Error("Unknown wallet type");
        }
        
        if (success) {
          alert(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} app opened. Please connect your wallet and return to this app.`);
          setShowConnectionModal(false);
          setShowSuccessModal(true);
        } else {
          throw new Error(`Failed to open ${walletType} app. Please install from Play Store.`);
        }
      } else {
        // Untuk desktop, gunakan browser extension
        switch (walletType) {
          case "phantom":
            await connectPhantom();
            break;
          case "solflare":
            await connectSolflare();
            break;
          case "backpack":
            await connectBackpack();
            break;
          default:
            throw new Error("Unknown wallet type");
        }
        
        // On successful connection: close connecting modal and show success modal
        setShowConnectionModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(`${walletType} connection error:`, err);
      setIsInConnectionFlow(false);
      localStorage.removeItem('isInConnectionFlow');
      // Error is handled by useWallet hook, modal will show error
    } finally {
      // Don't clear connectingWallet here - keep it for success modal
      if (error) {
        setConnectingWallet(null);
        setIsInConnectionFlow(false);
        localStorage.removeItem('isInConnectionFlow');
      }
    }
  };

  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
    setConnectingWallet(null);
    setIsInConnectionFlow(false);
    localStorage.removeItem('isInConnectionFlow');
    clearError();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setConnectingWallet(null);
    setIsInConnectionFlow(false);
    localStorage.removeItem('isInConnectionFlow');
  };

  const handleRedirectToHome = () => {
    setShowSuccessModal(false);
    setConnectingWallet(null);
    setIsInConnectionFlow(false);
    localStorage.removeItem('isInConnectionFlow');
    navigate("/chat", { replace: true });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      {/* <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')"
        }}
      /> */}
      <Sphere className="absolute inset-0 z-0" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Header Branding */}
      <div className="relative z-10 flex flex-col items-center pt-8">
        {/* Logo */}
        <div className="w-26 h-26 flex items-center justify-center mb-2">
          <img src={DaemonLogoGif} alt="Daemon Logo Gif" width={255} height={255} />
        </div>
        
        {/* App Name */}
        <h1 className="text-2xl font-bold text-white-900 mb-2">DAEMON PROTOCOL</h1>
        
        {/* Welcome Message */}
        <p className="text-white-700 text-sm">Nice to see you again!</p>
      </div>

      {/* Wallet Connection Card */}
      <div className="relative z-10 flex justify-center px-4 pt-8">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900/25 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Mobile Device Notice */}
            {/* {isMobileDevice() && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                <p className="text-blue-300 text-sm">
                  📱 Mobile detected - This will open your wallet app
                </p>
              </div>
            )} */}

            {/* Wallet Options */}
            <div className="space-y-4">
              {/* Phantom Wallet */}
              <Button
                onClick={() => handleConnectWallet('phantom')}
                disabled={isConnecting || connectingWallet !== null}
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 rounded-xl h-14 flex items-center justify-start gap-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  {(connectingWallet === "phantom" || isConnecting) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    // <div className="w-5 h-5 bg-white rounded-sm" />
                    <img src={PhantomLogo} className="text-foreground" width={15} height={15} />
                  )}
                </div>
                <span className="text-lg font-medium">
                  {(connectingWallet === "phantom" || isConnecting) ? "Connecting..." : "Phantom"}
                </span>
                {isMobileDevice() && (
                  <Smartphone className="w-4 h-4 text-gray-400 ml-auto" />
                )}
              </Button>

              {/* Solflare Wallet */}
              <Button
                onClick={() => handleConnectWallet('solflare')}
                disabled={isConnecting || connectingWallet !== null}
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 rounded-xl h-14 flex items-center justify-start gap-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  {(connectingWallet === "solflare" || isConnecting) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    // <span className="text-yellow-900 font-bold text-sm">S</span>
                    <img src={SolflareLogo} className="text-foreground" width={15} height={15} />

                  )}
                </div>
                <span className="text-lg font-medium">
                  {(connectingWallet === "solflare" || isConnecting) ? "Connecting..." : "Solflare"}
                </span>
                {isMobileDevice() && (
                  <Smartphone className="w-4 h-4 text-gray-400 ml-auto" />
                )}
              </Button>

              {/* Backpack Wallet */}
              {/* <Button
                onClick={() => handleConnectWallet('backpack')}
                disabled={isConnecting || connectingWallet !== null}
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 rounded-xl h-14 flex items-center justify-start gap-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  {(connectingWallet === "backpack" || isConnecting) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  )}
                </div>
                <span className="text-lg font-medium">
                  {(connectingWallet === "backpack" || isConnecting) ? "Connecting..." : "Backpack"}
                </span>
                {isMobileDevice() && (
                  <Smartphone className="w-4 h-4 text-gray-400 ml-auto" />
                )}
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
            {/* <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm transform rotate-12" /> */}
            <img src={DaemonLogo} className="text-black" width={25} height={25} />

          </div>
          <span className="text-white text-sm">@DaemonProtocol</span>
        </div>
        <span className="text-white text-sm">© All right reserved 2025</span>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-32 h-1 bg-black/30 rounded-full" />
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showConnectionModal}
        onClose={handleCloseConnectionModal}
        onBack={handleCloseConnectionModal}
        walletType={connectingWallet as 'phantom' | 'solflare' | 'backpack' | null}
        isConnecting={isConnecting}
        error={error}
      />

      {/* Wallet Success Modal */}
      <WalletSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        walletType={connectingWallet as 'phantom' | 'solflare' | 'backpack' | null}
        onRedirect={handleRedirectToHome}
      />
    </div>
  );
}
