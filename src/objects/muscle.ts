import RigidLink from '../core/rigidlink'

class Muscle extends RigidLink {
    slackLength = 2
    accumulatedCorrection: number = 0
    force: number = 0

    setLength(newLength: number) {
        this.targetLength = newLength
    }

    contract(percentage: number) {
        this.setLength(this.slackLength * (1 - (percentage * 1) / 100))
    }

    resetSensor() {
        this.accumulatedCorrection = 0
        this.force = 0
    }

    solve() {
        const dx = this.nodeA.pos.x - this.nodeB.pos.x
        const dy = this.nodeA.pos.y - this.nodeB.pos.y
        const currentDist = Math.sqrt(dx * dx + dy * dy)

        if (currentDist === 0) return

        // Calculate how much we need to move to fix the rope
        // (This includes the gap created by gravity since the last step)
        let stretch = currentDist - this.targetLength

        // If slack (negative stretch), do nothing
        if (stretch < 0) return

        // We add up all the micro-corrections from every sub-step
        this.accumulatedCorrection += stretch

        // Apply the Physics
        const difference = stretch / currentDist
        const invMassSum = this.nodeA.invMass + this.nodeB.invMass
        if (invMassSum === 0) return

        const scalar = 1 / invMassSum
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

    computeForce(dt: number, iterations: number) {
        const invMassSum = this.nodeA.invMass + this.nodeB.invMass

        if (invMassSum === 0 || dt === 0 || iterations === 0) return

        const subStepDt = dt / iterations

        // F = x / (t^2 * invMass)
        const rawForce =
            this.accumulatedCorrection / (dt * subStepDt * invMassSum)

        // Smooth the reading
        const alpha = 0.2
        this.force = this.force * (1 - alpha) + rawForce * alpha
    }
}

export default Muscle
