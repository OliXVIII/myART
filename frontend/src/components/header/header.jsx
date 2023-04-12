import React from 'react';
import './header.scss';

export const Header = () => {
  return (
    <header className="header">
      <div className='header-container'>
        <div className="header-logo">
          <img className='header-logo-img' src="https://static.vecteezy.com/system/resources/previews/007/186/959/original/paint-logo-full-color-luxury-design-style-creative-brush-concept-free-vector.jpg"></img>
          <title className='header-logo-text'>MyArt</title>
        </div>
        <div className="header-nav">
            <a className='header-nav-item'>Home</a>
            <a className='header-nav-item'>Art</a>
            <a className='header-nav-item'>Artists</a>
        </div>
        <div className="header-user">
          <ul>
            <li>Sign Up</li>
            <li>Log In</li>
          </ul>
        </div>
      </div>
  </header>
  );
};