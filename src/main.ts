import {Geometry, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Tree from "./Tree";

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls(camera);

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const material = new LineBasicMaterial( { color: 0x0000ff } );
const geometry = new Geometry();
geometry.vertices.push(new Vector3( -10, 0, 0) );
geometry.vertices.push(new Vector3( 0, 10, 0) );
geometry.vertices.push(new Vector3( 10, 0, 0) );

const line = new Line( geometry, material );
scene.add(line);

renderer.render(scene, camera);

// Create a tree
const tree = new Tree({
    attractionPoints: 500,
    branchSides: 8,
    branchThickness: 0.2,
    crownCentre: new Vector3(0, 2.5, 0),
    crownSize: new Vector3(2, 5, 2),
    influenceRadius: 15,
    killDistance: 2,
    maxIterations: 200,
    nodeSize: 0.15,
}, new Vector3(0, 0, 0));
