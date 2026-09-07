"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;
uniform float uGrain;
const float e = 2.71828182845904523536;
float noise(vec2 texCoord) {
  vec2 r = e * sin(e * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}
vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle), s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}
void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = vUv - 0.5;
  uv.x *= uResolution.x / max(uResolution.y, 1.0);
  vec2 tex = rotateUvs(uv * uScale, uRotation) * uScale;
  float t = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - t);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * t) + sin(20.0 * (tex.x + tex.y - 0.1 * t)));
  vec3 result = uColor * pattern - vec3(rnd / 15.0 * uNoiseIntensity);
  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 lightBase = mix(uColor * 0.72, min(uColor * 1.18, vec3(1.0)), fold);
    lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    result = lightBase + (rnd + fineNoise - 1.0) * clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
  }
  result += (noise(gl_FragCoord.xy + vec2(uTime * 19.0, uTime * 13.0)) - 0.5) * uGrain;
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}`;

const rgb = (hex) => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
};

export default function Silk({
  speed = 0.6,
  scale = 0.75,
  color = "#e8ebff",
  noiseIntensity = 0.18,
  grain = 0.028,
  rotation = 0.2,
  lightMode = true,
  animated = true,
  className,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return undefined;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    const vertex = compile(gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"), time: gl.getUniformLocation(program, "uTime"),
      color: gl.getUniformLocation(program, "uColor"), speed: gl.getUniformLocation(program, "uSpeed"),
      scale: gl.getUniformLocation(program, "uScale"), rotation: gl.getUniformLocation(program, "uRotation"),
      noise: gl.getUniformLocation(program, "uNoiseIntensity"), light: gl.getUniformLocation(program, "uLightMode"),
      grain: gl.getUniformLocation(program, "uGrain"),
    };
    const [red, green, blue] = rgb(color);
    gl.uniform3f(uniforms.color, red, green, blue);
    gl.uniform1f(uniforms.speed, speed);
    gl.uniform1f(uniforms.scale, scale);
    gl.uniform1f(uniforms.rotation, rotation);
    gl.uniform1f(uniforms.noise, noiseIntensity);
    gl.uniform1f(uniforms.light, lightMode ? 1 : 0);
    gl.uniform1f(uniforms.grain, grain);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    const render = (now) => {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, now * 0.0001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (animated) frame = requestAnimationFrame(render);
    };
    render(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [animated, color, grain, lightMode, noiseIntensity, rotation, scale, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
