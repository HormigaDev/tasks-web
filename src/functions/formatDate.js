/**
 *
 * @param {string} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export default function formatDate(date, format = "D/M/Y") {
  if (format === "Y/M/D") {
    if (date instanceof Date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    const [y, m, d] = date.split(/[T ]/)[0].split(/[-\/]/);
    return `${y}/${("0" + m).slice(-2)}/${("0" + d).slice(-2)}`;
  }
  const [y, m, d] = date.split(/[T ]/)[0].split(/[-\/]/);
  return `${("0" + d).slice(-2)}/${("0" + m).slice(-2)}/${y}`;
}
// DATE to YYYY-MM-DD
export function formatDateToISO(date) {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  } else {
    const [d, m, y] = date.split(/[T ]/)[0].split(/[-\/]/);
    return `${y}-${("0" + m).slice(-2)}-${("0" + d).slice(-2)}`;
  }
}
