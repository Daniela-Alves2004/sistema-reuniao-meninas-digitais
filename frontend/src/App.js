import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './componentes/macro/Login/Login'; 

import Home from './componentes/macro/Home/Home';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para a página home */}
        <Route path="/home" element={<Home />} />

        {/* Defina a rota padrão como login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
