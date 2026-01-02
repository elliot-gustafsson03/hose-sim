// src/cubic-spline.d.ts
declare module 'cubic-spline' {
    export default class Spline {
        /**
         * Creates a new cubic spline solver.
         * @param x An array of x-coordinates (must be strictly increasing).
         * @param y An array of y-coordinates.
         */
        constructor(x: number[], y: number[])

        /**
         * Interpolate the value at the given x.
         * @param x The x-coordinate to interpolate.
         */
        at(x: number): number
    }
}
