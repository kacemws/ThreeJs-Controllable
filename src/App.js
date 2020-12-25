import { useEffect, useRef, useState } from "react";

import { Canvas, useFrame } from "react-three-fiber";

import { softShadows, OrbitControls } from "drei";

import "./App.scss";

import { useSpring, a } from "react-spring/three";

const Controllable = ({
  moveForward,
  moveBackwards,
  moveLeft,
  moveRight,
  sizes,
  color,
}) => {
  const mesh = useRef(null); // the reference for the mesh
  useFrame(() => {
    if (moveForward) {
      mesh.current.position.z += 0.05;
    }

    if (moveBackwards) {
      mesh.current.position.z -= 0.05;
    }

    if (moveLeft) {
      mesh.current.position.x -= 0.05;
    }

    if (moveRight) {
      mesh.current.position.x += 0.05;
    }
  }); // to rotate the shape defined in our mesh

  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [2, 2, 2] : [1, 1, 1], // change the scale dynamically
  });

  return (
    <a.mesh
      onClick={() => {
        setExpand(!expand); // to expand the box on click
      }}
      // position={position}
      ref={mesh}
      castShadow
      {...props}
    >
      {/* position is an array in the x y z format  */}
      <boxBufferGeometry attach="geometry" args={sizes} />
      {/* since our shape is a box, the sizes is going to be an array like so : width, height, depth */}
      <meshStandardMaterial attach="material" color={color} />
    </a.mesh>
  );
};

function App() {
  const [moveForward, setForward] = useState(false); // to detect wheter the user is moving forward
  const [moveBackward, setBackward] = useState(false); // to detect wheter the user is moving backward
  const [moveLeft, setLeft] = useState(false); // to detect wheter the user is moving to the left
  const [moveRight, setRight] = useState(false); // to detect wheter the user is moving to the right

  const onKeyDown = (event) => {
    //event handler for when the user is pressing a button
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ setForward(true);
        break;

      case 40: /*down*/
      case 83:
        /*S*/ setBackward(true);
        break;

      case 37: /*left*/
      case 65:
        /*A*/ setLeft(true);
        break;

      case 39: /*right*/
      case 68:
        /*D*/ setRight(true);
        break;
    }
  };

  const onKeyUp = (event) => {
    //event handler for when the user is done pressing a button
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ setForward(false);
        break;

      case 40: /*down*/
      case 83:
        /*S*/ setBackward(false);
        break;

      case 37: /*left*/
      case 65:
        /*A*/ setLeft(false);
        break;

      case 39: /*right*/
      case 68:
        /*D*/ setRight(false);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false); // registreing the event that would determine where the user is moving
    document.addEventListener("keyup", onKeyUp, false); // registreing the event that would determine when the user is done moving
    return () => {
      document.removeEventListener("keydown", onKeyDown, false); // deleting the event that would determine where the user is moving
      document.removeEventListener("keyup", onKeyUp, false); // deleting the event that would determine when the user is done moving
    };
  }, []);

  return (
    <>
      <Canvas
        colorManagement
        shadowMap
        camera={{
          position: [5, 5, 5],
          fov: 100,
        }}
      >
        {/* Lightning, PS : FOV means Field Of View, its just how much zoomed in we are in the view */}

        <ambientLight intensity={0.3} />
        {/* Ambient light */}

        <directionalLight
          castShadow // this light cast a shadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* Main Source of Light */}

        <pointLight position={[-10, 0, -10]} intensity={0.5} />
        {/* left light */}

        <pointLight position={[0, -10, 0]} intensity={1.5} />
        {/* bottom light */}

        {/* Lightning */}

        {/* Plane */}
        <group>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            receiveShadow // this plane receives shadows
          >
            {/* The floor 'or' scene for the app */}
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <shadowMaterial attach="material" opacity={0.3} />
          </mesh>
          {/* Plane */}

          {/* shapes */}
          <Controllable
            moveBackwards={moveBackward}
            moveForward={moveForward}
            moveLeft={moveLeft}
            moveRight={moveRight}
            sizes={[1, 1, 1]}
            color="purple"
          />
          {/*you have to extract the mesh component and its ref and frame in order for it to work */}
          {/* shapes */}
        </group>

        {/* Allows us to move the canvas around for different prespectives */}
      </Canvas>
    </>
  );
}

export default App;
