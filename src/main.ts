import { HEIGHT, WIDTH } from './constants'
import Hose from './objects/hose'
import Renderer from './rendering/renderer'

// GET HTML ELEMENTS

const canvas = document.querySelector('canvas')! as HTMLCanvasElement

const loadInput = document.querySelector('#load')! as HTMLInputElement
const massInput = document.querySelector('#mass')! as HTMLInputElement
const stiffnessInput = document.querySelector('#stiffness')! as HTMLInputElement
const updateButton = document.querySelector('#update')! as HTMLSpanElement

const contractionInput = document.querySelector(
    '#contraction'
)! as HTMLInputElement
const contractionSpan = document.querySelector(
    '#contraction_span'
)! as HTMLSpanElement
const forceSpan = document.querySelector('#force')! as HTMLSpanElement

// HOSE DIMENSIONS

const hoseAttachment = { x: WIDTH / 2, y: 0.1 * HEIGHT }
const hoseLength = 3.45
const leverLength = 0.12

// DEFAULT SETTINGS

const mass = 23
const load = 0
const stiffness = 8000

const renderer = new Renderer(canvas)
let hose = new Hose(
    hoseAttachment.x,
    hoseAttachment.y,
    8,
    hoseLength,
    mass,
    stiffness
)
hose.attachMuscle(
    4,
    leverLength,
    hoseAttachment.x - leverLength,
    hoseAttachment.y
)

window.onload = () => {
    contractionInput.value = '0'
    massInput.value = mass.toString()
    loadInput.value = load.toString()
    stiffnessInput.value = stiffness.toString()

    contractionInput.addEventListener('input', () => {
        const contraction = Number(contractionInput.value)
        contractionSpan.innerHTML = `${contraction}%`
        hose.muscle!.contract(contraction)
    })

    updateButton.addEventListener('click', () => {
        hose = new Hose(
            hoseAttachment.x,
            hoseAttachment.y,
            8,
            hoseLength,
            Number(massInput.value) + Number(loadInput.value),
            Number(stiffnessInput.value)
        )
        hose.attachMuscle(
            4,
            leverLength,
            hoseAttachment.x - leverLength,
            hoseAttachment.y
        )
        contractionInput.value = '0'
    })
}

function showForce() {
    if (hose.muscle) {
        forceSpan.innerHTML = `<span>Load cell force</span>: ${
            Math.round(hose.muscle!.force * 10) / 10
        } N`
    }
}

const dt = 1 / 200
let counter = 0

function loop() {
    hose.update(dt)

    // Only render every 6th physics frame
    if (counter % 6 == 0) {
        renderer.renderGraphics(hose)
    }

    if (++counter == 30) {
        showForce()
        counter = 0
    }
}

setInterval(loop, dt * 1000)
