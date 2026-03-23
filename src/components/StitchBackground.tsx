import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  // --- noise helpers ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Stitch-like palette: coral, indigo, teal, amber, lavender
  vec3 palette(float t) {
    vec3 col1 = vec3(0.99, 0.35, 0.40);  // coral red
    vec3 col2 = vec3(0.33, 0.22, 0.85);  // indigo
    vec3 col3 = vec3(0.06, 0.73, 0.68);  // teal
    vec3 col4 = vec3(0.98, 0.72, 0.10);  // amber
    vec3 col5 = vec3(0.70, 0.40, 0.95);  // lavender

    float seg = fract(t) * 5.0;
    float idx = floor(seg);
    float frac = fract(seg);

    vec3 a, b;
    if (idx < 0.5)      { a = col1; b = col2; }
    else if (idx < 1.5) { a = col2; b = col3; }
    else if (idx < 2.5) { a = col3; b = col4; }
    else if (idx < 3.5) { a = col4; b = col5; }
    else                { a = col5; b = col1; }

    return mix(a, b, smoothstep(0.0, 1.0, frac));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    float t = u_time * 0.18;

    // Multiple layered noise fields to create blob-like forms
    float n1 = snoise(vec3(uv * 1.6, t * 0.70));
    float n2 = snoise(vec3(uv * 2.1 + vec2(3.7, 1.2), t * 0.55 + 1.3));
    float n3 = snoise(vec3(uv * 1.2 + vec2(1.5, 4.0), t * 0.40 + 2.6));
    float n4 = snoise(vec3(uv * 2.8 + vec2(5.1, 2.8), t * 0.80 + 4.2));

    // Combine noise into a smooth field
    float field = (n1 + n2 * 0.6 + n3 * 0.4 + n4 * 0.3) / 2.3;

    // Warp domain for organic movement
    vec2 warpedUV = uv + 0.22 * vec2(
      snoise(vec3(uv * 1.5, t * 0.60 + 7.0)),
      snoise(vec3(uv * 1.5 + vec2(3.3, 2.1), t * 0.60 + 9.0))
    );

    float warpedField = snoise(vec3(warpedUV * 1.8, t * 0.50 + 3.5));

    // Drive color from fields
    float colorT = field * 0.5 + 0.5 + warpedField * 0.25 + t * 0.12;

    vec3 color = palette(colorT);

    // Subtle luminance variation
    float lum = snoise(vec3(uv * 3.2 + vec2(2.0, 6.0), t * 0.35)) * 0.18;
    color += lum;

    // Subtle vignette
    vec2 centerUV = gl_FragCoord.xy / u_resolution.xy;
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(centerUV - 0.5) * 1.8);
    color *= (0.75 + 0.25 * vignette);

    // Clamp and gamma
    color = clamp(color, 0.0, 1.0);
    color = pow(color, vec3(0.9));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error("Program link error: " + gl.getProgramInfoLog(prog));
  }
  return prog;
}

export function StitchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false })
      ?? canvas.getContext("experimental-webgl", { antialias: false, alpha: false }) as WebGLRenderingContext | null;

    if (!gl) {
      // Show CSS fallback
      if (canvas) canvas.style.display = "none";
      if (fallbackRef.current) fallbackRef.current.style.display = "block";
      return;
    }

    let program: WebGLProgram;
    try {
      const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      program = createProgram(gl, vs, fs);
    } catch (e) {
      console.error(e);
      return;
    }

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    let startTime = performance.now();
    let rafId: number;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener("resize", resize);

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      gl!.uniform1f(timeLoc, elapsed);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      <div
        ref={fallbackRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "none" }}
      >
        <style>{`
          @keyframes stitch-blob-1 {
            0%, 100% { transform: translate(0%, 0%) scale(1); }
            33% { transform: translate(15%, -10%) scale(1.15); }
            66% { transform: translate(-8%, 12%) scale(0.9); }
          }
          @keyframes stitch-blob-2 {
            0%, 100% { transform: translate(0%, 0%) scale(1); }
            33% { transform: translate(-12%, 8%) scale(1.1); }
            66% { transform: translate(10%, -14%) scale(0.95); }
          }
          @keyframes stitch-blob-3 {
            0%, 100% { transform: translate(0%, 0%) scale(1); }
            33% { transform: translate(8%, 14%) scale(0.9); }
            66% { transform: translate(-14%, -6%) scale(1.12); }
          }
          @keyframes stitch-blob-4 {
            0%, 100% { transform: translate(0%, 0%) scale(1); }
            50% { transform: translate(-10%, -12%) scale(1.08); }
          }
          @keyframes stitch-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .stitch-blob { position: absolute; border-radius: 50%; filter: blur(70px); mix-blend-mode: screen; opacity: 0.75; }
          .blob1 { width: 60vw; height: 60vw; background: radial-gradient(circle, #ff5a5a, #ff2d55); top: -10%; left: -10%; animation: stitch-blob-1 14s ease-in-out infinite; }
          .blob2 { width: 50vw; height: 50vw; background: radial-gradient(circle, #4f2bff, #7c3aed); top: 20%; right: -10%; animation: stitch-blob-2 18s ease-in-out infinite; }
          .blob3 { width: 55vw; height: 55vw; background: radial-gradient(circle, #06b6d4, #10b981); bottom: -15%; left: 20%; animation: stitch-blob-3 16s ease-in-out infinite; }
          .blob4 { width: 40vw; height: 40vw; background: radial-gradient(circle, #f59e0b, #ef4444); top: 40%; left: 30%; animation: stitch-blob-4 20s ease-in-out infinite; }
        `}</style>
        <div style={{ background: "#0a0a0a", position: "absolute", inset: 0 }} />
        <div className="stitch-blob blob1" />
        <div className="stitch-blob blob2" />
        <div className="stitch-blob blob3" />
        <div className="stitch-blob blob4" />
      </div>
    </>
  );
}
