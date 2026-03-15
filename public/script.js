document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Fetch Data
        // To avoid CORS locally without server, we might need a server. 
        // For this scenario, assuming it runs on a simple HTTP server.
        const response = await fetch(`/data/site_config.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load site.json');
        const data = await response.json();
        
        // Setup initial config (Theme, Title, etc.)
        document.title = data.site.title || 'Portfolio';
        document.documentElement.setAttribute('data-theme', data.site.theme || 'dark');
        
        // Update CSS variables if provided in JSON
        if (data.site.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', data.site.primaryColor);
            // Convert Hex to RGB for utility classes
            const hex = data.site.primaryColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            document.documentElement.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);
        }
        if (data.site.accentColor) document.documentElement.style.setProperty('--color-accent', data.site.accentColor);

        // 2. Load Sections
        const sectionsToLoad = [
            { id: 'navbar-container', url: '/sections/navbar.html', dataKey: 'site' },
            { id: 'hero-container', url: '/sections/hero.html', dataKey: 'hero', parent: 'main-content' },
            { id: 'about-container', url: '/sections/about.html', dataKey: 'about', parent: 'main-content' },
            { id: 'portfolio-container', url: '/sections/portfolio.html', dataKey: 'portfolio', parent: 'main-content' },
            { id: 'services-container', url: '/sections/services.html', dataKey: 'services', parent: 'main-content' },
            { id: 'testimonials-container', url: '/sections/testimonials.html', dataKey: 'testimonials', parent: 'main-content' },
            { id: 'pricing-container', url: '/sections/pricing.html', dataKey: 'pricing', parent: 'main-content' },
            { id: 'contact-container', url: '/sections/contact.html', dataKey: 'contact', parent: 'main-content' },
            { id: 'footer-container', url: '/sections/footer.html', dataKey: 'footer' }
        ];

        const mainContent = document.getElementById('main-content');
        console.log('Main content container exists:', !!mainContent);

        for (const sec of sectionsToLoad) {
            console.log(`Loading section: ${sec.id} from ${sec.url}`);
            try {
                await loadSection(sec, data);
                console.log(`Successfully loaded section: ${sec.id}`);
            } catch (secError) {
                console.warn(`Failed to load section ${sec.id}, skipping:`, secError);
            }
        }

        // Force visibility for all sections after load (fallback for GSAP)
        document.querySelectorAll('section, .reveal-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // 3. Initialize Interactive Features
        initThemeToggle();
        initPortfolioFilter();
        initContactForm();
        
        // 4. Initialize GSAP Animations
        try {
            initAnimations();
        } catch (animError) {
            console.error('Animation initialization failed:', animError);
        }

        console.log('Site initialized successfully!');

    } catch (error) {
        console.error('CRITICAL Error initializing site:', error);
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.innerHTML = `<div class="bg-surface p-6 rounded-xl border border-red-500 max-w-lg mx-auto mt-20 text-center"><p class="text-red-500 font-bold text-xl mb-4"><i class="ph ph-warning-circle"></i> Initialization Error</p><p class="text-white text-sm whitespace-pre-wrap text-left font-mono">${error.message}\n${error.stack}</p></div>`;
        }
    } finally {
        // Always attempt to hide loader after a short delay
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                console.log('Dismissing loader...');
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }
        }, 1000);
    }
});

async function loadSection(sectionInfo, siteData) {
    try {
        const response = await fetch(sectionInfo.url);
        if (!response.ok) {
            console.warn(`Section not found: ${sectionInfo.url}`);
            return;
        }
        let htmlSnippet = await response.text();
        console.log(`Loaded ${sectionInfo.id}: ${htmlSnippet.length} chars. Start: ${htmlSnippet.substring(0, 20)}...`);
        
        // Simple templating engine: Replace {{key}} with data[sectionInfo.dataKey].key
        const sectionData = siteData[sectionInfo.dataKey] || {};

        // Pre-process: inject derived fields before template substitution
        if (sectionInfo.dataKey === 'contact' && sectionData.whatsapp) {
            sectionData.whatsappClean = sectionData.whatsapp.replace(/[^0-9]/g, '');
        }

        htmlSnippet = replaceTemplateVars(htmlSnippet, sectionData);

        // Inject HTML
        let container = document.getElementById(sectionInfo.id);
        if (!container && sectionInfo.parent) {
            const parent = document.getElementById(sectionInfo.parent);
            if (parent) {
                container = document.createElement('div');
                container.id = sectionInfo.id;
                parent.appendChild(container);
                console.log(`Created and appended ${sectionInfo.id} to ${sectionInfo.parent}`);
            } else {
                console.error(`Parent ${sectionInfo.parent} not found for ${sectionInfo.id}`);
            }
        }
        
        if (container) {
            container.innerHTML = htmlSnippet;
            
            // Post-injection logic for specific sections
            if (sectionInfo.dataKey === 'hero') renderHeroMedia(sectionData);
            if (sectionInfo.dataKey === 'about') renderAboutArrays(sectionData);
            if (sectionInfo.dataKey === 'portfolio') renderPortfolioArrays(sectionData);
            if (sectionInfo.dataKey === 'services') renderServicesArrays(sectionData);
            if (sectionInfo.dataKey === 'testimonials') renderTestimonialsArrays(sectionData);
            if (sectionInfo.dataKey === 'pricing') renderPricingArrays(sectionData);
            if (sectionInfo.dataKey === 'contact') renderContactArrays(sectionData);
        }

    } catch (error) {
        console.error(`Failed to load section ${sectionInfo.id}:`, error);
        throw error; // Re-throw to be caught by main loop
    }
}

function renderHeroMedia(data) {
    const container = document.getElementById('hero-media-container');
    if (!container || !data.backgroundVideo) return;

    const url = data.backgroundVideo;
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    console.log('Hero Video URL:', url);
    
    if (isYouTube) {
        // Handle YouTube Embed for Background
        let embedUrl = url;
        let videoId = '';
        
        if (url.includes('embed')) {
            // Extract ID from embed URL
            const parts = url.split('/');
            videoId = parts[parts.length - 1].split('?')[0];
        } else if (url.includes('youtu.be')) {
            // Handle youtu.be/ID?params
            videoId = url.split('/').pop().split('?')[0];
        } else {
            // Handle youtube.com/watch?v=ID
            videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop().split('?')[0];
        }
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        // Add background-specific parameters
        const params = new URLSearchParams({
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            enablejsapi: 1
        });
        
        container.insertAdjacentHTML('afterbegin', `
            <iframe src="${embedUrl}?${params.toString()}" 
                    class="absolute min-w-[100%] min-h-[100%] w-[177.77vh] h-[56.25vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 pointer-events-none" 
                    frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        `);
    } else {
        // Handle direct video file
        container.insertAdjacentHTML('afterbegin', `
            <video autoplay loop muted playsinline class="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-60">
                <source src="${url}" type="video/mp4">
            </video>
        `);
    }
}

function replaceTemplateVars(html, data, prefix = '') {
    let result = html;
    for (const key in data) {
        if (data[key] !== null && typeof data[key] === 'object' && !Array.isArray(data[key])) {
            result = replaceTemplateVars(result, data[key], `${prefix}${key}.`);
        } else if (typeof data[key] !== 'object') {
            // Correct regex for {{prefix.key}}
            const safeKey = `${prefix}${key}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\{\\{${safeKey}\\}\\}`, 'g');
            result = result.replace(regex, data[key]);
        }
    }
    return result;
}

// ----- Array Rendering Functions -----

function renderAboutArrays(data) {
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && data.skills) {
        skillsContainer.innerHTML = data.skills.map(skill => 
            `<span class="px-4 py-2 border border-border rounded-lg bg-background font-medium text-sm shadow-sm hover:border-primary transition-colors hover:text-primary reveal-up">${skill}</span>`
        ).join('');
    }

    const statsContainer = document.getElementById('stats-container');
    if (statsContainer && data.stats) {
        statsContainer.innerHTML = data.stats.map(stat => {
            // Extract numeric value for animation
            const numericValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;
            const suffix = stat.value.replace(/[0-9]/g, '');
            
            return `
            <div class="reveal-up">
                <p class="text-4xl md:text-5xl font-heading font-black text-primary mb-2 flex items-baseline justify-center">
                    <span class="stat-number" data-target="${numericValue}">0</span>
                    <span class="text-2xl">${suffix}</span>
                </p>
                <p class="text-xs font-bold text-textMuted uppercase tracking-widest">${stat.label}</p>
            </div>`;
        }).join('');
        
        // Trigger the stats animation
        animateStats();
    }
}

function animateStats() {
    const stats = gsap.utils.toArray('.stat-number');
    
    ScrollTrigger.create({
        trigger: '#stats-container',
        start: "top 85%",
        onEnter: () => {
            stats.forEach((stat, index) => {
                const target = parseInt(stat.getAttribute('data-target'));
                
                // Sequential count animation
                gsap.to(stat, {
                    innerText: target,
                    duration: 2.5,
                    delay: index * 0.3, // Sequential stagger
                    snap: { innerText: 1 },
                    ease: "power3.out",
                    onComplete: () => {
                        // Subtle bounce/glow when finished
                        gsap.to(stat.parentElement, {
                            scale: 1.1,
                            duration: 0.2,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.out"
                        });
                    }
                });
            });
        }
    });
}

function renderPortfolioArrays(data) {
    const filtersContainer = document.getElementById('portfolio-filters');
    const gridContainer = document.getElementById('portfolio-grid');
    
    if (filtersContainer && data.categories) {
        filtersContainer.innerHTML = data.categories.map((cat, index) => 
            `<button class="filter-btn px-6 py-2 rounded-full border ${index === 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-textMuted hover:border-primary hover:text-text'} font-medium transition-all duration-300" data-filter="${cat}">
                ${cat}
            </button>`
        ).join('');
    }

    if (gridContainer && data.projects) {
        window.portfolioProjects = data.projects; // Store for filtering
        renderProjectsGrid(data.projects);
        initPortfolioFilter();
    }
}

function renderProjectsGrid(projects) {
    const gridContainer = document.getElementById('portfolio-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = projects.map(proj => 
        `<div class="portfolio-item group relative rounded-2xl overflow-hidden glass-card border border-border/50 premium-glow reveal-up cursor-pointer" onclick="openModal('${proj.videoUrl}')" data-category="${proj.category}">
            <div class="aspect-video relative overflow-hidden">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10 flex items-center justify-center">
                    <div class="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 z-20 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)]">
                        <i class="ph ph-fill ph-play text-2xl ml-1"></i>
                    </div>
                </div>
                <img src="${proj.thumbnail}" alt="${proj.title}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <div class="absolute top-4 left-4 z-20">
                    <span class="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">${proj.category}</span>
                </div>
            </div>
            <div class="p-6 relative z-10">
                <h3 class="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors duration-300">${proj.title}</h3>
                <p class="text-textMuted text-sm leading-relaxed">${proj.description}</p>
            </div>
        </div>`
    ).join('');
    
    ScrollTrigger.refresh();
}

function renderServicesArrays(data) {
    const gridContainer = document.getElementById('services-grid');
    if (!gridContainer || !data.items) return;

    gridContainer.innerHTML = data.items.map(service => 
        `<div class="p-8 rounded-2xl glass-card border border-border/50 premium-glow transition-all group reveal-up">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500">
                <i class="ph ${service.icon} text-4xl text-primary drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]"></i>
            </div>
            <h3 class="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">${service.title}</h3>
            <p class="text-textMuted leading-relaxed text-base opacity-80 group-hover:opacity-100 transition-opacity">${service.description}</p>
        </div>`
    ).join('');
}

function renderTestimonialsArrays(data) {
    const gridContainer = document.getElementById('testimonials-grid');
    if (!gridContainer || !data.reviews) return;

    gridContainer.innerHTML = data.reviews.map(review => 
        `<div class="p-8 rounded-2xl glass-card border border-border/50 premium-glow relative group reveal-up">
            <div class="text-primary/10 absolute top-6 right-6 group-hover:text-primary/30 transition-colors duration-700">
                <i class="ph-fill ph-quotes text-7xl"></i>
            </div>
            <p class="text-text relative z-10 text-xl italic mb-8 leading-relaxed font-light">"${review.text}"</p>
            <div class="flex items-center gap-5 relative z-10">
                <div class="relative">
                    <img src="${review.image}" alt="${review.name}" class="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors duration-500">
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-surface">
                        <i class="ph ph-check text-[10px] text-white"></i>
                    </div>
                </div>
                <div>
                    <h4 class="font-bold text-lg">${review.name}</h4>
                    <p class="text-xs text-primary font-semibold uppercase tracking-widest">${review.role}</p>
                </div>
            </div>
        </div>`
    ).join('');
}

function renderPricingArrays(data) {
    const gridContainer = document.getElementById('pricing-grid');
    if (!gridContainer || !data.packages) return;

    gridContainer.innerHTML = data.packages.map((pkg, index) => {
        const popularBadge = pkg.isPopular ? 
            `<div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.4)] z-20">Popular Choice</div>` : '';
        const borderClass = pkg.isPopular ? 'border-primary shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)]' : 'border-border/50';
        
        return `
        <div class="relative flex flex-col p-10 rounded-3xl glass-card border ${borderClass} premium-glow reveal-up h-full ${pkg.isPopular ? 'scale-105 z-10' : ''}">
            ${popularBadge}
            <div class="mb-10 text-center">
                <h3 class="text-lg font-bold text-textMuted uppercase tracking-widest mb-4">${pkg.name}</h3>
                <div class="flex items-center justify-center gap-1">
                    <span class="text-5xl font-heading font-black">${pkg.price}</span>
                    <span class="text-textMuted font-medium text-sm translate-y-2">${pkg.frequency}</span>
                </div>
            </div>
            <ul class="space-y-5 mb-10 flex-grow">
                ${pkg.features.map(feat => `
                    <li class="flex items-center gap-4 text-sm text-text font-medium opacity-80">
                        <div class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <i class="ph ph-check text-xs text-primary font-bold"></i>
                        </div>
                        <span>${feat}</span>
                    </li>
                `).join('')}
            </ul>
            <a href="#contact" class="w-full py-4 rounded-xl text-center font-black text-sm uppercase tracking-widest transition-all duration-500 ${pkg.isPopular ? 'bg-primary text-white shadow-xl hover:shadow-primary/40' : 'bg-surface text-text hover:bg-primary hover:text-white border border-border/50'}">
                Get Started
            </a>
        </div>`
    }).join('');
}

