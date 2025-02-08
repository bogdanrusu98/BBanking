import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
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
import SendMoney from './pages/SendMoney';
import Cards from './pages/Cards';
import Recipients from './pages/Recipients';
import RecipientsItem from './pages/RecipientsItem';
import AddRecipient from './pages/AddRecipient';
import AllTransactions from './pages/AllTransactions';
import Settings from './pages/Settings';
import { ThemeProvider } from './hooks/ThemeContext';
import StatementsPage from './pages/StatementsPage';

// 📦 Layout definit în App.js
function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAuthRoute = [
    '/sign-in',
    '/balances/add-money',
    '/recipients/add',
    '/sign-up',
    '/',
    '/edit-personal-details',
    '/training',
    '/open-balance',
  ].includes(location.pathname);

  return (
    <>
      {!isAuthRoute && <Navbar toggleSidebar={toggleSidebar} />}
      <div className="lg:flex">
        {!isAuthRoute && <Sidebar isSidebarOpen={isSidebarOpen} />}

        <main className="flex-1">
          {isAuthRoute && location.pathname !== '/' && <SecondaryNavbar />}
          <Outlet />
        </main>
      </div>
    </>
  );
}
function App() {
  const user = useUser();

  return (
    <div className="container mx-auto px-3 pb-12">
      {/* Asigură-te că Router este la un nivel mai înalt decât provider-ele */}
      <Router>
        <ThemeProvider>
          <UserProvider>
            <Routes>
              {/* 🏠 Layout ca wrapper pentru toate rutele */}
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/training" element={<Training />} />
                <Route path="/open-balance" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <OpenBalance />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                <Route path="/recipients" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <Recipients />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                  <Route path="/statements" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <StatementsPage />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                <Route path="/recipients/:recipientId" element={
                   <TrainingGuard>
                    <PrivateRoute>
                      <RecipientsItem />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                <Route path="/cards" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <Cards />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                <Route path="/recipients/add" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <AddRecipient />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />
                <Route path="/all-transactions" element={
                  <TrainingGuard>
                  <PrivateRoute>
                    <AllTransactions />
                  </PrivateRoute>
                </TrainingGuard>
                  } />
                <Route path="/settings" element={
                  <TrainingGuard>
                      <PrivateRoute>
                    <Settings />
                    </PrivateRoute>
                  </TrainingGuard>
                  } />

                {/* 🛡️ Pagini protejate */}
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
                <Route path="/balances/:accountId" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <Balance />
                    </PrivateRoute>
                  </TrainingGuard>
                } />
                <Route path="/balances/add-money" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <AddMoney />
                    </PrivateRoute>
                  </TrainingGuard>
                } />
                <Route path="/balances/send-money" element={
                  <TrainingGuard>
                    <PrivateRoute>
                      <SendMoney />
                    </PrivateRoute>
                  </TrainingGuard>
                } />
              </Route>
            </Routes>
          </UserProvider>
        </ThemeProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}
<script src="../node_modules/flowbite/dist/flowbite.min.js"></script>

export default App;

