import Particle from '../core/particle'
import RigidLink from '../core/rigidlink'
import Muscle from './muscle'

export class Hose {
    particles: Particle[] = []
    hoseLinks: RigidLink[] = []
    leverLinks: RigidLink[] = []
    muscle: Muscle | null = null

    stiffness: number
    hoseLength: number

    constructor(
        startX: number,
        startY: number,
        segments: number,
        length: number,
        mass: number,
        stiffness: number
    ) {
        const segmentLength = length / segments
        const particleMass = mass / (segments + 1)

        for (let i = 0; i <= segments; i++) {
            const isPinned = i == 0

            const p = new Particle(
                startX,
                startY + i * segmentLength,
                particleMass,
                isPinned
            )
            this.particles.push(p)

            if (i > 0) {
                const prev = this.particles[i - 1]
                this.hoseLinks.push(new RigidLink(prev, p))
            }
        }

        this.stiffness = stiffness
        this.hoseLength = this.particles.length
    }

    attachMuscle(
        segmentIndex: number,
        leverLength: number,
        wallX: number,
        wallY: number
    ) {
        const pA = this.particles[segmentIndex]
        const pB = this.particles[segmentIndex + 1]

        const dx = pB.pos.x - pA.pos.x
        const dy = pB.pos.y - pA.pos.y

        const len = Math.sqrt(dx * dx + dy * dy)
        const normalX = (-dy / len) * leverLength
        const normalY = (dx / len) * leverLength

        const midX = (pA.pos.x + pB.pos.x) * 0.5
        const midY = (pA.pos.y + pB.pos.y) * 0.5

        const tipParticle = new Particle(midX + normalX, midY + normalY, 0.1)

        this.particles.push(tipParticle)

        const link1 = new RigidLink(pA, tipParticle)
        const link2 = new RigidLink(pB, tipParticle)

        this.leverLinks.push(link1, link2)
        1
        const wallAnchor = new Particle(wallX, wallY, 0, true)
        this.particles.push(wallAnchor)

        this.muscle = new Muscle(tipParticle, wallAnchor)
    }

    update(dt: number) {
        this.muscle?.resetSensor()

        for (const p of this.particles) {
            p.forces.y += p.mass * 9.81
        }

        this.applyBending()

        for (const p of this.particles) {
            p.update(dt)
        }

        // Iterate multiple times for stability
        for (let k = 0; k < 5; k++) {
            for (const link of this.hoseLinks) link.solve()
            for (let i = 0; i < 10; i++) {
                for (const link of this.leverLinks) link.solve()
            }
            if (this.muscle) this.muscle.solve()
        }

        this.muscle?.computeForce(dt, 5)
    }

    private applyBending() {
        for (let i = 1; i < this.hoseLength - 1; i++) {
            const prev = this.particles[i - 1]
            const curr = this.particles[i]
            const next = this.particles[i + 1]

            // Calculate the midpoint between the two neighbors (Prev and Next)
            const midX = (prev.pos.x + next.pos.x) * 0.5
            const midY = (prev.pos.y + next.pos.y) * 0.5

            // Calculate the Deflection Vector
            // This is the vector from the Current node TO the ideal straight line (midpoint).
            // The larger this vector, the more bent the hose is.
            const deltaX = midX - curr.pos.x
            const deltaY = midY - curr.pos.y

            // Apply the Spring Force (Hooke's Law: F = k * displacement)
            curr.forces.x += deltaX * this.stiffness
            curr.forces.y += deltaY * this.stiffness

            // Apply Equal and Opposite Forces (Newton's 3rd Law)
            // We split the reaction force equally between Prev and Next.
            const reactionX = deltaX * this.stiffness * 0.5
            const reactionY = deltaY * this.stiffness * 0.5

            prev.forces.x -= reactionX
            prev.forces.y -= reactionY

            next.forces.x -= reactionX
            next.forces.y -= reactionY
        }
    }
}

export default Hose
