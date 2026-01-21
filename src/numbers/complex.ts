/**
 * This module contains an implementation of the Complex Numbers
 * @module
 */

import type {
	ComplexObject,
	ComplexValue,
	MathValue,
	NumberObject,
} from '#/types.ts';
import {
	exactsTo as isExactlyTo,
	isFloat,
	isNegative,
	isNotNil,
	parseComplex,
	parseNum,
} from '#/helpers.ts';
import { Real } from '#/numbers/reals.ts';
import { clamp } from '../arithmetic.ts';

/** Constants for ImaginaryConstants  */
export interface ImaginaryConstants {
	/** The imaginary unit `i` */
	readonly i: Complex;
}

function parseValue(complex: ComplexValue): ComplexObject {
	if (complex instanceof Complex) {
		return parseComplex(complex.toString());
	} else {
		return parseComplex(complex);
	}
}

/**
 * Represents a complex number with real and imaginary parts.
 * Supports arithmetic operations and can be configured as immutable.
 *
 * @example
 * ```typescript
 * const c1 = new Complex(3, 4); // 3+4i
 * const c2 = new Complex("2+3i"); // Parse from string
 * const c3 = c1.sum(c2); // Add complex numbers
 * ```
 */
export class Complex {
	/** The real part of the complex number */
	real: number;
	/** The imaginary part of the complex number */
	imaginary: number;
	/** Indicates if the class is immutable  */
	readonly #immutable: boolean;

	/**
	 * Creates a new Complex number instance.
	 *
	 * @param real - The real part of the complex number, or a string representation of a complex number
	 * @param imaginary - The imaginary part of the complex number (optional if real contains both parts)
	 * @param immutable - If true, operations on this instance won't modify it (default: false)
	 * @throws {SyntaxError} If no parameters are provided
	 *
	 * @example
	 * ```typescript
	 * new Complex(3, 4); // 3+4i
	 * new Complex("5+2i"); // Parse from string
	 * new Complex(1, 2, true); // Immutable complex number
	 * ```
	 */
	constructor(real: MathValue, imaginary?: MathValue, immutable?: boolean) {
		let value = { re: 0, im: 0 };
		if (!isNotNil(real)) {
			throw new SyntaxError('Required at least one parameter');
		}
		if (isNotNil(real)) {
			const x = parseComplex(real);
			value.re = x.re ?? 0;
			if (isNotNil(imaginary)) {
				value.im = parseNum(imaginary as string) ?? 0;
			} else value.im = x.im ?? 0;
		}

		this.real = value.re;
		this.imaginary = value.im ?? 0;
		this.#immutable = isNotNil(immutable) && Boolean(immutable);
	}

	/**
	 * Adds a complex number to this instance.
	 * If the instance is mutable, it will be modified in place.
	 *
	 * @param imaginary - The complex number to add
	 * @returns A new Complex number representing the sum
	 *
	 * @example
	 * ```typescript
	 * const c1 = new Complex(3, 4);
	 * const c2 = c1.sum(new Complex(1, 2)); // Returns 4+6i
	 * ```
	 */
	sum(imaginary: ComplexValue): Complex {
		const { re, im } = parseValue(imaginary);
		const result = [re + this.real, im + this.imaginary];

		if (!this.#immutable) {
			this.real = result[0];
			this.imaginary = result[1];
		}

		return new Complex(result[0], result[1]);
	}

	/**
	 * Subtracts a complex number from this instance.
	 * If the instance is mutable, it will be modified in place.
	 *
	 * @param imaginary - The complex number to subtract
	 * @returns A new Complex number representing the difference
	 *
	 * @example
	 * ```typescript
	 * const c1 = new Complex(5, 7);
	 * const c2 = c1.minus(new Complex(2, 3)); // Returns 3+4i
	 * ```
	 */
	minus(imaginary: ComplexValue): Complex {
		const { re, im } = parseValue(imaginary);
		const result = [this.real - re, this.imaginary - im];

		if (!this.#immutable) {
			this.real = result[0];
			this.imaginary = result[1];
		}

		return new Complex(result[0], result[1]);
	}

