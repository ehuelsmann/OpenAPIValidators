import type { OpenAPIV3_1 } from 'openapi-types';
import type {
  OpenApiComponentDefinitionsProperty,
  OpenApiPathRecord,
  ResponseObjectWithSchema,
  Schema,
} from './AbstractOpenApiSpec';
import {
  defaultBasePath,
  findOpenApiPathMatchingPossiblePathnames,
  getPathnameWithoutBasePath,
} from '../utils/common.utils';
import {
  serversPropertyNotProvidedOrIsEmptyArray,
  getMatchingServerUrlsAndServerBasePaths,
} from '../utils/OpenApi3Spec.utils';
import AbstractOpenApiSpec from './AbstractOpenApiSpec';
import ValidationError, { ErrorCode } from './errors/ValidationError';

export default class OpenApi31Spec extends AbstractOpenApiSpec {
  public didUserDefineServers: boolean;

  constructor(protected override spec: OpenAPIV3_1.Document) {
    super(spec);
    this.didUserDefineServers = !serversPropertyNotProvidedOrIsEmptyArray(spec);
    this.ensureDefaultServer();
  }

  ensureDefaultServer(): void {
    if (serversPropertyNotProvidedOrIsEmptyArray(this.spec)) {
      this.spec.servers = [{ url: defaultBasePath }];
    }
  }

  servers(): OpenAPIV3_1.ServerObject[] {
    return this.spec.servers!;
  }

  getServerUrls(): string[] {
    return this.servers().map((server) => server.url);
  }

  getMatchingServerUrls(pathname: string): string[] {
    return getMatchingServerUrlsAndServerBasePaths(
      this.servers(),
      pathname,
    ).map(({ concreteUrl }) => concreteUrl);
  }

  getMatchingServerBasePaths(pathname: string): string[] {
    return getMatchingServerUrlsAndServerBasePaths(
      this.servers(),
      pathname,
    ).map(({ matchingBasePath }) => matchingBasePath);
  }

  override pathsObject(): OpenApiPathRecord {
    return {
      ...(this.spec.paths as OpenApiPathRecord | undefined),
      ...(this.spec.webhooks as OpenApiPathRecord | undefined),
    };
  }

  findOpenApiPathMatchingPathname(pathname: string): string {
    const matchingServerBasePaths = this.getMatchingServerBasePaths(pathname);
    if (!matchingServerBasePaths.length) {
      throw new ValidationError(ErrorCode.ServerNotFound);
    }
    const possiblePathnames = matchingServerBasePaths.map((basePath) =>
      getPathnameWithoutBasePath(basePath, pathname),
    );
    const openApiPath = findOpenApiPathMatchingPossiblePathnames(
      possiblePathnames,
      this.paths(),
    );
    if (!openApiPath) {
      throw new ValidationError(ErrorCode.PathNotFound);
    }
    return openApiPath;
  }

  findResponseDefinition(
    referenceString: string,
  ): ResponseObjectWithSchema | undefined {
    const nameOfResponseDefinition = referenceString.split(
      '#/components/responses/',
    )[1]!;
    return this.spec.components?.responses?.[nameOfResponseDefinition] as
      | ResponseObjectWithSchema
      | undefined;
  }

  getComponentDefinitionsProperty(): OpenApiComponentDefinitionsProperty {
    return { components: this.spec.components };
  }

  getSchemaObjects(): Record<string, Schema> | undefined {
    return this.spec.components?.schemas as Record<string, Schema> | undefined;
  }
}
