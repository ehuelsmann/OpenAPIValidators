import path from 'path';
import axios, { AxiosResponse } from 'axios';
import supertest, { Response as SuperAgentResponse } from 'supertest';

import { str } from '../../../../../commonTestResources/utils';
import app, { port } from '../../../../../commonTestResources/exampleApp';
import jestOpenAPI from '../../..';

const appOrigin = `http://127.0.0.1:${port}`;
const pathToApiSpec = path.resolve(
  '../../commonTestResources/exampleOpenApiFiles/valid/openapi3.yml',
);

describe('Parsing responses from different request modules', () => {
  beforeAll(async () => {
    jestOpenAPI(pathToApiSpec);
    await new Promise<void>((resolve) => {
      if (app.server && app.server.listening) {
        resolve();
        return;
      }
      app.server = app.listen(port, () => resolve());
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      if (!app.server) {
        resolve();
        return;
      }
      app.server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  // These tests cover both supertest and chai-http, because they make requests the same way (using superagent)
  describe('supertest', () => {
    describe('res header is application/json, and res.body is a string', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/string',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/emptyObject',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: {},
          }),
        );
      });
    });

    describe('res header is text/html, res.body is {}, and res.text is a string', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get('/header/text/html');
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: {},
            text: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/nullable',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: null,
          }),
        );
      });
    });

    describe('res has no content-type header, res.body is {}, and res.text is empty string', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/no/content-type/header/and/no/response/body',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: {},
            text: '',
          }),
        );
      });
    });
  });

  describe('axios', () => {
    describe('res header is application/json, and res.body is a string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/string`,
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/emptyObject`,
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: {},
          }),
        );
      });
    });

    describe('res header is text/html, res.body is a string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(`${appOrigin}/header/text/html`);
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/nullable`,
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: null,
          }),
        );
      });
    });

    describe('res has no content-type header, and res.body is empty string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/no/content-type/header/and/no/response/body`,
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({
            body: '',
          }),
        );
      });
    });
    describe('with explicit axios JSON parsing enabled', () => {
      describe('res header is application/json, and res.body is a string', () => {
        let res: AxiosResponse;
        beforeAll(async () => {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/string`,
            {
              transitional: {
                forcedJSONParsing: true,
                silentJSONParsing: false,
              },
            },
          );
        });
        it('passes', () => {
          expect(res).toSatisfyApiSpec();
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).not.toSatisfyApiSpec();
          expect(assertion).toThrow(
            str({
              body: 'res.body is a string',
            }),
          );
        });
      });

      describe('res header is application/json, and res.body is {}', () => {
        let res: AxiosResponse;
        beforeAll(async () => {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/emptyObject`,
            {
              transitional: {
                forcedJSONParsing: true,
                silentJSONParsing: false,
              },
            },
          );
        });
        it('passes', () => {
          expect(res).toSatisfyApiSpec();
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).not.toSatisfyApiSpec();
          expect(assertion).toThrow(
            str({
              body: {},
            }),
          );
        });
      });
    });
  });
});
