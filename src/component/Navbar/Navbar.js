import React, { useEffect, useState, useMemo } from 'react';
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

    const loginStatus = useMemo(() => {
        const token = localStorage.getItem("Authorization");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                return {
                    isLoggedIn: true,
                    username: decodedToken.name || "User",
                    userType: decodedToken.role ? decodedToken.role.toLowerCase() : "",
                };
            } catch (error) {
                console.error("Invalid token:", error);
                return { isLoggedIn: false, username: "", userType: "" };
            }
        }
        return { isLoggedIn: false, username: "", userType: "" };
    }, []);

    useEffect(() => {
        const { isLoggedIn, username, userType } = loginStatus;
        setIsLoggedIn(isLoggedIn);
        setUsername(username);
        setUserType(userType);
    }, [loginStatus]);

    useEffect(() => {
        if (isLoggedIn && userType === 'customer') {
            const fetchShippedOrdersCount = async () => {
                try {
                    const response = await axios.get('/order/shipped-count', {
                        headers: {
                            'Authorization': localStorage.getItem('Authorization'),
                        },
                    });
                    setPendingConfirmations(response.data.shippedCount || 0);
                } catch (error) {
                    console.error('Error fetching shipped orders count:', error);
                }
            };
            fetchShippedOrdersCount();
        }
    }, [isLoggedIn, userType]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate("/");
                setIsLoggedIn(false);
            }
        });
    };

    const renderDropdownOptions = () => {
        const options = [<Link key="profile" to="/profile">Profile</Link>];
        if (userType === 'admin') options.push(<Link key="admin" to="/admin">Admin Menu</Link>);
        if (userType === 'customer') {
            options.push(
                <Link key="myorder" to="/myorder">
                    My Orders {pendingConfirmations > 0 && <span className="text-success">({pendingConfirmations})</span>}
                </Link>
            );
            // TAMBAHAN "MY REQUEST" DI SINI
            options.push(
                <Link key="myrequest" to="/myrequestart">
                    My Request
                </Link>
            );
        }
        if (userType === 'artist') options.push(<Link key="artist-menu" to="/artist-menu">Artist Menu</Link>);
        options.push(<button key="logout" onClick={handleLogout}>Log Out</button>);
        return options;
    };

    return (
        <nav className="navbar-container">
            <div className="logo-container">
                <RouterLink to="/" onClick={() => scrollToSection("homeSection")}>
                    <img src={logo} alt="Mandalika Art Logo" className="logo" width="50" height="50" />
                </RouterLink>
                <div className="brand-info">
                    <span className="brand-name">MANDALIKA</span>
                    <span className="tagline">Art Community</span>
                </div>
            </div>
            <ul className="nav-links">
                <li><RouterLink to="/" onClick={() => scrollToSection("homeSection")}>Home</RouterLink></li>
                <li><RouterLink to="/" onClick={() => scrollToSection("artworkSection")}>Artwork</RouterLink></li>
                <li><RouterLink to="/" onClick={() => scrollToSection("artistSection")}>Artist</RouterLink></li>
                <li><RouterLink to="/" onClick={() => scrollToSection("contactSection")}>Contact</RouterLink></li>
            </ul>
            {isLoggedIn ? (
                <div className="dropdown">
                    <button className="dropbtn">Welcome, {username} {pendingConfirmations > 0 && <span className="text-success">({pendingConfirmations})</span>}</button>
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