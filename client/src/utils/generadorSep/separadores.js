import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { qrToPngAtDpi } from './qr';

const A4 = { w: 595.28, h: 841.89 }; // 72dpi

/**
 * Crea un A4 con título centrado y un QR 2D centrado, nítido (sin reescalar).
 * title = NMCATEGORY, code = IDCATEGORY
 */
export async function buildSeparatorPDF({
  title,
  code,
  titleSize = 28,
  margin = 48,
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4.w, A4.h]);
  const { width, height } = page.getSize();

  // 1) Título
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const titleY = height - margin - titleSize;
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: titleY,
    size: titleSize,
    font,
    color: rgb(0, 0, 0),
  });

  // 2) Tamaño físico del QR en el PDF (ajústalo a tu gusto)
  //    220pt ≈ 77.5 mm de lado (A4 se ve bien a esta escala)
  const usableW = width - margin * 2;
  const maxSquare = Math.min(usableW, height - (margin * 2 + titleSize + 24));
  const qrSizePt = Math.min(220, maxSquare * 0.9); // límite superior y 10% de aire

  // 3) Generar QR a alta densidad y dibujarlo 1:1 en el PDF (sin reescalar)
  const { dataUrl, pixelWidth, dpi } = await qrToPngAtDpi(code, qrSizePt, 600, 3);
  const png = await pdf.embedPng(dataUrl);

  // Tamaño exacto en puntos según dpi para evitar antialias
  const drawW = (pixelWidth * 72) / dpi;
  const drawH = drawW; // cuadrado

  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2 - 12; // un pelín bajo el centro

  page.drawImage(png, { x, y, width: drawW, height: drawH });

  const bytes = await pdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

// Descarga robusta (sin cambios)
export async function downloadSeparator({ title, code, filename }) {
  try {
    const blob = await buildSeparatorPDF({ title, code });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `Separador_${code}.pdf`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    console.error('Error al generar/descargar PDF:', e);
    try {
      const blob = await buildSeparatorPDF({ title, code });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (e2) {
      console.error('Fallback también falló:', e2);
      alert('No se pudo generar el PDF. Revisa la consola para más detalles.');
    }
  }
}