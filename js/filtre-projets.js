// Filtre projets par catégorie
// Catégories : Tous, 3D, Motion design, Design graphique, Temps réel, Site web
document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('filtre-categorie');
    const projets = document.querySelectorAll('[data-categorie]');
    if (!select) return;
    select.addEventListener('change', function() {
        const value = select.value;
        projets.forEach(projet => {
            if (value === 'tous' || projet.dataset.categorie.split(',').includes(value)) {
                projet.style.display = '';
            } else {
                projet.style.display = 'none';
            }
        });
    });
});