	/**
	 * Multiplies this complex number by another.
	 * Uses the formula: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
	 * If the instance is mutable, it will be modified in place.
	 *
	 * @param value - The complex number to multiply by
	 * @returns A new Complex number representing the product
	 *
	 * @example
	 * ```typescript
	 * const c1 = new Complex(2, 3);
	 * const c2 = c1.multiply(new Complex(4, 5)); // Returns -7+22i
	 * ```
	 */
	multiply(value: ComplexValue): Complex {
		const x = parseValue(value);
		const reals = x.re * this.real - x.im * this.imaginary;
		const imaginary = x.re * this.imaginary + x.im * this.real;

		if (!this.#immutable) {
			this.real = reals;
			this.imaginary = imaginary;
		}

		return new Complex(reals, imaginary);
	}

	/**
	 * Divides this complex number by another.
	 * Uses the formula: (a+bi)/(c+di) = [(ac+bd) + (bc-ad)i] / (c²+d²)
	 * If the instance is mutable, it will be modified in place.
	 *
	 * @param denominator - The complex number to divide by
	 * @returns A new Complex number representing the quotient
	 * @throws {Error} If attempting to divide by zero
	 *
	 * @example
	 * ```typescript
	 * const c1 = new Complex(4, 2);
	 * const c2 = c1.divide(new Complex(1, 1)); // Returns 3-1i
	 * ```
	 */
	divide(denominator: ComplexValue): Complex {
		const x = parseValue(denominator);
		const denom = x.re ** 2 + x.im ** 2;
		const real = x.re * this.real + x.im * this.imaginary;
		const imaginary = this.imaginary * x.re - this.real * x.im;
		const result = [real / denom, imaginary / denom];

		if (denom === 0) throw new Error('No number can be divided by zero');

		if (!this.#immutable) {
			this.real = result[0];
			this.imaginary = result[1];
		}

		return new Complex(result[0], result[1]);
	}

	/**
	 * Raises this complex number to the specified power.
	 * Performs repeated multiplication for integer exponents.
	 * If the instance is mutable, it will be modified in place.
	 *
	 * @param exponent - The power to raise to (default: 2, clamped to safe integer range)
	 * @returns A new Complex number representing the result
	 *
	 * @example
	 * ```typescript
	 * const c = new Complex(2, 1);
	 * const squared = c.pow(2); // Returns 3+4i
	 * const cubed = c.pow(3); // Returns 2+11i
	 * ```
	 */
	pow(exponent: MathValue = 2): Complex {
		exponent = clamp(exponent, 0, Number.MAX_SAFE_INTEGER);
		const n = parseNum(exponent);
		let result = new Complex(this.real, this.imaginary);

		for (let i = 1; i < n; i++) {
			result = result.multiply(this);
		}

		if (!this.#immutable) {
			this.imaginary = result.imaginary;
			this.real = result.real;
		}

		return result;
	}

	/**
	 * Calculates the absolute value (modulus) of the complex number.
	 * Uses the formula: |a+bi| = √(a²+b²)
	 *
	 * @returns A Real number representing the absolute value
	 *
	 * @example
	 * ```typescript
	 * const c = new Complex(3, 4);
	 * const abs = c.abs(); // Returns 5
	 * ```
	 */
	abs(): Real {
		return new Real(Math.hypot(this.real, this.imaginary));
	}

