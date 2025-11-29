import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use local backend for development, production API for deployed frontend
  // Ensure VITE_API_URL is not an empty string
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

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Redirect to backend OAuth endpoint with redirect URI
    const currentUrl = window.location.origin;
    const redirectUri = `${currentUrl}/register`;
    // Construct OAuth URL - ensure API_URL doesn't have trailing slash
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const oauthUrl = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Direct navigation - this bypasses React Router completely
    window.location.href = oauthUrl;
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Redirect to backend OAuth endpoint with redirect URI for login
    const currentUrl = window.location.origin;
    const redirectUri = `${currentUrl}/login`;
    // Construct OAuth URL - ensure API_URL doesn't have trailing slash
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const oauthUrl = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Debug log (remove in production if needed)
    console.log('OAuth URL:', oauthUrl);
    
    // Direct navigation - this bypasses React Router completely
    window.location.href = oauthUrl;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">WiTCON</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        {!userId && (
          <>
            <button onClick={handleLoginClick} className="hover:text-gray-300 bg-transparent border-none cursor-pointer text-white">
              Login
            </button>
            <button onClick={handleRegisterClick} className="hover:text-gray-300 bg-transparent border-none cursor-pointer text-white">
              Register
            </button>
          </>
        )}
        {userId && (
          <>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <button 
              onClick={handleLogout} 
              className="hover:text-gray-300 bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
