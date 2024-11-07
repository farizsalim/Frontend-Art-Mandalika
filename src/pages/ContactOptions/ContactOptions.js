import React from 'react';
import './ContactOptions.css';

// Import ikon (gunakan ikon SVG atau dari pustaka ikon jika tersedia)
import { FaWhatsapp, FaInstagram, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';

const contactData = [
    {
        platform: "WhatsApp",
        icon: <FaWhatsapp />,
        description: "Contact us on WhatsApp",
        link: "https://wa.me/1234567890"
    },
    {
        platform: "Instagram",
        icon: <FaInstagram />,
        description: "Follow us on Instagram",
        link: "https://instagram.com/yourpage"
    },
    {
        platform: "Telegram",
        icon: <FaTelegramPlane />,
        description: "Join our Telegram channel",
        link: "https://t.me/yourchannel"
    },
    {
        platform: "Gmail",
        icon: <FaEnvelope />,
        description: "Email us",
        link: "mailto:youremail@gmail.com"
    }
];

const ContactOptions = () => {
    return (
        <div className="contact-options-container">
            <h2 className="contact-title">Contact Us</h2>
            <div className="contact-grid">
                {contactData.map((contact, index) => (
                    <div key={index} className="contact-item">
                        <div className="contact-icon">{contact.icon}</div>
                        <h3 className="contact-platform">{contact.platform}</h3>
                        <p className="contact-description">{contact.description}</p>
                        <a href={contact.link} target="_blank" rel="noopener noreferrer" className="contact-link">
                            Learn more
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactOptions;
