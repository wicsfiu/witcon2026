import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailFromOAuth = searchParams.get('email') || '';

  const API_URL = import.meta.env.VITE_API_URL ||
    ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000/backend-api'
      : 'https://witcon.duckdns.org/backend-api');

  useEffect(() => {
    if (!emailFromOAuth) {
      // No email from OAuth, redirect to home
      navigate('/');
      return;
    }

    // Check if user exists by email
    fetch(`${API_URL}/attendees/by-email/?email=${encodeURIComponent(emailFromOAuth)}`)
      .then(res => {
        if (res.ok) {
          // User exists - log them in
          return res.json();
        } else if (res.status === 404) {
          // User doesn't exist - redirect to registration
          navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`);
          return null;
        } else {
          throw new Error('Failed to check user status');
        }
      })
      .then((data) => {
        if (data) {
          // User exists - store their ID and email, then redirect to profile
          if (data.id) {
            login(data.id, data.email || emailFromOAuth);
          }
          navigate('/profile');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        // On error, redirect to registration
        navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`);
      });
  }, [emailFromOAuth, navigate, login, API_URL]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging you in...</p>
    </div>
  );
}

