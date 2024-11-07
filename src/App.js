import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/Home/Home";
import Navbar from "./component/Navbar/Navbar";
import { Element } from "react-scroll";
import FeaturedArtists from './pages/FeaturedArtist/FeaturedArtist';
import Reviews from './pages/Reviews/Reviews';
import ContactOptions from './pages/ContactOptions/ContactOptions';
import Footer from './component/Footer/Footer';
import Login from './pages/Login/Login';
import ArtworkDetail from './pages/ArtworkDetail/ArtworkDetail';
import OrderPage from './pages/Order/OrderPage';
import PaymentPage from './pages/Payment/Payment';
import MyOrderPage from './pages/MyOrder/MyOrder';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { ReviewProvider } from './component/ReviewContext/ReviewContext';
import Register from './pages/Register/Register';
import AdminPage from './pages/AdminPage/AdminPage';

const ArtworkShowcase = lazy(() => import("./pages/ArtworkShowcase/ArtworkShowcase"));

const App = () => {
  return (
    <div className="App">
      <ReviewProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Element name="homeSection">
                    <Home />
                  </Element>
                  <Element name="artworkSection">
                    <Suspense fallback={<div>Loading...</div>}>
                      <ArtworkShowcase />
                    </Suspense>
                  </Element>
                  <Element name="artistSection">
                    <Suspense fallback={<div>Loading...</div>}>
                      <FeaturedArtists/>
                    </Suspense>
                  </Element>
                  <Element name="reviewSection">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Reviews/>
                    </Suspense>
                  </Element>
                  <Element name="contactSection">
                    <Suspense fallback={<div>Loading...</div>}>
                      <ContactOptions/>
                    </Suspense>
                  </Element>
                </div>
              }
            />
            <Route
              path="/login"
              element={<Login/>}
            />
            <Route
              path="/register"
              element={<Register/>}
            />
            <Route path="/artwork/:id" element={<ArtworkDetail/>} />
            <Route path="/orders/:idArtRequest" element={<OrderPage/>} />
            <Route path="/payment/:idOrder" element={<PaymentPage/>} />
            <Route path="/myorder" element={<MyOrderPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/admin" element={<AdminPage/>} />
          </Routes>
          <Footer/>
        </Router>
      </ReviewProvider>
    </div>
  );
}

export default App;
