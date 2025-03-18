import React, { useState, useEffect } from 'react';
import './Home.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';
import { image_1 } from '../../assets/image/home/asset';

const Home = React.memo(() => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("Authorization"));
    }, []);

    return (
        <div className="home-base">
            {/* Container Utama */}
            <div className="container my-5 home-container">
                <div className="row align-items-center">
                    {/* Teks Utama */}
                    <div className="col-md-6 mb-4 mb-md-0 text-center text-md-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <h1 className="home-title">Welcome to Mandalika Art Community!</h1>
                            <p className="home-description">
                                Unlock the art of your dreams, tailored to your unique vision, with our bespoke commissioned art services.
                                Register now to bring your creative ideas to life and gain access to exclusive art requests, collaborations, and opportunities.
                            </p>
                            <button className="home-button">
                                {isLoggedIn ? "Request Artwork Now!" : "Register Now!"}
                            </button>
                        </motion.div>
                    </div>
                    {/* Gambar Utama */}
                    <div className="col-md-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <LazyLoadImage
                                src={image_1}
                                alt="Art splash"
                                className="img-fluid home-image"
                                effect="blur"
                                placeholderSrc="https://via.placeholder.com/500"
                                width={500}
                                height={500}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section bg-orange p-4 mt-5">
                <div className="container my-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <h2 className="section-title text-white">
                            How commissioned art service works on the Art Mandalika Community
                        </h2>
                        <p className="section-description text-white">
                            At Art Mandalika Community, we offer a unique opportunity to turn your special moments into 
                            hand-painted works of art. You can commission a custom artwork based on a personal photo, which 
                            can be a memorable vacation, an important event, or a loved one. We provide two options: a 1:1 copy 
                            of the photo directly on canvas or a personalized digital design as a template for the final painting. 
                            Our team of skilled artists will then bring your moment to life on canvas, creating a one-of-a-kind 
                            piece that tells a unique story. Whether you prefer a physical artwork or a digital file, we've got you covered.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
});

export default Home;
