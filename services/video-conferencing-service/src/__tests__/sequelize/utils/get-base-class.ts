import {Constructor} from '@loopback/core';

/**
 * Get base class
 * @example
 * `getBaseClass(AuditLogRepository)` // returns DefaultCrudRepository
 * @param targetClass Class to retrieve base class of.
 * @returns base class constructor
 */
export function getBaseClass(targetClass: Constructor<unknown>) {
  if (targetClass instanceof Function) {
    let baseClass = targetClass;

    while (baseClass) {
      const newBaseClass = Object.getPrototypeOf(baseClass);

      if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
        baseClass = newBaseClass;
      } else {
        break;
      }
    }

    return baseClass;
  }
}
