// =============================================================================
// SNAKE ANIMATION CONFIGURATION
// Tweak any of these constants to adjust shape, overlap, gleam, colors, and motion
// =============================================================================

export const CONFIG = {
  // ---------------------------------------------------------------------------
  // 1. SCALE SHAPE & CONTOUR
  // ---------------------------------------------------------------------------
  scaleColumns: 10.0,          // [min: 4.0, max: 24.0] Scales across body (lower = larger scales)
  scaleAspect: 1.55,           // [min: 0.6, max: 3.0]  Vertical elongation (higher = longer/slenderer scales)
  scaleContourPower: 1.30,     // [min: 0.8, max: 2.5]  Shape contour (0.8 = sharp pointed diamond, 2.0 = rounded oval spade)
  keelSharpness: 0.72,         // [min: 0.1, max: 2.0]  Crest roundness (higher = defined rounded spine, lower = flatter dome)

  // ---------------------------------------------------------------------------
  // 2. SCALE OVERLAP & 3D RELIEF
  // ---------------------------------------------------------------------------
  scaleOverlap: 0.40,          // [min: 0.05, max: 0.80] Shingle overlap amount (how far each scale overlaps the one below)
  lipLiftHeight: 0.35,         // [min: 0.05, max: 0.80] Elevation / step-drop of trailing edge above the underlying body
  dropShadowStrength: 0.65,    // [min: 0.0, max: 1.0]  Darkness of contact drop shadow under the overlapping lip
  reliefDepth: 28.0,           // [min: 0.0, max: 60.0] 3D normal depth from surface gradients (0 = flat 2D)

  // ---------------------------------------------------------------------------
  // 3. GLEAM & SPECULAR SHINE
  // ---------------------------------------------------------------------------
  gleamOverall: 1.0,           // [min: 0.0, max: 2.5]  Master multiplier for all specular gleam & shine
  gleamSpineStrength: 0.45,    // [min: 0.0, max: 1.5]  Gleam brightness along central spine / crest
  gleamSpineTightness: 55.0,   // [min: 10., max: 120.] Pinpoint glint tightness (higher = smaller sharp glint)
  gleamSheenStrength: 0.32,    // [min: 0.0, max: 1.5]  Broad waxy keratin sheen brightness
  gleamSheenTightness: 16.0,   // [min: 2.0, max: 64.0] Broad sheen spread (higher = tighter gloss, lower = diffuse wax)
  gleamLipHighlight: 0.35,     // [min: 0.0, max: 1.5]  Gleam highlight brightness along rounded trailing rim

  // ---------------------------------------------------------------------------
  // 4. MOTION & CURVATURE
  // ---------------------------------------------------------------------------
  crawlSpeed: 0.95,            // [min: -3.0, max: 4.0] Upward speed (scale rows/sec; negative = crawls down)
  patternPeriod: 8.0,          // [min: 2.0, max: 16.0] Repeat cycle in rows (must be an even integer)
  maxTheta: 1.44,              // [min: 0.2, max: 1.54] Curvature wrap angle in radians (higher = steeper edge curving)
  cylinderFalloffExp: 0.80,    // [min: 0.1, max: 2.5]  Side vignette falloff exponent (higher = darker sides)

  // ---------------------------------------------------------------------------
  // 5. LIGHTING & ENVIRONMENT
  // ---------------------------------------------------------------------------
  lightDir: [0.0, 0.40, 0.91], // [X: -1 to 1, Y: -1 to 1, Z: 0.1 to 1] Overhead key light direction vector
  ambientStrength: 0.26,       // [min: 0.0, max: 1.0]  Base ambient fill lighting
  diffuseStrength: 1.0,        // [min: 0.0, max: 2.0]  Directional diffuse multiplier
  rimLightStrength: 0.40,      // [min: 0.0, max: 1.0]  Subsurface rim glow at cylinder edges

  // ---------------------------------------------------------------------------
  // 6. COLOR PALETTE (RGB normalized [0.0 - 1.0])
  // ---------------------------------------------------------------------------
  colorButterCream: [0.93, 0.86, 0.62], // [0-1, 0-1, 0-1] Pale ivory / butter-yellow markings
  colorDarkCharcoal: [0.12, 0.10, 0.08], // [0-1, 0-1, 0-1] Deep espresso / charcoal diamond borders
  colorWarmOchre: [0.62, 0.50, 0.33],    // [0-1, 0-1, 0-1] Warm amber / buff body scales
  colorOliveTan: [0.48, 0.42, 0.28],     // [0-1, 0-1, 0-1] Muted olive-tan flank scale variation

  // ---------------------------------------------------------------------------
  // 7. PERFORMANCE
  // ---------------------------------------------------------------------------
  maxDpr: 2.0                  // [min: 1.0, max: 3.0]  Maximum devicePixelRatio cap (prevents mobile GPU throttling)
};

