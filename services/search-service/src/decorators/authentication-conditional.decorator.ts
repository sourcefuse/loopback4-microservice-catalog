import {authenticate, STRATEGY} from 'loopback4-authentication';
export function authenticateOnCondition(condition = false) {
  if (condition) {
    return authenticate(STRATEGY.BEARER);
  } else {
    return () => {};
  }
}
