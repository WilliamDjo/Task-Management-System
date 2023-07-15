import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditAccount from './pages/EditAccount';
import AdminDashboard from './pages/AdminDashboard';
import PageNotFound from './pages/PageNotFound';
import CantLogin from './pages/CantLogin';
import ForgotPassword from './pages/ForgotPassword';
import ChangeEmail from './pages/ChangeEmail';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Outlet />}>
            <Route index element={<Profile />} />
            <Route path="edit" element={<EditAccount />} />
          </Route>
          <Route path="admin" element={<Outlet />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="cantlogin" element={<CantLogin />} />
          <Route path="changeemail" element={<ChangeEmail />} />
          <Route path="verifyemail" element={<VerifyEmail />} />
          <Route path="resetpassword" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
