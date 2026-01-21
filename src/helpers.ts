/**
 * This module contains all the helpers, internally, used.
 * You can use these for checking values, pasing numbers, etc
 * @module
 */
import { Complex, Real } from '#/numbers/mod.ts';
import type {
	ComplexObject,
	MathValue,
	NumberObject,
	NumberType,
} from '#/types.ts';

/** Just throws an error if the first and the second value of the array don't exists */
export const requires = (arr: unknown[]): void => {
	if (!isNotNil(arr[0]) || !isNotNil(arr[0])) {
		throw new ReferenceError('Required two or more numbers');
	}
};

/**
 * Returns an string of the value
 * @example
 * toString(3) // "3"
 * toString("23") // "23"
 */
export function toString(value: MathValue): string {
	if (!isNotNil(value)) throw new Error('Required a number o a string');
	if (typeof value === 'string') return value;
	else return String(value);
}

/**
 * Returns a boolean, indicating if the value is not `undefined or null`
 * @example
 * isNotNil(true) // true
 * isNotNil(undefined) // false
 * isNotNil(null) // false
 */
export function isNotNil(value: unknown): value is MathValue {
	return (value !== undefined && value !== null);
}

/**
 * Returns a boolean if it's a number
 * @example
 * isNumber(23.4) // true
 * isNumber('23') // true
 * isNumber({}) // false
 */
export function isNumber(value: MathValue): value is number {
	return !Number.isNaN(Number(toString(value)));
}

/**
 * Returns a boolean indicating if it's a float or not
 * @example
 * isFloat(2.3) // true
 * isFloat(2) // false
 */
export function isFloat(value: MathValue): boolean {
	const str = toString(value);
	return str.includes('.');
}

/**
 * Returns a boolean indicating if it's an integer or not
 * @example
 * isInteger(2.3) // false
 * isInteger(2) // true
 */
export function isInteger(value: MathValue): boolean {
	return !isFloat(value);
}

/**
 * Parses the number, if it's not a number, returns NaN
 * @example
 * parseNum(23) // 23
 * parseNum('23.4') // 23.4
 */
export function parseNum(value: MathValue): number {
	return Number.parseFloat(toString(value ?? '0'));
}

/**
 * Returns a boolean, indicating if it's an negative number or not
 * @example
 * isNegative(-3) // true
 * isNegative(3) // false
 */
export function isNegative(value: MathValue): boolean {
	const a = parseNum(value);
	return a < 0;
}

/**
 * Determines whether a given mathematical value represents an even or odd number.
 *
 * @param value - The mathematical value to evaluate. Will be parsed as a number.
 * @returns A string literal type indicating whether the number is 'even' or 'odd'.
 *
 * @example
 * ```typescript
 * typeOfNumber(4); // returns 'even'
 * typeOfNumber(7); // returns 'odd'
 * ```
 */
export function typeOfNumber(value: MathValue): NumberType {
	const num = parseNum(value);
	return num % 2 === 0 ? 'even' : 'odd';
}
export function parseComplex(complex: MathValue): ComplexObject {
	const str = toString(complex).replace(/\s+/g, '');
	const regex = /^([+-]?(\d+(\.\d+)?))?([+-]?(\d+(\.\d+)?)?i)?$/i;
	const match = str.match(regex);

	if (!match) {
		throw new Error(`Invalid complex number format: ${str}`);
	}

	const realPart = match[1] ? parseFloat(match[1]) : 0;
	let imaginaryPart = 0;

	if (match[4]) {
		const imagStr = match[4].replace('i', '');
		if (imagStr === '+' || imagStr === '') {
			imaginaryPart = 1;
		} else if (imagStr === '-') {
			imaginaryPart = -1;
		} else {
			imaginaryPart = parseFloat(imagStr);
		}
	}

	return { re: realPart, im: imaginaryPart };
}

/**
 * Compares two MathValue objects for exact equality by converting them to strings.
 *
 * @param a - The first MathValue to compare
 * @param b - The second MathValue to compare
 * @returns `true` if the string representations of both values are identical, `false` otherwise
 *
 * @example
 * ```typescript
 * exactsTo(value1, value2); // Returns true if toString(value1) === toString(value2)
 * ```
 */
export function exactsTo(a: MathValue, b: MathValue): boolean {
	return toString(a) === toString(b);
}

/**
 * Creates a number object (either Real or Complex) based on the provided partial number object.
 *
 * @param obj - A partial number object containing optional real and imaginary components
 * @param immutable - Whether the created number should be immutable (default: false)
 * @returns A Real number if the imaginary part is 0, otherwise a Complex number
 *
 * @example
 * ```typescript
 * // Creates a Real number
 * const realNum = createNumber({ real: 5 });
 *
 * // Creates a Complex number
 * const complexNum = createNumber({ real: 3, imaginary: 4 });
 * ```
 */
export function createNumber(
	obj: Partial<NumberObject>,
	immutable: boolean = false,
): Real | Complex {
	requires([obj, obj]);
	const partial = {
		real: obj.real,
		imaginary: obj.imaginary ?? 0,
	};

	if (!exactsTo(partial.imaginary, 0)) {
		return new Complex(partial.real ?? 0, partial.imaginary, immutable);
	} else {
		return new Real(partial.real ?? 0, immutable);
	}
}
