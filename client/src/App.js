import logo from "./logo.svg";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SearchProvider } from "./context/search";
import Main from "./components/Main";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AccountActivate from "./pages/auth/AccountActivate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccessAccount from "./pages/auth/AccessAccount";
import Dashboard from "./pages/user/Dashboard";
import AdCreate from "./pages/user/Ad/AdCreate";
import PrivateRoute from "./components/routes/PrivateRoute";
import SellHouse from "./pages/user/Ad/SellHouse";
import SellLand from "./pages/user/Ad/SellLand";
import RentHouse from "./pages/user/Ad/RentHouse";
import RentLand from "./pages/user/Ad/RentLand";
import AdView from "./pages/AdView";
import Footer from "./components/nav/Footer";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import AdEdit from "./pages/user/Ad/AdEdit";
import Wishlist from "./pages/user/Ad/Wishlist";
import Enquiries from "./pages/user/Ad/Enquiries";
import Agents from "./pages/Agents";
import Agent from "./pages/Agent";
import Buy from "./pages/Buy";
import Rent from "./pages/user/Rent";
import Search from "./pages/Search";
function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AuthProvider>
        <SearchProvider >
        <Main />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/auth/account-activate/:token"
            element={<AccountActivate />}
          ></Route>
          <Route
            path="/auth/forgot-password"
            element={<ForgotPassword />}
          ></Route>
          <Route
            path="/auth/access-account/:token"
            element={<AccessAccount />}
          ></Route>
          <Route path="/" element={<PrivateRoute />}>
            {" "}
            //* making private routes
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="ad/create" element={<AdCreate />}></Route>
            <Route path="ad/create/sell/House" element={<SellHouse />}></Route>
            <Route path="ad/create/sell/Land" element={<SellLand />}></Route>
            <Route path="ad/create/rent/House" element={<RentHouse />}></Route>
            <Route path="ad/create/rent/Land" element={<RentLand />}></Route>
            <Route path="user/profile" element={<Profile />}></Route>
            <Route path="user/settings" element={<Settings />}></Route>
            <Route path="user/ad/:slug" element={<AdEdit />}></Route>
            <Route path="user/wishlist" element={<Wishlist />}></Route>
            <Route path="user/enquiries" element={<Enquiries />}></Route>
          </Route>
          <Route path="/ad/:slug" element={<AdView />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:username" element={<Agent />} />
          <Route path="/buy" element={<Buy />}></Route>
          <Route path="/rent" element={<Rent />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
        <Footer />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
