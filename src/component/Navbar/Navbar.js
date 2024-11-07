import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link as RouterLink, useLocation, Link, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import axios from '../../api/backend/index';
import './Navbar.css';
import logo from '../../assets/Rectangle 4.png';
import Swal from 'sweetalert2';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [pendingConfirmations, setPendingConfirmations] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const NAVBAR_HEIGHT = 70;

    const scrollToSection = (section) => {
        if (location.pathname === "/") {
            scroller.scrollTo(section, {
                smooth: true,
                duration: 500,
                offset: -NAVBAR_HEIGHT,
            });
        }
    };

    const checkLoginStatus = () => {
        const token = localStorage.getItem("Authorization");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setIsLoggedIn(true);
                setUsername(decodedToken.name || "User");
                setUserType(decodedToken.role ? decodedToken.role.toLowerCase() : "");
                
            } catch (error) {
                console.error("Invalid token:", error);
                setIsLoggedIn(false);
                setUsername("");
                setUserType("");
            }
        } else {
            setIsLoggedIn(false);
            setUsername("");
            setUserType("");
        }
    };

    const fetchShippedOrdersCount = async () => {
        if (isLoggedIn && userType === 'customer') {
            try {
                const response = await axios.get('/order/shipped-count', {
                    headers: {
                        'Authorization': localStorage.getItem('Authorization'),
                        'Content-Type': 'application/json'
                    }
                });
                setPendingConfirmations(response.data.shippedCount);
            } catch (error) {
                console.error('Error fetching shipped orders count:', error);
            }
        }
    };

    useEffect(() => {
        checkLoginStatus();
        fetchShippedOrdersCount();

        const handleStorageChange = () => {
            checkLoginStatus();
            fetchShippedOrdersCount();
        };

        window.addEventListener("loginStatusChange", handleStorageChange);

        return () => {
            window.removeEventListener("loginStatusChange", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn && userType === 'customer') {
            fetchShippedOrdersCount();
        }
    }, [isLoggedIn, userType, pendingConfirmations]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
                window.location.reload();
                localStorage.clear();
                setIsLoggedIn(false);
                window.dispatchEvent(new Event("loginStatusChange"));
            }
        });
    };

    const renderDropdownOptions = () => {
        const options = [
            <Link key="profile" to="/profile">Profile</Link>
        ];

        if (userType === 'admin') {
            options.push(<Link key="admin" to="/admin">Admin Menu</Link>);
        } else if (userType === 'customer') {
            options.push(
                <Link key="myorder" to="/myorder">
                    My Orders {pendingConfirmations > 0 && <span className="text-success">({pendingConfirmations})</span>}
                </Link>
            );
        } else if (userType === 'artist') {
            options.push(<Link key="artist-menu" to="/artist-menu">Artist Menu</Link>);
        }

        options.push(
            <button key="logout" onClick={handleLogout}>Log Out</button>
        );

        return options;
    };

    return (
        <nav className="navbar-container">
            <div className="logo-container">
                <RouterLink to="/" onClick={() => scrollToSection("homeSection")}>
                    <img src={logo} alt="Mandalika Art Logo" className="logo" />
                </RouterLink>
                <div className="brand-info">
                    <span className="brand-name">MANDALIKA</span>
                    <span className="tagline">Art Community</span>
                </div>
            </div>
            <ul className="nav-links">
                <li>
                    <RouterLink to="/" onClick={() => scrollToSection("homeSection")}>
                        Home
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/" onClick={() => scrollToSection("artworkSection")}>
                        Artwork
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/" onClick={() => scrollToSection("artistSection")}>
                        Artist
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/" onClick={() => scrollToSection("contactSection")}>
                        Contact
                    </RouterLink>
                </li>
            </ul>
            {isLoggedIn ? (
                <div className="dropdown">
                    <button className="dropbtn">Welcome, {username} {pendingConfirmations > 0 && <span className="text-success">({pendingConfirmations})</span>}
                    </button>
                    <div className="dropdown-content">
                        {renderDropdownOptions()}
                    </div>
                </div>
            ) : (
                <Link to="/login">
                    <button className="nav-login-button">Log In</button>
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
