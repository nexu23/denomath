/**
 * Basic statistical calculations for datasets of numbers.
 * @module
 */

import type { MathValue } from '#/types.ts';
import { average, median } from '../arithmetic.ts';
import { parseNum } from '../helpers.ts';

/**
 * A class for calculating statistical measures on a dataset of numbers.
 *
 * @remarks
 * This class provides various statistical calculations including averages, medians, and ranges.
 * The input data is automatically filtered to remove NaN values during construction.
 *
 * @example
 * ```typescript
 * const stats = new Stats(1, 2, 3, 4, 5);
 * console.log(stats.average); // 3
 * console.log(stats.median); // 3
 * console.log(stats.range); // 4
 * ```
 */
export class Stats {
	data: number[];
	average: number;
	sumValue: number;

	constructor(...data: MathValue[]) {
		data = data.filter((num) => !Number.isNaN(parseNum(num))).map((num) =>
			parseNum(num)
		);
		this.average = average(...data);
		this.sumValue = this.average * data.length;
		this.data = data as number[];
	}

	/**
	 * Gets the median value of the dataset.
	 * @returns The middle value when data is sorted, or average of two middle values for even-length datasets.
	 */
	get median(): number {
		return median(...this.data);
	}

	/**
	 * Calculates the geometric mean of the dataset.
	 * @returns The nth root of the product of all values, where n is the number of values.
	 */
	get geometricAverage(): number {
		const { length } = this.data;
		if (length === 0) return NaN;
		const product = this.data.reduce((acc, num) => acc * num, 1);
		return Math.pow(product, 1 / length);
	}

	/**
	 * Calculates the harmonic mean of the dataset.
	 * @returns The reciprocal of the arithmetic mean of the reciprocals of the values.
	 */
	get harmonicAverage(): number {
		const { length } = this.data;
		if (length === 0) return NaN;
		let reciprocalSum = 0;
		for (const num of this.data) {
			reciprocalSum += 1 / num;
		}
		return length / reciprocalSum;
	}

	/**
	 * Calculates the range of the dataset.
	 * @returns The difference between the maximum and minimum values.
	 */
	get range(): number {
		if (this.data.length === 0) return NaN;
		const min = Math.min(...this.data);
		const max = Math.max(...this.data);
		return max - min;
	}

	/**
	 * Calculates the mid-range of the dataset.
	 * @returns Half of the range value.
	 */
	get midRange(): number {
		return this.range / 2;
	}
}
