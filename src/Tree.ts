import {Geometry, LineBasicMaterial, LineSegments, Scene, Vector3} from "three";

export interface TreeSettings
{
    attractionPoints: number;
    crownCentre: Vector3;
    crownSize: Vector3;
    influenceRadius: number;
    killDistance: number;
    nodeSize: number;
    maxIterations: number;
    branchSides: number;
    branchThickness: number;
}

interface AttractionPoint
{
    position: Vector3;
    closestNode?: Node;
}

class Node
{
    public parent: Node | undefined;
    public position: Vector3;
    public direction: Vector3;
    public influenceDirection: Vector3;
    public influenceCount: number;

    constructor(parent: Node | undefined, position: Vector3, direction: Vector3)
    {
        this.parent = parent;
        this.position = position;
        this.direction = direction;
        this.influenceDirection = direction;
        this.influenceCount = 0;
    }

    public resetInfluence()
    {
        this.influenceDirection = this.direction.clone();
        this.influenceCount = 0;
    }
}

function getRandomArbitrary(min: number, max: number): number
{
    return Math.random() * (max - min) + min;
}

export default class Tree
{
    private readonly position: Vector3;
    private readonly settings: TreeSettings;

    private readonly killDist: number;
    private readonly influenceRadius: number;

    private attractionPoints: AttractionPoint[] = [];
    private nodes: Node[] = [];

    public constructor(settings: TreeSettings, origin: Vector3)
    {
        this.position = origin;
        this.settings = settings;

        // Pre calculate kill and influence distance as it's based on node size
        this.killDist = settings.killDistance * settings.nodeSize;
        this.influenceRadius = settings.influenceRadius * settings.nodeSize;

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
        const rootNode = new Node(undefined, this.position.clone(), new Vector3(0, 1, 0));
        this.nodes.push(rootNode);

        let iterations = 0;
        while (this.attractionPoints.length > 0 && iterations < settings.maxIterations) {
            this.grow();
            iterations++;
        }
    }

    public generateGeometry(scene: Scene)
    {
        const material = new LineBasicMaterial( { color: 0x0000ff } );
        const geometry = new Geometry();

        for (const node of this.nodes)
        {
            if (node.parent !== undefined)
            {
                geometry.vertices.push(node.position);
                geometry.vertices.push(node.parent.position);
            }
        }

        const line = new LineSegments( geometry, material );
        scene.add(line);
    }

    private grow()
    {
        if (this.attractionPoints.length === 0) { return; }

        // Loop over attraction points and see if any nodes are attracted
        for (const attractionPoint of this.attractionPoints)
        {
            attractionPoint.closestNode = undefined;

            for (const node of this.nodes)
            {
                const distance = attractionPoint.position.distanceTo(node.position);

                if (distance > this.killDist && distance < this.influenceRadius)
                {
                    // Check if we're now the closest point and if so, set it
                    if (attractionPoint.closestNode === undefined
                        || distance < attractionPoint.closestNode.position.distanceTo(attractionPoint.position))
                    {
                        attractionPoint.closestNode = node;
                    }
                }
            }

            // Move node towards point
            if (attractionPoint.closestNode !== undefined)
            {
                let direction = attractionPoint.position.clone().sub(attractionPoint.closestNode.position);
                direction = direction.normalize();
                attractionPoint.closestNode.influenceDirection.add(direction);
                attractionPoint.closestNode.influenceCount += 1;
            }
        }

        // Generate new nodes
        const newNodes: Node[] = [];
        for (const node of this.nodes)
        {
            if (node.influenceCount > 0)
            {
                // Calculate new position and direction of branch based on point influence
                const direction = node.influenceDirection.clone().divideScalar(node.influenceCount).normalize();
                const newNode = new Node(
                    node,
                    node.position.clone().add(direction.multiplyScalar(this.settings.nodeSize)),
                    direction,
                );
                newNodes.push(newNode);

                // Reset node direction/influence
                node.resetInfluence();
            }
        }

        // Add new nodes
        this.nodes = this.nodes.concat(newNodes);

        // Remove attraction points
        // todo see if we can collapse this back into the first loop
        for (const node of this.nodes)
        {
            const newAttractionPoints: AttractionPoint[] = [];
            for (const point of this.attractionPoints)
            {
                const distance = point.position.distanceTo(node.position);
                // If the distance is bigger then the kill distance, keep the attraction point as its not reached it yet
                if (distance > this.killDist)
                {
                    newAttractionPoints.push(point);
                }
            }
            this.attractionPoints = newAttractionPoints;
        }
    }
}
