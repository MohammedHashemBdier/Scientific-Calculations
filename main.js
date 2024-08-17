import * as THREE from 'three';

// إعداد المشهد والكاميرا والمحرك
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// إعداد الضوء الخافت للشمس
const sun = new THREE.PointLight(0xffffff, 1);
sun.position.set(10, 10, 10);
scene.add(sun);

// إعداد الأمواج
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 }
    },
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z = sin(pos.y * 0.1 + time * 0.5) * 2.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(0.0, 0.1, 0.3, 1.0);
        }
    `
});
const ocean = new THREE.Mesh(geometry, material);
scene.add(ocean);

// إعداد القارب
const boatGeometry = new THREE.Geometry();

// الجسم
const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 5);
bodyGeometry.translate(0, 0.25, 0);
boatGeometry.merge(bodyGeometry);

// المحرك النفاث
const jetGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
jetGeometry.translate(1, 0, 0);
boatGeometry.merge(jetGeometry);

const boatMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff }); // لون أزرق
const boat = new THREE.Mesh(boatGeometry, boatMaterial);
scene.add(boat);

// تحديث موقع الكاميرا
camera.position.set(0, 3, 10);

// دورة الرسم التحريكي
function animate() {
    requestAnimationFrame(animate);

    // تحديث وقت الموج
    material.uniforms.time.value += 0.01;

    // دوران القارب
    boat.rotation.y += 0.01;

    // رسم المشهد
    renderer.render(scene, camera);
}

animate();
