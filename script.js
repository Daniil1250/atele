const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

const burgerBtn = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMenu() {
    const isActive = mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    burgerBtn.innerHTML = isActive ? '<i class="fa-solid fa-times"></i>' : '<i class="fa-solid fa-bars"></i>';
}
burgerBtn.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', closeMenu);

function closeMenu() {
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

const privacyModal = document.getElementById('privacyModal');
const bookingModal = document.getElementById('bookingModal');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');

let previouslyFocusedElement = null;

function openModalLogic(modalElement) {
    previouslyFocusedElement = document.activeElement;
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
        requestAnimationFrame(() => focusable[0].focus());
    }
}

function closeModalLogic(modalElement) {
    modalElement.classList.remove('active');
    document.body.style.overflow = '';
    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

function openPrivacyModal() { openModalLogic(privacyModal); }
function closePrivacyModal() { closeModalLogic(privacyModal); }

function openBookingModal() { openModalLogic(bookingModal); }
function closeBookingModal() { closeModalLogic(bookingModal); }

function openLightbox(src) {
    lightboxImg.src = src;
    openModalLogic(lightboxModal);
}
function closeLightbox() { closeModalLogic(lightboxModal); }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (privacyModal.classList.contains('active')) closePrivacyModal();
        if (bookingModal.classList.contains('active')) closeBookingModal();
        if (lightboxModal.classList.contains('active')) closeLightbox();
    }
    
    if (privacyModal.classList.contains('active') && e.key === 'Tab') {
        const focusable = privacyModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

const revealElements = document.querySelectorAll('.reveal');

function revealOnLoad() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            el.classList.add('active');
        }
    });
}
revealOnLoad();

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

const mapContainer = document.getElementById('mapContainer');
const mapObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            mapContainer.innerHTML = `
                <div style="position:relative;overflow:hidden; height:100%;">
                    <iframe src="https://yandex.ru/map-widget/v1/?ll=40.537204%2C64.535738&mode=search&oid=66163259063&ol=biz&tab=features&z=17.96" 
                            width="100%" height="100%" frameborder="0" allowfullscreen="true" style="position:relative;" loading="lazy">
                    </iframe>
                </div>
            `;
            observer.unobserve(mapContainer);
        }
    });
}, { threshold: 0.1 });

mapObserver.observe(mapContainer);

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const loadMoreBtn = document.getElementById('loadMoreBtn');
let isExpanded = false;

loadMoreBtn.addEventListener('click', () => {
    const hiddenCards = document.querySelectorAll('.hidden-card');
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        hiddenCards.forEach((card, index) => {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 50);
        });
        loadMoreBtn.textContent = 'Скрыть';
    } else {
        hiddenCards.forEach(card => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 400);
        });
        loadMoreBtn.textContent = 'Показать еще';
        
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        
        if (isExpanded) {
            isExpanded = false;
            loadMoreBtn.textContent = 'Показать еще';
        }

        galleryCards.forEach(card => {
            const isHidden = card.classList.contains('hidden-card');
            
            if (filterValue === 'all') {
                if (isHidden) {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                } else {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                }
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            }
        });
    });
});

const logo3d = document.getElementById('logo3d');
const container3d = document.getElementById('3d-container');

if (container3d && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container3d.addEventListener('mousemove', (e) => {
        const rect = container3d.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        logo3d.style.animation = 'none';
        logo3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container3d.addEventListener('mouseleave', () => {
        logo3d.style.animation = 'float3d 6s ease-in-out infinite';
        logo3d.style.transform = '';
    });
}