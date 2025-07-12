import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Budgets from './pages/Budgets';
import GroupBudgets from './pages/GroupBudgets';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import { RecurringTransactions } from './pages/RecurringTransactions';
import AIRecommendations from './pages/AIRecommendations';
import UserPreferences from './pages/UserPreferences';
import EWalletIntegration from './pages/EWalletIntegration';
import PaymentGateway from './pages/PaymentGateway';
import DataImportExport from './pages/DataImportExport';
import ExternalServices from './pages/ExternalServices';
import SecuritySettings from './pages/SecuritySettings';
import { Toaster } from 'sonner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <Router>
      <Routes>
        <Route path="/analytics-test" element={<Analytics />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="/budgets" element={
                <ProtectedRoute>
                  <Budgets />
                </ProtectedRoute>
              } />
              <Route path="/group-budgets" element={
                <ProtectedRoute>
                  <GroupBudgets />
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/chatbot" element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              } />
              <Route path="/ai-recommendations" element={
                <ProtectedRoute>
                  <AIRecommendations />
                </ProtectedRoute>
              } />
              <Route path="/preferences" element={
                <ProtectedRoute>
                  <UserPreferences />
                </ProtectedRoute>
              } />
              <Route path="/e-wallet-integration" element={
                <ProtectedRoute>
                  <EWalletIntegration />
                </ProtectedRoute>
              } />
              <Route path="/payment-gateway" element={
                <ProtectedRoute>
                  <PaymentGateway />
                </ProtectedRoute>
              } />
              <Route path="/data-import-export" element={
                <ProtectedRoute>
                  <DataImportExport />
                </ProtectedRoute>
              } />
              <Route path="/external-services" element={
                <ProtectedRoute>
                  <ExternalServices />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SecuritySettings />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AppProvider>
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </AppProvider>
  );
};

export default App;