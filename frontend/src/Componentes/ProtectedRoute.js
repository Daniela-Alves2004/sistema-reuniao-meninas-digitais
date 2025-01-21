// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Enquanto o estado de autenticação está carregando, você pode exibir uma tela de carregamento
  if (loading) {

    return <div>Loading...</div>;
    
  }

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!isLoggedIn) {

    return <Navigate to="/" />;

  }

  // Se o usuário está logado, renderiza o componente solicitado
  return element;
};

export default ProtectedRoute;
