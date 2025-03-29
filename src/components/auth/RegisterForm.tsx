import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signUpWithEmail } from '../../store/authSlice';
import { AppDispatch } from '../../store';

interface RegisterFormProps {
  onToggleForm: () => void;
}

export default function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await dispatch(signUpWithEmail({ email, password }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div className="card-body">
        <h1 className="text-2xl font-bold text-center">Register</h1>
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="confirm password"
              className="input input-bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Already have an account? 
            <button 
              onClick={onToggleForm} 
              className="text-primary btn-link ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 