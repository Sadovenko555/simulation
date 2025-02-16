import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio * 0.8);
document.body.appendChild(renderer.domElement);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/circle.png');


const starCount = 10000;


const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);
const velocities = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    const angle = i * 0.1;
    const radius = 0.1 + 0.02 * angle;

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = (Math.random() - 0.5) * 1.5;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const color = new THREE.Color().setHSL(0.6 - radius * 0.1, 1.0, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    velocities[i * 3] = (Math.random() - 0.5) * 0.0004;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0004;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0004;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.05,
    map: starTexture,
    transparent: true,
    alphaTest: 0.5, 
    vertexColors: true
});


const stars = new THREE.Points(geometry, material);
scene.add(stars);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    stars.rotation.z += 0.03 * delta;

    const positionsArray = geometry.attributes.position.array;
    for (let i = 0; i < starCount; i++) {
        positionsArray[i * 3] += velocities[i * 3] * delta * 60;
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();
