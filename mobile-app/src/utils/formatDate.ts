const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Formats an ISO date string as e.g. "Fri, 12 Sep · 6:30 PM". */
export const formatDueDate = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} · ${hours}:${minutes} ${ampm}`;
};

export const formatGreetingDate = (date: Date): string => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${weekdays[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

export const getGreeting = (date: Date): string => {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