// Programmatic min/max bounds and step increments for UI / controllers
export const CONFIG_BOUNDS = {
  // Shape
  scaleColumns: { min: 4.0, max: 24.0, step: 0.5 },
  scaleAspect: { min: 0.6, max: 3.0, step: 0.05 },
  scaleContourPower: { min: 0.80, max: 2.50, step: 0.05 },
  keelSharpness: { min: 0.10, max: 2.00, step: 0.02 },

  // Overlap
  scaleOverlap: { min: 0.05, max: 0.80, step: 0.02 },
  lipLiftHeight: { min: 0.05, max: 0.80, step: 0.02 },
  dropShadowStrength: { min: 0.0, max: 1.0, step: 0.05 },
  reliefDepth: { min: 0.0, max: 60.0, step: 1.0 },

  // Gleam
  gleamOverall: { min: 0.0, max: 2.5, step: 0.05 },
  gleamSpineStrength: { min: 0.0, max: 1.5, step: 0.05 },
  gleamSpineTightness: { min: 10.0, max: 120.0, step: 5.0 },
  gleamSheenStrength: { min: 0.0, max: 1.5, step: 0.05 },
  gleamSheenTightness: { min: 2.0, max: 64.0, step: 1.0 },
  gleamLipHighlight: { min: 0.0, max: 1.5, step: 0.05 },

  // Motion & Curvature
  crawlSpeed: { min: -3.0, max: 4.0, step: 0.05 },
  patternPeriod: { min: 2.0, max: 16.0, step: 2.0 },
  maxTheta: { min: 0.20, max: 1.54, step: 0.02 },
  cylinderFalloffExp: { min: 0.10, max: 2.50, step: 0.05 },

  // Lighting
  ambientStrength: { min: 0.0, max: 1.0, step: 0.02 },
  diffuseStrength: { min: 0.0, max: 2.0, step: 0.05 },
  rimLightStrength: { min: 0.0, max: 1.0, step: 0.02 },

  // Performance
  maxDpr: { min: 1.0, max: 3.0, step: 0.25 }
};

// GLSL formatting helpers
const f = (n) => Number(n).toFixed(4);
const v3 = (arr) => `vec3(${f(arr[0])}, ${f(arr[1])}, ${f(arr[2])})`;

// =============================================================================
// WEBGL ENGINE INITIALIZATION
// =============================================================================

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

