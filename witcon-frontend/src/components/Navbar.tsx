import { Link } from "react-router-dom";

export default function Navbar() {
  // Use local backend for development, production API for deployed frontend
  const API_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8000/backend-api'
      : 'https://witcon.duckdns.org/backend-api');

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Redirect to backend OAuth endpoint with redirect URI
    const currentUrl = window.location.origin;
    const redirectUri = `${currentUrl}/register`;
    const oauthUrl = `${API_URL}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = oauthUrl;
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">WiTCON</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <a href="#" onClick={handleRegisterClick} className="hover:text-gray-300">Register</a>
        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
      </div>
    </nav>
  );
}
