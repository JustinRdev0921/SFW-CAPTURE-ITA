import React from 'react';

const Card = ({ empleado }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-4 py-4">
        <div className="font-bold text-xl mb-2">{empleado.NOMBRES} {empleado.APELLIDOS}</div>
        <p className="text-gray-700 text-base"><span className='font-bold'>Cédula:</span> {empleado.CEDULA}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>Ciudad:</span> {empleado.CIUDAD}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>Cargo:</span> {empleado.CARGO}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>División:</span> {empleado.DIVISION}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>Seccion:</span> {empleado.SELECCION}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>Estado:</span> {empleado.ESTADO}</p>
        <p className="text-gray-700 text-base"><span className='font-bold'>Tipo Contrato:</span> {empleado.TIPO_CONTRATO}</p>
      </div>
    </div>
  );
};

export default Card;
