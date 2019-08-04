import {Vector3} from "three";

export abstract class Shape
{
    public abstract getRandomPoint(): Vector3;
}

export class Sphere extends Shape
{
    private readonly centre: Vector3;
    private readonly radius: number;

    constructor(centre: Vector3, radius: number)
    {
        super();
        this.centre = centre;
        this.radius = radius;
    }

    public getRandomPoint(): Vector3
    {
        const x1 = Math.random() - 0.5;
        const x2 = Math.random() - 0.5;
        const x3 = Math.random() - 0.5;

        const vec = new Vector3(x1, x2, x3);
        vec.normalize();

        // Math.cbrt is cube root
        const c = Math.cbrt(Math.random()) * this.radius;
        const point = new Vector3( x1 * c, x2 * c, x3 * c);

        return point.add(this.centre);
    }
}

export class Rectangle extends Shape
{
    private readonly centre: Vector3;
    private readonly halfSize: Vector3;

    constructor(centre: Vector3, size: Vector3) {
        super();
        this.centre = centre;
        this.halfSize = size.divideScalar(2);
    }

    public getRandomPoint(): Vector3
    {
        const pos = this.centre.clone();
        pos.x += this.getRandomArbitrary(-this.halfSize.x, this.halfSize.x);
        pos.y += this.getRandomArbitrary(-this.halfSize.y, this.halfSize.y);
        pos.z += this.getRandomArbitrary(-this.halfSize.z, this.halfSize.z);
        return pos;
    }

    private getRandomArbitrary(min: number, max: number): number
    {
        return Math.random() * (max - min) + min;
    }
}
