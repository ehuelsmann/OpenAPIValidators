import { inspect } from 'util';
import path from 'path';

export const commonTestResourcesRoot = path.resolve(__dirname, '..');

export const resolveCommonTestResource = (...segments: string[]) =>
  path.join(commonTestResourcesRoot, ...segments);

export const str = (obj: unknown): string =>
  inspect(obj, { showHidden: false, depth: null });

export const joinWithNewLines = (...lines: string[]): string =>
  lines.join('\n\n');
