<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let material: THREE.ShaderMaterial;
  let animationFrameId: number;

  const uniforms = {
    time: { value: 0.0 },
    colors: {
      value: [
        new THREE.Vector3(0.85, 0.92, 0.92), // 청록
        new THREE.Vector3(0.7, 0.85, 0.85), // 아쿠아
        new THREE.Vector3(1.0, 0.8, 0.85), // 라벤더
        new THREE.Vector3(0.9, 0.9, 0.7), // 레몬
      ],
    },
  };

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec3 colors[4];
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
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  onMount(() => {
    // 색상 랜덤 순서 결정
    uniforms.colors.value = shuffleArray(uniforms.colors.value);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      uniforms.time.value += 0.005;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", onWindowResize);
  });

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
</script>

<div bind:this={container} id="container"></div>

<style lang="scss">
  #container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
