import {Getter, extensionPoint, extensions} from '@loopback/core';
import {ObservabilityProfile, ObservabilityProfileName} from '../types';
import {OBSERVABILITY_PROFILE_EXTENSION_POINT_NAME} from './keys';

@extensionPoint(OBSERVABILITY_PROFILE_EXTENSION_POINT_NAME)
export class ObservabilityProfileRegistry {
  constructor(
    @extensions()
    private readonly getProfiles: Getter<ObservabilityProfile[]>,
  ) {}

  async getProfile(
    profileName: ObservabilityProfileName,
  ): Promise<ObservabilityProfile | undefined> {
    const profiles = await this.getProfiles();
    return profiles.find(profile => profile.supports(profileName));
  }
}
