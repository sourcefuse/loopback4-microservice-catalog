import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {
  IReturnType,
  ISearchService,
  ISearchServiceWithPromises,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class PromiseApiAdapterService<T extends IReturnType> {
  adapt(instance: ISearchServiceWithPromises<T>): ISearchService<T> {
    // this is a workaround for the fact that the recentSearchApiRequestWithPromise
    // method is optional in the ISearchServiceWithPromises interface
    // and type system is not able maintain the type information of a property
    const recentSearchMethod = instance.recentSearchApiRequestWithPromise;
    return {
      searchApiRequest: (requestParameters, saveInRecents) =>
        from(
          instance.searchApiRequestWithPromise(
            requestParameters,
            saveInRecents,
          ),
        ),
      ...(recentSearchMethod && {
        recentSearchApiRequest: () => from(recentSearchMethod()),
      }),
    };
  }
}
