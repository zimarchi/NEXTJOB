export function formatDate(dateStr: string) {
    const date = new Date (dateStr)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }