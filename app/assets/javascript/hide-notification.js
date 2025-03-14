// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find the close link
    const closeLink = document.querySelector('.govuk-notification-banner__link');
    
    // Find the entire notification banner
    const notificationBanner = document.querySelector('.govuk-notification-banner');
    
    // Add click event listener to the close link
    if (closeLink && notificationBanner) {
      closeLink.addEventListener('click', function(event) {
        // Prevent the default link behavior
        event.preventDefault();
        
        // Hide the notification banner
        notificationBanner.style.display = 'none';
        
        // Alternative: remove the element completely from the DOM
        // notificationBanner.remove();
      });
    }
  });