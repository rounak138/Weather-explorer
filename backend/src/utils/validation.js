export function validateSearchInput({ location, startDate, endDate }) {
  if (!location || typeof location !== 'string' || !location.trim()) {
    return 'Please provide a valid location name or coordinates.';
  }

  if (!startDate || !endDate) {
    return 'Start date and end date are both required.';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return 'Invalid start date format (use YYYY-MM-DD).';
  }

  if (isNaN(end.getTime())) {
    return 'Invalid end date format (use YYYY-MM-DD).';
  }

  if (end < start) {
    return 'End date cannot be earlier than start date.';
  }

  return null;
}
