let currentSlide = 0;
const totalSlides = 79;
const slideWidth = 960.0;
const slideHeight = 720.0;

function calculateScale() {
    const container = document.getElementById('presentation-container');
    const isFullscreen = document.fullscreenElement !== null;
    let availableWidth, availableHeight;
    if (isFullscreen) {
        availableWidth = window.innerWidth;
        availableHeight = window.innerHeight - 80;
    } else {
        availableWidth = window.innerWidth - 40;
        availableHeight = window.innerHeight - 150;
    }
    const scale = Math.min(availableWidth / slideWidth, availableHeight / slideHeight, 1.0);
    container.style.transform = `scale(${scale})`;
}

function updateProgress() {
    const progress = document.getElementById('progress');
    if (progress) {
        const percent = ((currentSlide + 1) / totalSlides) * 100;
        progress.style.width = `${percent}%`;
    }
}

function showSlide(index) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    const slide = document.getElementById(`slide-${index}`);
    if (slide) slide.classList.add('active');
    document.getElementById('slide-counter').textContent = `${index + 1} / ${totalSlides}`;
    document.getElementById('prev-btn').disabled = (index === 0);
    document.getElementById('next-btn').disabled = (index === totalSlides - 1);
    updateProgress();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) { currentSlide++; showSlide(currentSlide); }
}

function previousSlide() {
    if (currentSlide > 0) { currentSlide--; showSlide(currentSlide); }
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) { currentSlide = index; showSlide(currentSlide); }
}

function toggleFullscreen() {
    const wrapper = document.getElementById('presentation-wrapper');
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen().then(() => calculateScale()).catch(err => console.log(err));
    } else {
        document.exitFullscreen().then(() => calculateScale());
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); nextSlide(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); previousSlide(); break;
        case 'Home': e.preventDefault(); goToSlide(0); break;
        case 'End': e.preventDefault(); goToSlide(totalSlides - 1); break;
        case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
    }
});

let touchStartX = 0, touchEndX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) { diff < 0 ? nextSlide() : previousSlide(); }
});

document.addEventListener('fullscreenchange', () => {
    calculateScale();
    const icon = document.querySelector('#fullscreen-btn i');
    if (icon) icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
});

window.addEventListener('resize', calculateScale);
window.addEventListener('load', () => { calculateScale(); showSlide(0); });
