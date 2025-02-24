import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProductList from './components/admin/product/ProductList';
import CreateProduct from './components/admin/product/CreateProduct';
import EditProduct from './components/admin/product/EditProduct';
import EditProfile from './components/admin/EditProfile';
import Orders from './components/admin/Orders';
import CategoryList from './components/admin/category/CategoryList';
import UserList from './components/admin/user/UserList';
const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/products/create" element={<CreateProduct />}/>   
          <Route path="/admin/products/edit/:id" element={<EditProduct />}/>
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="*" element={ <Navigate to="/admin/products" />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;