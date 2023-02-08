/**
 * Interface defining the component's options object
 */
export interface ImportServiceComponentOptions {
  controllers?: boolean;
  initObservers?: boolean;
}

/**
 * Default options for the component
 */
export const DEFAULT_IMPORT_SERVICE_OPTIONS: ImportServiceComponentOptions = {
  // Specify the values here
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = {rows: any[]; types: Record<string, string>};
