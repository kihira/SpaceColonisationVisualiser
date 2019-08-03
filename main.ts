import {PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
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
    constructor(parent: Node | null, position: Vector3, direction: Vector3)
    {
        this.parent = parent;
        this.position = position;
        this.direction = direction;
        this.influenceDirection = direction;
        this.influenceCount = 0;
    }

    public parent: Node | null;
    public position: Vector3;
    public direction: Vector3;
    public influenceDirection: Vector3;
    public influenceCount: number;

    public resetInfluence()
    {
        this.influenceDirection = this.direction.clone();
        this.influenceCount = 0;
    }
}

interface AttractionPoint
{
    position: Vector3,
    closestNode?: Node
}

function getRandomArbitrary(min: number, max: number): number
{
    return Math.random() * (max - min) + min;
}

class Tree
{
    private position: Vector3;
    private settings: TreeSettings;
    private attractionPoints: Array<AttractionPoint> = [];
    private nodes: Array<Node> = [];

    public constructor(settings: TreeSettings, origin: Vector3)
    {
        this.position = origin;
        this.settings = settings;

        const crownSizeHalf = settings.crownSize.clone().divideScalar(2);

        for (let i = 0; i < settings.attractionPoints; ++i) 
        {
            const pos = settings.crownCentre.clone();
            pos.x += getRandomArbitrary(-crownSizeHalf.x, crownSizeHalf.x);
            pos.y += getRandomArbitrary(-crownSizeHalf.y, crownSizeHalf.y);
            pos.z += getRandomArbitrary(-crownSizeHalf.z, crownSizeHalf.z);
    
            const point: AttractionPoint = {position: pos};
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
        if (this.attractionPoints.length == 0) return;

        // Loop over attraction points and see if any nodes are attracted
        for (let attractionPoint of this.attractionPoints)
        {
            attractionPoint.closestNode = undefined;

            for (let node of this.nodes)
            {
                const distance = attractionPoint.position.distanceTo(node.position);
                const killDistance = this.settings.killDistance * this.settings.nodeSize;
                const influenceRadius = this.settings.influenceRadius * this.settings.nodeSize;

                if (distance > killDistance && distance < influenceRadius)
                {
                    // Check if we're now the closest point and if so, set it
                    if (attractionPoint.closestNode == null || distance < attractionPoint.closestNode.position.distanceTo(attractionPoint.position))
                    {
                        attractionPoint.closestNode = node;
                    }
                }
            }

            // Move node towards point
            if (attractionPoint.closestNode != undefined)
            {
                let direction = attractionPoint.position.clone().sub(attractionPoint.closestNode.position);
                direction = direction.normalize();
                attractionPoint.closestNode.influenceDirection.add(direction);
                attractionPoint.closestNode.influenceCount += 1;
            }
        }

        // Generate new nodes
        const newNodes: Array<Node> = [];
        for (let node of this.nodes)
        {
            if (node.influenceCount > 0)
            {
                // Calculate new position and direction of branch based on point influence
                const direction = node.influenceDirection.clone().divideScalar(node.influenceCount).normalize();
                const newNode = new Node(node, node.position.clone().add(direction.multiplyScalar(this.settings.nodeSize)), direction);
                newNodes.push(newNode);

                // Reset node direction/influence
                node.resetInfluence();
            }
        }

        // Add new nodes
        this.nodes.concat(newNodes);

        // Remove attraction points
        // todo see if we can collapse this back into the first loop
        for (let node of this.nodes)
        {
            for (let point of this.attractionPoints)
            {
                const distance = point.position.distanceTo(node.position);
                if (distance <= (this.settings.killDistance * this.settings.nodeSize)) {
                    // Remove node as we've now reached it
                    this.attractionPoints.splice(this.attractionPoints.indexOf(point), 1);
                } else {
                    //point++;
                }
            }
/*            const point = attractionPoints.begin();
            while (point != attractionPoints.end()) {
                auto distance = glm::distance(point->position, node->position);
                if (distance <= (settings.killDistance * settings.nodeSize)) {
                    // Remove node as we've now reached it
                    point = attractionPoints.erase(point);
                } else {
                    point++;
                }
            }*/
        }
    }

    private generateBranchVertices(node: Node): Array<Vector3>
    {
        return [];
    }

    private buildBuffers()
    {

    }
}

// Create a tree
const tree = new Tree({
    crownCentre: new Vector3(0, 2.5, 0),
    crownSize: new Vector3(2, 5, 2),
    attractionPoints: 500,
    influenceRadius: 15,
    killDistance: 2,
    nodeSize: 0.15,
    maxIterations: 200,
    branchSides: 8,
    branchThickness: 0.2
}, new Vector3(0, 0, 0));

console.log("Hello");