function renderContactArrays(data) {
    // Inject a digits-only version of the whatsapp number for the wa.me link
    if (data.whatsapp) {
        data.whatsappClean = data.whatsapp.replace(/[^0-9]/g, '');
    }

    const socialsContainer = document.getElementById('socials-container');
    if (!socialsContainer || !data.socials) return;

    socialsContainer.innerHTML = data.socials.map(social => 
        `<a href="${social.url}" target="_blank" aria-label="${social.name}" class="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text hover:text-white hover:bg-primary hover:border-primary transition-colors hover-lift">
            <i class="ph ${social.icon} text-2xl"></i>
        </a>`
    ).join('');
}

function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    });
}

// ── Contact Form: validation + fetch submit ───────────────────────────────────
function initContactForm() {
    const form    = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = document.getElementById('contact-name')?.value.trim()    || '';
        const email   = document.getElementById('contact-email')?.value.trim()   || '';
        const subject = document.getElementById('contact-subject')?.value.trim() || '';
        const message = document.getElementById('contact-message')?.value.trim() || '';

        // ── Client-side validation ────────────────────────────────────────────
        const errors = [];
        if (name.length < 2)                             errors.push('Please enter your name.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
        if (message.length < 10)                         errors.push('Message must be at least 10 characters.');

        if (errors.length > 0) {
            showContactStatus('error', errors.join(' '));
            return;
        }

        // ── Loading state ─────────────────────────────────────────────────────
        const btn     = document.getElementById('contact-submit');
        const btnText = document.getElementById('contact-btn-text');
        const btnIcon = document.getElementById('contact-btn-icon');
        if (btn) btn.disabled = true;
        if (btnText) btnText.textContent = 'Sending…';
        if (btnIcon) { btnIcon.className = 'ph ph-spinner text-xl animate-spin'; }
        hideContactStatus();

        // ── POST to /api/contact ──────────────────────────────────────────────
        try {
            const res  = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showContactStatus('success', '✅ Message sent successfully! I\'ll get back to you soon.');
                form.reset();
            } else {
                const msg = data.errors ? data.errors.join(' ') : 'Failed to send message. Please try again.';
                showContactStatus('error', '❌ ' + msg);
            }
        } catch (err) {
            showContactStatus('error', '❌ Network error. Please check your connection and try again.');
        } finally {
            if (btn) btn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) { btnIcon.className = 'ph ph-paper-plane-tilt text-xl'; }
        }
    });
}

