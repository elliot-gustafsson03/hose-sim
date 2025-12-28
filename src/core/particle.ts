import Vector2 from './vector2'

export class Particle {
    pos: Vector2
    oldPos: Vector2
    forces: Vector2
    mass: number
    invMass: number
    pinned: boolean

    constructor(x: number, y: number, mass: number, pinned: boolean = false) {
        this.pos = new Vector2(x, y)
        this.oldPos = new Vector2(x, y)
        this.forces = new Vector2(0, 0)

        this.mass = mass
        this.pinned = pinned
        this.invMass = pinned || mass === 0 ? 0 : 1 / mass
    }

    update(dt: number, drag: number = 0.96) {
        if (this.pinned) return

        const accX = this.forces.x * this.invMass
        const accY = this.forces.y * this.invMass

        const velX = (this.pos.x - this.oldPos.x) * drag
        const velY = (this.pos.y - this.oldPos.y) * drag

        this.oldPos.x = this.pos.x
        this.oldPos.y = this.pos.y

        this.pos.x += velX + accX * dt * dt
        this.pos.y += velY + accY * dt * dt

        this.forces.x = 0
        this.forces.y = 0
    }
}

export default Particle
