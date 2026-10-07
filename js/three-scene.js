// Three.js 3D Background & Hero Interactive 3D Official Python Flask Viking Horn Logo Scene

let mainScene, mainCamera, mainRenderer, mainParticles;
let heroScene, heroCamera, heroRenderer, heroFlaskGroup, heroRingMesh;
let isControlsEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
    initMain3DBackground();
    initHero3DWidget();
    init3DToggleButton();
});

// 1. MAIN GLOBAL 3D BACKGROUND PARTICLES & MESH NETWORK
function initMain3DBackground() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    mainScene = new THREE.Scene();
    mainScene.fog = new THREE.FogExp2(0x090d16, 0.0018);

    // Camera setup
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    mainCamera.position.z = 400;

    // Renderer setup
    mainRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
    mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(mainRenderer.domElement);

    // Create Particle Starfield / Node Grid
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorBrand = new THREE.Color(0x14b8a6);
    const colorCyan = new THREE.Color(0x06b6d4);
    const colorPurple = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
        const radius = 600;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * radius;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        let pColor;
        const rand = Math.random();
        if (rand < 0.5) pColor = colorBrand;
        else if (rand < 0.8) pColor = colorCyan;
        else pColor = colorPurple;

        colors[i * 3] = pColor.r;
        colors[i * 3 + 1] = pColor.g;
        colors[i * 3 + 2] = pColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    mainParticles = new THREE.Points(geometry, material);
    mainScene.add(mainParticles);

    // Mouse Move Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX);
        mouseY = (e.clientY - windowHalfY);
    });

    // Animation Loop
    function animateMain() {
        requestAnimationFrame(animateMain);

        if (isControlsEnabled) {
            targetX = mouseX * 0.05;
            targetY = mouseY * 0.05;

            if (mainParticles) {
                mainParticles.rotation.y += 0.0008;
                mainParticles.rotation.x += 0.0004;

                mainCamera.position.x += (targetX - mainCamera.position.x) * 0.03;
                mainCamera.position.y += (-targetY - mainCamera.position.y) * 0.03;
                mainCamera.lookAt(mainScene.position);
            }
        }

        mainRenderer.render(mainScene, mainCamera);
    }

    animateMain();

    // Resize handler
    window.addEventListener('resize', () => {
        mainCamera.aspect = window.innerWidth / window.innerHeight;
        mainCamera.updateProjectionMatrix();
        mainRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Helper to create a solid 3D Viking Drinking Horn geometry matching the official Flask logo
function createSolidVikingHornGeometry() {
    // Spline curve matching the exact Flask logo horn sweep
    const hornCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.85, 1.35, 0),     // Top rim center
        new THREE.Vector3(-1.75, -0.15, 0.4),  // Outer left belly curve
        new THREE.Vector3(-0.35, -1.75, -0.3), // Lower curve
        new THREE.Vector3(1.75, -1.15, 0)      // Curved tip
    );

    const tubularSegments = 70;
    const radialSegments = 36;

    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const frames = hornCurve.computeFrenetFrames(tubularSegments, false);

    for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments;
        const p = hornCurve.getPointAt(u);
        const N = frames.normals[i];
        const B = frames.binormals[i];

        // Smooth tapering profile from wide top (0.65) to small tip (0.03)
        const radius = 0.65 * Math.pow(1.0 - u * 0.92, 0.85) + 0.03;

        for (let j = 0; j <= radialSegments; j++) {
            const v = j / radialSegments;
            const theta = v * Math.PI * 2;

            const cos = Math.cos(theta);
            const sin = Math.sin(theta);

            // Vertex position
            const vx = p.x + radius * (cos * N.x + sin * B.x);
            const vy = p.y + radius * (cos * N.y + sin * B.y);
            const vz = p.z + radius * (cos * N.z + sin * B.z);

            // Normal vector pointing outward
            const nx = cos * N.x + sin * B.x;
            const ny = cos * N.y + sin * B.y;
            const nz = cos * N.z + sin * B.z;

            vertices.push(vx, vy, vz);
            normals.push(nx, ny, nz);
            uvs.push(u, v);
        }
    }

    // Generate Quad Indices
    for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
            const a = i * (radialSegments + 1) + j;
            const b = (i + 1) * (radialSegments + 1) + j;
            const c = (i + 1) * (radialSegments + 1) + (j + 1);
            const d = i * (radialSegments + 1) + (j + 1);

            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return { geometry, hornCurve };
}

