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
import Connections from './pages/Connections';
import AddConnection from './pages/AddConnection';
import MyConnections from './pages/MyConnections';
import ConnectionProfile from './pages/ConnectionProfile';
import MyProfile from './pages/MyProfile';
import PendingConnections from './pages/PendingConnections';
import PendingProfile from './pages/PendingProfile';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import SearchEverything from './pages/SearchEverything';
import MyAssignedTasks from './pages/MyAssignedTasks';
import AdminProfile from './pages/AdminProfile';
// import Connections from './pages/Connections';
// import AddConnection from './pages/AddConnection';
// import MyConnections from './pages/MyConnections';
// import ConnectionProfile from './pages/ConnectionProfile';
// import SearchEverything from './pages/SearchEverything';
// import MyProfile from './pages/MyProfile';
// import PendingConnections from './pages/PendingConnections';
// import PendingProfile from './pages/PendingProfile';

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
            <Route path="my" element={<MyProfile />} />
            <Route path="edit" element={<EditAccount />} />
            <Route path="assigned" element={<MyAssignedTasks />} />
          </Route>
          <Route path="admin" element={<Outlet />}>
            <Route index element={<AdminDashboard />} />
            <Route path=":email" element={<AdminProfile />} />
          </Route>
          <Route path="connections" element={<Outlet />}>
            <Route index element={<Connections />} />
            <Route path="my" element={<Outlet />}>
              <Route index element={<MyConnections />} />
              <Route path=":email" element={<ConnectionProfile />} />
            </Route>
            <Route path="add" element={<AddConnection />} />
            <Route path="pending" element={<Outlet />}>
              <Route index element={<PendingConnections />} />
              <Route path=":email" element={<PendingProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="cantlogin" element={<CantLogin />} />
          <Route path="changeemail" element={<ChangeEmail />} />
          <Route path="verifyemail" element={<VerifyEmail />} />
          <Route path="resetpassword" element={<ResetPassword />} />
          <Route path="searcheverything" element={<SearchEverything />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
