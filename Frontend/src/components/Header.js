import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Módulo Compras</h1>
        <div className="user-info">
          <img src="user-avatar.png" alt="User Avatar" className="user-avatar" />
          <span className="user-name">Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
