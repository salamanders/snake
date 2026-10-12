// WebGL2 & WebGL1 Compatible Full-Screen Snake Back Animation
// Realistic Keeled Overlapping Scales with 3D Cylindrical Foreshortening
// Pure Vanilla ES Module - Zero Dependencies

const canvas = document.getElementById('canvas');
const contextOptions = {
  alpha: false,
  antialias: true,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance'
};

let isWebGL2 = true;
let gl = canvas.getContext('webgl2', contextOptions);

if (!gl) {
  isWebGL2 = false;
  gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
}

if (!gl) {
  document.body.innerHTML = '<p style="color:#fff;text-align:center;margin-top:40vh;font-family:sans-serif;">WebGL is not supported on this browser/device.</p>';
  throw new Error('WebGL not supported');
}

// Enable standard derivatives for WebGL1 if needed
if (!isWebGL2) {
  gl.getExtension('OES_standard_derivatives');
}

// Vertex Shaders
const vsSourceWebGL2 = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const vsSourceWebGL1 = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Shared fragment shader body
const shaderCore = `
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;

// Mathematical period of dorsal pattern in scale rows (even for staggered lattice)
const float PATTERN_PERIOD = 8.0;

// Total scale columns mapped across the visible cylindrical perimeter (doubled scale size)
const float SCALE_COLUMNS = 9.0;

// Maximum cylinder wrap angle (radians, ~82 degrees for steep edge curving)
const float MAX_THETA = 1.44;

float pmod(float val, float m) {
  return mod(mod(val, m) + m, m);
}

// Organic pseudo-random hash (strictly periodic in v)
float hash21(vec2 p) {
  p = vec2(pmod(p.x, 64.0), pmod(p.y, PATTERN_PERIOD));
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Lanceolate keeled scale evaluator (matching anatomical reference photo)
// Returns vec4(spadeDist, surfaceHeight, idHash, macroPatternDist)
vec4 evalScale(float cu, float cv, float u, float v) {
  vec2 d = vec2(u - cu, v - cv);

  // Normalized transverse coordinate across scale width
  float sx = abs(d.x) / 0.52;

  // Asymmetric longitudinal coordinate:
  // d.y < 0 is the trailing caudal tip (tapered spade), d.y > 0 is cranial root (tucked)
  float sy = d.y < 0.0 ? abs(d.y) / 0.98 : d.y / 0.82;

  // Lanceolate spade contour: blend between rounded diamond and ovate petal
  float spadeDist = pow(pow(sx, 1.30) + pow(sy, 1.30), 1.0 / 1.30);

  // Longitudinal tilt: trailing caudal tip is thick and lifted above the body
  float ramp = mix(0.18, 1.05, smoothstep(0.80, -0.65, d.y));

  // Raised central keel ridge running down d.x = 0
  float keel = pow(clamp(1.0 - sx, 0.0, 1.0), 0.72);

  // Fleshy scale dome with elevated trailing lip
  float dome = sqrt(clamp(1.0 - clamp(spadeDist, 0.0, 1.0) * 0.45, 0.0, 1.0));
  float height = ramp * (0.38 + 0.62 * keel) * dome;

  // Discrete scale ID for pattern and organic variance
  vec2 scaleId = vec2(floor(cu), pmod(floor(cv), PATTERN_PERIOD));
  float idHash = hash21(scaleId);

  // Dorsal Diamondback pattern envelope calibrated for 2x scale size
  float spineDist = abs(cu - (SCALE_COLUMNS * 0.5));
  float cycleV = pmod(cv + 0.5, PATTERN_PERIOD) - (PATTERN_PERIOD * 0.5);
  float macroPatternDist = spineDist * 1.25 + abs(cycleV);

  return vec4(spadeDist, height, idHash, macroPatternDist);
}

vec3 computeColor() {
  // Normalized horizontal position across snake body: [-1.0, 1.0]
  float x = (gl_FragCoord.x / u_resolution.x - 0.5) * 2.0;

  // 1. TRUE 3D CYLINDRICAL FORESHORTENING:
  // Map linear screen space x into cylindrical angle theta = asin(x / R).
  // Near the edges (x -> +-1), du/dx increases dramatically, compressing scales horizontally!
  float normX = clamp(x * 0.985, -0.985, 0.985);
  float theta = asin(normX);
  float uNorm = theta / MAX_THETA; // [-1.0, 1.0]

  // Cylinder surface normal matching the physical curved geometry
  vec3 nCyl = normalize(vec3(sin(theta), 0.0, cos(theta)));

  // Texture coordinates:
  // u wraps along the cylinder perimeter (compressed at screen edges)
  float u = (uNorm * 0.5 + 0.5) * SCALE_COLUMNS;
  float v = (gl_FragCoord.y / u_resolution.x) * SCALE_COLUMNS * 1.55 - u_time * u_speed;

  // 2. OVERLAPPING SHINGLE RESOLUTION:
  // Snake scales overlap downwards (head tucks under, trailing tip overlaps over the scale below).
  // Check candidates from top layer (dr = 1) down to bottom layer (dr = -1).
  float baseRow = floor(v);
  vec4 win = vec4(999.0, 0.0, 0.0, 0.0);
  float upperLipDist = 999.0;
  bool found = false;

  for (int dr = 1; dr >= -1; --dr) {
    float row = baseRow + float(dr);
    float parity = pmod(row, 2.0);
    float cu = floor(u - parity * 0.5) + 0.5 + parity * 0.5;

    vec4 s = evalScale(cu, row, u, v);

    // Track distance to the upper scale's trailing edge for drop shadow
    if (dr == 1) {
      upperLipDist = s.x;
    }

    if (s.x <= 1.0) {
      win = s;
      found = true;
      break;
    }
  }

  // Boundary fallback
  if (!found) {
    for (int dr = 1; dr >= -1; --dr) {
      float row = baseRow + float(dr);
      float parity = pmod(row, 2.0);
      float cu = floor(u - parity * 0.5) + 0.5 + parity * 0.5;
      vec4 s = evalScale(cu, row, u, v);
      if (s.x < win.x) {
        win = s;
      }
    }
  }

  float dist = win.x;
  float h = win.y;
  float idHash = win.z;
  float macroDist = win.w;

  // Hardware screen-space derivatives for tactile scale relief
  float dhdx = dFdx(h);
  float dhdy = dFdy(h);
  vec3 nScale = normalize(vec3(-dhdx * 28.0, -dhdy * 28.0, 1.0));

  // Blend scale normal with cylindrical body curvature
  vec3 N = normalize(vec3(nCyl.xy * 0.65 + nScale.xy * 0.75, nCyl.z * nScale.z));

  // Lighting vectors
  vec3 lightDir = normalize(vec3(0.0, 0.40, 0.91));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  // Cylindrical diffuse falloff: brightest along the center spine
  float diff = max(dot(N, lightDir), 0.0);
  float cylVignette = pow(clamp(cos(theta), 0.0, 1.0), 0.75);

  // Keratin specular highlights: broad sheen plus sharp keel glint
  float specBroad = pow(max(dot(N, halfDir), 0.0), 16.0);
  float specKeel = pow(max(dot(N, halfDir), 0.0), 55.0) * clamp(1.0 - abs(dhdx * 10.0), 0.0, 1.0);

  // Subsurface rim lighting around curving cylinder horizon
  float rim = pow(clamp(1.0 - max(dot(nCyl, viewDir), 0.0), 0.0, 1.0), 2.2) * 0.40;

  // 3. COLOR PALETTE (matching reference snake photo):
  // - Rich luminous ivory / butter-yellow
  // - Deep pitch charcoal / espresso
  // - Warm caramel-ochre midtones
  vec3 butterCream = vec3(0.93, 0.86, 0.62);
  vec3 darkCharcoal = vec3(0.12, 0.10, 0.08);
  vec3 warmOchre = vec3(0.62, 0.50, 0.33);
  vec3 oliveTan = vec3(0.48, 0.42, 0.28);

  vec3 baseTone = mix(warmOchre, oliveTan, idHash * 0.65);
  vec3 scaleColor = baseTone;

  // Diamondback rattlesnake markings (calibrated for doubled scale size):
  if (macroDist < 1.4) {
    // Diamond center
    scaleColor = mix(scaleColor, butterCream, 0.85);
  } else if (macroDist >= 1.4 && macroDist < 2.6) {
    // Bold dark diamond border
    scaleColor = mix(scaleColor, darkCharcoal, 0.90);
  } else if (macroDist >= 2.6 && macroDist < 3.6) {
    // Pale outer halo
    scaleColor = mix(scaleColor, butterCream, 0.75);
  }

  // Micro-organic scale tint variance
  scaleColor *= (0.86 + 0.28 * idHash);

  // Highlight along the thick trailing lip of each scale
  float lipHighlight = smoothstep(0.80, 0.98, dist) * (1.0 - smoothstep(0.98, 1.02, dist));
  scaleColor = mix(scaleColor, butterCream * 1.15, lipHighlight * 0.35);

  // 4. OVERLAPPING CONTACT DROP SHADOW:
  // The upper scale lifts off and casts a soft drop shadow on the scale underneath
  float dropShadow = 1.0;
  if (upperLipDist > 1.0 && upperLipDist < 1.45) {
    dropShadow = smoothstep(1.0, 1.45, upperLipDist);
    dropShadow = mix(0.35, 1.0, dropShadow);
  }

  // Ambient occlusion crevice shadow at scale boundaries
  float edgeAO = smoothstep(0.0, 0.22, 1.0 - dist);

  // Combine ambient, diffuse, specular, and rim
  vec3 ambient = scaleColor * 0.26 * (0.25 + 0.75 * cylVignette);
  vec3 diffuse = scaleColor * diff * (0.30 + 0.70 * cylVignette);
  vec3 specular = vec3(1.0, 0.96, 0.88) * (specBroad * 0.32 + specKeel * 0.45) * cylVignette;
  vec3 rimLight = vec3(0.42, 0.36, 0.26) * rim;

  vec3 finalColor = (ambient + diffuse) * edgeAO * dropShadow + specular + rimLight;

  // Film-like tone curve
  return finalColor / (finalColor + vec3(0.78)) * 1.78;
}
`;

