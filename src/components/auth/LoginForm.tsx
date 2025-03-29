import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmail } from '../../store/authSlice';
import { AppDispatch } from '../../store';

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await dispatch(signInWithEmail({ email, password }));
    } catch {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div className="card-body">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Don&apos;t have an account? 
            <button 
              onClick={onToggleForm} 
              className="text-primary btn-link ml-1"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 