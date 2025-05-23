export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Ensure the date is parsed correctly, especially if it's just a date part without time
  // The toLocaleDateString should handle various ISO formats, but if issues arise,
  // more robust parsing might be needed (e.g. with a library like date-fns if dates are complex)
  return new Date(dateString).toLocaleDateString();
};
