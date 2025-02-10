import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import { getPendingOrders, updateOrder, OrderStatus } from '../../services/orderService';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { BASE_CLIENT_URL, getCurrentUser } from '../../services/userService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = await getCurrentUser();
        const pendingOrders = await getPendingOrders(currentUser.id);
        setOrders(pendingOrders);
      } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  const handleApprove = async (orderId) => {
    const result = await Swal.fire({
      title: 'Підтвердити замовлення?',
      text: 'Після підтвердження користувач отримає доступ до файлу',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Так, підтвердити',
      cancelButtonText: 'Скасувати'
    });

    if (result.isConfirmed) {
      try {
        await updateOrder({ id: orderId, status: OrderStatus.Completed });
        Swal.fire('Підтверджено!', 'Замовлення було підтверджено.', 'success');
        window.location.reload();
      } catch (error) {
        Swal.fire('Помилка!', 'Сталася помилка при підтвердженні замовлення.', 'error');
      }
    }
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: 'Скасувати замовлення?',
      text: 'Ви впевнені, що хочете скасувати це замовлення?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Так, скасувати',
      cancelButtonText: 'Назад'
    });

    if (result.isConfirmed) {
      try {
        await updateOrder({ id: orderId, status: OrderStatus.Canceled });
        Swal.fire('Скасовано!', 'Замовлення було скасовано.', 'success');
        window.location.reload();
      } catch (error) {
        Swal.fire('Помилка!', 'Сталася помилка при скасуванні замовлення.', 'error');
      }
    }
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        <AdminSidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <AdminNavbar />
            <div className="container-fluid">
              <h1 className="h3 mb-2 text-gray-800">Замовлення</h1>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <div className="table-responsive">
                    {loading ? (
                      <p>Завантаження...</p>
                    ) : (
                      <table className="table table-bordered" id="orderTable" width="100%" cellSpacing="0">
                        <thead>
                          <tr>
                            <th>Користувач</th>
                            <th>Продукт</th>
                            <th>Дата створення</th>
                            <th>Ціна</th>
                            <th>Дії</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>
                                <Link to={`${BASE_CLIENT_URL}/profile/view/${order.userId}`}>
                                  {order.user.visibleName}
                                </Link>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={order.product.previewUrl || 'img/product-1.jpg'} 
                                    alt={order.product.name}
                                    style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }}
                                  />
                                  <span>{order.product.name}</span>
                                </div>
                              </td>
                              <td>{new Date(order.createdAt).toLocaleString()}</td>
                              <td>${order.price.toFixed(2)}</td>
                              <td>
                                <button 
                                  className="btn btn-success btn-sm mr-2"
                                  onClick={() => handleApprove(order.id)}
                                >
                                  Підтвердити
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancel(order.id)}
                                >
                                  Скасувати
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
    </div>
  );
};

export default Orders;