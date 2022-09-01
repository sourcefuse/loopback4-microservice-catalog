import {Injectable} from '@angular/core';
import {LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types';

@Injectable()
export class NoLinkStrategy implements LinkStrategy<ModdleElement> {
  execute(): ModdleElement[] {
    return [];
  }
}
