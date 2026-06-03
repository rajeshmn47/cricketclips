import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../actions/userAction';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Safely get login state – adjust the state key if your reducer uses a different name (e.g., 'auth')
  const { loading, error, user } = useSelector(
    (state) => state.userLogin || state.auth || {}
  );

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (user) {
      navigate('/'); // change to your desired route
    }
  }, [user, navigate]);

  // Clear any existing error when user starts typing again
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Optionally dispatch a CLEAR_ERROR action here
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}