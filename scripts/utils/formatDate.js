export function formatChatMessageDate(dateString) {
  if (!dateString) {
    console.error("failed to format date, dateString is invalid");
    return;
  }

  const now = new Date();
  const sentAt = new Date(dateString);

  const difference = now - sentAt;
  const thirtyMinutes = 30 * 60 * 1000;

  if (difference < thirtyMinutes) {
    return "Just sent";
  }

  return new Date(dateString).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
