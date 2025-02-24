import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_CLIENT_URL, getUserAdmin, handleUserRedirect } from '../../services/userService.js';
import { getCurrentUser, setToken } from '../../services/userService';

import { useNavigate } from 'react-router-dom';
import '../../css/sb-admin-2.min.css';
import '../../css/sb-admin-2.css';
import '../../js/sb-admin-2.js';
import '../../js/sb-admin-2.min.js';
const AdminSidebar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const urlParams = new URLSearchParams(window.location.search);
        let paramsToken = urlParams.get('token');
        console.log(paramsToken);
        if (paramsToken) {
          try {
            setToken(paramsToken);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }

        const userData = await getCurrentUser();
        setUser(userData);
        var responseAdmin = await getUserAdmin(userData.id);
        setIsAdmin(responseAdmin);
        console.log(responseAdmin);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/signin');
      }
    };

    fetchUser();
  }, []);

  return (
    <ul className="navbar-nav bg-gradient-info sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
        </div>
        <div className="sidebar-brand-text mx-3">Media Shop</div>
      </Link>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <div onClick={handleUserRedirect} type="button" className="nav-link" to={BASE_CLIENT_URL}>
          <i className="fas fa-fw fa-house fa-solid"></i>
          <span>Головна</span>
        </div>
      </li>
      <hr className="sidebar-divider" />

      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item">
        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseTwo"
          aria-expanded="true" aria-controls="collapseTwo">
          <i className="fas fa-fw fa-solid fa-paperclip"></i>
          <span>Товари</span>
        </Link>
        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Товари:</h6>
            <Link className="collapse-item" to="/admin/products">Мої товари</Link>
            <Link className="collapse-item" to="/admin/products/create">Створити</Link>
          </div>
        </div>
      </li>


      {isAdmin && (
        <>
          <hr className="sidebar-divider" />
          {/* Nav Item - Pages Collapse Menu */}
          <li className="nav-item">
            <Link className="nav-link" to="/admin/categories">
              <i className="fas fa-fw fa-solid fa-list"></i>
              <span>Категорії</span>
            </Link>
          </li>
      <hr className="sidebar-divider d-none d-md-block" />
      <li className="nav-item">
            <Link className="nav-link" to="/admin/users">
              <i className="fas fa-fw fa-solid fa-user"></i>
              <span>Користувачі</span>
            </Link>
          </li>
        </>
      )}
      <hr className="sidebar-divider d-none d-md-block" />

      <li className="nav-item">
            <Link to="/admin/orders" className="nav-link">
              <i className="fas fa-fw fa-shopping-cart"></i>
              <span>Замовлення</span>
            </Link>
          </li>

      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
};

export default AdminSidebar;