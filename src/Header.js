
import React from 'react';
import './index.css';
import logo from './CSB_Bank_logo.jpg';


const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo">
          <img 
            src= {logo} 
            alt="Company Logo"
            className="logo-img"
          />
        </div>

        
        <nav className="nav-menu">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#loans">Loans</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#contact">Careers</a></li>
            <li><a href="#contact">Corporate</a></li>


          </ul>
        </nav>

        
        <div className="contact-info">
         
        </div>
      </div>
    </header>
  );
};

export default Header;