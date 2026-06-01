// Navigation entre les images (et vidéo YouTube optionnelle en première diapo)
document.addEventListener('DOMContentLoaded', function () {

  const mainImg = document.getElementById('carrousel-main');
  const thumbsNodeList = document.querySelectorAll('#carrousel-thumbs img');
  const thumbs = Array.from(thumbsNodeList);
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const videoWrap = document.getElementById('carrousel-video');
  const iframe = document.getElementById('carrousel-iframe');
  const thumbsContainer = document.getElementById('carrousel-thumbs');
  const hasVideo = !!(videoWrap && iframe);

  if (!mainImg || thumbs.length === 0 || !btnPrev || !btnNext) return;

  let currentIndex = 0;

  function isVideoSlide(thumb) {
    return thumb.dataset.type === 'video' && thumb.dataset.youtubeId;
  }

  function isCurrentSlideVideo() {
    return hasVideo && isVideoSlide(thumbs[currentIndex]);
  }

  function findInitialIndex() {
    if (thumbsContainer?.dataset.initialIndex !== undefined) {
      const n = parseInt(thumbsContainer.dataset.initialIndex, 10);
      if (!Number.isNaN(n) && n >= 0 && n < thumbs.length) return n;
    }
    const src = mainImg.getAttribute('src');
    const idx = thumbs.findIndex(t => (t.dataset.full || t.src) === src);
    return idx >= 0 ? idx : 0;
  }

  function setThumbStyles(activeIndex) {
    thumbs.forEach((t, i) => {
      t.classList.toggle('ring-2', i === activeIndex);
      t.classList.toggle('ring-white', i === activeIndex);
      t.classList.toggle('opacity-100', i === activeIndex);
      t.classList.toggle('opacity-60', i !== activeIndex);
    });
  }

  function showVideo(youtubeId, title) {
    videoWrap.classList.remove('hidden');
    videoWrap.setAttribute('aria-hidden', 'false');
    iframe.src = 'https://www.youtube.com/embed/' + youtubeId;
    iframe.title = title || 'Vidéo';
    mainImg.classList.add('hidden');
    mainImg.removeAttribute('role');
    mainImg.removeAttribute('aria-label');
  }

  function hideVideo() {
    videoWrap.classList.add('hidden');
    videoWrap.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    mainImg.classList.remove('hidden');
    mainImg.setAttribute('role', 'button');
    mainImg.setAttribute('aria-label', 'Ouvrir l\'image en grand');
  }

  function updateImage(index) {
    if (thumbs.length === 0) return;
    index = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[index];

    if (hasVideo && isVideoSlide(thumb)) {
      showVideo(thumb.dataset.youtubeId, thumb.alt);
    } else {
      if (hasVideo) hideVideo();
      const full = thumb.dataset.full || thumb.src;
      mainImg.src = full;
      mainImg.alt = thumb.alt || mainImg.alt || '';
      if (lightboxImg) {
        lightboxImg.src = full;
        lightboxImg.alt = thumb.alt || '';
      }
    }

    setThumbStyles(index);
    currentIndex = index;
  }

  function openLightbox() {
    if (!lightbox || !lightboxCloseBtn) return;
    lightbox.classList.remove('hidden');
    lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
  }

  currentIndex = findInitialIndex();
  updateImage(currentIndex);

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', function (e) {
      updateImage(i);
      e.stopPropagation();
    });
  });

  btnNext.addEventListener('click', function (e) {
    e.stopPropagation();
    updateImage(currentIndex + 1);
  });

  btnPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    updateImage(currentIndex - 1);
  });

  mainImg.addEventListener('click', function () {
    if (!isCurrentSlideVideo()) openLightbox();
  });

  if (lightbox && lightboxCloseBtn) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxCloseBtn) {
        closeLightbox();
      }
    });

    lightboxCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    } else if (e.key === 'ArrowRight') {
      updateImage(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      updateImage(currentIndex - 1);
    }
  });

});
