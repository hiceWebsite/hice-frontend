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
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.01} />;
}

// // === Pointer Overlay ===
// const PointerInstruction = ({ hasInteracted }: { hasInteracted: boolean }) => {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     let timeout: ReturnType<typeof setTimeout>;
//     if (!hasInteracted) {
//       // show after 2s
//       timeout = setTimeout(() => setShow(true), 2000);
//     }
//     return () => clearTimeout(timeout);
//   }, [hasInteracted]);

//   if (hasInteracted) return null;

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         zIndex: 10,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         pointerEvents: "none",
//         opacity: show ? 1 : 0,
//         transition: "opacity 0.5s ease-in-out",
//       }}
//     >
//       {/* Hand Circle */}
//       <div
//         style={{
//           width: 60,
//           height: 60,
//           borderRadius: "50%",
//           backgroundColor: "rgba(255,255,255,0.6)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           animation: "moveX 2s infinite ease-in-out",
//         }}
//       >
//         🖱️
//       </div>
//       <div
//         style={{
//           marginTop: "0.5rem",
//           backgroundColor: "rgba(0,0,0,0.6)",
//           color: "#fff",
//           padding: "4px 8px",
//           borderRadius: "4px",
//           fontSize: "0.8rem",
//           whiteSpace: "nowrap",
//         }}
//       >
//         Drag to rotate
//       </div>
//       <style>{`
//         @keyframes moveX {
//           0%   { transform: translateX(0); }
//           25%  { transform: translateX(-30px); }
//           50%  { transform: translateX(0); }
//           75%  { transform: translateX(30px); }
//           100% { transform: translateX(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

export default function ThreeModelViewer({
  modelUrl,
  width = "100%",
  height = "100%",
  adjustCamera = 4,
  enableZoom = true,
  defaultZoom = 6,
  minZoom = 1,
  maxZoom = 90,
}: ModelProps) {
  // const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        backgroundImage: `url(${backgroundImage.src || backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        // backgroundColor: "#e6e6e6",
      }}
    >
      {/* Overlay instruction */}
      {/* <PointerInstruction hasInteracted={hasInteracted} /> */}

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, defaultZoom], fov: 80 }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          cursor: enableZoom ? "grab" : "pointer",
        }}
        shadows
      >
        {/* lighting */}
        <ambientLight intensity={-3} color="#000000" /> {/* Top */}
        <directionalLight
          position={[0, 20, 0]}
          intensity={0.8}
          castShadow
          color="#ffffff"
        />
        {/* Bottom */}
        <directionalLight
          position={[0, -20, 0]}
          intensity={0.5}
          color="#ffffff"
        />
        {/* Left */}
        <directionalLight
          position={[-20, 0, 0]}
          intensity={2}
          color="#ffffff"
        />
        {/* Right */}
        <directionalLight
          position={[20, 0, 0]}
          intensity={0.6}
          color="#ffffff"
        />
        {/* Front (toward camera) */}
        <directionalLight
          position={[0, 0, 20]}
          intensity={0.7}
          color="#ffffff"
        />
        {/* Back */}
        <directionalLight
          position={[0, 0, -20]}
          intensity={1}
          color="#ffffff"
        />
        <directionalLight
          position={[0, 20, -20]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* <directionalLight position={[0, 20, 0]} intensity={0.2} color="#000000" /> */}
        <Suspense fallback={null}>
          <Stage
            environment="warehouse"
            intensity={-4}
            adjustCamera={adjustCamera}
            shadows
          >
            <Model url={modelUrl} />
          </Stage>

          <OrbitControls
            // autoRotate={!hasInteracted}
            autoRotate
            autoRotateSpeed={1}
            enableZoom={enableZoom}
            rotateSpeed={2}
            minDistance={minZoom}
            maxDistance={maxZoom}
            // onStart={() => setHasInteracted(true)} // detect drag
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
