import type Hose from '../objects/hose'
import { valueAt } from './muscle_data'

function getPressure(contraction: number, hose: Hose): number | undefined {
    if (hose.muscle == undefined) return undefined

    const x = contraction
    const y = hose.muscle.force

    let errors: (number | undefined)[] = []

    for (let i = 0; i <= 6; i++) {
        const yIndex = valueAt(i, x)
        if (yIndex) {
            errors.push(Math.abs(yIndex - y))
        } else {
            errors.push(undefined)
        }
    }

    const nDefined = errors.filter((x) => x != undefined).length
    if (nDefined == 0) {
        return undefined
    } else if (nDefined == 1) {
        return errors.filter((x) => x != undefined)[0]
    }

    const interval = errors
        .map((x, i) => {
            return { value: x ? x : 9999, index: i }
        })
        .sort((obj1, obj2) => obj1.value - obj2.value)
        .slice(0, 2)

    const weightedSum =
        interval[0].index * interval[1].value +
        interval[1].index * interval[0].value

    const totalSum = interval[0].value + interval[1].value

    return weightedSum / totalSum
}

export { getPressure }
