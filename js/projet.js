document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('carrousel-main');
    const thumbs = document.getElementById('carrousel-thumbs');
    const items = Array.from(document.querySelectorAll('[data-carousel-item]'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('carrousel-prev');
    const nextBtn = document.getElementById('carrousel-next');

    // Page qui n'a pas de carrousel : on ne fait rien
    if (!main || !thumbs || items.length === 0) return;
  
    let current = 0;
    let fadeTimer = null;

    /* ---------- Visuel principal ---------- */

    function buildMedia(item) {
        const src = item.dataset.src;

        if (item.dataset.type === 'video') {
            const wrapper = document.createElement('div');
            wrapper.className = 'h-full w-full';

            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.className = 'h-full w-full';
            iframe.title = 'Vidéo du projet';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;

            wrapper.appendChild(iframe);
            return wrapper;
        }

        const img = document.createElement('img');
        img.src = src;
        img.alt = item.querySelector('img')?.alt || '';
        img.className = 'h-full w-full cursor-zoom-in object-cover';
        img.addEventListener('click', () => openLightbox(src, img.alt));
        return img;
    }
    
    function updateArrows() {
    // L'attribut hidden masque complètement la flèche
    prevBtn.hidden = current === 0;
    nextBtn.hidden = current === items.length - 1;
    }

    // Garde la miniature active visible dans la colonne
    function scrollThumbIntoView(item) {
        const top = item.offsetTop;
        const bottom = top + item.offsetHeight;
        if (top < thumbs.scrollTop) {
            thumbs.scrollTo({ top: top, behavior: 'smooth' });
        } else if (bottom > thumbs.scrollTop + thumbs.clientHeight) {
            thumbs.scrollTo({ top: bottom - thumbs.clientHeight, behavior: 'smooth' });
        }
    }

    function show(index) {
        current = index;

        items.forEach((item, i) => {
            item.dataset.active = String(i === index);
        });

        updateArrows();
        scrollThumbIntoView(items[index]);

        // Petit fondu entre deux visuels
        clearTimeout(fadeTimer);
        main.style.opacity = '0';
        fadeTimer = setTimeout(() => {
            main.replaceChildren(buildMedia(items[index]));
            main.style.opacity = '1';
        }, 150);
    }

    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            if (i !== current) show(i);
        });
    });

    /* ---------- Miniatures : fondu en bas tant qu'on peut scroller ---------- */

    function updateFade() {
        const canScroll = thumbs.scrollHeight > thumbs.clientHeight + 2;
        const atEnd = thumbs.scrollTop + thumbs.clientHeight >= thumbs.scrollHeight - 2;
        const mask = canScroll && !atEnd
            ? 'linear-gradient(to bottom, #000 calc(100% - 80px), transparent)'
            : 'none';

        thumbs.style.maskImage = mask;
        thumbs.style.webkitMaskImage = mask;
    }

    thumbs.addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);
    window.addEventListener('load', updateFade);

    prevBtn.addEventListener('click', () => {
    if (current > 0) show(current - 1);
    });
    nextBtn.addEventListener('click', () => {
        if (current < items.length - 1) show(current + 1);
    });

    /* ---------- Lightbox ---------- */

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.dataset.open = 'true';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.dataset.open = 'false';
        document.body.style.overflow = '';
    }

    // Clic n'importe où sauf sur l'image elle-même (fond ou croix)
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });
    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.dataset.open === 'true') closeLightbox();
    });

    /* ---------- Init ---------- */

    const initial = items.findIndex((item) => item.dataset.active === 'true');
    show(initial >= 0 ? initial : 0);
    updateFade();
});