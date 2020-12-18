/* eslint-disable-next-line  @typescript-eslint/naming-convention */
export const enum STATUS_CODE {
  // sonarignore:start
  OK = 200,
  CREATED,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORISED,
  FORBIDDEN = 403,
  NOT_FOUND,
  UNPROCESSED_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  // sonarignore:end
}

export const ErrorCodes = {
  [STATUS_CODE.UNAUTHORISED]: {
    description: 'Invalid Credentials.',
  },
  [STATUS_CODE.BAD_REQUEST]: {
    description: 'The syntax of the request entity is incorrect.',
  },
  [STATUS_CODE.UNPROCESSED_ENTITY]: {
    description: 'The syntax of the request entity is incorrect',
  },
  [STATUS_CODE.NOT_FOUND]: {
    description: 'The entity requested does not exist.',
  },
};
