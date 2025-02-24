import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { getUsers, deleteUser } from '../../../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Помилка!', 'Не вдалося завантажити користувачів.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Ви впевнені?',
      text: "Ви не зможете відновити цього користувача!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Так, видалити!',
      cancelButtonText: 'Відміна'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        await fetchUsers();
        Swal.fire('Видалено!', 'Користувача було видалено.', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Помилка!', 'Не вдалося видалити користувача.', 'error');
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
                <h1 className="h3 mb-2 text-gray-800">Користувачі</h1>

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
                              <th>Аватар</th>
                              <th>Ім'я користувача</th>
                              <th>Email</th>
                              <th>Відображуване ім'я</th>
                              <th>Кількість замовлень</th>
                              <th>Про користувача</th>
                              <th>Дії</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                  {user.avatarUrl ? (
                                    <img 
                                      src={user.avatarUrl} 
                                      alt={user.visibleName} 
                                      className="rounded-circle"
                                      width="50" 
                                      height="50"
                                    />
                                  ) : (
                                    'Немає аватара'
                                  )}
                                </td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.visibleName}</td>
                                <td>{user.orderCount}</td>
                                <td>{user.about || 'Немає опису'}</td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user.id)}
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

export default UserList;