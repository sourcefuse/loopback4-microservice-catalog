# core

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Overview

`@sourceloop/core` is the [application core](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) for the `sourceloop`. It contains

* adapters
* commands
* components
* constants
* decorators
* enums
* mixins
* models
* providers
* repositories
* sequence handlers
* utilities

that are used throughout the service catalog.

### Installation

```bash
npm install @sourcelooop/core
```

`@sourceloop/core` is dependent on [`swagger-stats`](https://www.npmjs.com/package/swagger-stats), so if you haven't added prom-client already, you should do this now. It's a peer dependency of swagger-stats as of version 0.95.19.

```bash
npm install prom-client@12 --save
```
