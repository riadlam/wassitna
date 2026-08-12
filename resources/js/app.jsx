import '../css/brand.css';
import '../css/webapp.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import Contact from './pages/Contact';
import ContentPage from './pages/ContentPage';
import Help from './pages/Help';
import FeeCalculator from './pages/FeeCalculator';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StartTransaction from './pages/StartTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Transactions from './pages/Transactions';
import Withdrawals from './pages/Withdrawals';

createRoot(document.getElementById('app')).render(
    <StrictMode>
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/partners" element={<ContentPage pageKey="partners" />} />
                    <Route path="/transaction-types" element={<ContentPage pageKey="transaction-types" />} />
                    <Route path="/transaction-types/domain-names" element={<ContentPage pageKey="domain-names" />} />
                    <Route path="/transaction-types/motor-vehicles" element={<ContentPage pageKey="motor-vehicles" />} />
                    <Route path="/transaction-types/merchandise" element={<ContentPage pageKey="merchandise" />} />
                    <Route path="/transaction-types/milestone" element={<ContentPage pageKey="milestone" />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/careers" element={<ContentPage pageKey="careers" />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/press" element={<ContentPage pageKey="press" />} />
                    <Route path="/fees" element={<Navigate to="/transactions/fees" replace />} />
                    <Route path="/fee-calculator" element={<Navigate to="/transactions/fees" replace />} />
                    <Route path="/security" element={<ContentPage pageKey="security" />} />
                    <Route path="/licenses" element={<ContentPage pageKey="licenses" />} />
                    <Route path="/pay" element={<ContentPage pageKey="pay" />} />
                    <Route path="/offer" element={<ContentPage pageKey="offer" />} />
                    <Route path="/api" element={<ContentPage pageKey="api" />} />
                    <Route path="/legal/terms" element={<ContentPage pageKey="terms" />} />
                    <Route path="/legal/privacy" element={<ContentPage pageKey="privacy" />} />
                    <Route path="/legal/cookies" element={<ContentPage pageKey="cookies" />} />
                </Route>
                <Route path="/start-transaction" element={<Navigate to="/transactions/start" replace />} />
                <Route
                    path="/transactions/start"
                    element={
                        <RequireAuth>
                            <StartTransaction />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/transaction/:transactionId"
                    element={
                        <RequireAuth>
                            <TransactionDetail />
                        </RequireAuth>
                    }
                />
                <Route
                    element={
                        <RequireAuth>
                            <AppShell />
                        </RequireAuth>
                    }
                >
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/withdrawals" element={<Withdrawals />} />
                    <Route path="/transactions/fees" element={<FeeCalculator />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
