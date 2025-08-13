// src/utils/generadorSep/pdf417.js
import PDF417 from 'pdf417-generator';

/**
 * Dibuja el PDF417 en un canvas usando la firma soportada por la lib.
 * @param {string} text
 * @param {number} scaleX - px por módulo en X (entero)
 * @param {number} scaleY - px por módulo en Y (entero)
 * @returns {HTMLCanvasElement}
 */
export function pdf417ToCanvas(text, scaleX = 6, scaleY = 4) {
  const canvas = document.createElement('canvas');
  // pdf417-generator soporta: draw(text, canvas, scaleX, scaleY)
  PDF417.draw(text, canvas, Math.max(1, Math.round(scaleX)), Math.max(1, Math.round(scaleY)));
  return canvas;
}
