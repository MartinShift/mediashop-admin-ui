import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { createCategory } from '../../../services/categoryService';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await createCategory({ name });
        if (response.id) {
          Swal.fire('Успіх!', 'Категорію успішно створено', 'success');
          navigate('/admin/products');
        } else {
          throw new Error('Failed to create category');
        }
      } catch (error) {
        console.error('Error creating category:', error);
        const errorData = JSON.parse(error.message);
        Swal.fire('Помилка!', errorData.Message, 'error');
      }
    };
  
  return (
    <div>
      <div id="wrapper">
        <AdminSidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <AdminNavbar />
            <div className="container-fluid">
              <h1 className="h3 mb-4 text-gray-800">Створити категорію</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Назва категорії</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Створити
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;