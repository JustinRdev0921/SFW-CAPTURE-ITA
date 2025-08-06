// src/components/Navbar.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = "font-bold text-white bg-slate-600 px-4 py-1 rounded-sm text-center"

function NavItem({ to, label, onClick, plain }) {
  // Ítem “plano” (Bienvenid@ … |)
  if (plain) {
    return (
      <li className="font-bold text-white lg:mb-0 mb-4 text-center">
        {label} |
      </li>
    )
  }

  // Enlace de navegación
  if (to) {
    return (
      <li className="text-center">
        <Link to={to} onClick={onClick} className={linkClass}>
          {label}
        </Link>
      </li>
    )
  }

  // Botón (por ejemplo “Salir”)
  return (
    <li className="text-center">
      <button onClick={onClick} className={linkClass}>
        {label}
      </button>
    </li>
  )
}

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const items = useMemo(() => {
    if (!isAuthenticated) {
      return [{ to: '/login', label: 'Iniciar sesión' }]
    }

    const common = [
      { to: '/cargaDocs',     label: 'Captura' },
      { to: '/twainBridge',   label: 'Twain' },
      { to: '/profile',       label: 'Perfil' },
    ]
    const adminExtras = user.Admin === 1
      ? [
          { to: '/users',    label: 'Usuarios' },
          { to: '/add-user', label: 'Nuevo Usuario' },
        ]
      : []

    return [
      // Primero la bienvenida, en modo 'plain'
      { label: `Bienvenid@ ${user.nombreUsuario}`, plain: true },

      // Luego tus enlaces de navegación
      ...common,
      ...adminExtras,

      // Finalmente el botón salir
      { label: 'Salir', onClick: logout },
    ]
  }, [isAuthenticated, user, logout])

  return (
    <nav className="bg-zinc-700 flex justify-between items-center py-5 px-10">
      <Link to="/" className="text-2xl font-bold text-white">
        CaptureSoft
      </Link>

      <button
        className="text-white lg:hidden"
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {/* Ícono hamburguesa / cerrar */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen
              ? "M6 18L18 6M6 6l12 12"
              : "M4 6h16M4 12h16m-7 6h7"
            }
          />
        </svg>
      </button>

      <ul className={`
          absolute lg:static left-0 w-full lg:w-auto
          bg-zinc-700 lg:bg-transparent
          flex flex-col lg:flex-row gap-2 lg:gap-x-2
          ${isOpen ? 'block' : 'hidden'} lg:flex
        `}>
        {items.map((item, idx) => (
          <NavItem
            key={idx}
            to={item.to}
            label={item.label}
            onClick={() => {
              setIsOpen(false)
              item.onClick?.()
            }}
            plain={item.plain}
          />
        ))}
      </ul>
    </nav>
  )
}
