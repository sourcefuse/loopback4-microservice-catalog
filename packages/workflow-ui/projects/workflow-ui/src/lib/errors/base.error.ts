/* InvalidEntityError is a class that extends Error and has a constructor that takes an entity
parameter and calls super with a string that contains the entity parameter. */
export class InvalidEntityError extends Error {
  constructor(entity: string) {
    super(`Invalid Entity: ${entity}`);
  }
}

/* It's a class that extends the Error class and has a constructor that takes a name and sets the
message to "No provider found for " */
export class NotProvided extends Error {
  constructor(name: string) {
    super(`No provider found for ${name}`);
  }
}

/* MissingError is a class that extends Error and has a constructor that takes a name and sets the
message to 'Missing: ' plus the name. */
export class MissingError extends Error {
  constructor(name: string) {
    super(`Missing: ${name}`);
  }
}
