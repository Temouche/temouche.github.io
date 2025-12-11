document.addEventListener('DOMContentLoaded', function() {

    // Inclus fichiers html externes dans les data-include
    const placeholders = document.querySelectorAll('[data-include]');

    placeholders.forEach(placeholder => {
        const componentPath = placeholder.getAttribute('data-include');

        if (componentPath) {
            fetch(componentPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur de chargement pour ${componentPath}: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlContent => {
                    placeholder.innerHTML = htmlContent;
                    placeholder.removeAttribute('data-include');
                })
                .catch(error => console.error("Erreur lors de l'inclusion:", error));
        }
    });
});