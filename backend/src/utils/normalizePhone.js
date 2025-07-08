export const normalizePhone = (phone) => {
  if (!phone) return undefined;

  // Quitar todo excepto números
  let clean = phone.replace(/\D/g, "");

  // Si empieza con "521", quitar los 3 dígitos
  if (clean.startsWith("521")) {
    clean = clean.slice(3);
  }
  // Si empieza con "52", quitar los 2 dígitos
  else if (clean.startsWith("52")) {
    clean = clean.slice(2);
  }
  // Si empieza con "1", quitar el dígito extra
  else if (clean.startsWith("1") && clean.length === 11) {
    clean = clean.slice(1);
  }

  // Después de limpiar, debe haber 10 dígitos
  if (clean.length !== 10) {
    return undefined;
  }

  // Retornar normalizado
  return `+52${clean}`;
};
