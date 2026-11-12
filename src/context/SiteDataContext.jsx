import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SHOP_DATA } from '../data/shopData';
import { COURSES_DATA } from '../data/coursesData';
import { BLOG_DATA } from '../data/blogData';
import { COACHES_DATA } from '../data/coachesData';
import { COURTS_DATA } from '../data/courtsData';
import { DEFAULT_SITE_CONTENT } from '../data/defaultSiteContent';

const STORAGE_KEYS = {
  products: 'apex_cms_products',
  courses: 'apex_cms_courses',
  blogs: 'apex_cms_blogs',
  coaches: 'apex_cms_coaches',
  courts: 'apex_cms_courts',
  siteContent: 'apex_cms_site_content',
  orders: 'apex_orders',
  registrations: 'apex_registrations',
  courtBookings: 'apex_court_bookings',
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read localStorage key "${key}"`, err);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write localStorage key "${key}"`, err);
    return false;
  }
}

function mergeSiteContent(saved) {
  if (!saved || typeof saved !== 'object') return DEFAULT_SITE_CONTENT;
  return {
    home: { ...DEFAULT_SITE_CONTENT.home, ...(saved.home || {}) },
    shop: { ...DEFAULT_SITE_CONTENT.shop, ...(saved.shop || {}) },
    blog: { ...DEFAULT_SITE_CONTENT.blog, ...(saved.blog || {}) },
    about: { ...DEFAULT_SITE_CONTENT.about, ...(saved.about || {}) },
    contact: { ...DEFAULT_SITE_CONTENT.contact, ...(saved.contact || {}) },
  };
}

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [products, setProducts] = useState(() => readStorage(STORAGE_KEYS.products, SHOP_DATA));
  const [courses, setCourses] = useState(() => readStorage(STORAGE_KEYS.courses, COURSES_DATA));
  const [blogs, setBlogs] = useState(() => readStorage(STORAGE_KEYS.blogs, BLOG_DATA));
  const [coaches, setCoaches] = useState(() => readStorage(STORAGE_KEYS.coaches, COACHES_DATA));
  const [courts, setCourts] = useState(() => readStorage(STORAGE_KEYS.courts, COURTS_DATA));
  const [siteContent, setSiteContent] = useState(() =>
    mergeSiteContent(readStorage(STORAGE_KEYS.siteContent, null))
  );

  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, []));
  const [registrations, setRegistrations] = useState(() => readStorage(STORAGE_KEYS.registrations, []));
  const [courtBookings, setCourtBookings] = useState(() => readStorage(STORAGE_KEYS.courtBookings, []));

  // Sync CMS datasets to localStorage
  useEffect(() => {
    writeStorage(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.courses, courses);
  }, [courses]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.blogs, blogs);
  }, [blogs]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.coaches, coaches);
  }, [coaches]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.courts, courts);
  }, [courts]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.siteContent, siteContent);
  }, [siteContent]);

  const refreshOperations = useCallback(() => {
    setOrders(readStorage(STORAGE_KEYS.orders, []));
    setRegistrations(readStorage(STORAGE_KEYS.registrations, []));
    setCourtBookings(readStorage(STORAGE_KEYS.courtBookings, []));
  }, []);

  // Products CRUD
  const addProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      rating: Number(productData.rating) || 5.0,
      reviewsCount: Number(productData.reviewsCount) || 0,
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
      inStock: productData.inStock !== false,
      isFeatured: Boolean(productData.isFeatured),
      specs: productData.specs && Object.keys(productData.specs).length > 0 ? productData.specs : { origin: 'Chính hãng Apex' },
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((productId, updates) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              ...updates,
              price: updates.price !== undefined ? Number(updates.price) : item.price,
              originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : item.originalPrice,
              rating: updates.rating !== undefined ? Number(updates.rating) : item.rating,
              reviewsCount: updates.reviewsCount !== undefined ? Number(updates.reviewsCount) : item.reviewsCount,
            }
          : item
      )
    );
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Courses CRUD
  const addCourse = useCallback((courseData) => {
    const newCourse = {
      ...courseData,
      id: courseData.id || `course-${Date.now()}`,
      price: Number(courseData.price) || 0,
      originalPrice: Number(courseData.originalPrice) || Number(courseData.price) || 0,
      highlights: Array.isArray(courseData.highlights) ? courseData.highlights : [],
      curriculum: Array.isArray(courseData.curriculum) ? courseData.curriculum : [],
    };
    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  }, []);

  const updateCourse = useCallback((courseId, updates) => {
    setCourses((prev) =>
      prev.map((item) =>
        item.id === courseId
          ? {
              ...item,
              ...updates,
              price: updates.price !== undefined ? Number(updates.price) : item.price,
              originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : item.originalPrice,
            }
          : item
      )
    );
  }, []);

  const deleteCourse = useCallback((courseId) => {
    setCourses((prev) => prev.filter((item) => item.id !== courseId));
  }, []);

  // Blogs CRUD
  const addBlog = useCallback((blogData) => {
    const newBlog = {
      ...blogData,
      id: blogData.id || `blog-${Date.now()}`,
      date: blogData.date || new Date().toLocaleDateString('vi-VN'),
    };
    setBlogs((prev) => [newBlog, ...prev]);
    return newBlog;
  }, []);

  const updateBlog = useCallback((blogId, updates) => {
    setBlogs((prev) => prev.map((item) => (item.id === blogId ? { ...item, ...updates } : item)));
  }, []);

  const deleteBlog = useCallback((blogId) => {
    setBlogs((prev) => prev.filter((item) => item.id !== blogId));
  }, []);

  // Coaches CRUD
  const addCoach = useCallback((coachData) => {
    const newCoach = {
      ...coachData,
      id: coachData.id || `coach-${Date.now()}`,
    };
    setCoaches((prev) => [...prev, newCoach]);
    return newCoach;
  }, []);

  const updateCoach = useCallback((coachId, updates) => {
    setCoaches((prev) => prev.map((item) => (item.id === coachId ? { ...item, ...updates } : item)));
  }, []);

  const deleteCoach = useCallback((coachId) => {
    setCoaches((prev) => prev.filter((item) => item.id !== coachId));
  }, []);

  // Courts update
  const updateCourt = useCallback((courtId, updates) => {
    setCourts((prev) =>
      prev.map((item) =>
        item.id === courtId
          ? {
              ...item,
              ...updates,
              hourlyRateOffPeak:
                updates.hourlyRateOffPeak !== undefined ? Number(updates.hourlyRateOffPeak) : item.hourlyRateOffPeak,
              hourlyRatePeak:
                updates.hourlyRatePeak !== undefined ? Number(updates.hourlyRatePeak) : item.hourlyRatePeak,
            }
          : item
      )
    );
  }, []);

  // Site Content update
  const updateSiteContentSection = useCallback((section, sectionData) => {
    setSiteContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...sectionData,
      },
    }));
  }, []);

  // Operational records management (Orders / Registrations / Court Bookings)
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.orderId === orderId ? { ...o, status } : o));
      writeStorage(STORAGE_KEYS.orders, next);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.orderId !== orderId);
      writeStorage(STORAGE_KEYS.orders, next);
      return next;
    });
  }, []);

  const updateRegistrationStatus = useCallback((bookingCode, status) => {
    setRegistrations((prev) => {
      const next = prev.map((r) => (r.bookingCode === bookingCode ? { ...r, status } : r));
      writeStorage(STORAGE_KEYS.registrations, next);
      return next;
    });
  }, []);

  const deleteRegistration = useCallback((bookingCode) => {
    setRegistrations((prev) => {
      const next = prev.filter((r) => r.bookingCode !== bookingCode);
      writeStorage(STORAGE_KEYS.registrations, next);
      return next;
    });
  }, []);

  const updateCourtBookingStatus = useCallback((ticketCode, status) => {
    setCourtBookings((prev) => {
      const next = prev.map((c) => (c.ticketCode === ticketCode ? { ...c, status } : c));
      writeStorage(STORAGE_KEYS.courtBookings, next);
      return next;
    });
  }, []);

  const deleteCourtBooking = useCallback((ticketCode) => {
    setCourtBookings((prev) => {
      const next = prev.filter((c) => c.ticketCode !== ticketCode);
      writeStorage(STORAGE_KEYS.courtBookings, next);
      return next;
    });
  }, []);

  // Reset & Backup
  const resetAllCmsData = useCallback(() => {
    setProducts(SHOP_DATA);
    setCourses(COURSES_DATA);
    setBlogs(BLOG_DATA);
    setCoaches(COACHES_DATA);
    setCourts(COURTS_DATA);
    setSiteContent(DEFAULT_SITE_CONTENT);
  }, []);

  const exportCmsSnapshot = useCallback(() => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        products,
        courses,
        blogs,
        coaches,
        courts,
        siteContent,
      },
      null,
      2
    );
  }, [products, courses, blogs, coaches, courts, siteContent]);

  const importCmsSnapshot = useCallback((jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed.products)) setProducts(parsed.products);
      if (Array.isArray(parsed.courses)) setCourses(parsed.courses);
      if (Array.isArray(parsed.blogs)) setBlogs(parsed.blogs);
      if (Array.isArray(parsed.coaches)) setCoaches(parsed.coaches);
      if (Array.isArray(parsed.courts)) setCourts(parsed.courts);
      if (parsed.siteContent) setSiteContent(mergeSiteContent(parsed.siteContent));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'File JSON không hợp lệ' };
    }
  }, []);

  const value = {
    products,
    courses,
    blogs,
    coaches,
    courts,
    siteContent,
    orders,
    registrations,
    courtBookings,
    refreshOperations,
    addProduct,
    updateProduct,
    deleteProduct,
    addCourse,
    updateCourse,
    deleteCourse,
    addBlog,
    updateBlog,
    deleteBlog,
    addCoach,
    updateCoach,
    deleteCoach,
    updateCourt,
    updateSiteContentSection,
    updateOrderStatus,
    deleteOrder,
    updateRegistrationStatus,
    deleteRegistration,
    updateCourtBookingStatus,
    deleteCourtBooking,
    resetAllCmsData,
    exportCmsSnapshot,
    importCmsSnapshot,
  };

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used inside SiteDataProvider');
  }
  return ctx;
}
