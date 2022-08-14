import './style.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import texture01 from "/texture/earth.jpg";
import texture02 from "/texture/star02.png";
import texture03 from "/texture/Burst01.png";
import droidFont from "/node_module/three/examples/fonts/droid/droid_sans_mono_regular.typeface.json";

//UIデバッグ
const gui = new dat.GUI();

//定数
const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.getElementById('canvas');
const sphereSpeed = {
  sphereSpeedY: 0.005
}
const particlesSpeed = {
  particlesSpeedY: 0.001,
  particlesSpeedZ: 0.001,
}

gui.add(sphereSpeed, "sphereSpeedY", 0, 0.1, 0.001);
gui.add(particlesSpeed, "particlesSpeedY", 0, 0.01, 0.0001);
gui.add(particlesSpeed, "particlesSpeedZ", 0, 0.01, 0.0001);

//シーン
const scene = new THREE.Scene();

// アスペクト比
var aspRatio = window.innerWidth / window.innerHeight;

// 視野角
var fov;
if (aspRatio > 1) {
  fov = 35;
} else if (aspRatio > 0.9) {
  fov = 45
} else if (aspRatio > 0.8) {
  fov = 50;
} else if (aspRatio > 0.6) {
  fov = 60;
} else if (aspRatio > 0.5) {
  fov = 70;
} else {
  fov = 80;
}

// カメラ
const camera = new THREE.PerspectiveCamera(fov, aspRatio, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 100;
camera.lookAt(scene.position);

// レンダラー
const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
// webGLRenderer.shadowMap.enabled = true;
webGLRenderer.setPixelRatio(window.devicePixelRatio);
canvas.appendChild(webGLRenderer.domElement);

// ライト
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(-100,100,100);
scene.add(dirLight);

// テキストと球体を入れるコンテナ
const container = new THREE.Object3D();
container.position.z = -8;
container.rotation.z = -0.2;
scene.add(container);

// テキスト
let textMesh;
const textSize = 6;
const fontLoader = new FontLoader();
fontLoader.load(droidFont, function(font) {
  createTextGeometry("U", font, 330);
  createTextGeometry("N", font, 345);
  createTextGeometry("I", font, 0);
  createTextGeometry("V", font, 15);
  createTextGeometry("E", font, 30);
  createTextGeometry("R", font, 45);
  createTextGeometry("S", font, 60);
  createTextGeometry("A", font, 75);
  createTextGeometry("L", font, 90);

  createTextGeometry("U", font, 150);
  createTextGeometry("N", font, 165);
  createTextGeometry("I", font, 180);
  createTextGeometry("V", font, 195);
  createTextGeometry("E", font, 210);
  createTextGeometry("R", font, 225);
  createTextGeometry("S", font, 240);
  createTextGeometry("A", font, 255);
  createTextGeometry("L", font, 270);
});

//テクスチャ
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(texture01);
const particlesTexture = textureLoader.load(texture02);
const starTexture = textureLoader.load(texture03);

// 球体
const sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
sphereMaterial.map = earthTexture;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.rotation.x = -0.5;
container.add(sphere);

//　パーティクル
const particlesGeometry = new THREE.BufferGeometry();
const count = 1500;

const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++)  {
  positionArray[i] = (Math.random() - 0.5) * 150;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
)