	/**
	 * Calculates the principal square root of the complex number.
	 * Uses the formula: √(a+bi) = √((|z|+a)/2) + sign(b)·i·√((|z|-a)/2)
	 *
	 * @returns A new Complex number representing the square root
	 *
	 * @example
	 * ```typescript
	 * const c = new Complex(3, 4);
	 * const root = c.sqrRoot(); // Returns 2+1i
	 * ```
	 */
	sqrRoot(): Complex {
		const abs = this.abs().value;
		const SIGN = this.imaginary < 0 ? -1 : 1;
		const real = Math.sqrt((abs + this.real) / 2);
		const img = (abs - this.real) / 2;
		const imaginary = SIGN * Math.sqrt(Math.abs(img));

		return new Complex(real, imaginary);
	}

	/**
	 * Converts the complex number to its string representation.
	 * Format depends on whether it's pure imaginary, complex, or real.
	 *
	 * @returns String in format "a+bi", "bi", or "a"
	 *
	 * @example
	 * ```typescript
	 * new Complex(3, 4).toString(); // "3+4i"
	 * new Complex(0, 5).toString(); // "5i"
	 * new Complex(7, 0).toString(); // "7"
	 * new Complex(2, -3).toString(); // "2-3i"
	 * ```
	 */
	toString(): string {
		const pureStr = `${this.imaginary}i`;
		if (this.isPure) {
			return pureStr;
		} else if (this.isImaginary) {
			return `${this.real}${this.isNegative ? '-' : '+'}${
				Math.abs(this.imaginary)
			}i`;
		} else {
			return `${this.real}`;
		}
	}

	/**
	 * Converts the complex number to a JSON object representation.
	 * The returned object is frozen and cannot be modified.
	 *
	 * @returns A frozen object containing the complex number's properties
	 *
	 * @example
	 * ```typescript
	 * const c = new Complex(3, 4);
	 * c.toJSON(); // { real: 3, imaginary: 4, isFloat: false, isImaginary: true, isNegative: false }
	 * ```
	 */
	toJSON(): NumberObject {
		return Object.freeze({
			imaginary: this.imaginary,
			isFloat: this.isFloat,
			isImaginary: this.isImaginary,
			isNegative: this.isNegative,
			real: this.real,
		});
	}

	/**
	 * Checks if the imaginary part is negative.
	 *
	 * @returns True if the imaginary part is negative, false otherwise
	 */
	get isNegative(): boolean {
		return isNegative(this.imaginary);
	}

	/**
	 * Checks if the complex number has a non-zero imaginary part.
	 *
	 * @returns True if the imaginary part is not zero, false otherwise
	 */
	get isImaginary(): boolean {
		return !isExactlyTo(this.imaginary, 0);
	}

	/**
	 * Checks if the imaginary part is a floating-point number.
	 *
	 * @returns True if the imaginary part is a float, false otherwise
	 */
	get isFloat(): boolean {
		return isFloat(this.imaginary);
	}

	/**
	 * Checks if the complex number is purely imaginary (real part is zero).
	 *
	 * @returns True if real part is zero and imaginary part is non-zero, false otherwise
	 */
	get isPure(): boolean {
		return this.isImaginary && this.real === 0;
	}

	/**
	 * Gets an immutable copy of this complex number.
	 * If already immutable, returns the same instance.
	 *
	 * @returns An immutable Complex number instance
	 */
	get immutable(): Complex {
		if (!this.#immutable) {
			return new Complex(this.real, this.imaginary, true);
		} else return this;
	}

	/**
	 * Creates a clone of this complex number.
	 * The clone can optionally be made immutable.
	 *
	 * @param immutable - If true, the cloned instance will be immutable (default: false)
	 * @returns A new Complex number instance with the same values
	 *
	 * @example
	 * ```typescript
	 * const c1 = new Complex(3, 4);
	 * const c2 = c1.clone(); // Mutable clone
	 * const c3 = c1.clone(true); // Immutable clone
	 * ```
	 */
	clone(immutable?: boolean): Complex {
		immutable = isNotNil(immutable) && Boolean(immutable);
		return new Complex(this.real, this.imaginary, immutable);
	}
}

/**
 * Complex constants
 */
export const C: ImaginaryConstants = Object.freeze({
	i: new Complex('i'),
});
