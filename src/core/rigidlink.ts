import { Particle } from './particle'

export class RigidLink {
    nodeA: Particle
    nodeB: Particle
    targetLength: number

    constructor(nodeA: Particle, nodeB: Particle, length?: number) {
        this.nodeA = nodeA
        this.nodeB = nodeB
        this.targetLength = length ?? nodeA.pos.distance(nodeB.pos)
    }

    solve() {
        const dx = this.nodeA.pos.x - this.nodeB.pos.x
        const dy = this.nodeA.pos.y - this.nodeB.pos.y
        const currentDist = Math.sqrt(dx * dx + dy * dy)

        if (currentDist == 0) return

        const difference = (currentDist - this.targetLength) / currentDist
        const scalar = 1 / (this.nodeA.invMass + this.nodeB.invMass)

        const moveX = dx * difference * scalar
        const moveY = dy * difference * scalar

        if (!this.nodeA.pinned) {
            this.nodeA.pos.x -= moveX * this.nodeA.invMass
            this.nodeA.pos.y -= moveY * this.nodeA.invMass
        }

        if (!this.nodeB.pinned) {
            this.nodeB.pos.x += moveX * this.nodeB.invMass
            this.nodeB.pos.y += moveY * this.nodeB.invMass
        }
    }
}

export default RigidLink
