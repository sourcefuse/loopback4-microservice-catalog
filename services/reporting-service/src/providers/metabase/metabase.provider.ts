import {Provider, inject} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {AuthenticationBindings} from 'loopback4-authentication';
import {QueriesRepository, MetabaseTokenRepository} from '../../repositories';
import axios from 'axios';
import CircularJSON from 'circular-json';
import moment from 'moment';
import {MetabaseReports} from './types';
const dotenvExt = require('dotenv-extended');
const path = require('path');
dotenvExt.load({
  path: path.join(process.env.INIT_CWD, '.env'),
  defaults: path.join(process.env.INIT_CWD, '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});

export class MetabaseProvider implements Provider<MetabaseReports> {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private user: DataObject<{role: string}>,
    @repository(QueriesRepository)
    public queriesRepository: QueriesRepository,
    @repository(MetabaseTokenRepository)
    public sessionTokenRepository: MetabaseTokenRepository,
  ) {}

  value() {
    return {
      getQueryData: async (queryId: string, userRole: string) => {
        const findQuery = await this.queriesRepository.findById(queryId);
        if (!findQuery?.permittedRoles?.includes(parseInt(userRole))) {
          return {
            error: {
              statusCode: 403,
              name: 'Forbidden Access',
              message: {
                message: 'Not Authorized To run this query',
              },
            },
          };
        }
        const env = process.env;
        const metabaseBaseUrl = env['METABASE_BASE_URL'];
        const metabaseUserName = env['METABASE_USERNAME'];
        const metabasePassword = env['METABASE_PASSWORD'];
        const sessionTokenFind = await this.sessionTokenRepository.findOne({
          where: {name: 'metabaseToken'},
        });
        const date = new Date();
        const daysDiff = moment(date).diff(
          sessionTokenFind?.modifiedOn,
          'days',
        );
        let tokenValue = sessionTokenFind?.sessionKey ?? '';
        if (sessionTokenFind === null || daysDiff > 13) {
          await axios
            .post(`${metabaseBaseUrl}/api/session`, {
              username: `${metabaseUserName}`,
              password: `${metabasePassword}`,
            })
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            .then(function (
              respon: DataObject<{data: DataObject<{id: string}>}> | any,
            ) {
              tokenValue = respon.data.id;
            })
            .catch((err: unknown) => {
              console.log(err);
            });
          if (sessionTokenFind !== null && daysDiff > 13) {
            await this.sessionTokenRepository.updateById(sessionTokenFind?.id, {
              ...sessionTokenFind,
              sessionKey: tokenValue,
            });
          } else {
            const tokenData = {
              id: uuidv4() || '',
              name: 'metabaseToken',
              sessionKey: tokenValue || '',
              createdOn: new Date(),
              modifiedOn: new Date(),
            };
            await this.sessionTokenRepository.create(tokenData);
          }
        }
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.post['X-Metabase-Session'] = tokenValue ?? '';
        const result = axios({
          method: 'post',
          url: `${metabaseBaseUrl}/api/dataset`,
          data: findQuery.query,
        })
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .then((res: any) => {
            const newJson = CircularJSON.stringify(res);
            const returnObjectUpdated = JSON.parse(newJson);
            const parsedObject = returnObjectUpdated?.data?.data;
            return parsedObject;
          })
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .catch((err: any) => {
            console.log(
              ` The error occurred while get Metabase JSON response :  ${err}`,
            );
          })
          // })
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .catch(function (error: any) {
            console.log(error);
          });
        const returnObject = result;
        return returnObject;
      },
    };
  }
}
