export interface SqlValidatorInterface {
  validate(sqlQuery: string): Promise<boolean>;
}
