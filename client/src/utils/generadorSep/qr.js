import QRCode from 'qrcode';

/**
 * Genera un QR como PNG a una densidad "real" (dpi) para evitar blur al meterlo en el PDF.
 * @param {string} text        Contenido del QR
 * @param {number} sizePt      Tamaño deseado del QR en el PDF (en puntos, 1pt = 1/72")
 * @param {number} dpi=600     Densidad objetivo para el PNG
 * @param {number} margin=2    Quiet zone del QR (en módulos)
 * @returns {Promise<{dataUrl:string, pixelWidth:number, pixelHeight:number, dpi:number}>}
 */
export async function qrToPngAtDpi(text, sizePt, dpi = 600, margin = 2) {
  const sizePx = Math.max(300, Math.round((sizePt / 72) * dpi)); // pt -> px
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, {
    width: sizePx,
    margin,              // margen en módulos (2–4 típico)
    errorCorrectionLevel: 'M', // L|M|Q|H (sube a 'Q'/'H' si quieres más robusto)
    // color: { dark: '#000000', light: '#FFFFFF' },
  });
  return {
    dataUrl: canvas.toDataURL('image/png'),
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    dpi,
  };
}