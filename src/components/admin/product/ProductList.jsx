import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { getCurrentUser } from '../../../services/userService';
import { getProductsByUserId, deleteProduct } from '../../../services/productService';
import { BASE_CLIENT_URL, getToken, setToken } from '../../../services/userService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = await getCurrentUser();
        const products = await getProductsByUserId(user.id);
        setProducts(products);
      } catch (error) {
        console.error('Помилка завантаження продуктів:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const renderMediaType = (mediaType) => {
    switch (mediaType) {
      case 1:
        return 'Зображення';
      case 2:
        return 'Відео';
      case 3:
        return 'Аудіо';
      case 4:
        return 'Документ';
      default:
        return 'Невідомо';
    }
  };

  const handleCreate = () => {
    navigate('/admin/products/create');
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Ви впевнені?',
      text: 'Це неможливо буде скасувати!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Так, видалити!'
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire('Видалено!', 'Ваш продукт було видалено.', 'success');
        window.location.reload();
      } catch (error) {
        Swal.fire('Помилка!', 'Сталася помилка при видаленні продукту.', 'error');
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
                <h1 className="h3 mb-2 text-gray-800">Продукти</h1>
                <button className="btn btn-primary mb-4" onClick={handleCreate}>
                  Створити
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
                              <th>Назва</th>
                              <th>Попередній перегляд</th>
                              <th>Опис</th>
                              <th>Ціна</th>
                              <th>Тип медіа</th>
                              <th>Дії</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id}>
                                <td>                     <a href={`${BASE_CLIENT_URL}/product/${product.id}`}>{product.name}</a></td>
                                <td>
                                  <a href={`${BASE_CLIENT_URL}/product/${product.id}`}>
                                  {product.previewUrl ? (
                                    <img src={product.previewUrl} alt={product.name} width="50" height="50" />
                                  ) : (
                                    'Немає зображення'
                                  )}
                                  </a>
                                </td>
                                <td>{product.description.slice(0, 50)}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{renderMediaType(product.mediaType)}</td>
                                <td>
                                  <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(product.id)}>
                                    Редагувати
                                  </button>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>
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
              {/* /.container-fluid */}
            </div>
            {/* End of Main Content */}
          </div>
          {/* End of Content Wrapper */}
        </div>

        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
};

export default ProductList;