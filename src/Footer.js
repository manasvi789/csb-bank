
import React from 'react';
import './index.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Products</h3>
          <ul>
            <li><a href="#personal">Personal Loans</a></li>
            <li><a href="#business">Business Loans</a></li>
            <li><a href="#home">Home Loans</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@csb-bank.com</p>
          <p>Phone: 1800-123-4567</p>
          <p>Address: CSB Bank Ltd.,
Head Office, CSB Bhavan,
P.O Box No.502,
St.Mary’s College Road,
Thrissur–680020,
Kerala, India</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 CSB Bank. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;