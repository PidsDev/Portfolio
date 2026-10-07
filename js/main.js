// Main Application & UI Interactions

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjectFilters();
    initCounters();
    initFanAssyChart();
});

// Navigation Toggle & Smooth Active State
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.className = 'fa-solid fa-bars text-xl';
            } else {
                menuIcon.className = 'fa-solid fa-xmark text-xl';
            }
        });
    }

    // Scroll spy for active navigation link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-nav');
            }
        });
    });
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Filter projects by category
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from all
            filterButtons.forEach(b => {
                b.classList.remove('bg-brand-500', 'text-slate-950', 'font-bold');
                b.classList.add('bg-slate-900', 'border', 'border-slate-800', 'text-slate-300');
            });

            // Set active
            btn.classList.remove('bg-slate-900', 'border', 'border-slate-800', 'text-slate-300');
            btn.classList.add('bg-brand-500', 'text-slate-950', 'font-bold');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                } else if (card.classList.contains(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Animated Stat Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Workflow Tab Switcher
function switchWorkflowTab(tab) {
    const tabFan = document.getElementById('tab-fan-assy');
    const tabDrawing = document.getElementById('tab-drawing');
    const workflowFan = document.getElementById('workflow-fan');
    const workflowDrawing = document.getElementById('workflow-drawing');

    if (tab === 'fan') {
        tabFan.className = "px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-brand-500 text-slate-950 font-bold transition-all flex items-center gap-2";
        tabDrawing.className = "px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-2";
        workflowFan.classList.remove('hidden');
        workflowDrawing.classList.add('hidden');
    } else {
        tabDrawing.className = "px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-brand-500 text-slate-950 font-bold transition-all flex items-center gap-2";
        tabFan.className = "px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-2";
        workflowDrawing.classList.remove('hidden');
        workflowFan.classList.add('hidden');
    }
}

// Fan Assembly Chart simulation using Chart.js
let chartInstance = null;
function initFanAssyChart() {
    const ctx = document.getElementById('fanAssyChart');
    if (!ctx) return;

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon (SO Upload)', 'Tue (WH Recv)', 'Wed (Assy)', 'Thu (PQA Pass)', 'Fri (Shipment)'],
            datasets: [
                {
                    label: 'Target Forecast Output',
                    data: [1200, 1200, 1200, 1200, 1200],
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'Actual Completed & Delivered',
                    data: [1150, 1180, 1210, 1190, 1250],
                    backgroundColor: 'rgba(20, 184, 166, 0.85)',
                    borderColor: '#2dd4bf',
                    borderWidth: 1.5,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });
}

// Project Modal Details Data
const projectDetails = {
    'drawing-system': {
        title: "Customer Standard Management System",
        tag: "Enterprise Revision Management",
        badgeColor: "text-brand-400 border-brand-500/30 bg-brand-500/10",
        tech: ["HTML5", "CSS3", "JavaScript", "Python Flask", "MS SQL Server"],
        overview: "An enterprise-grade document and blueprint management system built for manufacturing and engineering departments to eliminate obsolete technical drawings from production lines.",
        features: [
            "User Drawing Uploads & High-Resolution Vector Blueprint Viewer.",
            "Automatic Versioning Engine (v1.0, v1.1, Revision history tracking).",
            "Role-Based Approval Workflow for Engineering Leads & Quality Managers.",
            "Audit Trail logging every drawing update, author, and timestamp into MS SQL Server."
        ],
        architecture: "Frontend (HTML/CSS/JS) ➔ Flask REST Endpoints ➔ Drawing Storage & Indexing Engine ➔ MS SQL Server"
    },
    'fan-assy': {
        title: "Fan Assembly Parts Monitoring System",
        tag: "Industrial Supply Chain & Production Tracking",
        badgeColor: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10",
        tech: ["HTML5", "CSS3", "JavaScript", "Python Flask", "MS SQL Server", "Chart.js"],
        overview: "A full-scale industrial supply chain & assembly monitoring web application engineered to manage mass forecast Shop Orders (SO) from planning through shipment.",
        features: [
            "Mass Forecast SO Ingestion: Upload bulk Excel/CSV orders directly into MS SQL Database.",
            "Warehouse Receiving Hub: Input receiving logs for raw components and sub-assemblies.",
            "Assembly Line Tracking: Production units log daily assembled quantities.",
            "PQA Quality Inspection: Pass/Fail verification module with flaw categorization.",
            "Shipment & Target Analytics: Interactive real-time graph summaries comparing target output vs. actual delivered parts for Sales & Executive teams."
        ],
        architecture: "Forecast SO Mass Upload ➔ Warehouse Receiving ➔ Assembly Line Log ➔ PQA Inspection ➔ Shipment Dispatch ➔ SQL Analytics Engine"
    },
    'vehicle-validation': {
        title: "Vehicle Validation Web System",
        tag: "Full-Stack Web Platform",
        badgeColor: "text-accent-purple border-accent-purple/30 bg-accent-purple/10",
        tech: ["Python Flask", "React JS", "RESTful APIs", "MySQL", "Document Generation"],
        overview: "A full-stack web application designed for automated vehicle validation, user management, online registration, and printable sticker generation.",
        features: [
            "Role-Based Access Control (RBAC) for Admins, Inspectors, and Vehicle Owners.",
            "Online Payment Gateway Integration for validation processing.",
            "Automated PDF & Sticker Generation Engine for instant printing.",
            "Secure File Upload for registration documents and vehicle photographs."
        ],
        architecture: "React SPA ➔ Flask REST API ➔ Payment & PDF Engine ➔ MySQL Relational DB"
    },
    'elearning-app': {
        title: "E-Learning Application for Hearing-Impaired Learners",
        tag: "Desktop Accessibility Application",
        badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        tech: ["Python", "Kivy Desktop Framework", "SQLite3"],
        overview: "An accessible desktop e-learning application created to assist hearing-impaired students through interactive visual lessons and captioned educational materials.",
        features: [
            "Visual-first learning interface designed with Kivy GUI framework.",
            "Sign language & captioned video playback integration.",
            "Offline progress tracking powered by SQLite3 database."
        ],
        architecture: "Kivy User Interface ➔ Python Core Logic ➔ SQLite Local Database"
    }
};

function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('project-modal-content');

    let techBadges = data.tech.map(t => `<span class="bg-slate-800 text-slate-300 text-xs font-mono px-3 py-1 rounded-lg border border-slate-700">${t}</span>`).join('');
    let featureList = data.features.map(f => `<li class="flex items-start gap-2 text-slate-300 text-xs leading-relaxed"><i class="fa-solid fa-circle-check text-brand-400 mt-0.5"></i> <span>${f}</span></li>`).join('');

    content.innerHTML = `
        <button onclick="closeProjectModal()" class="absolute top-6 right-6 text-slate-400 hover:text-white text-xl">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="mb-4">
            <span class="px-3 py-1 rounded-full border text-xs font-mono font-semibold ${data.badgeColor}">${data.tag}</span>
        </div>

        <h3 class="font-display text-2xl font-bold text-white mb-3">${data.title}</h3>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">${data.overview}</p>

        <div class="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-6">
            <h4 class="text-xs font-mono text-brand-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                <i class="fa-solid fa-layer-group"></i> Architecture Pipeline
            </h4>
            <p class="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 overflow-x-auto">${data.architecture}</p>
        </div>

        <div class="mb-6">
            <h4 class="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-3">Key Features & Capabilities</h4>
            <ul class="space-y-2.5">
                ${featureList}
            </ul>
        </div>

        <div>
            <h4 class="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-2">Technologies Used</h4>
            <div class="flex flex-wrap gap-2">
                ${techBadges}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
}

// Resume Modal Open/Close
function openResumeModal() {
    document.getElementById('resume-modal').classList.remove('hidden');
}

function closeResumeModal() {
    document.getElementById('resume-modal').classList.add('hidden');
}

// Contact Form Handler Simulation
function handleFormSubmit(e) {
    e.preventDefault();
    const successDiv = document.getElementById('form-success');
    if (successDiv) {
        successDiv.classList.remove('hidden');
    }
}

function resetContactForm() {
    const successDiv = document.getElementById('form-success');
    const form = document.getElementById('contact-form');
    if (successDiv) successDiv.classList.add('hidden');
    if (form) form.reset();
}
