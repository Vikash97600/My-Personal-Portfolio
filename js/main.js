document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================================================
    // 1. GLOBAL INTERACTIVE ELEMENTS (Cursor Glow & Scroll Progress)
    // ==========================================================================
    
    const cursorGlow = document.getElementById('cursorGlow');
    const scrollProgress = document.getElementById('scrollProgress');

    // Custom Cursor Glow Follower
    document.addEventListener('mousemove', function (e) {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // Expanding glow state on interactive hover
    document.querySelectorAll('a, button, .project-card, .certification-card, .tool-radial-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorGlow) {
                cursorGlow.style.width = '400px';
                cursorGlow.style.height = '400px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorGlow) {
                cursorGlow.style.width = '300px';
                cursorGlow.style.height = '300px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)';
            }
        });
    });

    // Scroll Progress Indicator calculation
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            body.classList.toggle('light-mode');
            body.classList.toggle('dark-mode');

            // Save preference to localStorage
            const isDarkMode = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
    }

    // Check for saved theme preference (default is dark-mode)
    if (localStorage.getItem('darkMode') === 'false') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    // ==========================================================================
    // 2. STICKY NAVBAR, SCROLL SPY & MOBILE MENU DRAWER
    // ==========================================================================
    
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    // Smooth backdrop blur solid opacity change on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Drawer Toggle
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Dismiss drawer on menu item click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Active Section Indicator (Scroll Spy)
    function scrollSpy() {
        const currentScroll = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);

    // ==========================================================================
    // 3. TYPING ANIMATION (Hero Greeting Text)
    // ==========================================================================
    
    const textElement = document.querySelector('.sec-text');
    if (textElement) {
        const texts = ['Python Developer', 'Django Specialist', 'Flask Specialist', 'Problem Solver'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                textElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                textElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1600; // Freeze at completion
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 400; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }
        setTimeout(type, 800);
    }

    // ==========================================================================
    // 4. MICRO-INTERACTIONS (3D Tilt & Magnetic Buttons & Counters)
    // ==========================================================================
    
    // Interactive Native Card Tilt Effect
    const tiltElements = document.querySelectorAll('.project-card, .certification-card, .tool-radial-card, .stat-card, .team-role');
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            const tiltMax = 8; // degrees limit
            
            card.style.transform = `perspective(1000px) rotateX(${-percentY * tiltMax}deg) rotateY(${percentX * tiltMax}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // Magnetic CTA Button Pull
    const magneticBtns = document.querySelectorAll('.btn.primary, .btn.secondary, .btn.outline, .social-links a');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit coordinate pull to 12px max
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Scroll numerical counters increment animation
    const statsSection = document.querySelector('.about-stats-grid');
    const counters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function runCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 1500; // ms
            const stepTime = Math.max(Math.floor(duration / target), 30);
            let current = 0;
            
            const timer = setInterval(() => {
                current += 1;
                counter.textContent = current;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    runCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        
        observer.observe(statsSection);
    }

    // Skills Progress & Radial Animation trigger on scroll
    const skillsContainer = document.querySelector('.skills-container');
    let skillsAnimated = false;

    function animateSkills() {
        // Animate linear progress bars
        document.querySelectorAll('.progress').forEach(bar => {
            const targetWidth = bar.style.width || bar.getAttribute('data-width') || '0%';
            if (!bar.getAttribute('data-width')) {
                bar.setAttribute('data-width', targetWidth);
            }
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width');
            }, 100);
        });

        // Animate radial progress bars dynamically calculating radius for mobile adaptability
        document.querySelectorAll('.tool-radial-card').forEach(card => {
            const value = parseInt(card.getAttribute('data-value'), 10) || 0;
            const radialBar = card.querySelector('.radial-bar');
            if (radialBar) {
                const radius = radialBar.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                
                radialBar.style.strokeDasharray = circumference;
                radialBar.style.strokeDashoffset = circumference;
                
                const offset = circumference - (value / 100) * circumference;
                setTimeout(() => {
                    radialBar.style.strokeDashoffset = offset;
                }, 100);
            }
        });
    }

    if (skillsContainer) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    skillsAnimated = true;
                    animateSkills();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(skillsContainer);
    }

    // ==========================================================================
    // 5. PROJECTS CLIENT-SIDE FILTERING ACTION
    // ==========================================================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Set active category link styling
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                // Show/hide logic
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ==========================================================================
    // 6. THREE.JS 3D PARTICLES BACKGROUND & HERO TECH SPHERE
    // ==========================================================================
    
    if (typeof THREE !== 'undefined') {
        initParticlesBackground();
        initHero3DStackSphere();
    }

    // A space dust stars background mapping
    function initParticlesBackground() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Generate stars vertices
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 450;
        const positions = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1400; // x
            positions[i + 1] = (Math.random() - 0.5) * 1400; // y
            positions[i + 2] = (Math.random() - 0.5) * 1000 - 200; // z
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Soft star point textures
        const starsMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 2.2,
            transparent: true,
            opacity: 0.45,
            sizeAttenuation: true
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Resize handler
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Slowly animate point field rotation
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            starField.rotation.y += 0.0006;
            starField.rotation.x += 0.0003;
            renderer.render(scene, camera);
        }
        animateParticles();
    }

    // Hero 3D stack sphere surrounding profile image
    function initHero3DStackSphere() {
        const container = document.getElementById('three-tech-canvas-container');
        if (!container) return;

        let width = container.offsetWidth || 400;
        let height = container.offsetHeight || 400;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.z = 4.2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Core visual globe mapping
        const globeGeo = new THREE.SphereGeometry(1.3, 18, 18);
        const globeMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const techCoreGlobe = new THREE.Mesh(globeGeo, globeMat);
        scene.add(techCoreGlobe);

        // Canvas Billboard generator for orbital labels
        function makeLabelSprite(text, borderHex) {
            const canvas = document.createElement('canvas');
            canvas.width = 190;
            canvas.height = 54;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
            ctx.beginPath();
            ctx.roundRect(4, 4, 182, 46, 12);
            ctx.fill();

            ctx.strokeStyle = borderHex;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Font styles
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Inter, Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 95, 27);

            const texture = new THREE.CanvasTexture(canvas);
            const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(1.4, 0.4, 1);
            return sprite;
        }

        // Tech orbital configurations
        const techStacks = [
            { name: 'Python', color: '#3776AB' },
            { name: 'Django', color: '#092E20' },
            { name: 'Flask', color: '#888888' },
            { name: 'MySQL', color: '#00758F' },
            { name: 'JavaScript', color: '#F7DF1E' },
            { name: 'Git', color: '#F05032' }
        ];

        const orbitRadius = 1.85;
        const orbitalGroup = new THREE.Group();
        const spritesArray = [];

        techStacks.forEach((tech, index) => {
            const sprite = makeLabelSprite(tech.name, tech.color);
            
            // Distribute labels in coordinates evenly
            const phi = Math.acos(-1 + (2 * index) / techStacks.length);
            const theta = Math.sqrt(techStacks.length * Math.PI) * phi;

            sprite.position.x = orbitRadius * Math.sin(phi) * Math.cos(theta);
            sprite.position.y = orbitRadius * Math.sin(phi) * Math.sin(theta);
            sprite.position.z = orbitRadius * Math.cos(phi);

            // Keep custom data references for rotators
            sprite.userData = { phi, theta, index };
            orbitalGroup.add(sprite);
            spritesArray.push(sprite);
        });

        scene.add(orbitalGroup);

        // Parallax pointers
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX = (e.clientX - centerX) / centerX; // normalize -1 to 1
            mouseY = (e.clientY - centerY) / centerY;
        });

        // Resize listeners
        window.addEventListener('resize', () => {
            width = container.offsetWidth || 400;
            height = container.offsetHeight || 400;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        // Orbit update loop
        let angle = 0;
        function updateTechSphere() {
            requestAnimationFrame(updateTechSphere);

            angle += 0.0035;

            // Orbit rotation around local axes
            orbitalGroup.rotation.y = angle;
            orbitalGroup.rotation.x = angle * 0.5;

            // Slowly spin core globe wireframe
            techCoreGlobe.rotation.y -= 0.002;

            // Parallax subtle shifts
            camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.06;
            camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.06;
            camera.lookAt(scene.position);

            // Responsive scroll rotation accelerator
            const currentScroll = window.scrollY * 0.001;
            orbitalGroup.rotation.y += currentScroll * 0.02;

            renderer.render(scene, camera);
        }

        updateTechSphere();
    }

    // ==========================================================================
    // 7. LIGHTBOX GALLERY MODAL ACTION
    // ==========================================================================
    
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const currentIndexElement = document.getElementById('currentIndex');
        const totalImagesElement = document.getElementById('totalImages');
        const closeBtn = document.querySelector('.modal-close');
        const prevBtn = document.querySelector('.modal-nav.prev');
        const nextBtn = document.querySelector('.modal-nav.next');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const downloadBtn = document.getElementById('downloadBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        let currentImageIndex = 0;
        let images = [];
        let captions = [];
        let zoomLevel = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        // Collect gallery assets from masonry grid items
        function initGallery() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            images = [];
            captions = [];
            
            galleryItems.forEach((item) => {
                const imgSrc = item.getAttribute('data-image');
                const caption = item.getAttribute('data-caption');
                
                if (imgSrc) {
                    // Resolve paths relative to root directory (removing parent prefix if exists)
                    const cleanPath = imgSrc.startsWith('../') ? imgSrc.substring(3) : imgSrc;
                    images.push(cleanPath);
                    captions.push(caption || '');
                }
            });
            
            if (totalImagesElement) {
                totalImagesElement.textContent = images.length;
            }
        }

        function openModal(index) {
            if (index < 0 || index >= images.length) return;
            
            currentImageIndex = index;
            updateModal();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetImageTransform();
        }

        function updateModal() {
            if (images.length === 0) return;
            
            const currentImgPath = images[currentImageIndex];
            modalImage.src = currentImgPath;
            modalImage.alt = captions[currentImageIndex] || 'Gallery image';
            modalCaption.textContent = captions[currentImageIndex] || '';
            if (currentIndexElement) {
                currentIndexElement.textContent = currentImageIndex + 1;
            }
            
            // Preload neighbors
            const nextIndex = (currentImageIndex + 1) % images.length;
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            
            [nextIndex, prevIndex].forEach(idx => {
                const img = new Image();
                img.src = images[idx];
            });
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateModal();
            resetImageTransform();
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateModal();
            resetImageTransform();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            resetImageTransform();
        }

        function resetImageTransform() {
            zoomLevel = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
        }

        function updateImageTransform() {
            modalImage.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (zoomLevel < 4) {
                    zoomLevel += 0.4;
                    updateImageTransform();
                }
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (zoomLevel > 0.6) {
                    zoomLevel -= 0.4;
                    updateImageTransform();
                }
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = modalImage.src;
                link.download = `achievements-image-${currentImageIndex + 1}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    modalImage.requestFullscreen().catch(err => {
                        console.error('Fullscreen request error:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }

        // Attach modal trigger click events to items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                openModal(index);
            });
        });

        // Close triggers
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        // Click outside image dismisses modal
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        // Keyboard bindings
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });

        // Touch swiping triggers for mobile viewports
        let touchStartX = 0;
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;

            if (Math.abs(diffX) > 60) {
                if (diffX > 0) nextImage();
                else prevImage();
            }
        }, { passive: true });

        initGallery();
    }

    // Scroll animation trigger (AOS initialization fallback)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80
        });
    }

});