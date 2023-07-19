import { GridHelper } from 'three';
import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);
renderer.render(scene, camera);


//ring world
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);


//lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);


//camera controls
// const controls = new OrbitControls(camera, renderer.domElement);


//stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x,y,z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);


//world
const worldTexture = new THREE.TextureLoader().load('world_edge.jpg');
const world = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map:worldTexture})
);
scene.add(world);
world.position.z = -5;
world.position.x = 2;

//moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
    })
)
scene.add(moon);
moon.position.z = 30;
moon.position.x = -10;


//background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


//camera movement
function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += .05;
    moon.rotation.y += .075;
    moon.rotation.z += .05;

    earth.rotation.y += .01;
    earth.rotation.z += .01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
// moveCamera();


//animations
function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += .01;
    torus.rotation.y += .005;
    torus.rotation.z += .01;

    // controls.update();

    renderer.render(scene, camera);
}
animate();


