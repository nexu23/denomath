/**
 * This module contains the simple math constants
 * @module
 */

import type { Complex } from '#/numbers/complex.ts';
import { C } from '#/numbers/complex.ts';
import { Real } from '#/numbers/reals.ts';

/** The imaginary unit `i`
 * @constant
 * @type {Complex}  */
export const i: Complex = C.i;

/**
 * The mathematical constant `PI`, useful for geometric formulas
 * @constant
 * @type {Real}
 */
export const PI: Real = new Real(Math.PI);
/**
 * The mathematical constant `Euler`
 * @constant
 * @type {Real}
 */
export const E: Real = new Real(Math.E);

/**
 * A Real number representation of the machine epsilon.
 *
 * Machine epsilon represents the smallest positive number that, when added to 1.0,
 * produces a result different from 1.0 in floating-point arithmetic.
 *
 * @constant
 * @type {Real}
 */
export const EPSILON: Real = new Real(Number.EPSILON);
