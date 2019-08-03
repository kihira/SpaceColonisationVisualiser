import {PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

interface TreeSettings
{
    crownCentre: Vector3,
    crownSize: Vector3,
    attractionPoints: number,
    influenceRadius: number,
    killDistance: number,
    nodeSize: number,
    maxIterations: number,
    branchSides: number,
    branchThickness: number
}

class Node
{
    constructor(parent: Node, position: Vector3, vector3: Vector3) {
        
    }

    private parent: Node;
    private position: Vector3;
    private direction: Vector3;
    private influenceDirection: Vector3;
    private influenceCount: number;

    public resetInfluence()
    {
        this.influenceDirection = this.direction.clone();
        this.influenceCount = 0;
    }
}

interface AttractionPoint
{
    position: Vector3,
    closestNode: Node
}

function getRandomArbitrary(min: number, max: number): number
{
    return Math.random() * (max - min) + min;
}

class Tree
{
    private position: Vector3;
    private setting: TreeSettings;
    private attractionPoints: Array<AttractionPoint>;
    private nodes: Array<Node>;

    public constructor(settings: TreeSettings, origin: Vector3)
    {
        const crownSizeHalf = settings.crownSize.clone().divideScalar(2);

        for (let i = 0; i < settings.attractionPoints; ++i) 
        {
            const pos = settings.crownCentre.clone();
            pos.x += getRandomArbitrary(-crownSizeHalf.x, crownSizeHalf.x);
            pos.y += getRandomArbitrary(-crownSizeHalf.y, crownSizeHalf.y);
            pos.z += getRandomArbitrary(-crownSizeHalf.z, crownSizeHalf.z);
    
            let point: AttractionPoint;
            point.position = pos;
            this.attractionPoints.push(point);
        }

        // Create root node
        const rootNode = new Node(null, this.position, new Vector3(0, 1, 0));
        this.nodes.push(rootNode);

        let iterations = 0;
        while (this.attractionPoints.length > 0 && iterations < settings.maxIterations) {
            this.grow();
            iterations++;
        }
    }

    private grow()
    {

    }

    private generateBranchVertices(node: Node): Array<Vector3>
    {
        return null;
    }

    private buildBuffers()
    {

    }
}