const pointMaterial = new THREE.PointsMaterial({
  size: 1.5,
  sizeAttenuation: true,
  alphaMap: particlesTexture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
pointMaterial.color.set("white");

//GUIデバッグ
gui.addColor(pointMaterial, "color");
gui.add(pointMaterial, "size", 0.5, 10, 0.01);

const particles = new THREE.Points(particlesGeometry, pointMaterial);
particles.position.set(0,0,0);

scene.add(particles);

// 流れ星
const starGeometry = new THREE.PlaneGeometry(0.5, 50);
const starMaterial = new THREE.MeshBasicMaterial({
  alphaMap: starTexture,
  transparent: true,
});
const starMesh01 = new THREE.Mesh(starGeometry, starMaterial);
const starMesh02 = new THREE.Mesh(starGeometry, starMaterial);
const starMesh03 = new THREE.Mesh(starGeometry, starMaterial);
const starMesh04 = new THREE.Mesh(starGeometry, starMaterial);
const starMesh05 = new THREE.Mesh(starGeometry, starMaterial);
starMesh01.position.set(30,45,-20);
starMesh02.position.set(60,40,-20);
starMesh03.position.set(-20,40,-20);
starMesh04.position.set(-20,-20,-20);
starMesh05.position.set(-10,-25,-20);
starMesh01.rotation.set(1.68,0,0);
starMesh02.rotation.set(1.4,0,0);
starMesh03.rotation.set(-1.2,0,0);
starMesh04.rotation.set(-1.65,0,0);
starMesh05.rotation.set(-1.7,0,0);
scene.add(starMesh01, starMesh02, starMesh03, starMesh04, starMesh05);

// カメラのコントロール
const trackballControls = new TrackballControls(camera, webGLRenderer.domElement);
trackballControls.panSpeed = 0.2;
trackballControls.rotateSpeed = 3.0;
trackballControls.maxDistance = 1000;
trackballControls.noZoom = true;

/***** 3Dテキスト作成関数 *****/
function createTextGeometry(text, font, deg) {
  const textGeometry = new TextGeometry(text, {
    font: font,
    size: textSize,
    height: 1.5,
    curveSegment: 1
  });
  textGeometry.center();

  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });

  const r = 22;
  const phi = 90 * (Math.PI / 180);
  const theta = deg * (Math.PI / 180);
  const sphericalPos = new THREE.Spherical(r, phi, theta);

  textMesh = new THREE.Mesh(textGeometry, material);
  textMesh.position.setFromSpherical(sphericalPos);

  const vector = new THREE.Vector3();
  vector.copy(textMesh.position).multiplyScalar(2);

  textMesh.lookAt(vector);
  container.add(textMesh);
}


/***** 描画関数 *****/
const clock = new THREE.Clock();

function renderScene() {
  // コンテナを回す(コンテナ中身のテキストと球体も回る)
  container.rotation.y -= sphereSpeed.sphereSpeedY;
  particles.rotation.y += particlesSpeed.particlesSpeedY;
  particles.rotation.z += particlesSpeed.particlesSpeedZ;
  const delta = clock.getDelta();
  trackballControls.update(delta);
  starAnimation01();
  requestAnimationFrame(renderScene);
  webGLRenderer.render(scene, camera);
}

function starAnimation01() {
  starMesh01.position.y -= 0.2;
  starMesh01.position.x -= 0.15;
  starMesh01.material.opacity -= 0.001;
  if (starMesh01.material.opacity <= 0) {
    starMesh01.position.y = 45;
    starMesh01.position.x = 30;
    starMesh01.material.opacity = 1;
  }
  starMesh02.position.y -= 0.2;
  starMesh02.position.x -= 0.2;
  starMesh02.material.opacity -= 0.001;
  if (starMesh02.material.opacity <= 0) {
    starMesh02.position.y = 40;
    starMesh02.position.x = 60;
    starMesh02.material.opacity = 1;
  }
  starMesh03.position.y -= 0.2;
  starMesh03.position.x -= 0.3;
  starMesh03.material.opacity -= 0.001;
  if (starMesh03.material.opacity <= 0) {
    starMesh03.position.y = 40;
    starMesh03.position.x = -20;
    starMesh03.material.opacity = 1;
  }
  starMesh04.position.y -= 0.2;
  starMesh04.position.x -= 0.3;
  starMesh04.material.opacity -= 0.0005;
  if (starMesh04.material.opacity <= 0) {
    starMesh04.position.y = -20;
    starMesh04.position.x = -20;
    starMesh04.material.opacity = 1;
  }
  starMesh05.position.y -= 0.2;
  starMesh05.position.x -= 0.3;
  starMesh05.material.opacity -= 0.0005;
  if (starMesh05.material.opacity <= 0) {
    starMesh05.position.y = -25;
    starMesh05.position.x = -10;
    starMesh05.material.opacity = 1;
  }
}

/***** ウィンドウサイズ変更 *****/
window.addEventListener("resize", function(){

  // アスペクト比
var aspRatio = window.innerWidth / window.innerHeight;

  // 視野角
  var fov;
  if (aspRatio > 1) {
    fov = 35;
  } else if (aspRatio > 0.9) {
    fov = 45
  } else if (aspRatio > 0.8) {
    fov = 50;
  } else if (aspRatio > 0.6) {
    fov = 60;
  } else if (aspRatio > 0.5) {
    fov = 70;
  } else {
    fov = 80;
  }

  camera.aspect = aspRatio;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.render(scene, camera);

});

// 描画
renderScene();