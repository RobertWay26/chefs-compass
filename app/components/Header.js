'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-primary shadow-md z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-background">Chef's Compass</h1>
        
        <nav className="flex space-x-4 mt-2">
          <Link href="/" className="text-lg text-background hover:text-highlight">
            Home
          </Link>
          <Link href="/posted-recipes" className="text-lg text-background hover:text-highlight">
            Posted Recipes
          </Link>
          {user && (
            <Link href="/saved-recipes" className="text-lg text-background hover:text-highlight">
              Saved Recipes
            </Link>
          )}
        </nav>
      </div>

      <div className="absolute top-3 right-4">
        {user ? (
          <button
            onClick={logout}
            className="bg-accent text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition-colors"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;