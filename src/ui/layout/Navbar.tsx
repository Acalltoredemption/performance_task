import React from 'react';
import NavbarLink from '../components/NavbarLink';
import '../stylesheets/navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-dark nav-main">
            <div className="container">
                <a className="navbar-brand">inquirED</a>
                <i id="loading-icon" className="fas fa-cog fa-spin fa-2x loading-icon" title="Loading..." style={{display: "none"}}></i>

                <ul className="navbar-nav">
                    <NavbarLink text="Admin Panel" />
                    <NavbarLink text="Unit Dashboard" />
                    <NavbarLink text="Curriculum Library" />
                    <NavbarLink text="PD & Learning" />
                    <NavbarLink text="Help" />
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
