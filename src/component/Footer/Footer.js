import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo di Tengah */}
                <h2 className="footer-logo">ArtMandalika</h2>

                {/* Navigasi Horizontal */}
                <ul className="footer-nav">
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/gallery">Gallery</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                </ul>
            </div>
            
            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} ArtMandalika. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
