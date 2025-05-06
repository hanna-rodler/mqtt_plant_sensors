import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="navbar-link">
                    <img src="/images/plant.svg" alt="Plant Icon" className="navbar-icon" />
                    Smart Plants
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
