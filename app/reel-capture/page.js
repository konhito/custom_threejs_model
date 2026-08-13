"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Film, LoaderCircle, Rotate3D } from "lucide-react";

const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION = 10_000;
const BACKGROUND = "#E8E6DF";

function waitFor(video, event) {
  return new Promise((resolve, reject) => {
    video.addEventListener(event, resolve, { once: true });
    video.addEventListener("error", () => reject(new Error("The video could not be read.")), { once: true });
  });
}

function preferredMime() {
  return [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
  ].find((mime) => MediaRecorder.isTypeSupported(mime));
}

export default function ReelCapturePage() {
  const outputCanvasRef = useRef(null);
  const threeRef = useRef(null);
  const recordingRef = useRef(false);
  const [enteredGlbUrl, setEnteredGlbUrl] = useState("/lotus.glb");
  const [glbUrl, setGlbUrl] = useState("/lotus.glb");
  const [clipOne, setClipOne] = useState(null);
  const [clipTwo, setClipTwo] = useState(null);
  const [music, setMusic] = useState(null);
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("Loading the 3D flower…");

  function drawFlower(progress) {
    const output = outputCanvasRef.current;
    const three = threeRef.current;
    if (!output || !three) return;
    const context = output.getContext("2d");
    three.pivot.rotation.y = progress * Math.PI * 2;
    three.renderer.render(three.scene, three.camera);
    context.drawImage(three.renderer.domElement, 0, 0, WIDTH, HEIGHT);
  }

  function drawVideo(video) {
    const output = outputCanvasRef.current;
    const context = output?.getContext("2d");
    if (!output || !context || !video.videoWidth || !video.videoHeight) return;
    const scale = Math.max(WIDTH / video.videoWidth, HEIGHT / video.videoHeight);
    const width = video.videoWidth * scale;
    const height = video.videoHeight * scale;
    context.fillStyle = BACKGROUND;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.drawImage(video, (WIDTH - width) / 2, (HEIGHT - height) / 2, width, height);
  }

  useEffect(() => {
    let cancelled = false;
    let animationFrame;
    let renderer;
    setReady(false);
    setMessage("Loading the 3D flower…");

    async function load() {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
        const output = outputCanvasRef.current;
        if (!output || cancelled) return;

        const renderCanvas = document.createElement("canvas");
        renderer = new THREE.WebGLRenderer({ canvas: renderCanvas, antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(WIDTH, HEIGHT, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(BACKGROUND);
        const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 100);
        camera.position.set(0, 1.5, 3);
        camera.lookAt(0, 0, 0);
        const pivot = new THREE.Group();
        scene.add(pivot);

        const key = new THREE.DirectionalLight(0xffffff, 2.5);
        key.position.set(5, 8, 5);
        key.castShadow = true;
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xfff1d6, 1.5);
        fill.position.set(-5, 3, -5);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xd8ecff, 1.5);
        rim.position.set(0, 5, -8);
        scene.add(rim);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.18 }));
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.15;
        ground.receiveShadow = true;
        scene.add(ground);

        const draco = new DRACOLoader();
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const source = glbUrl.startsWith("http") ? `/api/glb-proxy?url=${encodeURIComponent(glbUrl)}` : glbUrl;
        loader.load(source, (gltf) => {
          if (cancelled) return;
          const model = gltf.scene;
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const scale = 2.2 / Math.max(size.x, size.y, size.z);
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          pivot.add(model);
          threeRef.current = { renderer, scene, camera, pivot };
          setReady(true);
          setMessage("Ready to record.");

          const preview = (now) => {
            if (!recordingRef.current) drawFlower((now % DURATION) / DURATION);
            animationFrame = requestAnimationFrame(preview);
          };
          animationFrame = requestAnimationFrame(preview);
        }, undefined, () => {
          if (!cancelled) setMessage("The GLB could not be loaded. Check the S3 URL and public access.");
        });
      } catch {
        if (!cancelled) setMessage("Three.js could not start in this browser.");
      }
    }

    load();
    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      renderer?.dispose();
      threeRef.current = null;
    };
  }, [glbUrl]);

  async function makeVideo(file) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    await waitFor(video, "loadeddata");
    if (video.duration < 9.5) throw new Error(`${file.name} is shorter than 10 seconds.`);
    return video;
  }

  async function record(master) {
    if (!ready || recording) return;
    if (!window.MediaRecorder) {
      setMessage("This browser cannot record canvas video. Use current Chrome or Edge.");
      return;
    }
    if (master && (!clipOne || !clipTwo || !music)) {
      setMessage("Choose M1, M2 and the country music before recording the master.");
      return;
    }
    const mimeType = preferredMime();
    if (!mimeType) {
      setMessage("This browser cannot create a supported video file. Use current Chrome or Edge.");
      return;
    }

    setRecording(true);
    recordingRef.current = true;
    setMessage(master ? "Recording 30-second master. Keep this tab open…" : "Recording 10-second original GLB…");
    const urls = [];
    let audioContext;
    let audio;
    try {
      const output = outputCanvasRef.current;
      const videoOne = master ? await makeVideo(clipOne) : null;
      const videoTwo = master ? await makeVideo(clipTwo) : null;
      if (videoOne) urls.push(videoOne.src);
      if (videoTwo) urls.push(videoTwo.src);

      const stream = output.captureStream(30);
      if (master) {
        audio = new Audio(URL.createObjectURL(music));
        audio.volume = 0.42;
        urls.push(audio.src);
        audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(destination);
        stream.addTrack(destination.stream.getAudioTracks()[0]);
        await audioContext.resume();
      }

      const chunks = [];
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.onerror = () => setMessage("The browser could not encode this recording.");
      recorder.onstop = () => {
        const extension = mimeType.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunks, { type: mimeType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = master ? `aquamundi-hybrid-reel.${extension}` : `aquamundi-original-3d-turntable.${extension}`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
        urls.forEach((url) => URL.revokeObjectURL(url));
        audioContext?.close();
        setRecording(false);
        recordingRef.current = false;
        setMessage(extension === "mp4" ? "MP4 downloaded." : "WebM downloaded. Import it into CapCut and export the final post as MP4.");
      };

      const startedAt = performance.now();
      let phase = -1;
      recorder.start();
      if (audio) audio.play();
      const frame = (now) => {
        const elapsed = now - startedAt;
        let nextPhase = 0;
        if (!master || elapsed < DURATION) {
          drawFlower(Math.min(elapsed / DURATION, 1));
        } else if (elapsed < DURATION * 2) {
          nextPhase = 1;
          if (phase !== 1) videoOne.play();
          drawVideo(videoOne);
        } else {
          nextPhase = 2;
          if (phase !== 2) videoTwo.play();
          drawVideo(videoTwo);
        }
        phase = nextPhase;
        if (elapsed < (master ? DURATION * 3 : DURATION)) requestAnimationFrame(frame);
        else recorder.stop();
      };
      requestAnimationFrame(frame);
    } catch (error) {
      urls.forEach((url) => URL.revokeObjectURL(url));
      audioContext?.close();
      setRecording(false);
      recordingRef.current = false;
      setMessage(error.message || "Recording failed. Check the selected files.");
    }
  }

  return (
    <main className="capture-page">
      <section className="capture-intro">
        <p>Original 3D capture</p>
        <h1>Flower Reel Recorder</h1>
        <span>Ten seconds of your GLB, then M1 and M2—without Blender or Docker.</span>
      </section>

      <section className="capture-workspace" aria-label="Flower Reel Recorder">
        <div className="capture-preview">
          <canvas ref={outputCanvasRef} width={WIDTH} height={HEIGHT} aria-label="3D flower preview" />
        </div>
        <div className="capture-controls">
          <label htmlFor="glb-url">Public S3 GLB URL</label>
          <div className="capture-url">
            <input id="glb-url" value={enteredGlbUrl} onChange={(event) => setEnteredGlbUrl(event.target.value)} spellCheck="false" />
            <button type="button" onClick={() => setGlbUrl(enteredGlbUrl.trim())} disabled={recording}>Load flower</button>
          </div>

          <label htmlFor="clip-one">Seedance M1 (10 seconds)</label>
          <input id="clip-one" type="file" accept="video/*" onChange={(event) => setClipOne(event.target.files?.[0] ?? null)} disabled={recording} />
          <label htmlFor="clip-two">Seedance M2 (10 seconds)</label>
          <input id="clip-two" type="file" accept="video/*" onChange={(event) => setClipTwo(event.target.files?.[0] ?? null)} disabled={recording} />
          <label htmlFor="music">Country music</label>
          <input id="music" type="file" accept="audio/*" onChange={(event) => setMusic(event.target.files?.[0] ?? null)} disabled={recording} />

          <p className="capture-status" role="status">{message}</p>
          <button className="capture-action" type="button" onClick={() => record(false)} disabled={!ready || recording}>
            {recording ? <LoaderCircle aria-hidden="true" /> : <Rotate3D aria-hidden="true" />}
            Download original 10s GLB
          </button>
          <button className="capture-action capture-action--dark" type="button" onClick={() => record(true)} disabled={!ready || recording}>
            {recording ? <LoaderCircle aria-hidden="true" /> : <Download aria-hidden="true" />}
            Download 30s hybrid master
          </button>
          <p className="capture-note"><Film aria-hidden="true" /> Chrome/Edge may download WebM. CapCut converts it when you export the final Instagram MP4.</p>
        </div>
      </section>

      <style jsx>{`
        .capture-page { min-height: calc(100vh - var(--site-banner-height, 0px)); background: #10362a; color: #f3eee2; padding: clamp(1.25rem, 4vw, 4rem); }
        .capture-intro { margin: 0 auto clamp(1.5rem, 4vw, 3.5rem); max-width: 72rem; }
        .capture-intro p { color: #d6ae4b; font: 700 0.75rem/1.2 Arial, sans-serif; letter-spacing: 0.12em; margin: 0 0 0.65rem; text-transform: uppercase; }
        .capture-intro h1 { font-family: Georgia, serif; font-size: clamp(2.25rem, 6vw, 4.5rem); letter-spacing: -0.035em; line-height: 0.95; margin: 0 0 0.9rem; text-wrap: balance; }
        .capture-intro span { color: #dce5db; font: 400 1rem/1.5 Arial, sans-serif; }
        .capture-workspace { align-items: center; display: grid; gap: clamp(1.5rem, 5vw, 5rem); grid-template-columns: minmax(0, 27rem) minmax(17rem, 30rem); justify-content: center; margin: auto; max-width: 70rem; }
        .capture-preview { aspect-ratio: 9 / 16; background: ${BACKGROUND}; box-shadow: 0 8px 8px rgba(0, 0, 0, 0.26); overflow: hidden; width: 100%; }
        .capture-preview canvas { display: block; height: 100%; width: 100%; }
        .capture-controls { display: grid; gap: 0.65rem; }
        label { color: #f3eee2; font: 700 0.85rem/1.2 Arial, sans-serif; margin-top: 0.7rem; }
        input { background: #f3eee2; border: 1px solid #b9c6b8; border-radius: 0.4rem; color: #123328; font: 400 0.9rem/1.2 Arial, sans-serif; min-height: 2.75rem; padding: 0.6rem 0.7rem; width: 100%; }
        input:focus-visible, button:focus-visible { outline: 3px solid #f5cf75; outline-offset: 3px; }
        .capture-url { display: flex; gap: 0.5rem; }
        .capture-url input { min-width: 0; }
        button { background: #d6ae4b; border: 0; border-radius: 0.4rem; color: #132c22; cursor: pointer; font: 700 0.85rem/1 Arial, sans-serif; min-height: 2.75rem; padding: 0.7rem 0.9rem; }
        button:hover:not(:disabled) { background: #f5cf75; }
        button:disabled { cursor: not-allowed; opacity: 0.55; }
        .capture-status { color: #dce5db; font: 400 0.9rem/1.45 Arial, sans-serif; margin: 1.25rem 0 0.25rem; min-height: 2.6rem; }
        .capture-action { align-items: center; display: inline-flex; gap: 0.7rem; justify-content: center; margin-top: 0.1rem; }
        .capture-action svg { height: 1.1rem; width: 1.1rem; }
        .capture-action--dark { background: #f3eee2; color: #132c22; }
        .capture-note { align-items: flex-start; color: #c7d3c7; display: flex; font: 400 0.83rem/1.45 Arial, sans-serif; gap: 0.45rem; margin: 0.8rem 0 0; }
        .capture-note svg { flex: 0 0 auto; height: 1rem; margin-top: 0.1rem; width: 1rem; }
        @media (max-width: 780px) { .capture-workspace { grid-template-columns: minmax(0, 24rem); } .capture-preview { margin: 0 auto; } }
        @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
      `}</style>
    </main>
  );
}
