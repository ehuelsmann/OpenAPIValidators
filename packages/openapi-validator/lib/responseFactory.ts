import { RawResponse } from './classes/AbstractResponse';
import AxiosResponse from './classes/AxiosResponse';
import SuperAgentResponse from './classes/SuperAgentResponse';

export default function makeResponse(
  res: RawResponse,
): AxiosResponse | SuperAgentResponse {
  if ('data' in res) {
    return new AxiosResponse(res);
  }
  if ('status' in res) {
    return new SuperAgentResponse(res);
  }
  throw new Error(
    'Unsupported response object: expected axios, supertest, superagent, or chai-http response shape.',
  );
}
