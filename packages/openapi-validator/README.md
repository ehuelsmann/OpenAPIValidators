# OpenAPI Validator

> **Notice:** Support for responses from [`request`](https://github.com/request/request#deprecated) and [`request-promise`](https://github.com/request/request-promise#deprecated) has been removed because both upstream projects are deprecated.

[![downloads](https://img.shields.io/npm/dm/@ehuelsmann%2Fopenapi-validator)](https://www.npmjs.com/package/@ehuelsmann/openapi-validator)
[![npm](https://img.shields.io/npm/v/@ehuelsmann%2Fopenapi-validator.svg)](https://www.npmjs.com/package/@ehuelsmann/openapi-validator)
![build status](https://github.com/ehuelsmann/OpenAPIValidators/actions/workflows/ci.yml/badge.svg)
![style](https://img.shields.io/badge/code%20style-airbnb-ff5a5f.svg)
[![codecov](https://codecov.io/gh/ehuelsmann/OpenAPIValidators/branch/master/graph/badge.svg)](https://codecov.io/gh/ehuelsmann/OpenAPIValidators)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ehuelsmann/OpenAPIValidators/blob/master/CONTRIBUTING.md)

**Note** This project is a fork from the [openapi-library](https://github.com/openapi-library) project because that project is not maintained at the moment. This project contains updates and security fixes, but ideally will be merged back into that project, as soon as it's maintained again.

Common code for [@ehuelsmann/jest-openapi](https://www.npmjs.com/package/@ehuelsmann/jest-openapi) and [Chai OpenAPI Response Validator](https://www.npmjs.com/package/@ehuelsmann/chai-openapi-response-validator)

## Keywords

`openapi` `swagger` `validate` `response` `testing` `jest` `chai` `http` `api` `schema`

## Contributing ✨

If you've come here to help contribute - thanks! Take a look at the [contributing](https://github.com/ehuelsmann/OpenAPIValidators/blob/master/CONTRIBUTING.md) docs to get started.

## Installation

[npm](http://npmjs.org)

```bash
npm install --save-dev @ehuelsmann/openapi-validator
```

[yarn](https://yarnpkg.com/)

```bash
yarn add --dev @ehuelsmann/openapi-validator
```

## Importing

This package ships with both **ESM** (preferred) and **CommonJS** builds, so it works in any environment.

ESM / TypeScript

```typescript
import { makeApiSpec, makeResponse } from '@ehuelsmann/openapi-validator';
```

CommonJS / JavaScript

```javascript
const { makeApiSpec, makeResponse } = require('@ehuelsmann/openapi-validator');
```

## Usage

This package provides the shared validation logic used by [@ehuelsmann/jest-openapi](https://www.npmjs.com/package/@ehuelsmann/jest-openapi) and [@ehuelsmann/chai-openapi-response-validator](https://www.npmjs.com/package/@ehuelsmann/chai-openapi-response-validator). Use it to build your own OpenAPI validation integration.

### Loading an OpenAPI spec

`makeApiSpec` accepts either an absolute filepath or an object representing an OpenAPI (v2 or v3) document:

```typescript
import { makeApiSpec } from '@ehuelsmann/openapi-validator';

// From an absolute filepath (YAML or JSON)
const spec = makeApiSpec('/absolute/path/to/openapi.yml');

// From an object
const spec = makeApiSpec({
  openapi: '3.0.0',
  info: { title: 'Example API', version: '1.0.0' },
  paths: {},
});
```

### Validating a response

`makeResponse` wraps an HTTP response from `axios`, `supertest`, `superagent`, or `chai-http` so it can be validated against the loaded spec:

```typescript
import { makeApiSpec, makeResponse } from '@ehuelsmann/openapi-validator';

const spec = makeApiSpec('/absolute/path/to/openapi.yml');

// res is an axios, supertest, superagent, or chai-http response object
const response = makeResponse(res);
const validationError = spec.validateResponse(response);
if (validationError) {
  throw new Error(validationError.message);
}
```
