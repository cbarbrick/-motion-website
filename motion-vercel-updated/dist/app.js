const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header') && !mobileNav.hidden) setMenu(false); });
const desktop = matchMedia('(min-width: 951px)');
desktop.addEventListener('change', event => { if (event.matches) setMenu(false); });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('#hero-media video');
const heroToggle = document.querySelector('#hero-video-toggle');
if (heroVideo) {
  heroToggle.hidden = false;
  function updateHeroButton() {
    heroToggle.setAttribute('aria-label', heroVideo.paused ? 'Play background video' : 'Pause background video');
    heroToggle.innerHTML = '<span aria-hidden="true">' + (heroVideo.paused ? '▷' : 'Ⅱ') + '</span>';
  }
  heroVideo.addEventListener('play', updateHeroButton);
  heroVideo.addEventListener('pause', updateHeroButton);
  heroVideo.addEventListener('error', () => { heroToggle.hidden = true; });
  heroToggle.addEventListener('click', () => { if (heroVideo.paused) heroVideo.play().catch(updateHeroButton); else heroVideo.pause(); });
  if (!reduceMotion.matches) heroVideo.play().catch(updateHeroButton);
  else updateHeroButton();
  reduceMotion.addEventListener('change', event => { if (event.matches) heroVideo.pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) heroVideo.pause(); });
}
// Load and loop each reel only while it is visible. Native controls allow sound and pause.
const reels = [...document.querySelectorAll('.scroll-video')];
const visibleReels = new Set();
const manuallyPaused = new WeakSet();
const automaticallyPausing = new WeakSet();
function pauseReel(video) {
  if (!video.paused) { automaticallyPausing.add(video); video.pause(); }
}
function playReel(video) {
  if (document.hidden || document.querySelector('#post-dialog[open]') || reduceMotion.matches || manuallyPaused.has(video)) return;
  if (!video.src) { video.src = video.dataset.src; video.load(); }
  video.play().catch(() => {});
}
reels.forEach(video => {
  video.muted = true;
  video.addEventListener('pointerdown', () => {
    if (!video.src) { video.src = video.dataset.src; video.load(); }
  }, {once:true});
  video.addEventListener('focus', () => {
    if (!video.src) { video.src = video.dataset.src; video.load(); }
  }, {once:true});
  video.addEventListener('pause', () => {
    if (automaticallyPausing.has(video)) automaticallyPausing.delete(video);
    else manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
});
if ('IntersectionObserver' in window) {
  const reelObserver = new IntersectionObserver(entries => {
    entries.forEach(({target:video, isIntersecting, intersectionRatio}) => {
      if (isIntersecting && intersectionRatio >= .35) {
        visibleReels.add(video);
        playReel(video);
      } else {
        visibleReels.delete(video);
        pauseReel(video);
      }
    });
  }, {threshold:[0,.35]});
  reels.forEach(video => reelObserver.observe(video));
} else {
  reels.forEach(video => { video.src = video.dataset.src; });
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) reels.forEach(pauseReel);
  else visibleReels.forEach(playReel);
});
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) reels.forEach(pauseReel);
  else visibleReels.forEach(playReel);
});
const siteTop = document.querySelector('#site-top');
function updateHeader() { siteTop.classList.toggle('is-scrolled', window.scrollY > 48); }
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();
const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
const muteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5ZM16 9l5 6m0-6-5 6"/></svg>';
const soundIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
reels.forEach(video => {
  const card = video.closest('.feed-card');
  const playButton = card.querySelector('.reel-play');
  const soundButton = card.querySelector('.reel-sound');
  function syncPlay() {
    playButton.innerHTML = video.paused ? playIcon : pauseIcon;
    playButton.setAttribute('aria-label', (video.paused ? 'Play ' : 'Pause ') + video.getAttribute('aria-label'));
  }
  playButton.addEventListener('click', () => {
    if (video.paused) {
      if (!video.src) { video.src = video.dataset.src; video.load(); }
      manuallyPaused.delete(video);
      video.play().catch(syncPlay);
    } else { manuallyPaused.add(video); video.pause(); }
  });
  soundButton.addEventListener('click', () => {
    video.muted = !video.muted;
    soundButton.innerHTML = video.muted ? muteIcon : soundIcon;
    soundButton.setAttribute('aria-label', video.muted ? 'Unmute reel' : 'Mute reel');
    soundButton.setAttribute('aria-pressed', String(!video.muted));
  });
  video.addEventListener('play', syncPlay);
  video.addEventListener('pause', syncPlay);
  syncPlay();
});
const postDialog = document.querySelector('#post-dialog');
let postTrigger;
document.querySelectorAll('.caption-open').forEach(button => {
  button.addEventListener('click', () => {
    postTrigger = button;
    const card = button.closest('.feed-card');
    const original = card.querySelector('video,img');
    const media = original.cloneNode(true);
    if (media.tagName === 'VIDEO') {
      media.src = original.src || original.dataset.src;
      media.controls = true;
      media.muted = true;
      media.loop = true;
      media.removeAttribute('class');
    }
    reels.forEach(pauseReel);
    postDialog.querySelector('.post-media').replaceChildren(media);
    postDialog.querySelector('#post-caption').textContent = card.dataset.caption;
    postDialog.showModal();
    document.body.style.overflow = 'hidden';
    if (media.tagName === 'VIDEO') media.play().catch(() => {});
  });
});
postDialog.querySelector('.post-close').addEventListener('click', () => postDialog.close());
postDialog.addEventListener('click', event => {
  if (event.target === postDialog) {
    const rect = postDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) postDialog.close();
  }
});
postDialog.addEventListener('close', () => {
  postDialog.querySelector('video')?.pause();
  postDialog.querySelector('.post-media').replaceChildren();
  document.body.style.overflow = '';
  postTrigger?.focus();
  visibleReels.forEach(playReel);
});
