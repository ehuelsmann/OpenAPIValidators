import path from 'path';
import * as chai from 'chai';
import { resolveCommonTestResource } from '@ehuelsmann/common-test-resources/utils';

import chaiResponseValidator from '../../..';

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

const { expect, AssertionError } = chai;

openApiSpecs.forEach((spec) => {
  const { openApiVersion, pathToApiSpec } = spec;

  describe(`expect(obj).to.satisfySchemaInApiSpec(schemaName) (using an OpenAPI ${openApiVersion} spec with no schema definitions)`, () => {
    const obj = 'foo';

    before(() => {
      chai.use(chaiResponseValidator(pathToApiSpec));
    });

    it('fails', () => {
      const assertion = () =>
        expect(obj).to.satisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).to.throw(
        AssertionError,
        'The argument to satisfySchemaInApiSpec must match a schema in your API spec',
      );
    });

    it('fails when using .not', () => {
      const assertion = () =>
        expect(obj).to.not.satisfySchemaInApiSpec('NonExistentSchema');
      expect(assertion).to.throw(
        AssertionError,
        'The argument to satisfySchemaInApiSpec must match a schema in your API spec',
      );
    });
  });
});
