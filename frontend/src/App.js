import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas para qualquer tipo de Usuária
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Home from './pages/Home/Home';
import PerfilUsuario from './pages/Perfil/PerfilUsuario';
import PerfilAdmin from './pages/Perfil/PerfilAdmin';

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil-usuario" element={<PerfilUsuario />} />
        <Route path="/perfil-admin" element={<PerfilAdmin />} />

      </Routes>

    </Router>

  );

}

export default App;