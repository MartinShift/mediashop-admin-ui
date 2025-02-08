import React from 'react';
import { Link } from 'react-router-dom';
import '../../js/sb-admin-2.js'
import '../../css/sb-admin-2.css'
import { BASE_CLIENT_URL, handleUserRedirect } from '../../services/userService.js';

const AdminSidebar = () => {
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

      <hr className="sidebar-divider" />

      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item">
        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseCategory"
          aria-expanded="true" aria-controls="collapseCategory">
          <i className="fas fa-fw fa-solid fa-list"></i>
          <span>Категорії</span>
        </Link>
        <div id="collapseCategory" className="collapse" aria-labelledby="headingCategory" data-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Категорії:</h6>
            <Link className="collapse-item" to="/admin/categories/create">Створити</Link>
          </div>
        </div>
      </li>

      <li className="nav-item">
                <Link to="/admin/orders" className="nav-link">
                    <i className="fas fa-fw fa-shopping-cart"></i>
                    <span>Замовлення</span></Link>
            </li>

      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />

      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
};

export default AdminSidebar;