import { useEffect } from "react";
import Header from "../components/text/Header";
import Text from "../components/text/Text";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  bodyText: string;
  isRegister?: boolean; // true for register, false for login
}

export default function RegistrationModal({
  isOpen,
  onClose,
  headerText,
  bodyText,
  isRegister = true,
}: RegistrationModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // OAuth handler - same logic as Navbar
  const handleGoogleAuth = () => {
    // Use local backend for development, production API for deployed frontend
    const getApiUrl = () => {
      const envUrl = import.meta.env.VITE_API_URL;
      if (envUrl && envUrl.trim() !== '') {
        return envUrl;
      }
      // Fallback based on hostname
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/backend-api';
      }
      return 'https://witcon.duckdns.org/backend-api';
    };
    
    const API_URL = getApiUrl();
    const currentUrl = window.location.origin;
    const redirectUri = isRegister 
      ? `${currentUrl}/register` 
      : `${currentUrl}/login`;
    
    // Construct OAuth URL - ensure API_URL doesn't have trailing slash
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const oauthUrl = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Direct navigation - this bypasses React Router completely
    window.location.href = oauthUrl;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-secondary-yellow dark:bg-gray-900 p-6 max-w-md w-full shadow-lg relative animate-scaleIn mx-4 comic-image"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-primary-pink dark:text-gray-300 hover:text-pink-300 dark:hover:text-white text-xl font-bold"
        >
          ×
        </button>

        <div className="mt-5 mb-3">
          <Header className="text-8xl mb-4 sm:mb-6 text-center">{headerText}</Header>
          <Text className="font-bold pb-2 text-primary-pink text-sm sm:text-base">{bodyText}</Text>

          <div className="flex justify-center">
            <button
              onClick={handleGoogleAuth}
              className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-white text-primary-pink hover:shadow-md active:bg-gray-200 transition-all w-full max-w-xs"
            >
              {/* Google SVG icon */}
              <div className="w-5 h-5 flex-shrink-0">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  style={{ display: "block" }}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="font-medium text-sm sm:text-base">
                Continue with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}