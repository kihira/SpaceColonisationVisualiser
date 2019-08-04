import {Color, PerspectiveCamera, Plane, PlaneHelper, Scene, Vector3, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Tree from "./Tree";

// Init renderer
const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// Init camera
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Init controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Init scene
const scene = new Scene();
scene.background = new Color(0xEEEEEE);

// Create a tree
const tree = new Tree({
    attractionPoints: 500,
    branchSides: 8,
    branchThickness: 0.2,
    crownCentre: new Vector3(0, 2.5, 0),
    crownSize: new Vector3(2, 5, 2),
    influenceRadius: 7,
    killDistance: 2,
    maxIterations: 200,
    nodeSize: 0.15,
}, new Vector3(0, 0, 0));
tree.generateGeometry(scene);

// Generate ground plane
const plane = new Plane(new Vector3(0, 1, 0));
scene.add(new PlaneHelper(plane, 4, 0xAAAAAA));

// Start the animation/render loop
animate();

function animate() {
    requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render( scene, camera );
}
