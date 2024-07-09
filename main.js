import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Loaders
const textureLoader = new THREE.TextureLoader();

// Moon
const moonTexture = textureLoader.load("/R.jpeg");
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  moonMaterial
);
scene.add(moonMesh);

// Light
const light = new THREE.PointLight(0xffffff, 30, 1000);
light.position.set(0, 10, 10);
scene.add(light);

// Sun
const sunTexture = textureLoader.load("/sun.jpg");
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissiveMap: sunTexture,
  emissive: 0xffffff,
});
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  sunMaterial
);
sunMesh.position.copy(light.position);
scene.add(sunMesh);

const smallPlanetInclination = Math.PI / 4;

// Animate Planet Movement
const animatePlanets = () => {
  const time = performance.now() * 0.001;

  moonMesh.position.applyAxisAngle(
    new THREE.Vector3(0, 0, 0),
    smallPlanetInclination
  );
  moonMesh.rotation.y = time * 0.5;

  requestAnimationFrame(animatePlanets);
};
animatePlanets();

// Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  size: 0.5,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8,
});
const starVertices = new Float32Array(1500 * 3);
for (let i = 0; i < starVertices.length; i += 3) {
  starVertices[i] = (Math.random() - 0.5) * 300;
  starVertices[i + 1] = (Math.random() - 0.5) * 300;
  starVertices[i + 2] = (Math.random() - 0.5) * 300;
}
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Grid Helper
const gridHelper = new THREE.GridHelper(10, 10);
//scene.add(gridHelper); // Uncomment if needed

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Resize Handler
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Animation Loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// Timeline Animation
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(moonMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("div", { y: "-100%" }, { y: "0%" }); // Corrected nav selection
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

/*const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White light with intensity 0.5
scene.add(ambientLight);*/
