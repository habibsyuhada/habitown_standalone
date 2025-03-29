import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../lib/AuthContext';
import { signOut } from '../../store/authSlice';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/habits">My Habits</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/stats">Statistics</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">HabiTown</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/habits">My Habits</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href="/stats">Statistics</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
        {isAuthenticated ? (
          <button 
            onClick={handleSignOut} 
            className="btn btn-ghost ml-2"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/auth" className="btn btn-primary ml-2">
            Login / Register
          </Link>
        )}
      </div>
    </div>
  );
} 