export namespace VonageEnums {
  export enum FallbackType {
    None = 'none',
    Opentok = 'opentok',
  }

  export enum ArchiveMode {
    Manual = 'manual',
    Always = 'always',
  }

  export enum MediaMode {
    Routed = 'routed',
    Relayed = 'relayed',
  }

  export enum ArchiveLayout {
    BestFit = 'bestFit',
    Custom = 'custom',
    HorizontalPresentation = 'horizontalPresentation',
    Pip = 'pip',
    VerticalPresentation = 'verticalPresentation',
  }

  export enum Role {
    Subscriber = 'subscriber',
    Publisher = 'publisher',
    Moderator = 'moderator',
  }

  export enum OutputMode {
    Composed = 'composed',
    Individual = 'individual',
  }

  export enum SessionWebhookEvents {
    ConnectionCreated = 'connectionCreated',
    ConnectionDestroyed = 'connectionDestroyed',
    StreamCreated = 'streamCreated',
    StreamDestroyed = 'streamDestroyed',
  }
}
