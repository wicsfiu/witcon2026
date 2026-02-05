import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {useState, useRef, useEffect} from "react";


export default function Navbar() {
  // const { userId, logout } = useAuth();
  // const navigate = useNavigate();


  // const getApiUrl = () => {
  //   const envUrl = import.meta.env.VITE_API_URL;
  //   if (envUrl && envUrl.trim() !== "") return envUrl;
  //   if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  //     return "http://localhost:8000/backend-api";
  //   }
  //   return "https://witcon.duckdns.org/backend-api";
  // };


  // const API_URL = getApiUrl();


  // const handleRegisterClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   try {
  //     // Redirect to backend OAuth endpoint with redirect URI
  //     const currentUrl = window.location.origin;
  //     const redirectUri = `${currentUrl}/register`;


  //     // Construct OAuth URL - ensure API_URL doesn't have trailing slash
  //     const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  //     const oauthUrl = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
  //     window.location.href = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
  //     console.log('Register clicked - OAuth URL:', oauthUrl);
     
  //     // Direct navigation - this bypasses React Router completely
  //     window.location.href = oauthUrl;
  //   } catch (error) {
  //     console.error('Error in handleRegisterClick:', error);
  //   }
  // };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  




};

  // const handleLoginClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const currentUrl = window.location.origin;
  //   const redirectUri = `${currentUrl}/login`;
  //   const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  //   window.location.href = `${baseUrl}/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}`;
  // };


  // const handleLogout = () => {


  //   logout();
  //   window.location.href = '/';
  // };


  return (
    <nav className="sticky top-0 z-50 bg-primary-pink text-tertiary-yellow px-6 py-3 shadow-md font-actor text-lg">
      <div className="flex items-center justify-between mx-auto w-full">
        {/* Left: Logo */}
        <Link to="/">
          <img src="/witcon-logo.png" alt="WiTCON Logo" className="h-10 w-auto pr-4" />
        </Link>

        {/* Center: Links */}
        <div className="flex space-x-4 justify-center flex-1">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-secondary-mint bg-transparent border-none cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-secondary-mint bg-transparent border-none cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-secondary-mint bg-transparent border-none cursor-pointer"
          >
            FAQ
          </button>

          {/* Register Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() =>{
                console.log('Dropdown toggle clicked');
                setIsDropdownOpen(!isDropdownOpen)}}
              className="hover:text-secondary-mint bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              Register
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-primary-pink border-2 shadow-lg min-w-[150px] z-50">
                
                <a  href="https://luma.com/krgt285e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-primary-pink hover:bg-secondary-mint hover:text-primary-pink transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  WiTCON
                </a>
                
                <a  href="https://airtable.com/appkju2gzzjQtCRbp/pagoyadOZvoKnq8qi/form"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-primary-pink hover:bg-secondary-mint hover:text-primary-pink transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Tech Showcase
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right: Empty div to balance flex layout */}
        <div className="w-10" />
      </div>
    </nav>
  );
}