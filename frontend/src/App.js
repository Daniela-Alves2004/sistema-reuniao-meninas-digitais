import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './componentes/macro/Login/Login';
import Home from './componentes/macro/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './componentes/ProtectedRoute'; 

function App() {

    return (

        <AuthProvider>

            <Router>

                <Routes>

                    <Route path="/" element={<Login />} />

                    <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

                </Routes>

            </Router>

        </AuthProvider>

    );

}

export default App;