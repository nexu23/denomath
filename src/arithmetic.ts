/**
 * This module contains all the basic math aritmetic functions
 * @module
 */

import type { MathValue } from '#/types.ts';
import {
	isFloat,
	isNegative,
	parseNum,
	requires,
	typeOfNumber,
} from '#/helpers.ts';

/**
 * Adds two or more numbers
 * @example
 * sum(2, '3') // 5
 * sum(3, '5') // 8
 */
export function sum(...numbers: MathValue[]): number {
	requires(numbers);
	const arr = numbers.map((num) => parseNum(num));

	return arr.reduce((previous, current) => previous + current, 0);
}

/**
 * Minus two or more numbers
 * @example
 * minus(2, '3') // -1
 * minus(3, '45') // -42
 */
export function minus(...numbers: MathValue[]): number {
	requires(numbers);
	const arr = numbers.map((num) => parseNum(num));
	return arr.reduce((previous, current) => previous - current);
}

/**
 * Multiplies two or more numbers
 * @example
 * mult(2, '3', 4) // 24
 * mult(2) // NaN
 */
export function multiply(...numbers: MathValue[]): number {
	requires(numbers);
	const arr = numbers.map((num) => parseNum(num));
	return arr.reduce((previous, current) => current * previous);
}

/**
 * Dividees two numbers (implementation of a/b)
 * @example
 * divide(3,2) // 1.5
 * divide(10,5) // 2
 * @param x
 * @param y
 * @returns
 */
export function divide(x: MathValue, y: MathValue): number {
	requires([x, y]);
	const a = parseNum(x);
	const b = parseNum(y);

	if (b === 0) throw new SyntaxError('No number can be divided by zero');

	return a / b;
}

/**
 * Elevates a number
 * @example
 * pow(2,2) // 4
 * pow(2,'4') // 16
 */
export function pow(base: MathValue, exponent: MathValue): number {
	requires([base, exponent]);
	const a = parseNum(base), b = parseNum(exponent);

	if (isNegative(base) && isFloat(exponent)) {
		throw new SyntaxError('Complex numbers are not supported at pow');
	}
	if (b === 1 / 2) return Math.sqrt(a);
	if (b === 1 / 3) return Math.cbrt(a);
	return Math.pow(a, b);
}

/**
 * Returns the average of a group of values
 * @example
 * average(2,2,2,2) // 2
 * average (2,3,4) // 3
 */
export function average(...data: MathValue[]): number {
	requires(data);
	const addition = sum(...data);
	const result = divide(addition, data.length);

	return result;
}

/**
 * Calculates the median value of the provided numbers.
 *
 * The median is the middle value in a sorted list of numbers.
 * - For odd-length arrays: returns the middle element
 * - For even-length arrays: returns the average of the two middle elements
 *
 * @param data - Variable number of numeric values (can be of type MathValue)
 * @returns The median value as a number
 *
 * @example
 * ```typescript
 * median(1, 2, 3, 4, 5); // returns 3
 * median(1, 2, 3, 4); // returns 2.5
 * ```
 */
export function median(...data: MathValue[]): number {
	requires(data);
	const arr = [...data].map((x) => parseNum(x)).sort((a, b) => a - b);
	const mid = Math.floor(arr.length / 2);

	if (typeOfNumber(arr.length) === 'even') {
		return (arr[mid - 1] + arr[mid]) / 2;
	} else {
		return arr[mid];
	}
}

/**
 * Calculates the factorial of a given number.
 *
 * The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.
 * For example, factorial(5) = 5! = 5 × 4 × 3 × 2 × 1 = 120
 *
 * @param number - The non-negative integer to calculate the factorial for
 * @returns The factorial of the input number
 * @throws {SyntaxError} If the input is negative or a floating-point number
 */

export function factorial(number: MathValue): number {
	requires([number, number]);
	const n = parseNum(number);
	if (n < 0 || isFloat(n)) {
		throw new SyntaxError(
			'Factorial is only defined for non-negative integers',
		);
	}
	let result = 1;

	for (let i = 2; i <= n; i++) {
		result *= i;
	}
	return result;
}
/**
 * Returns the greatest common divisor of the numbers
 * @example
 * gdc(2,4) // 2
 */
export function gcd(...nums: MathValue[]): number {
	requires([nums[0], nums[0]]);
	const arr = nums.map((x) => Math.abs(parseNum(x)));

	const func = (a: number, b: number): number => b === 0 ? a : func(b, a % b);

	return arr.reduce((acc, x) => func(acc, x));
}
/**
 * Returns the least Common Multiple of the numbers
 * @example
 * lcm(2,3,4) // 12
 */
export function lcm(...nums: number[]): number {
	const func = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

	return nums.reduce((acc, x) => func(acc, x));
}
/**
 * Returns how far to zero is the number
 * @example
 * abs(-2) // |-2| = 2
 * abs(2,3) // |2+3i| = 3.60555
 */
export function abs(real: MathValue, imaginary?: MathValue): number {
	requires([real, real]);

	return Math.hypot(parseNum(real), parseNum(imaginary ?? 0));
}

/**
 * Limits a value into a range
 * @example
 * clamp(3, 0, '10') // 3
 * clamp(10, 0, 5) // 5
 */
export function clamp(
	value: MathValue,
	min: MathValue,
	max: MathValue,
): number {
	const a = parseNum(min), b = parseNum(max), v = parseNum(value);
	return Math.min(Math.max(v, a), b);
}
