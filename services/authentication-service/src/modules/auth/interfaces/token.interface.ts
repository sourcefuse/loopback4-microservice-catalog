export interface BaseTokenPayload {
  exp?: number; // Optional because the token may not have an expiration field
  iat?: number;
}

/**
 * @interface TokenPayload
 * @extends BaseTokenPayload
 *
 * Represents the payload of a token used for authentication.
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {string[]} roles - An array of roles assigned to the user.
 */
export interface TokenPayload extends BaseTokenPayload {
  userId: string;
  email: string;
  roles: string[];
}
