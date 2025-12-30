<script lang="ts">
  import { onMount } from "svelte";
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
   * uniforms & constants
   * =============================== */
  const uniforms = {
    time: { value: 0.0 },
    fade: { value: 0.0 },
    colors: {
      value: [
        new THREE.Vector3(0.85, 0.92, 0.92), // teal
        new THREE.Vector3(0.7, 0.85, 0.85), // aqua
        new THREE.Vector3(1.0, 0.8, 0.85), // lavender
        new THREE.Vector3(0.9, 0.9, 0.7), // lemon
      ],
    },
  };

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
    uniform vec3 colors[4];
    varying vec2 vUv;

    float noise(vec2 uv, float t) {
      return (1.0 + sin(uv.x * 4.3 + t) + cos(uv.y * 4.3 + t)) * 0.5;
    }

    vec2 rotate(vec2 v, float a) {
      float s = sin(a);
      float c = cos(a);
      return vec2(
        c * v.x - s * v.y,
        s * v.x + c * v.y
      );
    }

    vec3 getColor(vec2 uv, float t) {
      vec2 center = vec2(0.5);
      vec2 rotatedUV = rotate(uv - center, t * 0.05) + center;

      vec2 noiseUV = vec2(
        noise(rotatedUV, t * 0.5),
        noise(rotatedUV, t * 0.75)
      );

      vec3 top = mix(colors[0], colors[1], noiseUV.x);
      vec3 bottom = mix(colors[2], colors[3], noiseUV.x);

      return mix(top, bottom, noiseUV.y);
    }

    void main() {
      vec3 color = getColor(vUv, time);
      gl_FragColor = vec4(color, fade);
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
      1000,
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };

  /* ===============================
   * animation loop
   * =============================== */
  const animate = () => {
    uniforms.time.value += 0.005;

    if (uniforms.fade.value < 1.0) {
      uniforms.fade.value = Math.min(uniforms.fade.value + 0.02, 1.0);
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  /* ===============================
   * resize handler
   * =============================== */
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /* ===============================
   * lifecycle
   * =============================== */
  onMount(() => {
    uniforms.colors.value = shuffleArray(uniforms.colors.value);

    initThree();
    animate();

    window.addEventListener("resize", handleResize);
  });
</script>

<div bind:this={container} id="container"></div>

<style lang="scss">
  #container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
