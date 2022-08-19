export class InvalidEntityError extends Error {
  constructor(entity: string) {
    super(`Invalid Entity: ${entity}`);
  }
}

export class NotProvided extends Error {
  constructor(name: string) {
    super(`No provider found for ${name}`);
  }
}

export class MissingError extends Error {
  constructor(name: string) {
    super(`Missing: ${name}`);
  }
}
