import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../actions/userAction';
import { clearErrors } from '../actions/userAction';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const { loading, success, error } = useSelector((state) => state.userRegister || {});

    // Show toast on success or error
    useEffect(() => {
        if (success) {
            toast.success('Registration successful! Redirecting to login...');
            const timer = setTimeout(() => navigate('/login'), 1500);
            return () => clearTimeout(timer);
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) dispatch(clearErrors());
        if (passwordError) setPasswordError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, email, phoneNumber, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            return;
        }

        dispatch(register({ username, email, phoneNumber, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {/* Inline error/success messages (optional; toasts already shown) */}
                {error && (
                    <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 rounded">
                        ✅ Registration successful! Redirecting to login...
                    </div>
                )}

                <div className="mb-3">
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <Input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {passwordError && (
                    <div className="mb-3 text-sm text-red-600">{passwordError}</div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating account...' : 'Register'}
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}