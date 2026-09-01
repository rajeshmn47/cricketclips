import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../actions/userAction';
import { clearErrors } from '../actions/userAction';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'; // if you have lucide-react installed
// If you don't have lucide-react, you can use simple emojis or remove icons

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        appType: 'cricketclips',
    });

    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        const { username, email, phoneNumber, password, confirmPassword, appType } = formData;

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

        dispatch(register({ username, email, phoneNumber, password, appType }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Optional: Branding header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        🏏 CricketClips
                    </h1>
                    <p className="text-gray-500 mt-1">Create your account to get started</p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/30 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>

                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200 flex items-center gap-2">
                            <span>❌</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-xl border border-green-200 flex items-center gap-2">
                            <span>✅</span> Registration successful! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="pl-10 py-3 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="pl-10 py-3 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="pl-10 py-3 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-3 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-3 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {passwordError && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{passwordError}</div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="text-center mt-6 text-xs text-gray-400">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
}