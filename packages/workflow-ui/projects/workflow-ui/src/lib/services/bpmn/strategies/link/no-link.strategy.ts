import {Injectable} from '@angular/core';
import {LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types';

@Injectable()
export class NoLinkStrategy implements LinkStrategy<ModdleElement> {
  /**
   * It returns an empty array
   * @returns An empty array.
   */
  execute(): ModdleElement[] {
    return [];
  }
}
