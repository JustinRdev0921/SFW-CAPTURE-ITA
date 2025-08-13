// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//rutas
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ProfilePage from "./pages/ProfilePage";
import UserFormPage from "./pages/UserFormPage";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import CargaDocsPage from "./pages/CargaDocsPage";
import CargaDocsPageRefact from "./pages/CargaDocsPage-Refact";  // ← import de la versión refactor
import GeneradorSeparadores from './pages/GeneradorSeparadores';

import ProtectedRoute from "./ProtectedRoute";

import { UserProvider } from "./context/UsersContext";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import CargaDocsPageRefactNoAttributes from './pages/CargaDocsPage-Refact-NoAttributes';

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas: solo usuarios autenticados */}
          <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
            
            {/* Rutas solo para administradores (user.Admin === 1) */}
            <Route element={<ProtectedRoute isAllowed={user?.Admin === 1} />}>
              <Route path="/users" element={<UserPage />} />
              <Route path="/add-user" element={<UserFormPage />} />
              <Route path="/user/:id" element={<UserFormPage />} />
            </Route>

            {/* Rutas para cualquier usuario autenticado */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/cargaDocs" element={<CargaDocsPage />} />
            <Route path="/twainBridge" element={<CargaDocsPageRefact />} />  {/* ← nueva ruta */}
            <Route path="/twainBridgeNoAtt" element={<CargaDocsPageRefactNoAttributes  />} />
            <Route path="/generador-separadores" element={<GeneradorSeparadores />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
