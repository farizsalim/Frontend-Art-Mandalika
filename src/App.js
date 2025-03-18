import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Element } from "react-scroll";
import Navbar from "./component/Navbar/Navbar";
import Footer from './component/Footer/Footer';
import './App.css';
import { ReviewProvider } from './component/ReviewContext/ReviewContext'; // Impor ReviewProvider
import NewsEventDetails from './pages/NewsEvent/NewsEventDetails';
import MyRequestArt from './pages/MyRequestArt/MyRequestArt';
import OrderArtworkCustom from './pages/Order/OrderArtworkCustom';

// Lazy Load Komponen
const Home = lazy(() => import("./pages/Home/Home"));
const FeaturedArtists = lazy(() => import('./pages/FeaturedArtist/FeaturedArtist'));
const Reviews = lazy(() => import('./pages/Reviews/Reviews'));
const ContactOptions = lazy(() => import('./pages/ContactOptions/ContactOptions'));
const ArtworkShowcase = lazy(() => import("./pages/ArtworkShowcase/ArtworkShowcase"));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail/ArtworkDetail'));
const OrderPage = lazy(() => import('./pages/Order/OrderPage'));
const PaymentPage = lazy(() => import('./pages/Payment/Payment'));
const MyOrderPage = lazy(() => import('./pages/MyOrder/MyOrder'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const ArtworkCustom = lazy(() => import('./pages/ArtworkCustom/ArtworkCustom'));
const ArtistDetail= lazy(() => import('./pages/FeaturedArtist/ArtistDetail'));
const NewsList = lazy(() => import('./pages/NewsEvent/NewsList'));

// Placeholder fallback
const Placeholder = ({ message }) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#C15A01',
    }}
  >
    {message}
  </div>
);

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ReviewProvider> {/* Membungkus dengan ReviewProvider */}
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {/* React Scroll Elements */}
                  <Element name="homeSection">
                    <Suspense fallback={<Placeholder message="Loading Home..." />}>
                      <Home />
                    </Suspense>
                  </Element>
                  <Element name="artworkSection">
                    <Suspense fallback={<Placeholder message="Loading Artwork Showcase..." />}>
                      <ArtworkShowcase />
                    </Suspense>
                  </Element>
                  <Element name="NewsEventUpdate">
                    <Suspense fallback={<Placeholder message="Loading NewsEvent Update..." />}>
                      <NewsList />
                    </Suspense>
                  </Element>
                  <Element name="artistSection">
                    <Suspense fallback={<Placeholder message="Loading Featured Artists..." />}>
                      <FeaturedArtists />
                    </Suspense>
                  </Element>
                  <Element name="reviewSection">
                    <Suspense fallback={<Placeholder message="Loading Reviews..." />}>
                      <Reviews />
                    </Suspense>
                  </Element>
                  <Element name="contactSection">
                    <Suspense fallback={<Placeholder message="Loading Contact Options..." />}>
                      <ContactOptions />
                    </Suspense>
                  </Element>
                </div>
              }
            />
            {/* Halaman Lain */}
            <Route
              path="/login"
              element={<Suspense fallback={<Placeholder message="Loading Login..." />}><Login /></Suspense>}
            />
            <Route
              path="/register"
              element={<Suspense fallback={<Placeholder message="Loading Register..." />}><Register /></Suspense>}
            />
            <Route
              path="/artwork/:id"
              element={<Suspense fallback={<Placeholder message="Loading Artwork Detail..." />}><ArtworkDetail /></Suspense>}
            />
            <Route
              path="/artist/:id"
              element={<Suspense fallback={<Placeholder message="Loading ArtistDetail..." />}><ArtistDetail /></Suspense>}
            />
            <Route
              path="/order"
              element={<Suspense fallback={<Placeholder message="Loading Order Page..." />}><OrderPage /></Suspense>}
            />
          <Route
              path="/order-artwork-custom"
              element={<Suspense fallback={<Placeholder message="Loading Order Page..." />}><OrderArtworkCustom /></Suspense>}
            />
            <Route
              path="/payment/:idOrder"
              element={<Suspense fallback={<Placeholder message="Loading Payment Page..." />}><PaymentPage /></Suspense>}
            />
            <Route
              path="/myorder"
              element={<Suspense fallback={<Placeholder message="Loading My Orders..." />}><MyOrderPage /></Suspense>}
            />
            <Route
              path="/profile"
              element={<Suspense fallback={<Placeholder message="Loading Profile..." />}><ProfilePage /></Suspense>}
            />
            <Route
              path="/admin"
              element={<Suspense fallback={<Placeholder message="Loading Admin Page..." />}><AdminPage /></Suspense>}
            />
            <Route
              path="/artworkcustom"
              element={<Suspense fallback={<Placeholder message="Loading Artwork Custom..." />}><ArtworkCustom/></Suspense>}
            />
            <Route
              path="/newslist"
              element={<Suspense fallback={<Placeholder message="Loading Artwork Custom..." />}><NewsList/></Suspense>}
            />
            <Route
              path="/news/:id"
              element={<Suspense fallback={<Placeholder message="Loading News..." />}><NewsEventDetails/></Suspense>}
            />
            <Route
              path="/myrequestart"
              element={<Suspense fallback={<Placeholder message="Loading MyRequestArt..." />}><MyRequestArt/></Suspense>}
            />
          </Routes>
        </ReviewProvider>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
