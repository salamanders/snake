// WebGL2 & WebGL1 Compatible Full-Screen Snake Back Animation
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
let oesDeriv = null;
if (!isWebGL2) {
  oesDeriv = gl.getExtension('OES_standard_derivatives');
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

// Mathematical period of the dorsal pattern in scale rows (even for staggered grid)
const float PATTERN_PERIOD = 8.0;

// Number of scale columns spanning the body width
const float SCALE_COLUMNS = 16.0;

// Positive modulo helper
float pmod(float val, float m) {
  return mod(mod(val, m) + m, m);
}

// Pseudo-random hash for natural organic scale variance (strictly periodic in v)
float hash21(vec2 p) {
  p = vec2(pmod(p.x, 64.0), pmod(p.y, PATTERN_PERIOD));
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Scale evaluation: returns vec4(distance, height, idHash, patternWeight)
vec4 evalScale(float cu, float cv, float u, float v) {
  vec2 d = vec2(u - cu, v - cv);

  // Diamond bounding box calibrated for gapless shingle overlap
  float nx = abs(d.x) / 0.54;
  float ny = abs(d.y) / 1.08;
  float diamondDist = nx + ny;

  // Keeled ridge: sharp crest running down center of scale (nx = 0)
  float keel = pow(clamp(1.0 - nx, 0.0, 1.0), 0.70);

  // Longitudinal arch: trailing caudal tip (-d.y) lifts above underlying scale
  float arch = clamp(0.70 - d.y * 0.35, 0.25, 1.25);

  // Height relief of the scale
  float height = clamp(1.0 - diamondDist, 0.0, 1.0) * keel * arch;

  // Discrete scale ID for pattern and keratin variation
  vec2 scaleId = vec2(floor(cu), pmod(floor(cv), PATTERN_PERIOD));
  float idHash = hash21(scaleId);

  // Diamondback rattlesnake dorsal pattern:
  // Center spine is at SCALE_COLUMNS * 0.5
  float spineDist = abs(cu - (SCALE_COLUMNS * 0.5));
  float cycleV = pmod(cv + 0.5, PATTERN_PERIOD) - (PATTERN_PERIOD * 0.5);

  // Macro-diamond envelope on dorsal spine repeating every 8 rows
  float macroDiamond = spineDist * 1.35 + abs(cycleV);

  return vec4(diamondDist, height, idHash, macroDiamond);
}

vec3 computeColor() {
  // Horizontal coordinate across snake body: [-1.0 (left) to 1.0 (right)]
  float x = (gl_FragCoord.x / u_resolution.x - 0.5) * 2.0;

  // Cylindrical body curvature normal (brightest along center spine, falls off at sides)
  float xClamped = clamp(x, -0.999, 0.999);
  float zCyl = sqrt(max(0.001, 1.0 - xClamped * xClamped));
  vec3 nCyl = normalize(vec3(xClamped, 0.0, zCyl));

  // Scale UV lattice coordinates:
  // Scaled by u_resolution.x so scales stay proportional and grow on landscape
  float u = (x * 0.5 + 0.5) * SCALE_COLUMNS;
  float v = (gl_FragCoord.y / u_resolution.x) * SCALE_COLUMNS * 1.45 - u_time * u_speed;

  // Overlapping scale lattice:
  // Shingles overlap downwards, so candidate rows checked from dr = 1 down to dr = -1
  float baseRow = floor(v);
  vec4 winningScale = vec4(999.0, 0.0, 0.0, 0.0);
  bool found = false;

  for (int dr = 1; dr >= -1; --dr) {
    float row = baseRow + float(dr);
    float parity = pmod(row, 2.0);
    float cu = floor(u - parity * 0.5) + 0.5 + parity * 0.5;

    vec4 s = evalScale(cu, row, u, v);
    if (s.x <= 1.0) {
      winningScale = s;
      found = true;
      break;
    }
  }

  if (!found) {
    for (int dr = 1; dr >= -1; --dr) {
      float row = baseRow + float(dr);
      float parity = pmod(row, 2.0);
      float cu = floor(u - parity * 0.5) + 0.5 + parity * 0.5;
      vec4 s = evalScale(cu, row, u, v);
      if (s.x < winningScale.x) {
        winningScale = s;
      }
    }
  }

  float dist = winningScale.x;
  float h = winningScale.y;
  float idHash = winningScale.z;
  float macroDist = winningScale.w;

  // Compute scale normal from screen-space derivatives
  float dhdx = dFdx(h);
  float dhdy = dFdy(h);
  vec3 nScale = normalize(vec3(-dhdx * 28.0, -dhdy * 28.0, 1.0));

  // Blend scale surface normal with cylindrical body curvature
  vec3 N = normalize(vec3(nCyl.xy * 0.60 + nScale.xy * 0.80, nCyl.z * nScale.z));

  // Lighting vectors
  vec3 lightDir = normalize(vec3(0.0, 0.35, 0.93));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  // Cylindrical diffuse falloff: brightest in center, soft shadow at edges
  float diff = max(dot(N, lightDir), 0.0);
  float cylVignette = smoothstep(1.0, 0.12, abs(x));

  // Keratin specular highlights: broad sheen plus sharp anisotropic glint along the keel
  float specBroad = pow(max(dot(N, halfDir), 0.0), 18.0);
  float specKeel = pow(max(dot(N, halfDir), 0.0), 55.0) * clamp(1.0 - abs(dhdx * 12.0), 0.0, 1.0);

  // Rim lighting / subtle subsurface grazing angle glow
  float rim = pow(clamp(1.0 - max(dot(nCyl, viewDir), 0.0), 0.0, 1.0), 2.2) * 0.35;

  // Reptilian color palette:
  vec3 tanBase = vec3(0.64, 0.52, 0.35);
  vec3 oliveBase = vec3(0.50, 0.44, 0.30);
  vec3 scaleColor = mix(tanBase, oliveBase, idHash * 0.7);

  // Diamondback markings:
  vec3 darkMarking = vec3(0.13, 0.10, 0.07);
  vec3 creamHighlight = vec3(0.85, 0.80, 0.66);
  vec3 diamondCenter = vec3(0.58, 0.46, 0.31);

  if (macroDist < 1.9) {
    scaleColor = mix(scaleColor, diamondCenter, 0.65);
  } else if (macroDist >= 1.9 && macroDist < 3.1) {
    scaleColor = mix(scaleColor, darkMarking, 0.88);
  } else if (macroDist >= 3.1 && macroDist < 4.1) {
    scaleColor = mix(scaleColor, creamHighlight, 0.82);
  }

  // Micro-keratin shade variation per scale
  scaleColor *= (0.88 + 0.24 * idHash);

  // Scale depth & ambient occlusion crevices between overlapping shingles
  float edgeAO = smoothstep(0.0, 0.18, 1.0 - dist) * (0.55 + 0.45 * cylVignette);

  // Combine ambient, diffuse, specular, and rim
  vec3 ambient = scaleColor * 0.28 * (0.3 + 0.7 * cylVignette);
  vec3 diffuse = scaleColor * diff * (0.35 + 0.65 * cylVignette);
  vec3 specular = vec3(1.0, 0.96, 0.88) * (specBroad * 0.35 + specKeel * 0.45) * cylVignette;
  vec3 rimLight = vec3(0.38, 0.34, 0.26) * rim;

  vec3 finalColor = (ambient + diffuse) * edgeAO + specular + rimLight;

  // Tone mapping and gamma curve for rich contrast
  return finalColor / (finalColor + vec3(0.80)) * 1.80;
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

const CRAWL_SPEED = 1.2;

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
    if (typeof dump === 'function') dump('toDataURL error: ' + e + '\n');
  }
}
