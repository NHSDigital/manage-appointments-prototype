/**
 * Common helper functions used across the application
 */

// Format a date in various ways
const formatDate = (date, format) => {
    if (!date) return '';
    const d = new Date(date);
    
    // Default format is DD/MM/YYYY
    if (!format) {
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }
    
    // Add other formats as needed
    return d.toLocaleDateString();
  };
  
  // Capitalize first letter of a string
  const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  // Convert boolean to Yes/No
  const yesNo = (bool) => {
    return bool ? 'Yes' : 'No';
  };
  
  // Export all helper functions
  module.exports = {
    formatDate,
    capitalize,
    yesNo
  };