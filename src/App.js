import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";

import Login from "./components/Login";
import SignUp from "./components/Signup";
import AdminPage from "./components/AdminPage";
import OrderPage from "./components/OrderPage";
import VerificationPage from "./components/VerificationPage";

function Homepage() {
  return (
    <>
      <Navbar />
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/Order/:id" element={<OrderPage />} />
        <Route path="/verify" element={<VerificationPage />} />
      </Routes>
      {/* Add ToastContainer here so it works across the app */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Analytics />
    </Router>
  );
}

export default App;
