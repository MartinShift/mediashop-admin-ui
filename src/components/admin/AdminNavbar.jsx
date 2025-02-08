import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../../mediashop-client-ui/src/services/userService';
import LogoutModal from '../shared/LogoutModal';

import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/signin');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>
      
      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">

        <div className="topbar-divider d-none d-sm-block"></div>

        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {user ? (
              <>
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user.userName}</span>
                <img className="img-profile rounded-circle ml-2" src={user.avatarUrl} alt="..." />
              </>
            ) : (
              <span>Loading...</span>
            )}
          </a>
          {/* Dropdown - User Information */}
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            {user && (
              <a className="dropdown-item" href={`/profile/view/` + user.id}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Профіль
              </a>
            )}
            <a className="dropdown-item" href="/profile/edit">
              <i className="fas fa-cog fa-sm fa-fw mr-2 mt-2 text-gray-400"></i>
              Редагувати Профіль
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Вийти
            </a>
          </div>
        </li>
      </ul>
    </nav>

    <LogoutModal/>
    </div>
  );
};

export default AdminNavbar;