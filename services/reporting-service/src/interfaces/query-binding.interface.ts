/* eslint-disable @typescript-eslint/no-explicit-any */
// sonarignore:start
export interface QueryBinding {
  addBinding(value: any): string;
  getBindings(): Record<string, any>;
}
// sonarignore:end
