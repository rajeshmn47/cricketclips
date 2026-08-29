import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ShieldCheck, BarChart3, PlayCircle, ArrowRight } from 'lucide-react';
import { login } from '../actions/userAction';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, user } = useSelector(
    (state) => state.userLogin || state.auth || {}
  );

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-sky-100/60">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden lg:block bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_40%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <PlayCircle size={16} />
                  Cricket Clips
                </div>
                <h1 className="mt-8 text-4xl font-black leading-tight">
                  Turn match moments into instant insights.
                </h1>
              </div>

              <div className="space-y-5">
                {[
                  { icon: BarChart3, label: 'AI search and smart filters' },
                  { icon: ShieldCheck, label: 'Secure access to your clips and playlists' },
                  { icon: LogIn, label: 'Fast workflow for creators and analysts' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <div className="rounded-xl bg-white/10 p-2">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-blue-50">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Welcome back</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Login to your account</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Access your cricket clips, playlists, and analytics dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-6 h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
                <span>New here?</span>
                <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
                  Create account
                  <ArrowRight size={14} />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}