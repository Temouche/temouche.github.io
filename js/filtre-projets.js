// Filtre des projets par onglet : 3D, Temps réel, Site web
// Le bouton croix réaffiche tous les projets (désactivé tant qu'aucun filtre n'est actif).
document.addEventListener('DOMContentLoaded', () => {
    const onglets = document.querySelectorAll('[data-filtre]');
    const reset = document.getElementById('filtre-reset');
    const projets = document.querySelectorAll('[data-categorie]');
    if (onglets.length === 0 || !reset) return;

    // categorie = null : tous les projets
    function filtrer(categorie) {
        onglets.forEach((onglet) => {
            onglet.setAttribute('aria-pressed', String(onglet.dataset.filtre === categorie));
        });
        reset.disabled = categorie === null;

        projets.forEach((projet) => {
            const categories = projet.dataset.categorie.split(',');
            projet.hidden = categorie !== null && !categories.includes(categorie);
        });
    }

    onglets.forEach((onglet) => {
        onglet.addEventListener('click', () => filtrer(onglet.dataset.filtre));
    });
    reset.addEventListener('click', () => filtrer(null));
});