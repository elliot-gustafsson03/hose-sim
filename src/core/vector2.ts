class Vector2 {
    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    add(v: Vector2): this {
        this.x += v.x
        this.y += v.y
        return this
    }

    sub(v: Vector2): this {
        this.x -= v.x
        this.y -= v.y
        return this
    }

    scale(s: number): this {
        this.x *= s
        this.y *= s
        return this
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y)
    }

    distance(v: Vector2): number {
        const dx = this.x - v.x
        const dy = this.y - v.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}

export default Vector2