// 2. HERO SECTION INTERACTIVE 3D OFFICIAL PYTHON FLASK VIKING DRINKING HORN
function initHero3DWidget() {
    const heroContainer = document.getElementById('hero-3d-interactive');
    if (!heroContainer) return;

    const width = heroContainer.clientWidth || 350;
    const height = heroContainer.clientHeight || 250;

    heroScene = new THREE.Scene();

    heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    heroCamera.position.set(0, 0, 7.5);

    heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroContainer.appendChild(heroRenderer.domElement);

    // Balanced Clean Studio Lighting (No blown-out neon colors)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    heroScene.add(ambientLight);

    // Key Light from upper right
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 8, 6);
    heroScene.add(keyLight);

    // Soft Rim Light from back left for 3D depth outline
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.8);
    rimLight.position.set(-6, -2, -4);
    heroScene.add(rimLight);

    heroFlaskGroup = new THREE.Group();

    // A. SOLID 3D VIKING DRINKING HORN MESH (Authentic Pure White / Pearl Surface)
    const { geometry: hornGeo } = createSolidVikingHornGeometry();

    const hornMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,          // Pure clean white matching official Flask logo illustration
        roughness: 0.35,          // Natural satin horn finish
        metalness: 0.05,          // Subtle specular reflectance
        emissive: 0x000000,       // No emissive wash so 3D shadows and contours are crisp!
        side: THREE.DoubleSide
    });

    const hornMesh = new THREE.Mesh(hornGeo, hornMaterial);
    heroFlaskGroup.add(hornMesh);

    // B. TOP OPENING LIQUID DISK (Dark Teal Flask Liquid)
    const topCapGeo = new THREE.CircleGeometry(0.64, 36);
    const liquidTopMat = new THREE.MeshStandardMaterial({
        color: 0x0f766e,
        emissive: 0x0d9488,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        side: THREE.DoubleSide
    });
    const topCapMesh = new THREE.Mesh(topCapGeo, liquidTopMat);
    topCapMesh.position.set(-0.85, 1.35, 0);
    topCapMesh.rotation.x = Math.PI / 2.3;
    heroFlaskGroup.add(topCapMesh);

    // C. TOP RIM ACCENT BAND
    const rimTorusGeo = new THREE.TorusGeometry(0.66, 0.06, 16, 36);
    const rimMat = new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        metalness: 0.8,
        roughness: 0.2
    });
    const rimMesh = new THREE.Mesh(rimTorusGeo, rimMat);
    rimMesh.position.set(-0.85, 1.35, 0);
    rimMesh.rotation.x = Math.PI / 2.3;
    heroFlaskGroup.add(rimMesh);

    // D. STOPPER CAP (Official emblem top knob plug)
    const capGroup = new THREE.Group();
    const capBaseGeo = new THREE.CylinderGeometry(0.28, 0.38, 0.25, 24);
    const capSphereGeo = new THREE.SphereGeometry(0.18, 20, 20);

    const capMat = new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        metalness: 0.8,
        roughness: 0.2
    });

    const capBase = new THREE.Mesh(capBaseGeo, capMat);
    const capSphere = new THREE.Mesh(capSphereGeo, capMat);
    capSphere.position.y = 0.22;

    capGroup.add(capBase);
    capGroup.add(capSphere);
    capGroup.position.set(-0.9, 1.58, 0);
    heroFlaskGroup.add(capGroup);

    // E. ELEGANT BACKGROUND ORBIT RING (Subtle Purple Backdrop)
    const ringGeo = new THREE.RingGeometry(2.3, 2.38, 40);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    heroRingMesh = new THREE.Mesh(ringGeo, ringMat);
    heroRingMesh.rotation.x = Math.PI / 2.3;
    heroFlaskGroup.add(heroRingMesh);

    // Adjust initial orientation
    heroFlaskGroup.position.set(0.1, 0.1, 0);

    heroScene.add(heroFlaskGroup);

    // Mouse Drag/Rotate Logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    heroContainer.addEventListener('mousedown', (e) => {
        if (isControlsEnabled) isDragging = true;
    });

    heroContainer.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging && heroFlaskGroup && isControlsEnabled) {
            heroFlaskGroup.rotation.y += deltaMove.x * 0.01;
            heroFlaskGroup.rotation.x += deltaMove.y * 0.01;
        }

        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile
    heroContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && isControlsEnabled) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    heroContainer.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1 && heroFlaskGroup && isControlsEnabled) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            heroFlaskGroup.rotation.y += deltaMove.x * 0.01;
            heroFlaskGroup.rotation.x += deltaMove.y * 0.01;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });

    heroContainer.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Animation Loop
    function animateHero() {
        requestAnimationFrame(animateHero);

        if (heroFlaskGroup && isControlsEnabled) {
            if (!isDragging) {
                heroFlaskGroup.rotation.y += 0.008;
                if (heroRingMesh) heroRingMesh.rotation.z += 0.003;
            }
        }

        heroRenderer.render(heroScene, heroCamera);
    }

    animateHero();

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const newWidth = entry.contentRect.width;
            const newHeight = entry.contentRect.height;
            if (newWidth > 0 && newHeight > 0) {
                heroCamera.aspect = newWidth / newHeight;
                heroCamera.updateProjectionMatrix();
                heroRenderer.setSize(newWidth, newHeight);
            }
        }
    });
    resizeObserver.observe(heroContainer);
}

// 3D Toggle button controller
function init3DToggleButton() {
    const btn = document.getElementById('toggle-3d-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        isControlsEnabled = !isControlsEnabled;
        if (isControlsEnabled) {
            btn.classList.add('border-brand-500/50');
            btn.innerHTML = `<i class="fa-solid fa-flask text-brand-400"></i><span class="text-xs font-mono">3D Active</span>`;
        } else {
            btn.classList.remove('border-brand-500/50');
            btn.innerHTML = `<i class="fa-solid fa-flask text-slate-500"></i><span class="text-xs font-mono text-slate-500">3D Paused</span>`;
        }
    });
}
