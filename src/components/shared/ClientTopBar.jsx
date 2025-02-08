import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { getCurrentUser, getToken } from '../services/userService';

const ClientTopBar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center bg-light py-3 px-xl-5 d-lg-flex">
        <div className="col-lg-4">
          {/* Logo or other content */}
        </div>
        
        <div className="col-lg-4 col-6 text-left">
          <form>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for products" />
              <div className="input-group-append">
                <span className="input-group-text bg-transparent text-primary">
                  <i className="fa fa-search"></i>
                </span>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-4 col-6 text-right">
          {!isLoading && (
            <>
              {user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="userDropdown">
                    <span className="mr-2 d-none d-lg-inline text-dark medium">
                      {user.username}
                    </span>
                    {user.avatarUrl && (
                      <img
                        className="img-profile rounded-circle ml-2"
                        src={user.avatarUrl}
                        alt="User avatar"
                        style={{ width: '30px', height: '30px' }}
                      />
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile/edit">Edit Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/create">Create Products</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="loginDropdown">
                    Not logged in
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/signin">Sign in</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/signup">Sign up</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTopBar;