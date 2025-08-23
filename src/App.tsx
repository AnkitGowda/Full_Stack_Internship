import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionsBySchool from './pages/TransactionsBySchool';
import TransactionStatus from './pages/TransactionStatus';
import CreatePayment from './pages/CreatePayment';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transactions/school" element={
                <ProtectedRoute>
                  <Layout>
                    <TransactionsBySchool />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transaction-status" element={
                <ProtectedRoute>
                  <Layout>
                    <TransactionStatus />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/create-payment" element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePayment />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;