import { Hose } from '../objects/hose'
import { WIDTH, HEIGHT, SCALING } from '../constants'

export class Renderer {
    ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!
    }

    renderGraphics(hose: Hose) {
        this.clear()
        this.drawHose(hose)
        this.drawMuscle(hose)
        this.drawLever(hose)
        this.drawAttachment(hose)
    }

    clear() {
        this.ctx.clearRect(0, 0, WIDTH * SCALING, HEIGHT * SCALING)
    }

    drawHose(hose: Hose) {
        const { ctx } = this
        if (hose.hoseLength < 2) return

        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 0.06 * SCALING
        ctx.lineCap = 'round'

        for (const link of hose.hoseLinks) {
            ctx.moveTo(link.nodeA.pos.x * SCALING, link.nodeA.pos.y * SCALING)
            ctx.lineTo(link.nodeB.pos.x * SCALING, link.nodeB.pos.y * SCALING)
        }
        ctx.stroke()
    }

    drawLever(hose: Hose) {
        const { ctx } = this
        if (hose.leverLinks.length === 0) return

        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 5

        for (const link of hose.leverLinks) {
            ctx.moveTo(link.nodeA.pos.x * SCALING, link.nodeA.pos.y * SCALING)
            ctx.lineTo(link.nodeB.pos.x * SCALING, link.nodeB.pos.y * SCALING)
        }
        ctx.stroke()

        // Optional: Draw the "Tip" joint
        const tip = hose.leverLinks[0].nodeB
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(tip.pos.x * SCALING, tip.pos.y * SCALING, 2, 0, Math.PI * 2)
        ctx.fill()
    }

    drawMuscle(hose: Hose) {
        const { ctx } = this
        if (!hose.muscle) return

        const A = hose.muscle.nodeA.pos
        const B = hose.muscle.nodeB.pos

        ctx.beginPath()

        const force = (Math.min(hose.muscle!.force, 1000) * 255) / 1000

        ctx.strokeStyle = `rgb(255, ${255 - force}, ${255 - force})`
        ctx.lineWidth = 3

        ctx.setLineDash([4, 10])

        ctx.moveTo(A.x * SCALING, A.y * SCALING)
        ctx.lineTo(B.x * SCALING, B.y * SCALING)

        ctx.stroke()
        ctx.setLineDash([])
    }

    drawAttachment(hose: Hose) {
        const { ctx } = this

        const pX = hose.particles[0].pos.x * SCALING
        const pY = hose.particles[0].pos.y * SCALING

        ctx.rect(pX - 200, -5, 400, pY)

        ctx.lineWidth = 10

        ctx.stroke()
    }
}

export default Renderer