// Shared fragment shader body with injected constants
const shaderCore = `
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;

// Injected configuration constants
const float PATTERN_PERIOD = ${f(CONFIG.patternPeriod)};
const float SCALE_COLUMNS = ${f(CONFIG.scaleColumns)};
const float SCALE_ASPECT = ${f(CONFIG.scaleAspect)};
const float SCALE_OVERLAP = ${f(CONFIG.scaleOverlap)};
const float LIP_LIFT = ${f(CONFIG.lipLiftHeight)};
const float MAX_THETA = ${f(CONFIG.maxTheta)};
const float CYL_FALLOFF_EXP = ${f(CONFIG.cylinderFalloffExp)};
const float CONTOUR_POW = ${f(CONFIG.scaleContourPower)};
const float KEEL_SHARPNESS = ${f(CONFIG.keelSharpness)};
const float RELIEF_DEPTH = ${f(CONFIG.reliefDepth)};
const float DROP_SHADOW_STR = ${f(CONFIG.dropShadowStrength)};

// Gleam constants
const float GLEAM_OVERALL = ${f(CONFIG.gleamOverall)};
const float GLEAM_SPINE_STR = ${f(CONFIG.gleamSpineStrength)};
const float GLEAM_SPINE_TIGHTNESS = ${f(CONFIG.gleamSpineTightness)};
const float GLEAM_SHEEN_STR = ${f(CONFIG.gleamSheenStrength)};
const float GLEAM_SHEEN_TIGHTNESS = ${f(CONFIG.gleamSheenTightness)};
const float GLEAM_LIP_STR = ${f(CONFIG.gleamLipHighlight)};

// Lighting constants
const vec3 LIGHT_DIR = normalize(${v3(CONFIG.lightDir)});
const float AMBIENT_STR = ${f(CONFIG.ambientStrength)};
const float DIFFUSE_STR = ${f(CONFIG.diffuseStrength)};
const float RIM_STR = ${f(CONFIG.rimLightStrength)};

// Color palette
const vec3 COLOR_BUTTER_CREAM = ${v3(CONFIG.colorButterCream)};
const vec3 COLOR_DARK_CHARCOAL = ${v3(CONFIG.colorDarkCharcoal)};
const vec3 COLOR_WARM_OCHRE = ${v3(CONFIG.colorWarmOchre)};
const vec3 COLOR_OLIVE_TAN = ${v3(CONFIG.colorOliveTan)};

float pmod(float val, float m) {
  return mod(mod(val, m) + m, m);
}

// Organic pseudo-random hash (strictly periodic in v)
float hash21(vec2 p) {
  p = vec2(pmod(p.x, 64.0), pmod(p.y, PATTERN_PERIOD));
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Lanceolate keeled scale evaluator with smooth, rounded interior camber
// Returns vec4(spadeDist, surfaceHeight, idHash, macroPatternDist)
vec4 evalScale(float cu, float cv, float u, float v) {
  vec2 d = vec2(u - cu, v - cv);

  // Normalized transverse coordinate across scale width
  float sx = abs(d.x) / 0.52;

  // Asymmetric longitudinal coordinate:
  // d.y < 0 is the trailing caudal tip (overlaps downwards), d.y > 0 is cranial root (tucked)
  float caudalSpan = 0.70 + SCALE_OVERLAP * 0.70;
  float sy = d.y < 0.0 ? abs(d.y) / caudalSpan : d.y / 0.82;

  // Lanceolate spade perimeter boundary
  float spadeDist = pow(pow(sx, CONTOUR_POW) + pow(sy, CONTOUR_POW), 1.0 / CONTOUR_POW);

  // Longitudinal tilt: trailing caudal tip is elevated above the underlying body
  float ramp = mix(0.20, 0.85 + LIP_LIFT, smoothstep(0.85, -caudalSpan * 0.65, d.y));

  // 1. SMOOTH INTERIOR CAMBER (No hard pyramid divider / crease):
  // Using quadratic u2 ensures d(height)/dx = 0 at the central spine (dx = 0).
  float u2 = clamp(sx * sx, 0.0, 1.0);
  float crossDome = clamp(1.0 - u2, 0.0, 1.0);
  float softSpine = exp(-u2 * KEEL_SHARPNESS * 4.0);
  float interiorCamber = mix(crossDome, crossDome * 0.45 + softSpine * 0.55, 0.55);

  // Outer lip thickness profile (thick trailing edge stepping down to underlying scale)
  float lipProfile = smoothstep(1.04, 0.65, spadeDist);
  float height = ramp * interiorCamber * (0.35 + 0.65 * lipProfile);

  // Discrete scale ID for pattern and organic variance
  vec2 scaleId = vec2(floor(cu), pmod(floor(cv), PATTERN_PERIOD));
  float idHash = hash21(scaleId);

  // Dorsal Diamondback pattern envelope calibrated for scale density
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
  float normX = clamp(x * 0.985, -0.985, 0.985);
  float theta = asin(normX);
  float uNorm = theta / MAX_THETA; // [-1.0, 1.0]

  // Cylinder surface normal matching the physical curved geometry
  vec3 nCyl = normalize(vec3(sin(theta), 0.0, cos(theta)));

  // Texture coordinates:
  // u wraps along the cylinder perimeter (compressed at screen edges)
  float u = (uNorm * 0.5 + 0.5) * SCALE_COLUMNS;
  float v = (gl_FragCoord.y / u_resolution.x) * SCALE_COLUMNS * SCALE_ASPECT - u_time * u_speed;

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
  vec3 nScale = normalize(vec3(-dhdx * RELIEF_DEPTH, -dhdy * RELIEF_DEPTH, 1.0));

  // Blend scale normal with cylindrical body curvature
  vec3 N = normalize(vec3(nCyl.xy * 0.65 + nScale.xy * 0.75, nCyl.z * nScale.z));

  // Lighting vectors
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(LIGHT_DIR + viewDir);

  // Cylindrical diffuse falloff: brightest along the center spine
  float diff = max(dot(N, LIGHT_DIR), 0.0);
  float cylVignette = pow(clamp(cos(theta), 0.0, 1.0), CYL_FALLOFF_EXP);

  // 3. GLEAM & KERATIN SPECULAR HIGHLIGHTS:
  float specBroad = pow(max(dot(N, halfDir), 0.0), GLEAM_SHEEN_TIGHTNESS);
  float specKeel = pow(max(dot(N, halfDir), 0.0), GLEAM_SPINE_TIGHTNESS);
  vec3 specular = vec3(1.0, 0.96, 0.88) * GLEAM_OVERALL * (specBroad * GLEAM_SHEEN_STR + specKeel * GLEAM_SPINE_STR) * cylVignette;

  // Subsurface rim lighting around curving cylinder horizon
  float rim = pow(clamp(1.0 - max(dot(nCyl, viewDir), 0.0), 0.0, 1.0), 2.2) * RIM_STR;

  // 4. COLOR PALETTE:
  vec3 baseTone = mix(COLOR_WARM_OCHRE, COLOR_OLIVE_TAN, idHash * 0.65);
  vec3 scaleColor = baseTone;

  // Diamondback rattlesnake markings:
  if (macroDist < 1.4) {
    scaleColor = mix(scaleColor, COLOR_BUTTER_CREAM, 0.85);
  } else if (macroDist >= 1.4 && macroDist < 2.6) {
    scaleColor = mix(scaleColor, COLOR_DARK_CHARCOAL, 0.90);
  } else if (macroDist >= 2.6 && macroDist < 3.6) {
    scaleColor = mix(scaleColor, COLOR_BUTTER_CREAM, 0.75);
  }

  // Micro-organic scale tint variance
  scaleColor *= (0.86 + 0.28 * idHash);

  // Highlight gleam along the thick trailing lip of each scale
  float lipHighlight = smoothstep(0.80, 0.98, dist) * (1.0 - smoothstep(0.98, 1.02, dist));
  scaleColor = mix(scaleColor, COLOR_BUTTER_CREAM * 1.15, lipHighlight * GLEAM_LIP_STR * GLEAM_OVERALL);

  // 5. OVERLAPPING CONTACT DROP SHADOW:
  // The upper scale lifts off and casts a soft drop shadow on the scale underneath
  float dropShadow = 1.0;
  if (upperLipDist > 1.0 && upperLipDist < 1.45) {
    dropShadow = smoothstep(1.0, 1.45, upperLipDist);
    dropShadow = mix(1.0 - DROP_SHADOW_STR, 1.0, dropShadow);
  }

  // Ambient occlusion crevice shadow at scale boundaries
  float edgeAO = smoothstep(0.0, 0.22, 1.0 - dist);

  // Combine ambient, diffuse, specular, and rim
  vec3 ambient = scaleColor * AMBIENT_STR * (0.25 + 0.75 * cylVignette);
  vec3 diffuse = scaleColor * diff * DIFFUSE_STR * (0.30 + 0.70 * cylVignette);
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

function handleResize() {
  const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
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
  gl.uniform1f(speedLoc, CONFIG.crawlSpeed);

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
