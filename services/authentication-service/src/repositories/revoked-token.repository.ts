// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {RevokedTokenRepository as CoreRevokedTokenRepository} from '@sourceloop/core';

/**
 * Authentication service extends the core's RevokedTokenRepository
 * All functionality is inherited from the core package
 * This follows the single source of truth principle
 */
export class RevokedTokenRepository extends CoreRevokedTokenRepository {}
