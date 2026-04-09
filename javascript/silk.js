import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

const hexToNormalizedRGB = (hex) => {
    const cleanHex = hex.replace('#', '');
    return [
        parseInt(cleanHex.slice(0, 2), 16) / 255,
        parseInt(cleanHex.slice(2, 4), 16) / 255,
        parseInt(cleanHex.slice(4, 6), 16) / 255
    ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const initSilk = () => {
    const container = document.getElementById('silk-canvas');
    if (!container) return;

    // Remove any existing canvas if init is called multiple times
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const scene = new THREE.Scene();
    // Use an OrthographicCamera for 2D-like full screen plane
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const initialColor = '#7B7481';

    const uniforms = {
        uSpeed: { value: 0.5 },
        uScale: { value: 1 },
        uNoiseIntensity: { value: 1.5 },
        uColor: { value: new THREE.Color(...hexToNormalizedRGB(initialColor)) },
        uRotation: { value: 0 },
        uTime: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Correct aspect ratio adjustments if using perspective camera, 
        // but for full screen quad/orthographic usually just resize is enough 
        // if the shader handles coords correctly (which it seems to via UVs).
        // However, checks on the original code show it used viewport width/height scaling.
        // Let's re-examine original SilkPlane. 
        // "ref.current.scale.set(viewport.width, viewport.height, 1);"
        // The original used perspective camera (default in R3F Canvas).
        // Here we use Orthographic full screen quad (-1 to 1). 
        // The shader uses vUv. 
        // If we want identical aspect behavior we might need to adjust uScale or uv based on aspect.
        // But for a background pattern, stretching might be fine or handled by uScale.
        // Based on original code, it scaled the plane to viewport. 
        // In R3F default camera is perspective, positioned at z=5.
        // If we use Orthographic -1..1, the plane fills the screen exactly.
    };

    window.addEventListener('resize', onWindowResize);
};

// Wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSilk);
} else {
    initSilk();
}
