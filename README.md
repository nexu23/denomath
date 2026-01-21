# Documentation

## Overview

`@nexu/denomath` is a lightweight, type-safe mathematical library for managing
real and complex numbers across multiple JavaScript runtimes (Web Browsers, Bun,
Deno, and Node.js).

## Features

- **Easy to use**: Simple and intuitive API
- **Written from Scratch**: No external dependencies
- **Type-safe**: Full TypeScript support
- **Cross-platform**: Works seamlessly on Bun, Deno, and Node.js
- **Immutable operations**: Support for both mutable and immutable number
  operations

## Installation

The module is available exclusively on jsr.io. Install using your preferred
package manager:

- Deno: `deno add jsr:@nexu/denomath`
- Bun: `bunx jsr add @nexu/denomath`
- pnpm: `pnpm i jsr:@nexu/denomath`
- Yarn: `yarn add jsr:@nexu/denomath`

## API Documentation

### Real Numbers

The `Real` class provides operations for real number arithmetic with support for
both mutable and immutable instances.

**Key Methods:**

- `new Real(value)`: Create a real number from string or number
- `.immutable`: Get an immutable copy
- `.sum(value)`: Add a value
- `.multiply(value)`: Multiply by a value
- `.pow(exponent)`: Raise to a power
- `.round()`: Round the value
- `.toJSON()`: Convert to immutable JSON object

### Complex Numbers

The `Complex` class handles complex number operations with support for string
parsing.

**Key Methods:**

- `new Complex(value)`: Create from string (e.g., '2+3i') or components
- `.sum(value)`: Add complex numbers
- `.toJSON()`: Convert to immutable JSON object
- `.toString()`: Convert to string representation

**Constants:**

- `C.i`: The imaginary unit

### Statistics

The `Stats` class provides statistical operations on numerical datasets.

### Constants

Pre-defined mathematical constants like `PI` are available with immutable
access.

## Usage Patterns

- Import specific modules: `import { Real } from '@nexu/denomath/reals'`
- Or use barrel import: `import {...} from '@nexu/denomath'`
- Use `.immutable` for read-only operations
- Use `.toJSON()` for serialization and immutable snapshots

## Resources

[**Registry on jsr.io**](https://jsr.io/@nexu/denomath)

[**CHANGELOG**](./CHANGELOG.md)
