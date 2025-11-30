import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  MessageCircle, 
  ArrowRight, 
  Phone, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  Info,
  X,
  Send,
  Home
} from 'lucide-react';
import { User } from 'firebase/auth';

import { loginWithGoogle, loginAnonymously, logoutUser, subscribeToAuthChanges } from './services/firebase';
import { TRANSLATIONS, SERVICES_DATA, INITIAL_REVIEWS } from './constants';
import { Language, ServiceItem, FormData, Review } from './types';

import Navbar from './components/Navbar';
import AiTools from './components/AiTools';
import BookingModal from './components/BookingModal';

export default function BaleCareApp() {
  const [lang, setLang] = useState<Language>('id');
  const [user, setUser] = useState<User | null>(null);
  
  // UI States
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuestNotification, setShowGuestNotification] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Data States
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReview, setNewReview] = useState<{name: string, text: string, rating: number}>({ name: '', text: '', rating: 5 });
  const [bookingData, setBookingData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    date: '',
    description: ''
  });

  const t = TRANSLATIONS[lang];

  // Auth Listener
  useEffect(() => {
    // Use the safe subscriber from services/firebase
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const displayName = currentUser.displayName || (lang === 'id' ? 'Tamu' : 'Guest');
        setBookingData(prev => ({ ...prev, name: displayName }));
        setNewReview(prev => ({ ...prev, name: displayName }));
      }
    });
    return () => unsubscribe();
  }, [lang]);

  // Auth Handlers
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.warn("Login error:", error.code || error.message);
      
      // Handle missing configuration gracefully
      if (error.message === 'auth/configuration-not-found') {
        alert("Authentication is currently unavailable (Missing API Config). You can still browse the app!");
        return;
      }

      // Handle domain restrictions (common in previews)
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
        try {
          await loginAnonymously();
          setShowGuestNotification(true);
        } catch (anonError) {
           console.error("Guest login failed:", anonError);
        }
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setBookingData(prev => ({ ...prev, name: '' }));
    setNewReview(prev => ({ ...prev, name: '' }));
  };

  // Interactions
  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (data: FormData) => {
    // In a real app, send to backend here
    setTimeout(() => {
      setShowBookingModal(false);
      setShowSuccess(true);
      setBookingData({ name: user?.displayName || (user?.isAnonymous ? t.guestName : ''), phone: '', address: '', date: '', description: '' });
    }, 1000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    const reviewToAdd: Review = {
      name: newReview.name,
      role: lang === 'id' ? 'Pelanggan Baru' : 'Verified Customer',
      text: newReview.text,
      rating: newReview.rating
    };

    setReviews([reviewToAdd, ...reviews]);
    setShowReviewModal(false);
    
    const defaultName = user ? (user.displayName || (user.isAnonymous ? t.guestName : '')) : '';
    setNewReview({ name: defaultName, text: '', rating: 5 });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar 
        user={user} 
        lang={lang} 
        t={t} 
        onToggleLang={() => setLang(prev => prev === 'id' ? 'en' : 'id')}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <div className="relative bg-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 text-center md:text-left">
          <div className="md:w-2/3">
            <div className="inline-flex items-center gap-2 bg-teal-800/50 px-4 py-1 rounded-full text-teal-200 text-sm font-medium mb-6 border border-teal-700">
              <ShieldCheck size={16} /> Verified & Professional Partners
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-400 text-teal-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-300 transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
              >
                {t.ctaButton} <ArrowRight size={20}/>
              </button>
              <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition">
                WhatsApp Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools */}
      <AiTools 
        t={t} 
        lang={lang} 
        onBookRecommended={(desc) => {
          setBookingData(prev => ({ ...prev, description: desc }));
          setSelectedService(null);
          setShowBookingModal(true);
        }} 
      />

      {/* Services Grid */}
      <div id="services" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.servicesTitle}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.servicesSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {SERVICES_DATA.map((service) => (
            <div 
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${service.color} group-hover:scale-110 transition`}>
                <service.icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t.categories[service.id]}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{service.price}</p>
              <div className="text-teal-600 text-sm font-medium flex items-center gap-1">
                Book Now <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features / Why Us */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t.whyUsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm group hover:shadow-md transition-all duration-300">
              <ShieldCheck className="text-teal-600 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" size={40} />
              <h3 className="text-xl font-bold mb-2">Verified Partners</h3>
              <p className="text-gray-600">All workers have passed background checks (KTP & SKCK) for your safety.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm group hover:shadow-md transition-all duration-300">
              <MapPin className="text-teal-600 mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300" size={40} />
              <h3 className="text-xl font-bold mb-2">Bali Local Experts</h3>
              <p className="text-gray-600">We understand Bali's climate, architecture, and logistics deeply.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm group hover:shadow-md transition-all duration-300">
              <MessageCircle className="text-teal-600 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" size={40} />
              <h3 className="text-xl font-bold mb-2">Bilingual Support</h3>
              <p className="text-gray-600">Communication is key. Our CS speaks fluent Indonesian and English.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="reviews" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-4">
          <div className="text-center md:text-left w-full">
            <h2 className="text-3xl font-bold text-center md:text-left mb-2">{t.testimoniTitle}</h2>
            <div className="flex items-center justify-center md:justify-start gap-1">
               <span className="font-bold text-amber-500 text-xl">4.9</span>
               <div className="flex text-amber-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
               </div>
               <span className="text-gray-400 text-sm">({reviews.length} Reviews)</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowReviewModal(true)}
            className="whitespace-nowrap flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full hover:bg-gray-50 transition shadow-sm font-medium"
          >
            <PlusCircle size={18} /> {t.addReviewBtn}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                      className={i < review.rating ? "text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-300 font-mono">Verified</span>
              </div>
              <p className="text-gray-600 italic mb-6 line-clamp-4">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                  ${idx % 3 === 0 ? 'bg-teal-500' : idx % 3 === 1 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                >
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center md:text-left">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="bg-white text-teal-900 p-1.5 rounded">
                  <Home size={20} />
                </div>
                <span className="text-xl font-bold">BaleCare</span>
              </div>
              <p className="text-teal-200 mb-4 max-w-sm mx-auto md:mx-0">
                The #1 On-demand home service app in Bali. Trusted by locals and expats.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-teal-200 text-sm">support@balecare.com</p>
              <p className="text-teal-200 text-sm">+62 812 3456 7890</p>
              <p className="text-teal-200 text-sm">Jl. Sunset Road No. 88, Kuta</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-teal-200 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Partner Registration</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-800 pt-8 text-center text-teal-400 text-sm">
            &copy; 2024 BaleCare Bali. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          t={t}
          service={selectedService}
          initialData={bookingData}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg">{t.reviewModalTitle}</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-6">
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`transform transition hover:scale-110 ${star <= newReview.rating ? 'text-amber-400' : 'text-gray-200'}`}
                    >
                      <Star size={36} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <input 
                  required 
                  type="text" 
                  placeholder={t.reviewNamePlaceholder}
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <textarea 
                  required 
                  rows={3}
                  placeholder={t.reviewTextPlaceholder}
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
                <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2">
                  {t.submitReviewBtn} <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Login Notification */}
      {showGuestNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative">
            <button 
              onClick={() => setShowGuestNotification(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.guestLoginTitle}</h3>
            <p className="text-gray-600 mb-6 text-sm">{t.guestLoginMsg}</p>
            <button 
              onClick={() => setShowGuestNotification(false)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center animate-scale-in shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} className="animate-check-pop" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
            <p className="text-gray-500 mb-6">{t.successMsg}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowSuccess(false); setShowReviewModal(true); }} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition flex justify-center items-center gap-2">
                 <Star size={18} /> {t.reviewSuccessBtn}
              </button>
              <button onClick={() => setShowSuccess(false)} className="w-full bg-transparent border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40 flex items-center gap-2 group"
      >
        <Phone size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          Chat Us
        </span>
      </a>

    </div>
  );
}