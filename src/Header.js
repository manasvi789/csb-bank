import React, { useState } from 'react';
import './index.css'; 
import logo from './CSB_Bank_logo.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo">
          <img src={logo} alt="CSB Bank Logo" className="logo-img" />
        </div>

        
        <button className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="#home" onClick={toggleMenu}>Home</a></li>
            <li><a href="#loans" onClick={toggleMenu}>Loans</a></li>
            <li><a href="#about" onClick={toggleMenu}>About Us</a></li>
            <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
            <li><a href="#careers" onClick={toggleMenu}>Careers</a></li>
            <li><a href="#corporate" onClick={toggleMenu}>Corporate</a></li>
          </ul>
        </nav>

      
        <div className="contact-info">
          
        </div>
      </div>
    </header>
  );
};

export default Header;
