import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use local backend for development, production API for deployed frontend
  const API_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8000/backend-api'
      : 'https://witcon.duckdns.org/backend-api');

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirect to backend OAuth endpoint with redirect URI
    const currentUrl = window.location.origin;
    const redirectUri = `${currentUrl}/register`;
    const oauthUrl = `${API_URL}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    // Use window.location.replace to ensure full page navigation (bypasses React Router)
    window.location.replace(oauthUrl);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirect to backend OAuth endpoint with redirect URI for login
    const currentUrl = window.location.origin;
    const redirectUri = `${currentUrl}/login`;
    const oauthUrl = `${API_URL}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    // Use window.location.replace to ensure full page navigation (bypasses React Router)
    window.location.replace(oauthUrl);
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
