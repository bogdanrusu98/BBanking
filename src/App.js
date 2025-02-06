import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ProtectedRoute } from './hooks/PrivateRoute';
import PrivateRoute from './hooks/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './hooks/userContext';
import { useUser } from './hooks/userContext';
import Profile from './pages/Profile';
import OpenBalance from './pages/OpenBalance';
import EditPersonalDetails from './pages/EditPersonalDetails';
import SecondaryNavbar from './components/SecondaryNavbar';
import Training from './pages/Training';
import TrainingGuard from './components/TrainingGuard';
import Balance from './pages/Balance';
import AddMoney from './pages/AddMoney';
import SendMoney from './pages/SendMoney'
import Cards from './pages/Cards';
import Recipients from './pages/Recipients';
import RecipientsItem from './pages/RecipientsItem';
import AddRecipient from './pages/AddRecipient';
function Layout() {
  const location = useLocation();

  // Verificăm dacă ruta curentă este "/sign-in", "/sign-up", "/" sau "/edit-personal-details"
  const isAuthRoute = location.pathname === '/sign-in' || location.pathname === '/balances/add-money' || location.pathname === '/recipients/add' || location.pathname === '/sign-up' || location.pathname === '/' || location.pathname === '/edit-personal-details' || location.pathname === '/training' || location.pathname === '/open-balance';

  return (
    <>
      {!isAuthRoute && <Navbar />}
      {!isAuthRoute && <Sidebar />}
      {isAuthRoute && location.pathname !== '/' && <SecondaryNavbar />}
    </>
  );
}

function App() {
  const user = useUser();

  return (
    <div className={`container mx-auto px-3 pb-12`}>
      <Router>
        <UserProvider>
          <Layout />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/training" element={<Training />} />
            <Route path="/open-balance" element={<OpenBalance />} />
            <Route path="/recipients" element={<Recipients />} />
            <Route path={'/recipients/:recipientId'} element={<RecipientsItem />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/recipients/add" element={<AddRecipient />} />


            {/* Pagini protejate de TrainingGuard */}
            <Route path="/home" element={
              <TrainingGuard>
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              </TrainingGuard>
            } />
            <Route path="/settings/profile" element={
              <TrainingGuard>
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </TrainingGuard>
            } />
            <Route path="/edit-personal-details" element={
              <TrainingGuard>
                <PrivateRoute>
                  <EditPersonalDetails />
                </PrivateRoute>
              </TrainingGuard>
            } />
              <Route path={`/balances/:accountId`} element={
              <TrainingGuard>
                <PrivateRoute>
                  <Balance />
                </PrivateRoute>
              </TrainingGuard>
            } />
                 <Route path={`/balances/add-money`} element={
              <TrainingGuard>
                <PrivateRoute>
                  <AddMoney />
                </PrivateRoute>
              </TrainingGuard>
            } />
                   <Route path={`/balances/send-money`} element={
              <TrainingGuard>
                <PrivateRoute>
                  <SendMoney />
                </PrivateRoute>
              </TrainingGuard>
            } />
          </Routes>
        </UserProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
