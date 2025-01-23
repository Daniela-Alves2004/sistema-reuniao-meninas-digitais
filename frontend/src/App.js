import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './componentes/macro/Login/Login.js';
import Cadastro from './componentes/macro/Cadastro/Cadastro.js';
import Home from './componentes/macro/Home/Home.js';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './componentes/ProtectedRoute';



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
