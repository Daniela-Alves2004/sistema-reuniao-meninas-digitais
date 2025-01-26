import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas para qualquer tipo de Usuária
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Home from './pages/Home/Home';
import Perfil from './pages/Perfil/Perfil';

function App() {

  return (

    <Router>

      <Routes>

        {/* Rota de login pública */}
        <Route path="/" element={<Login />} />

        {/* Rota para a página de cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota protegida */}
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />

      </Routes>

    </Router>

  );

}

export default App;