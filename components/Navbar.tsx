import React, { useState } from 'react';
import { Home, Globe, LogIn, LogOut, Menu, X } from 'lucide-react';
import { User } from 'firebase/auth';
import { Language, TranslationData } from '../types';

interface NavbarProps {
  user: User | null;
  lang: Language;
  t: TranslationData;
  onToggleLang: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, lang, t, onToggleLang, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.isAnonymous) return t.guestName;
    return user.displayName ? user.displayName.split(' ')[0] : t.guestName;
  };

  const getUserFullName = () => {
    if (!user) return '';
    if (user.isAnonymous) return t.guestName;
    return user.displayName || t.guestName;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-teal-600 text-white p-2 rounded-lg">
              <Home size={24} />
            </div>
            <span className="text-xl font-bold text-teal-800 tracking-tight">BaleCare</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('services')} className="hover:text-teal-600 transition text-gray-600 font-medium">
              {t.servicesTitle}
            </button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-teal-600 transition text-gray-600 font-medium">
              {t.testimoniTitle}
            </button>

            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-50 text-sm font-medium"
            >
              <Globe size={14} />
              {lang === 'id' ? 'EN' : 'ID'}
            </button>

            {/* Auth Button Desktop */}
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                    {getUserDisplayName().charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium hidden lg:block text-gray-700">
                  {getUserDisplayName()}
                </span>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  title={t.logoutBtn}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-teal-600 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-600/20 flex items-center gap-2"
              >
                <LogIn size={16} /> {t.loginBtn}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs border border-teal-200">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="U" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getUserDisplayName().charAt(0)
                )}
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-lg animate-fade-in-up">
          {user ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                  {getUserDisplayName().charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{getUserFullName()}</p>
                <p className="text-xs text-gray-500">{user.isAnonymous ? 'Guest Mode' : user.email}</p>
              </div>
              <button onClick={onLogout} className="p-2 text-red-500 bg-red-50 rounded-full">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onLogin(); setIsMenuOpen(false); }}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mb-4 flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> {t.loginBtn}
            </button>
          )}

          <button 
            onClick={() => { scrollToSection('services'); setIsMenuOpen(false); }} 
            className="block w-full text-left py-2 text-gray-600 font-medium hover:text-teal-600"
          >
            {t.servicesTitle}
          </button>
          <button 
            onClick={() => { scrollToSection('reviews'); setIsMenuOpen(false); }} 
            className="block w-full text-left py-2 text-gray-600 font-medium hover:text-teal-600"
          >
            {t.testimoniTitle}
          </button>
          <button onClick={onToggleLang} className="flex items-center gap-2 py-2 text-gray-600 font-medium w-full text-left">
            <Globe size={18} /> {lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;