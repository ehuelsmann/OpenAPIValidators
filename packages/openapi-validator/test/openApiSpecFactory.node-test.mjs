import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixture = (...parts) =>
  path.join(
    testDirectory,
    '../../common-test-resources/exampleOpenApiFiles',
    ...parts,
  );

const { makeApiSpec } = await import('../dist/index.mjs');

test('loads YAML and JSON OpenAPI specs', () => {
  const yamlSpec = makeApiSpec(fixture('valid/openapi3.yml'));
  const jsonSpec = makeApiSpec(fixture('valid/openapi3.json'));

  assert.ok(yamlSpec.paths().length > 0);
  assert.ok(jsonSpec.paths().length > 0);
});

test('rejects invalid YAML and JSON files', () => {
  assert.throws(
    () => makeApiSpec(fixture('invalid/fileFormat/invalidYamlFormat.yml')),
    /Invalid YAML or JSON:/,
  );
  assert.throws(
    () => makeApiSpec(fixture('invalid/fileFormat/invalidJsonFormat.json')),
    /Invalid YAML or JSON:/,
  );
});
