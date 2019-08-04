import {prng} from "seedrandom";
import * as seedrandom from "seedrandom";
import {Vector3} from "three";

export abstract class Shape
{
    protected rng: prng;
    private seed: string;

    protected constructor() {
        this.seed = "hello";
        this.rng = seedrandom(this.seed);
    }

    public abstract getRandomPoint(): Vector3;

    /**
     * Reseeds the RNG with the preset seed
     */
    public reseed()
    {
        this.rng = seedrandom(this.seed);
    }
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
        const x1 = this.rng() - 0.5;
        const x2 = this.rng() - 0.5;
        const x3 = this.rng() - 0.5;

        const vec = new Vector3(x1, x2, x3);
        vec.normalize();

        // Math.cbrt is cube root
        const c = Math.cbrt(this.rng()) * this.radius;
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
        return this.rng() * (max - min) + min;
    }
}
