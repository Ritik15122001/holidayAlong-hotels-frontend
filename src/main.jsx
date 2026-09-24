import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import RequireAuth from './components/RequireAuth.jsx';

const Hotels = lazy(() => import('./pages/Hotels.jsx'));
const HotelDetails = lazy(() => import('./pages/HotelDetails.jsx'));
const EnquirySuccess = lazy(() => import('./pages/EnquirySuccess.jsx'));
const Packages = lazy(() => import('./pages/Packages.jsx'));
const Formats = lazy(() => import('./pages/Formats.jsx'));
const VendorsPage = lazy(() => import('./pages/Vendors.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

const Loading = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Suspense fallback={<Loading />}><Hotels /></Suspense>} />
          <Route path="/hotels/:id" element={<Suspense fallback={<Loading />}><HotelDetails /></Suspense>} />
          <Route path="/enquiry-success" element={<Suspense fallback={<Loading />}><EnquirySuccess /></Suspense>} />
          <Route path="/packages" element={<Suspense fallback={<Loading />}><Packages /></Suspense>} />
          <Route path="/formats" element={<Suspense fallback={<Loading />}><Formats /></Suspense>} />
          <Route path="/vendors" element={<Suspense fallback={<Loading />}><VendorsPage /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
