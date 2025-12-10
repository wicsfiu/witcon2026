import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailFromOAuth = searchParams.get('email') || '';
  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';

  const API_URL = getApiUrl();

  useEffect(() => {
    // Use tokens from OAuth redirect if available
    if (accessToken && refreshToken && emailFromOAuth) {
      // Get user info to get the ID
      fetch(`${API_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailFromOAuth }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.attendee_id) {
            // Use tokens from URL
            login(accessToken, refreshToken, data.attendee_id, emailFromOAuth);
            // Clean up URL params
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('email');
            newSearchParams.delete('access_token');
            newSearchParams.delete('refresh_token');
            const newUrl = window.location.pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : '');
            window.history.replaceState({}, '', newUrl);
            // Redirect to profile
            navigate('/profile', { replace: true });
          }
        })
        .catch(err => {
          console.error('Login error:', err);
          // Fallback: try to get token by email
          fetch(`${API_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailFromOAuth }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.access_token && data.attendee_id) {
                login(data.access_token, data.refresh_token, data.attendee_id, emailFromOAuth);
                navigate('/profile', { replace: true });
              } else {
                navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`, { replace: true });
              }
            })
            .catch(() => {
              navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`, { replace: true });
            });
        });
      return;
    }

    // If we only have email (legacy flow), check if user exists
    if (emailFromOAuth && !accessToken) {
      fetch(`${API_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailFromOAuth }),
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 404) {
            // User doesn't exist - redirect to registration
            navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`, { replace: true });
            return null;
          } else {
            throw new Error('Failed to get token');
          }
        })
        .then((data) => {
          if (data && data.access_token && data.attendee_id) {
            // User exists - log them in with tokens
            login(data.access_token, data.refresh_token, data.attendee_id, data.email || emailFromOAuth);
            navigate('/profile', { replace: true });
          }
        })
        .catch(err => {
          console.error('Login error:', err);
          // On error, redirect to registration
          navigate(`/register?email=${encodeURIComponent(emailFromOAuth)}`, { replace: true });
        });
      return;
    }

    // No email or tokens, redirect to home
    if (!emailFromOAuth && !accessToken) {
      navigate('/');
    }
  }, [emailFromOAuth, accessToken, refreshToken, navigate, login, API_URL, searchParams]);

  return null;
}

