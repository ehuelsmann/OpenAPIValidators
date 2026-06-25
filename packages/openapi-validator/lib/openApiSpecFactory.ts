import { openapiV31 } from '@apidevtools/openapi-schemas';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import OpenAPISchemaValidatorModule from 'openapi-schema-validator';
import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import typeOf from 'typeof';
import OpenApi2Spec from './classes/OpenApi2Spec';
import OpenApi3Spec from './classes/OpenApi3Spec';
import OpenApi31Spec from './classes/OpenApi31Spec';
import { stringify } from './utils/common.utils';

// openapi-schema-validator is a CommonJS module that sets `exports.__esModule = true`
// and exports the class via `exports.default`. When imported natively as ESM, Node.js
// exposes the whole `module.exports` object as the default, so we must unwrap `.default`
// to get the actual constructor. The `??` fallback covers the CJS build context where
// the bundler (esbuild/__toESM) has already unwrapped it for us.
const OpenAPISchemaValidator =
  (
    OpenAPISchemaValidatorModule as unknown as {
      default?: typeof OpenAPISchemaValidatorModule;
    }
  ).default ?? OpenAPISchemaValidatorModule;

type AnyObject = Record<string, unknown>;

const openApi31SpecValidator = createOpenApi31SpecValidator();

const isObject = (arg: unknown): arg is AnyObject =>
  typeof arg === 'object' && arg !== null && !Array.isArray(arg);

export default function makeApiSpec(
  filepathOrObject: string | OpenAPI.Document | OpenAPIV3_1.Document,
): OpenApi2Spec | OpenApi3Spec | OpenApi31Spec {
  const spec = loadSpec(filepathOrObject);
  validateSpec(spec);
  const validSpec = spec as OpenAPI.Document | OpenAPIV3_1.Document;
  if ('swagger' in validSpec) {
    return new OpenApi2Spec(validSpec);
  }
  if (validSpec.openapi.startsWith('3.1.')) {
    return new OpenApi31Spec(validSpec as OpenAPIV3_1.Document);
  }
  return new OpenApi3Spec(validSpec as OpenAPIV3.Document);
}

function loadSpec(arg: unknown): AnyObject {
  try {
    if (typeof arg === 'string') {
      return loadFile(arg);
    }
    if (isObject(arg)) {
      return arg;
    }
    throw new Error(`Received type '${typeOf(arg)}'`);
  } catch (error) {
    throw new Error(
      `The provided argument must be either an absolute filepath or an object representing an OpenAPI specification.\nError details: ${
        (error as Error).message
      }`,
      { cause: error },
    );
  }
}

function loadFile(filepath: string): AnyObject {
  if (!path.isAbsolute(filepath)) {
    throw new Error(`'${filepath}' is not an absolute filepath`);
  }
  const fileData = fs.readFileSync(filepath, { encoding: 'utf8' });
  try {
    return yaml.load(fileData) as AnyObject;
  } catch (error) {
    throw new Error(`Invalid YAML or JSON:\n${(error as Error).message}`, {
      cause: error,
    });
  }
}

function validateSpec(obj: AnyObject): OpenAPI.Document | OpenAPIV3_1.Document {
  try {
    if ((obj as OpenAPIV3_1.Document).openapi?.startsWith('3.1.')) {
      validateOpenApi31Spec(obj);
      return obj as OpenAPIV3_1.Document;
    }

    const validator = new OpenAPISchemaValidator({
      version:
        (obj as unknown as OpenAPIV2.Document).swagger || // '2.0'
        (obj as unknown as OpenAPIV3.Document).openapi, // '3.X.X'
    });
    const { errors } = validator.validate(obj as OpenAPI.Document);
    if (errors.length > 0) {
      throw new Error(stringify(errors));
    }
    return obj as OpenAPI.Document;
  } catch (error) {
    throw new Error(`Invalid OpenAPI spec: ${(error as Error).message}`, {
      cause: error,
    });
  }
}

function createOpenApi31SpecValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(openapiV31);
}

function validateOpenApi31Spec(obj: AnyObject): void {
  if (!openApi31SpecValidator(obj)) {
    throw new Error(stringify(openApi31SpecValidator.errors));
  }
}
