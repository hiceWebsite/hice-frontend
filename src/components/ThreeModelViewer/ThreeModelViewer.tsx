"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import React, { Suspense } from "react";
import backgroundImage from "@/assets/product-bg.webp";

type ModelProps = {
  modelUrl: string;
  width?: string;
  height?: string;
  adjustCamera?: number;
  enableZoom?: boolean;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.01} />;
}

export default function ThreeModelViewer({
  modelUrl,
  width = "100%",
  height = "100%",
  adjustCamera = 5,
  enableZoom = true,
}: ModelProps) {
  return (
    <div
      style={{
        width,
        height,
        // backgroundColor: "#F0F2F0",
        backgroundImage: `url(${backgroundImage.src || backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, 8], fov: 80 }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          cursor: enableZoom ? "grab" : "pointer",
        }}
        shadows={false}
      >
        <Suspense fallback={null}>
          <Stage
            environment="warehouse"
            intensity={1}
            adjustCamera={adjustCamera}
            shadows={false}
          >
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1}
            enableZoom={enableZoom}
            rotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
