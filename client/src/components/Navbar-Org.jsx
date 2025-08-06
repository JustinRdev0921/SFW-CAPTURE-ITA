import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-700 flex justify-between items-center py-5 px-10">
      <Link to="/" className="font-bold text-white">
        <h1 className="text-2xl font-bold text-white">CaptureSoft</h1>
      </Link>
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>
      <ul
        className={`flex-col lg:flex lg:flex-row gap-2 lg:gap-x-2 absolute lg:static left-0 w-full lg:w-auto bg-zinc-700 lg:bg-transparent lg:flex ${isOpen ? 'block' : 'hidden'}`}
      >
        {isAuthenticated && user.Admin === 1 ? (
          <>
            <li className="font-bold text-white lg:mb-0 mb-4 text-center">
              Bienvenid@ {user.nombreUsuario} |
            </li>
            <li className="text-center">
              <Link
                to="/cargaDocs"
                className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Captura
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/users"
                className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Usuarios
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/add-user"
                className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Nuevo Usuario
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/profile"
                className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </Link>
            </li>
            <li className="text-center">
              <Link
                to="/"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
              >
                Salir
              </Link>
            </li>
          </>
        ) : (
          <>
            {isAuthenticated ? (
              <>
                <li className="font-bold text-white lg:mb-0 mb-4 text-center">
                  Bienvenid@ {user.nombreUsuario}
                </li>
                <li className="text-center">
                  <Link
                    to="/cargaDocs"
                    className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Captura
                  </Link>
                </li>
                <li className="text-center">
                  <Link
                    to="/profile"
                    className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Perfil
                  </Link>
                </li>
                <li className="text-center">
                  <Link
                    to="/"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                  >
                    Salir
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="text-center">
                  <Link
                    to="/login"
                    className="font-bold text-white bg-slate-600 px-4 py-1 rounded-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