const fsSourceWebGL2 = `#version 300 es
precision highp float;
out vec4 fragColor;
${shaderCore}
void main() {
  fragColor = vec4(computeColor(), 1.0);
}
`;

const fsSourceWebGL1 = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
${shaderCore}
void main() {
  gl_FragColor = vec4(computeColor(), 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation error: ${info}`);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return program;
}

const vsSource = isWebGL2 ? vsSourceWebGL2 : vsSourceWebGL1;
const fsSource = isWebGL2 ? fsSourceWebGL2 : fsSourceWebGL1;
const program = createProgram(gl, vsSource, fsSource);

// Geometry Setup
const quadVertices = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
]);

let vao = null;
if (isWebGL2) {
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
}

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

const posAttribLoc = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(posAttribLoc);
gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, false, 0, 0);

// Uniform locations
const resLoc = gl.getUniformLocation(program, 'u_resolution');
const timeLoc = gl.getUniformLocation(program, 'u_time');
const speedLoc = gl.getUniformLocation(program, 'u_speed');

const CRAWL_SPEED = 0.85;

function handleResize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
  const width = Math.round(window.innerWidth * dpr);
  const height = Math.round(window.innerHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

window.addEventListener('resize', handleResize, { passive: true });
window.addEventListener('orientationchange', handleResize, { passive: true });
handleResize();

function toggleFullscreen() {
  const doc = document;
  const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement;

  if (!isFullscreen) {
    const el = doc.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    }
  }
}

window.addEventListener('click', toggleFullscreen);

const startTime = performance.now();

function render() {
  const currentTime = (performance.now() - startTime) / 1000.0;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.enableVertexAttribArray(posAttribLoc);
  gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.uniform1f(timeLoc, currentTime);
  gl.uniform1f(speedLoc, CRAWL_SPEED);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

// Initial synchronous draw for immediate display and headless screenshotting
render();

if (new URLSearchParams(window.location.search).has('snap')) {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.id = 'snapshot-img';
    img.src = dataUrl;
    img.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100dvh;z-index:999999;display:block;object-fit:cover;';
    document.body.appendChild(img);
  } catch (e) {
    // ignore
  }
}
