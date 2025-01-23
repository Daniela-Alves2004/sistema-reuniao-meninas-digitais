import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Componentes/macro/both/Login/Login.js';
import Cadastro from './Componentes/macro/normal/Cadastro/Cadastro.js';
import Home from './Componentes/macro/admin/Home/Home.js';
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
