export default function getDate() {
  const now = new Date()
  return now.toLocaleDateString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}
