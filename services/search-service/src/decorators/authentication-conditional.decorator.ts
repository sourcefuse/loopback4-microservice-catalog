// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {authenticate, STRATEGY} from 'loopback4-authentication';
export function authenticateOnCondition(condition = false) {
  if (condition) {
    return authenticate(STRATEGY.BEARER);
  } else {
    return () => {}; //NOSONAR
  }
}
