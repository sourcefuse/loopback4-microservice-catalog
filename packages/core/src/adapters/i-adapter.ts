// sonarignore:file
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Adapter<T, R> {
  adaptToModel(resp: R, ...rest: any[]): T;
  adaptFromModel(data: T, ...rest: any[]): R;
}
