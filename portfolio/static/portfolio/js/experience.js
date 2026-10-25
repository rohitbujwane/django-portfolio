import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

if (new URLSearchParams(window.location.search).has("skipBoot")) {
  document.body.classList.add("skip-boot");
}

const canvas = document.querySelector("#universe");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03040b, 0.045);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.8, 8);

const pointer = { x: 0, y: 0 };
const clock = new THREE.Clock();

const cyan = new THREE.Color("#20f6ff");
const violet = new THREE.Color("#a658ff");
const pink = new THREE.Color("#ff4fd8");

scene.add(new THREE.AmbientLight(0x3ccfff, 0.45));

const keyLight = new THREE.PointLight(0x20f6ff, 9, 36);
keyLight.position.set(-3, 5, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xff4fd8, 7, 30);
rimLight.position.set(4, -2, 5);
scene.add(rimLight);

const particleCount = 2200;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i += 1) {
  const radius = 4 + Math.random() * 18;
  const angle = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.5) * 12;
  positions[i * 3] = Math.cos(angle) * radius;
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * radius - 7;

  const color = Math.random() > 0.55 ? cyan : Math.random() > 0.5 ? violet : pink;
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.86,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
);
scene.add(particles);

const coreGroup = new THREE.Group();
scene.add(coreGroup);

const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x20f6ff,
  emissive: 0x0ea9ff,
  emissiveIntensity: 1.4,
  metalness: 0.45,
  roughness: 0.18,
  wireframe: true,
});

for (let i = 0; i < 5; i += 1) {
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.45 + i * 0.55, 0.01 + i * 0.003, 12, 160),
    torusMaterial.clone()
  );
  torus.rotation.x = Math.PI / 2 + i * 0.28;
  torus.rotation.y = i * 0.38;
  torus.material.color = i % 2 ? violet : cyan;
  coreGroup.add(torus);
}

const neuralMaterial = new THREE.MeshStandardMaterial({
  color: 0xa658ff,
  emissive: 0x6f2dff,
  emissiveIntensity: 1.1,
  roughness: 0.2,
  metalness: 0.5,
  transparent: true,
  opacity: 0.78,
});

const nodeGeometry = new THREE.IcosahedronGeometry(0.08, 1);
for (let i = 0; i < 34; i += 1) {
  const node = new THREE.Mesh(nodeGeometry, neuralMaterial);
  const angle = (i / 34) * Math.PI * 2;
  const radius = 2.2 + Math.sin(i * 1.7) * 0.8;
  node.position.set(Math.cos(angle) * radius, Math.sin(i) * 1.2, Math.sin(angle) * radius);
  coreGroup.add(node);
}

const grid = new THREE.GridHelper(60, 80, 0x20f6ff, 0x17334e);
grid.position.y = -3.2;
grid.position.z = -8;
grid.material.transparent = true;
grid.material.opacity = 0.28;
scene.add(grid);

function moveParallax(event) {
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll("[data-depth]").forEach((element) => {
    const depth = Number(element.dataset.depth);
    element.style.transform = `translate3d(${pointer.x * depth * 80}px, ${pointer.y * depth * 70}px, 0)`;
  });
}

window.addEventListener("pointermove", moveParallax);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll("section, .project-card, .profile-card, .skill-row").forEach((element) => {
  revealObserver.observe(element);
});

document.querySelectorAll(".project-card, .profile-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    const rotateX = ((y / rect.height) - 0.5) * -9;
    card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function animate() {
  const elapsed = clock.getElapsedTime();
  const scrollProgress = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);

  particles.rotation.y = elapsed * 0.025 + scrollProgress * 1.5;
  particles.rotation.x = Math.sin(elapsed * 0.18) * 0.08;

  coreGroup.rotation.x = elapsed * 0.18 + pointer.y * 0.12;
  coreGroup.rotation.y = elapsed * 0.24 + pointer.x * 0.22;
  coreGroup.position.y = Math.sin(elapsed * 0.8) * 0.2;
  coreGroup.position.z = -scrollProgress * 4;

  grid.position.z = -8 + (scrollProgress * 18) % 8;
  camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.04;
  camera.position.y += (0.8 - pointer.y * 0.34 - camera.position.y) * 0.04;
  camera.position.z = 8 - scrollProgress * 2.2;
  camera.lookAt(0, 0, -1);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
animate();
