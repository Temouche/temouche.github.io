document.addEventListener('DOMContentLoaded', function() {
    
    // Gère le visuel de la scrollbar
    const style = document.createElement('style');
    style.innerHTML = `
        body.scrollbar-hover::-webkit-scrollbar-thumb { background-color: #ffffff7e !important; }
        body.scrollbar-active::-webkit-scrollbar-thumb { background-color: #ffffff !important; }
    `;
    document.head.appendChild(style);

    const isScrollbar = (x) => x > window.innerWidth - 20;

    document.addEventListener('mousemove', (e) => {
        document.body.classList.toggle('scrollbar-hover', isScrollbar(e.clientX));
    });

    document.addEventListener('mousedown', (e) => {
        if (isScrollbar(e.clientX)) document.body.classList.add('scrollbar-active');
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('scrollbar-active');
    });

    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('scrollbar-hover', 'scrollbar-active');
    });
});