// File: app/assets/javascript/autocomplete.js

// We can't use require or import statements directly in the browser
// Instead, we'll use the global version of the accessible-autocomplete library
document.addEventListener('DOMContentLoaded', function() {
  // Check if the library is available globally (usually added via script tag)
  if (typeof window.accessibleAutocomplete !== 'undefined') {
    // Initialize function that we can call from our pages
    window.initAccessibleAutocomplete = function(elementId, options) {
      const container = document.getElementById(elementId + '-container');
      const hiddenInput = document.getElementById(elementId + '-hidden');
      
      if (!container) {
        console.error('Could not find container element with ID:', elementId + '-container');
        return;
      }
      
      window.accessibleAutocomplete({
        element: container,
        id: elementId,
        source: options.source || [],
        displayMenu: 'overlay',
        confirmOnBlur: true,
        onConfirm: function(selectedItem) {
          if (hiddenInput && selectedItem) {
            hiddenInput.value = selectedItem;
          }
        }
      });
    };
  } else {
    console.error('Accessible Autocomplete library not loaded. Make sure you\'ve included the script tag.');
  }
});