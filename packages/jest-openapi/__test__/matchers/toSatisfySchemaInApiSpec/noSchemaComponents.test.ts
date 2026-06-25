import path from 'path';
import { EXPECTED_COLOR as green } from 'jest-matcher-utils';
import { resolveCommonTestResource } from '@ehuelsmann/common-test-resources/utils';

import jestOpenAPI from '../../..';

const openApiSpecsDir = resolveCommonTestResource(
  'exampleOpenApiFiles/valid/satisfySchemaInApiSpec/noSchemaComponents',
);
const openApiSpecs = [
  {
    openApiVersion: 2,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi2WithNoDefinitions.json'),
  },
  {
    openApiVersion: 3,
    pathToApiSpec: path.join(openApiSpecsDir, 'openapi3WithNoComponents.yml'),
  },
  {
    openApiVersion: '3.1',
    pathToApiSpec: path.join(
      openApiSpecsDir,
      'openapi3_1WithNoComponents.json',
    ),
  },
];

openApiSpecs.forEach((spec) => {
  const { openApiVersion, pathToApiSpec } = spec;

  describe(`expect(obj).to.satisfySchemaInApiSpec(schemaName) (using an OpenAPI ${openApiVersion} spec with no schema definitions)`, () => {
    const obj = 'foo';

    beforeAll(() => {
      jestOpenAPI(pathToApiSpec);
    });

    it('fails', () => {
      const assertion = () =>
        expect(obj).toSatisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).toThrow(
        `${green('schemaName')} must match a schema in your API spec`,
      );
    });

    it('fails when using .not', () => {
      const assertion = () =>
        expect(obj).not.toSatisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).toThrow(
        `${green('schemaName')} must match a schema in your API spec`,
      );
    });
  });
});
