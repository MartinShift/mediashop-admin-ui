import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { getCurrentUser } from '../../../services/userService';
import { createProduct } from '../../../services/productService';
import CategorySearchSelect from '../../shared/CategorySearchSelect';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    userId: null,
    categoryId: null,
    media: null,
    preview: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData(prev => ({
          ...prev,
          userId: user.id
        }));
      } catch (error) {
        console.error('Помилка завантаження користувача:', error);
      }
    };

    fetchUser();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e, inputName) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const fileInput = document.getElementById(inputName);
    fileInput.files = e.dataTransfer.files;

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  };

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('productDto.Name', formData.name);
    formDataToSend.append('productDto.Description', formData.description);
    formDataToSend.append('productDto.Price', formData.price);
    formDataToSend.append('productDto.UserId', formData.userId);
    formDataToSend.append('productDto.CategoryId', formData.categoryId);
    if (formData.media) {
      formDataToSend.append('media', formData.media);
    }
    if (formData.preview) {
      formDataToSend.append('preview', formData.preview);
    }

    try {
      const response = await createProduct(formDataToSend);
      if (response.id) {
        Swal.fire('Успіх!', 'Продукт успішно створено', 'success');
        navigate('/admin/products');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      let errorMessage = 'Не вдалося створити продукт';
      
      if (error.response) {
          try {
              const errorData = JSON.parse(error.message.substring(error.message.indexOf('{')));
              if (errorData.errors) {
                  errorMessage = Object.entries(errorData.errors)
                      .map(([key, messages]) => {
                          const fieldName = key.split('.').pop();
                          return `${fieldName}: ${messages.join(', ')}`;
                      })
                      .join('\n');
              }
          } catch (parseError) {
              console.error('Error parsing error message:', parseError);
          }
      }

      Swal.fire({
          icon: 'error',
          title: 'Помилка',
          text: errorMessage,
          confirmButtonText: 'OK'
      });
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
              <h1 className="h3 mb-4 text-gray-800">Створити продукт</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Назва</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Опис</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Ціна</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                <label htmlFor="category">Категорія</label>
                <CategorySearchSelect onCategorySelect={handleCategorySelect} />
              </div>
              <div className="form-group">
                  <label htmlFor="category">Медіа</label>
                  <div className="form-group">
                    <label
                      className="drop-container"
                      id="dropcontainer-media"
                      htmlFor="media"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'media')}
                    >
                      <span className="drop-title">Перетягніть файл</span>
                      або
                      <input
                        type="file"
                        id="media"
                        name="media"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Прев'ю</label>
                  <div className="form-group">
                    <label
                      className="drop-container"
                      id="dropcontainer-preview"
                      htmlFor="preview"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'preview')}
                    >
                      <span className="drop-title">Перетягніть файл</span>
                      або
                      <input
                        type="file"
                        id="preview"
                        name="preview"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
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

export default CreateProduct;