function showContactStatus(type, message) {
    const el = document.getElementById('contact-status');
    if (!el) return;
    el.className = [
        'mb-6 px-6 py-4 rounded-xl text-sm font-semibold flex items-center gap-3',
        type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
    ].join(' ');
    el.textContent = message;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideContactStatus() {
    const el = document.getElementById('contact-status');
    if (el) el.className = 'hidden';
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button state
            filterBtns.forEach(b => {
                b.classList.remove('border-primary', 'bg-primary/10', 'text-primary');
                b.classList.add('border-border', 'text-textMuted');
            });
            btn.classList.add('border-primary', 'bg-primary/10', 'text-primary');
            btn.classList.remove('border-border', 'text-textMuted');
            
            // Filter projects with animation context
            const projects = window.portfolioProjects || [];
            const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);
            
            // Simple fade out/in effect for grid
            const grid = document.getElementById('portfolio-grid');
            if (grid) {
                gsap.to(grid, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    onComplete: () => {
                        renderProjectsGrid(filtered);
                        // Force-animate the new cards into view (they start at opacity:0 via .reveal-up CSS)
                        const newCards = document.querySelectorAll('#portfolio-grid > .reveal-up');
                        gsap.to(newCards, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.06,
                            ease: 'power2.out'
                        });
                        gsap.to(grid, {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
    });
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Snappier entry for hero elements
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroTl = gsap.timeline();
        const badge = document.getElementById('hero-badge');
        const h1 = heroSection.querySelector('h1');
        const p = heroSection.querySelector('p');
        const btns = heroSection.querySelector('.flex');

        if (badge) heroTl.from(badge, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.3 });
        if (h1) heroTl.from(h1, { y: 50, opacity: 0, duration: 1, ease: "expo.out" }, badge ? "-=0.5" : "0.3");
        if (p) heroTl.from(p, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.7");
        if (btns) heroTl.from(btns, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
    }

    // General scroll reveals - slightly faster
    gsap.utils.toArray('section').forEach(section => {
        const header = section.querySelector('h2');
        const underline = section.querySelector('.w-24.h-1');
        
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 95%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
        
        if (underline) {
            gsap.from(underline, {
                scrollTrigger: {
                    trigger: underline,
                    start: "top 95%",
                },
                scaleX: 0,
                transformOrigin: "center",
                duration: 1,
                ease: "expo.out"
            });
        }
    });

    // Animate items on scroll - Faster and more immediate
    gsap.utils.toArray('.reveal-up').forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 95%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    // Special grids - Individual reveal instead of staggered group
    ['#portfolio-grid', '#services-grid', '#testimonials-grid', '#pricing-grid'].forEach(gridId => {
        ScrollTrigger.create({
            trigger: gridId,
            start: "top 95%",
            onEnter: () => {
                const items = document.querySelectorAll(`${gridId} > .reveal-up`);
                if (items.length > 0) {
                    gsap.to(items, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.05, // Minimal stagger for natural feel
                        ease: "power2.out"
                    });
                }
            }
        });
    });
}

function openModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-video');
    const content = document.getElementById('modal-content');
    if (!modal || !iframe || !content) return;

    // Add autoplay parameter
    let finalUrl = videoUrl;
    if (videoUrl.includes('youtube.com')) {
        finalUrl += (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1';
    } else if (videoUrl.includes('vimeo.com')) {
        finalUrl += (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1';
    }

    iframe.src = finalUrl;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-video');
    const content = document.getElementById('modal-content');
    if (!modal || !iframe || !content) return;

    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        iframe.src = '';
        document.body.style.overflow = '';
    }, 300);
}
