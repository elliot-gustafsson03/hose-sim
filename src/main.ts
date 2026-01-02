import { HEIGHT, WIDTH } from './constants'
import { getPressure } from './graph/pressure_estimator'
import Hose from './objects/hose'
import Renderer from './rendering/renderer'

// GET HTML ELEMENTS

const canvas = document.querySelector('canvas')! as HTMLCanvasElement

const loadInput = document.querySelector('#load')! as HTMLInputElement
const massInput = document.querySelector('#mass')! as HTMLInputElement
const stiffnessInput = document.querySelector('#stiffness')! as HTMLInputElement
const contractionInput = document.querySelector(
    '#contraction'
)! as HTMLInputElement
const updateButton = document.querySelector('#update')! as HTMLSpanElement
const contractionSpan = document.querySelector(
    '#contraction_span'
)! as HTMLSpanElement
const forceSpan = document.querySelector('#force')! as HTMLSpanElement
const pressureSpan = document.querySelector('#pressure')! as HTMLSpanElement

// HOSE DIMENSIONS

const hoseAttachment = { x: WIDTH / 2, y: 0.1 * HEIGHT }
const hoseLength = 3.45
const leverLength = 0.12

// DEFAULT SETTINGS

const mass = 23
const load = 0
const stiffness = 6000

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
        contraction = Number(contractionInput.value)
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
        forceSpan.innerHTML = `<span>Load cell measurement</span><br>${
            Math.round(hose.muscle!.force * 10) / 10
        } N`
    }
}

function showPressure() {
    const pressure = getPressure(contraction, hose)

    if (pressure) {
        pressureSpan.innerHTML = `<span>Pneumatic muscle control signal</span><br>${
            Math.round(pressure * 10) / 10
        } bar`
    }
}

const dt = 1 / 200
let counter = 0

// variables

let contraction = 0

function loop() {
    hose.update(dt)

    // Only render every 6th physics frame
    if (counter % 6 == 0) {
        renderer.renderGraphics(hose)
    }

    if (++counter == 24) {
        showForce()
        showPressure()
        counter = 0
    }
}

setInterval(loop, dt * 1000)
