/**
 * This module contains all the type definitions for numbers
 * @module
 */

import type { Real } from '#/numbers/reals.ts';
import type { Complex } from '#/numbers/complex.ts';

/** The type values of the functions */
export type MathValue = string | number;

/** The value types used in Real functions */
export type RealValue = MathValue | Real;

/** The value types used in Complex functions */
export type ComplexValue = MathValue | Complex;

/** Indicates if the number is oven or odd */
export type NumberType = 'odd' | 'even';

/** The JSON data of a number */
/**
 * Represents a number object with real and imaginary components.
 *
 * @remarks
 * This interface defines the structure for a complex number, supporting both real and imaginary parts.
 * It includes metadata flags to indicate the nature of the number (negative, imaginary, or float).
 */
export interface NumberObject {
	/** The real value of the number */
	readonly real: number;
	/** The imaginary part of the number @default 0 */
	readonly imaginary: number;
	/** Indicates if it's negative */
	readonly isNegative: boolean;
	/** Indicates if it's imaginary */
	readonly isImaginary: boolean;
	/**
	 * Indicates if it's float */
	readonly isFloat: boolean;
}

/** Just used on the `parseComplex` function */
export interface ComplexObject {
	/** The real part of the complex */
	readonly re: number;
	/** The imaginary part of the complex */
	readonly im: number;
}
