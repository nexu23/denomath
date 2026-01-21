/**
 * This module contains implementation of Real Numbers
 * @module
 */

import type { MathValue, NumberObject, RealValue } from '#/types.ts';
import { isFloat, isNegative, isNotNil, parseNum } from '#/helpers.ts';
import { divide, minus as min, multiply, pow, sum } from '../arithmetic.ts';

function parseRealNumber(num: MathValue | Real): number {
	return num instanceof Real ? num.value : parseNum(num);
}

/**
 * Represents a real number with arithmetic operations and utilities.
 *
 * @class Real
 * @example
 * ```typescript
 * const num = new Real(42);
 * const result = num.sum(8).multiply(2);
 * console.log(result.toString()); // "100"
 * ```
 *
 * @remarks
 * - Instances can be made immutable to prevent value mutations during operations
 * - All arithmetic operations return new Real instances
 * - When immutable is false, operations modify the instance value in place
 */
export class Real {
	/** Indicates whether the number is imaginary (always false for Real numbers). */
	readonly isImaginary: boolean;
	/** The numeric value of the real number. */
	value: number;
	#immutable: boolean;

	/**
	 * Creates an instance of Real.
	 * @param {MathValue} num - The value of the real number
	 * @param {boolean} [immutable] - Makes an immutable number if true
	 * @throws {ReferenceError} Throws an error if num is not provided
	 */
	constructor(
		num: MathValue,
		immutable?: boolean,
	) {
		if (!isNotNil(num)) throw new ReferenceError('A number is required!');
		const parsedNum = parseRealNumber(num ?? 0);
		this.isImaginary = false;
		this.value = parsedNum;
		this.#immutable = isNotNil(immutable) && Boolean(immutable);
	}

	/**
	 * Rounds the number to a specified number of decimal places.
	 * @param {MathValue} [decimals=2] - The number of decimal places to round to
	 * @returns {Real} A new Real instance with the rounded value
	 */
	round(decimals: MathValue = 2): Real {
		const d = parseNum(decimals);

		return new Real(this.value.toFixed(d));
	}

	/**
	 * Elevates the number to a specified exponent.
	 * @param {RealValue} [exponent=2] - The exponent to raise the number to
	 * @returns {Real} A new Real instance with the result. If not immutable, updates the current instance's value
	 */
	pow(exponent: RealValue = 2): Real {
		const exp = parseRealNumber(exponent);
		const result = pow(this.value, exp);
		if (!this.#immutable) this.value = result;
		return new Real(result);
	}

	/**
	 * Adds one or more numbers to the real number.
	 * @param {...RealValue[]} numbers - The numbers to add
	 * @returns {Real} A new Real instance with the sum. If not immutable, updates the current instance's value
	 */
	sum(...numbers: RealValue[]): Real {
		const arr = numbers.map((x) => parseRealNumber(x));
		const result = sum(...arr, this.value);

		if (!this.#immutable) this.value = result;
		return new Real(result);
	}

	/**
	 * Subtracts one or more numbers from the real number.
	 * @param {...RealValue[]} numbers - The numbers to subtract
	 * @returns {Real} A new Real instance with the result. If not immutable, updates the current instance's value
	 */
	minus(...numbers: RealValue[]): Real {
		const arr = numbers.map((x) => parseRealNumber(x));
		const result = min(this.value, ...arr);

		if (!this.#immutable) this.value = result;
		return new Real(result);
	}

	/**
	 * Multiplies the value by one or more numbers.
	 * @param {...RealValue[]} numbers - The numbers to multiply by
	 * @returns {Real} A new Real instance with the product. If not immutable, updates the current instance's value
	 */
	multiply(...numbers: RealValue[]): Real {
		const arr = numbers.map((x) => parseRealNumber(x));
		const result = multiply(...arr, this.value);

		if (!this.#immutable) this.value = result;
		return new Real(result);
	}

	/**
	 * Divides the value by a divisor.
	 * @param {RealValue} divisor - The divisor to divide by
	 * @returns {Real} A new Real instance with the quotient. If not immutable, updates the current instance's value
	 */
	divide(divisor: RealValue): Real {
		const result = divide(this.value, parseRealNumber(divisor));
		if (!this.#immutable) {
			this.value = result;
		}
		return new Real(result);
	}

	/**
	 * Checks if the value is equal to another number.
	 * @param {RealValue} other - The number to compare with
	 * @returns {boolean} True if the values are equal, false otherwise
	 */
	equals(other: RealValue): boolean {
		const num = parseRealNumber(other);
		return num === this.value;
	}

	/**
	 * Checks if the value is less than another number.
	 * @param {RealValue} other - The number to compare with
	 * @returns {boolean} True if this value is less than the other, false otherwise
	 */
	lessThan(other: RealValue): boolean {
		const num = parseRealNumber(other);
		return this.value < num;
	}

	/**
	 * Checks if the value is greater than another number.
	 * @param {RealValue} other - The number to compare with
	 * @returns {boolean} True if this value is greater than the other, false otherwise
	 */
	higherThan(other: RealValue): boolean {
		const num = parseRealNumber(other);
		return this.value > num;
	}

	/**
	 * Gets whether the number is negative.
	 * @readonly
	 * @returns {boolean} True if the number is negative, false otherwise
	 */
	get isNegative(): boolean {
		return isNegative(this.value);
	}

	/**
	 * Gets whether the number is a floating-point number (decimal).
	 * @readonly
	 * @returns {boolean} True if the number has decimal places, false otherwise
	 */
	get isFloat(): boolean {
		return isFloat(this.value);
	}

	/**
	 * Converts the real number to a string representation.
	 * @returns {string} The string representation of the number
	 */
	toString(): string {
		return this.value.toString();
	}

	/**
	 * Converts the real number to a JSON object representation.
	 * @returns {NumberObject} A frozen object containing the number's properties
	 */
	toJSON(): NumberObject {
		return Object.freeze({
			imaginary: 0,
			real: this.value,
			isImaginary: false,
			isNegative: this.isNegative,
			isFloat: this.isFloat,
		});
	}

	/**
	 * Gets an immutable clone of the Real instance.
	 * @readonly
	 * @returns {Real} An immutable clone of the current instance
	 */
	get immutable(): Real {
		return this.clone(true);
	}

	/**
	 * Creates a clone of the Real instance.
	 * @param {boolean} [immutable] - Whether the clone should be immutable
	 * @returns {Real} A new Real instance with the same value
	 */
	clone(immutable?: boolean): Real {
		immutable = isNotNil(immutable) && Boolean(immutable);
		return new Real(this.value, immutable);
	}
}
