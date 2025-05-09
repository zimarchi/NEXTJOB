export function formatDateLong(dateStr: string) {
    const date = new Date (dateStr)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

export function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}