import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas para qualquer tipo de Usuária
import Login from './Componentes/macro/both/Login/Login';

// Páginas da Usuária Normal
import Home from './Componentes/macro/normal/Home/Home';
import Cadastro from './Componentes/macro/normal/Cadastro/Cadastro.js';

// Páginas da Usuária Administradora
import HomeAdmin from './Componentes/macro/admin/Home/Home';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Componentes/ProtectedRoute.js';



function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* Rota de login pública */}
          <Route path="/" element={<Login />} />

          {/* Rota para a página de cadastro */}
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rota protegida */}
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/admin/home" element={<ProtectedRoute element={<HomeAdmin />} />} />

        </Routes>

      </Router>

    </AuthProvider>

  );

}

export default App;