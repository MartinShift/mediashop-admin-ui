import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopCategories } from '../../services/categoryService';

const ClientNavBar = () => {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showPagesDropdown, setShowPagesDropdown] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getTopCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="container-fluid bg-dark mb-30">
            <div className="row px-xl-5">
                <div className="col-lg-3 d-none d-lg-block">
                    <a className="btn d-flex align-items-center justify-content-between bg-primary w-100" 
                       onClick={() => setShowCategories(!showCategories)}
                       style={{ height: '65px', padding: '0 30px', cursor: 'pointer' }}>
                        <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Categories</h6>
                        <i className="fa fa-angle-down text-dark"></i>
                    </a>
                    <nav className={`position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light ${showCategories ? 'show' : 'collapse'}`}
                         style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
                        <div className="navbar-nav w-100">
                            {categories.map(category => (
                                <Link key={category.id} 
                                      to={`/category/${category.id}`} 
                                      className="nav-item nav-link">
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
                <div className="col-lg-9">
                    <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                        <Link to="/" className="text-decoration-none d-block d-lg-none">
                            <span className="h1 text-uppercase text-dark bg-primary px-2">Media</span>
                            <span className="h1 text-uppercase text-primary bg-dark px-2 ml-n1">Shop</span>
                        </Link>
                        <button type="button" 
                                className="navbar-toggler" 
                                onClick={() => setShowMobileMenu(!showMobileMenu)}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse justify-content-between ${showMobileMenu ? 'show' : ''}`}>
                            <div className="navbar-nav mr-auto py-0">
                                <Link to="/" className="nav-item nav-link active">Home</Link>
                                <Link to="/shop" className="nav-item nav-link">Shop</Link>
                                <div className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" 
                                       onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                                       style={{ cursor: 'pointer' }}>
                                        Pages <i className="fa fa-angle-down mt-1"></i>
                                    </a>
                                    <div className={`dropdown-menu bg-primary rounded-0 border-0 m-0 ${showPagesDropdown ? 'show' : ''}`}>
                                        <Link to="/cart" className="dropdown-item">Shopping Cart</Link>
                                        <Link to="/checkout" className="dropdown-item">Checkout</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ClientNavBar; 