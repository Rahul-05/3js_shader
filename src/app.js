import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { init, gl, scene, camera, controls } from './init/init';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import { GUI } from './init/lil-gui.module.min';
import './style.css';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

init();

let gui = new GUI();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 1, 32, 200 ),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 0.6 },
      uSpread: { value: 2.4 },
      uNoise: { value: 16 },
    },
  })
);

scene.add(sphere);

let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

// Controls //

gui.add(sphere.material.uniforms.uDisplace, 'value', 0, 5, 0.1)
   .name('displacemnt');
gui.add(sphere.material.uniforms.uSpread, 'value', 0, 3, 0.1).name('spread');
gui.add(sphere.material.uniforms.uNoise, 'value', 0, 25, 0.1).name('noise');

// Controls //

// Postprocessing //

// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   1.4,
//   0.0001,
//   0.01
// );

// composer.addPass(bloomPass);

// Postprocessing //

const clock = new THREE.Clock();

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.material.uniforms.uTime.value = elapsedTime;
  sphere.rotation.z = Math.sin(elapsedTime) / 1 + elapsedTime / 10 + 5;
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
};
animate();
