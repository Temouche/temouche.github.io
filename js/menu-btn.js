document.addEventListener('DOMContentLoaded', function() {
    
    // Gère l'apparition du bouton menu flottant
    const menuFlottant = document.getElementById('menuFlottant');
    const navElement = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (navElement) {
            const navRect = navElement.getBoundingClientRect();
            const isNavOutOfView = navRect.bottom < 0;
            
            if (isNavOutOfView) {
                menuFlottant.classList.remove('opacity-0', 'pointer-events-none');
                menuFlottant.classList.add('opacity-100');
            } else {
                menuFlottant.classList.add('opacity-0', 'pointer-events-none');
                menuFlottant.classList.remove('opacity-100');
            }
        }
    });
});