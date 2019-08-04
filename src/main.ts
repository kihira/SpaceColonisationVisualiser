import {GUI} from "dat.gui";
import {Color, PerspectiveCamera, Plane, PlaneHelper, Scene, Vector3, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Sphere} from "./Shapes";
import Tree, {TreeSettings} from "./Tree";

// Init renderer
const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// Init camera
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5, 5, 5);

// Init controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
controls.update();

// Init scene
const scene = new Scene();
scene.background = new Color(0xEEEEEE);

// Create a tree
const treeSettings: TreeSettings = {
    attractionPoints: 500,
    branchSides: 8,
    branchThickness: 0.2,
    colour: new Color(0x0000ff),
    crownShape: new Sphere(new Vector3(0, 2.5, 0), 3),
    influenceRadius: 7,
    killDistance: 2,
    maxIterations: 200,
    nodeSize: 0.2,
};
const tree = new Tree(treeSettings, new Vector3(0, 0, 0));
tree.generateTree();
tree.generateGeometry(scene);

// Generate ground plane
const plane = new Plane(new Vector3(0, 1, 0));
scene.add(new PlaneHelper(plane, 4, 0xAAAAAA));

// Init GUI
const gui = new GUI();
gui.add(treeSettings.crownShape, "seed").onFinishChange(() => tree.regenerate(scene));
gui.add(treeSettings, "attractionPoints", 1).onFinishChange(() => tree.regenerate(scene));
gui.add(treeSettings, "influenceRadius", 0).onFinishChange(() => tree.regenerate(scene));
gui.add(treeSettings, "killDistance", 0).onFinishChange(() => tree.regenerate(scene));
gui.add(treeSettings, "maxIterations", 1).onFinishChange(() => tree.regenerate(scene));
gui.add(treeSettings, "nodeSize", 0).onFinishChange(() => tree.regenerate(scene));
const renderSettingsGui = gui.addFolder("Render Settings");
renderSettingsGui.add(treeSettings, "branchSides", 3).onFinishChange(() => tree.generateGeometry(scene));
renderSettingsGui.add(treeSettings, "branchThickness", 0).onFinishChange(() => tree.generateGeometry(scene));

// Start the animation/render loop
animate();

function animate() {
    requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render( scene, camera );
}
