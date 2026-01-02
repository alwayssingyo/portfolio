<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import * as THREE from "three";

  /* ===============================
   * dom & three instances
   * =============================== */
  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let material: THREE.ShaderMaterial;
  let animationFrameId: number;

  /* ===============================
   * utils
   * =============================== */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const baseColors = [
    new THREE.Vector3(0.85, 0.92, 0.92),
    new THREE.Vector3(0.7, 0.85, 0.85),
    new THREE.Vector3(1.0, 0.8, 0.85),
    new THREE.Vector3(0.9, 0.9, 0.7),
  ];

  /* ===============================
   * uniforms
   * =============================== */
  const uniforms = {
    time: { value: 0 },
    fade: { value: 0 },

    mixRatio: { value: 1 },

    colorsFrom: {
      value: baseColors.map((c) => c.clone()),
    },

    colorsTo: {
      value: shuffleArray(baseColors.map((c) => c.clone())),
    },
  };

  /* ===============================
   * shaders
   * =============================== */
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float fade;
    uniform float mixRatio;
    uniform vec3 colorsFrom[4];
    uniform vec3 colorsTo[4];
    varying vec2 vUv;

    float noise(vec2 uv, float t) {
      return (1.0 + sin(uv.x * 4.3 + t) + cos(uv.y * 4.3 + t)) * 0.5;
    }

    vec2 rotate(vec2 v, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
    }

    vec3 getColor(vec2 uv, float t) {
      vec2 center = vec2(0.5);
      vec2 ruv = rotate(uv - center, t * 0.05) + center;

      vec2 n = vec2(
        noise(ruv, t * 0.5),
        noise(ruv, t * 0.75)
      );

      vec3 c0 = mix(colorsFrom[0], colorsTo[0], mixRatio);
      vec3 c1 = mix(colorsFrom[1], colorsTo[1], mixRatio);
      vec3 c2 = mix(colorsFrom[2], colorsTo[2], mixRatio);
      vec3 c3 = mix(colorsFrom[3], colorsTo[3], mixRatio);

      vec3 top = mix(c0, c1, n.x);
      vec3 bottom = mix(c2, c3, n.x);

      return mix(top, bottom, n.y);
    }

    void main() {
      gl_FragColor = vec4(getColor(vUv, time), fade);
    }
  `;

  /* ===============================
   * three setup
   * =============================== */
  const initThree = () => {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10,
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);

    scene.add(mesh);
  };

  /* ===============================
   * animation loop
   * =============================== */
  const animate = () => {
    uniforms.time.value += 0.001;

    if (uniforms.fade.value < 1) {
      uniforms.fade.value += 0.02;
    }

    if (uniforms.mixRatio.value < 1) {
      uniforms.mixRatio.value += 0.01;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  /* ===============================
   * resize
   * =============================== */
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /* ===============================
   * route change → color transition
   * =============================== */
  const transitionColors = () => {
    uniforms.colorsFrom.value = uniforms.colorsTo.value.map((c) => c.clone());

    uniforms.colorsTo.value = shuffleArray(baseColors.map((c) => c.clone()));

    uniforms.mixRatio.value = 0;
  };

  /* ===============================
   * lifecycle
   * =============================== */
  onMount(() => {
    initThree();
    animate();
    window.addEventListener("resize", handleResize);
  });

  $: $page.url.pathname, transitionColors();
</script>

<div class="shader-bg" bind:this={container}></div>

<style>
  .shader-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
</style>
