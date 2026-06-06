import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VendorScreen from './pages/VendorScreen';
import RFQScreen from './pages/RFQScreen';
import QuotationScreen from './pages/QuotationScreen';
import ApprovalScreen from './pages/ApprovalScreen';
import POScreen from './pages/POScreen';
import InvoiceScreen from './pages/InvoiceScreen';
import Landing from './pages/Landing';
import Activity from './pages/Activity';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><h1>LOADING...</h1></div>;
  if (!user) return <Navigate to="/landing" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="vendors" element={<VendorScreen />} />
        <Route path="rfqs" element={<RFQScreen />} />
        <Route path="quotations" element={<QuotationScreen />} />
        <Route path="approvals" element={<ApprovalScreen />} />
        <Route path="pos" element={<POScreen />} />
        <Route path="invoices" element={<InvoiceScreen />} />
        <Route path="activity" element={<Activity />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
