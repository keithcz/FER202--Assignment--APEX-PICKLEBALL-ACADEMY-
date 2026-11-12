import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ModalAuth from './components/ModalAuth';
import CartDrawer from './components/CartDrawer';
import { SiteDataProvider } from './context/SiteDataContext';
import { isAdminUser } from './utils/auth';

import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourtBookingPage from './pages/CourtBookingPage';
import ShopPage from './pages/ShopPage';
import BlogPage from './pages/BlogPage';
import AboutContactPage from './pages/AboutContactPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [dashboardSubTab, setDashboardSubTab] = useState('courses');
  const [selectedCourseForRegister, setSelectedCourseForRegister] = useState(null);
  const [aboutSection, setAboutSection] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('student');

  useEffect(() => {
    const savedUser = localStorage.getItem('apex_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  const openAuthModal = (role = 'student') => {
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  // Cart operations
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_user');
    setCurrentUser(null);
    if (activeTab === 'dashboard' || activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const handleOpenAdmin = () => {
    if (isAdminUser(currentUser)) {
      setActiveTab('admin');
    } else {
      openAuthModal('admin');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeTab !== 'dashboard') {
      setDashboardSubTab('courses');
    }
  }, [activeTab]);

  return (
    <SiteDataProvider>
      <div className="min-h-screen bg-[#FAFBF9] text-[#11181C] flex flex-col font-sans selection:bg-[#B6F05C] selection:text-[#11181C]">
        {/* Sleek Floating Glass Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          setIsCartOpen={setIsCartOpen}
          currentUser={currentUser}
          setIsAuthOpen={() => openAuthModal('student')}
          onLogout={handleLogout}
          onSelectCourse={(courseId) => {
            setSelectedCourseForRegister(courseId);
            setActiveTab('courses');
          }}
          setAboutSection={setAboutSection}
        />

        {/* Main Page Content */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomePage
              setActiveTab={setActiveTab}
              setSelectedCourseForRegister={setSelectedCourseForRegister}
            />
          )}

          {(activeTab === 'courses' || activeTab === 'booking') && (
            <CoursesPage
              selectedCourseId={selectedCourseForRegister}
              setSelectedCourseForRegister={setSelectedCourseForRegister}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'courts' && <CourtBookingPage setActiveTab={setActiveTab} />}

          {activeTab === 'shop' && (
            <ShopPage
              addToCart={addToCart}
              setIsCartOpen={setIsCartOpen}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'blog' && <BlogPage />}

          {activeTab === 'about' && <AboutContactPage scrollToSection={aboutSection} clearScrollSection={() => setAboutSection(null)} />}

          {activeTab === 'dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              initialSubTab={dashboardSubTab}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPage
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              onOpenAdminLogin={() => openAuthModal('admin')}
            />
          )}
        </main>

        {/* Modern Enode Footer */}
        <Footer setActiveTab={setActiveTab} onOpenAdmin={handleOpenAdmin} />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          updateQuantity={updateCartQuantity}
          removeItem={removeCartItem}
          clearCart={clearCart}
          currentUser={currentUser}
          onViewOrders={() => {
            setDashboardSubTab('orders');
            setIsCartOpen(false);
            setActiveTab('dashboard');
          }}
        />

        {/* Auth Modal */}
        <ModalAuth
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialRole={authInitialRole}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (isAdminUser(user)) {
              setActiveTab('admin');
            }
          }}
        />
      </div>
    </SiteDataProvider>
  );
}
