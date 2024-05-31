/**
 *
 * @param {string} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export default function formatDate(date) {
  const [y, m, d] = date.split(/[T ]/)[0].split(/[-\/]/);
  return `${("0" + d).slice(-2)}/${("0" + m).slice(-2)}/${y}`;
}
