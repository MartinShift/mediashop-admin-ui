import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { getCategories, deleteCategory, createCategory, updateCategory } from '../../../services/categoryService';
import { getCurrentUser, getUserAdmin } from '../../../services/userService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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
          if(!responseAdmin)
          {
            navigate('/admin/products');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/signin');
        }
      };
  
      fetchUser();
    }, []);

  useEffect(() => {
    if (!loading) {
      $('#dataTable1').DataTable({
        language: {
          "processing": "Зачекайте...",
          "search": "Пошук:",
          "lengthMenu": "Показати _MENU_ записів",
          "info": "Записи з _START_ по _END_ із _TOTAL_ записів",
          "infoEmpty": "Записи з 0 по 0 із 0 записів",
          "infoFiltered": "(відфільтровано з _MAX_ записів)",
          "loadingRecords": "Завантаження...",
          "zeroRecords": "Записи відсутні.",
          "emptyTable": "У таблиці відсутні дані",
          "paginate": {
            "first": "Перша",
            "previous": "Попередня",
            "next": "Наступна",
            "last": "Остання"
          },
          "aria": {
            "sortAscending": ": активувати для сортування стовпця за зростанням",
            "sortDescending": ": активувати для сортування стовпця за спаданням"
          }
        }
      });
    }
  }, [loading]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Swal.fire('Помилка!', 'Не вдалося завантажити категорії.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Ви впевнені?',
      text: "Ви не зможете відновити цю категорію!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Так, видалити!',
      cancelButtonText: 'Відміна'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        await fetchCategories();
        Swal.fire('Видалено!', 'Категорію було видалено.', 'success');
      } catch (error) {
        console.error('Error deleting category:', error);
        Swal.fire('Помилка!', 'Не вдалося видалити категорію.', 'error');
      }
    }
  };

  const handleCreate = async () => {
    const { value: categoryName } = await Swal.fire({
      title: 'Створення нової категорії',
      input: 'text',
      inputLabel: 'Назва категорії',
      inputPlaceholder: 'Введіть назву категорії',
      showCancelButton: true,
      confirmButtonText: 'Створити',
      cancelButtonText: 'Відміна',
      inputValidator: (value) => {
        if (!value) {
          return 'Назва категорії не може бути порожньою!';
        }
      }
    });
  
    if (categoryName) {
      try {
        const response = await createCategory({ name: categoryName });
        if (response.id) {
          await fetchCategories(); 
          Swal.fire('Успіх!', 'Категорію успішно створено', 'success');
        } else {
          throw new Error('Failed to create category');
        }
      } catch (error) {
        console.error('Error creating category:', error);
        const errorData = JSON.parse(error.message);
        Swal.fire('Помилка!', errorData.Message, 'error');
      }
    }
  };


  const handleEdit = async (id) => {
    // Find current category
    const category = categories.find(c => c.id === id);
    
    const { value: newName } = await Swal.fire({
      title: 'Редагування категорії',
      input: 'text',
      inputLabel: 'Назва категорії',
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonText: 'Зберегти',
      cancelButtonText: 'Відміна',
      inputValidator: (value) => {
        if (!value) {
          return 'Назва категорії не може бути порожньою!';
        }
      }
    });
  
    if (newName && newName !== category.name) {
      try {
        const response = await updateCategory({ id, name: newName });
        if (response.id) {
          await fetchCategories(); // Refresh the list
          Swal.fire('Успіх!', 'Категорію успішно оновлено', 'success');
        } else {
          throw new Error('Failed to update category');
        }
      } catch (error) {
        console.error('Error updating category:', error);
        const errorData = JSON.parse(error.message);
        Swal.fire('Помилка!', errorData.Message, 'error');
      }
    }
  };

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <AdminSidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <AdminNavbar />
              <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Категорії</h1>
                <button className="btn btn-primary mb-4" onClick={handleCreate}>
                  Створити категорію
                </button>

                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="table-responsive">
                      {loading ? (
                        <p>Завантаження...</p>
                      ) : (
                        <table className="table table-bordered" id="dataTable1" width="100%" cellSpacing="0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Назва</th>
                              <th>Кількість товарів</th>
                              <th>Дії</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => (
                              <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.productCount}</td>
                                <td>
                                  <button 
                                    className="btn btn-warning btn-sm mr-2"
                                    onClick={() => handleEdit(category.id)}
                                  >
                                    Редагувати
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    Видалити
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
};

export default CategoryList;