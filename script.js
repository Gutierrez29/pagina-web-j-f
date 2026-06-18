let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

if (totalSlides > 0) {
    function showSlide(index) {
        // Quitamos la clase 'active' de todas las imágenes
        slides.forEach(slide => slide.classList.remove('active'));

        // Lógica para que el carrusel sea infinito
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Añadimos la clase 'active' a la imagen correspondiente
        slides[currentSlide].classList.add('active');
    }

    function moveSlide(step) {
        showSlide(currentSlide + step);
    }

    // Configurar el carrusel para que cambie automáticamente cada 5 segundos
    setInterval(() => {
        moveSlide(1);
    }, 5000);
}

// --- LÓGICA DEL MENÚ MÓVIL ---
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

if (mobileMenu && navbar) {
    // Abrir/cerrar menú al tocar el botón
    mobileMenu.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // Cerrar el menú automáticamente al seleccionar una opción
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}

// --- ANIMACIONES DE APARICIÓN (REVEAL) ---
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Si el elemento tiene la clase 'count-up', iniciamos el contador
            if (entry.target.classList.contains('count-up')) {
                animateNumber(entry.target);
            }
            
            // Dejar de observar el elemento para que la animación solo ocurra UNA VEZ
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Función para animar números suavemente
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500; // 2.5 segundos para todos
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Efecto de desaceleración (easeOutQuad)
        const easeProgress = progress * (2 - progress);
        
        const currentCount = Math.floor(easeProgress * target);
        element.textContent = '+' + currentCount + (element.getAttribute('data-suffix') || '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = '+' + target + (element.getAttribute('data-suffix') || '');
        }
    }
    
    requestAnimationFrame(update);
}

// --- CARGA DINÁMICA DE PROYECTOS EN HOME ---
function loadProjectsHome() {
    const grids = {
        'Obras Civiles y Estructuras Metálicas': document.getElementById('grid-obras'),
        'Mantenimiento Vial y Soporte Minero': document.getElementById('grid-mantenimiento'),
        'Ingeniería y Montaje Industrial': document.getElementById('grid-ingenieria'),
        'Operaciones Logísticas y MATPEL': document.getElementById('grid-logistica')
    };

    if (!grids['Obras Civiles y Estructuras Metálicas']) return; // No estamos en el Home

    fetch('proyectos.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                const grid = grids[project.cat];
                if (grid) {
                    const card = document.createElement('div');
                    card.className = 'project-card reveal';
                    
                    // Ajustar ruta de imagen (eliminar ../ si existe)
                    const imgPath = project.img.replace('../', '');
                    
                    card.innerHTML = `
                        <img src="${imgPath}" alt="${project.title}">
                        <div class="overlay">
                            <div class="overlay-text">
                                <h4>${project.title}</h4>
                                <p>${project.desc.substring(0, 80)}...</p>
                                <a href="proyecto.html?id=${project.id}" class="saber-mas-btn">Saber más ></a>
                            </div>
                        </div>
                    `;
                    grid.appendChild(card);
                    // Observar el nuevo elemento para la animación
                    revealObserver.observe(card);
                }
            });
        })
        .catch(error => console.error('Error cargando proyectos:', error));
}

// Ejecutar carga al iniciar
document.addEventListener('DOMContentLoaded', loadProjectsHome);