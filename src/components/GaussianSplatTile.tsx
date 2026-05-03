import { SplatMesh, SparkRenderer } from "@sparkjsdev/spark";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type GaussianSplatTileProps = {
  url: string;
  title: string;
};

export function GaussianSplatTile({ url, title }: GaussianSplatTileProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let frameId = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-label", title);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const sparkRenderer = new SparkRenderer({ renderer });
    scene.add(sparkRenderer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.7;
    controls.minDistance = 0.4;
    controls.maxDistance = 12;

    const splat = new SplatMesh({ url });
    scene.add(splat);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    splat.initialized
      .then(() => {
        if (disposed) return;

        const bounds = splat.getBoundingBox();
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z, 0.001);

        splat.position.sub(center);
        splat.rotation.set(THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(145), 0);
        controls.target.set(0, 0, 0);
        camera.position.set(0, 0, maxDimension * 1.8);
        camera.near = Math.max(maxDimension / 1000, 0.001);
        camera.far = Math.max(maxDimension * 20, 10);
        camera.updateProjectionMatrix();
        controls.minDistance = maxDimension * 0.35;
        controls.maxDistance = maxDimension * 8;
        controls.update();
      })
      .catch((error: unknown) => {
        console.error("Failed to load Gaussian splat tile", error);
      });

    const animate = () => {
      if (disposed) return;

      controls.update();
      sparkRenderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      scene.remove(splat);
      scene.remove(sparkRenderer);
      splat.dispose();
      sparkRenderer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [title, url]);

  return <div ref={hostRef} className="h-full w-full" aria-hidden="true" />;
}
