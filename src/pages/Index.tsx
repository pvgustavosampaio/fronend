
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    console.log('Redirecting to dashboard...');
  }, []);

  return <Navigate to="/login" replace />;
};

export default Index;
