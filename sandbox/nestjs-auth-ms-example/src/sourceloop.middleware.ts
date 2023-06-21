import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Minimatch } from 'minimatch';
import { RestApplication } from '@loopback/rest';

@Injectable()
export class SourceLoopMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.url = req.originalUrl; // See: https://github.com/nestjs/nest/issues/2261

    let candidateServiceApp: RestApplication | null = null;
    for (const service of global.sourceloop.services) {
      for (const path of service.reservedPaths) {
        const urlMatched = new Minimatch(path).match(req.url);
        if (urlMatched) {
          console.log(req.url, 'matched with', path);
          candidateServiceApp = service.appInstance;
          break;
        }
      }
      if (candidateServiceApp !== null) {
        break;
      }
    }

    if (candidateServiceApp) {
      candidateServiceApp.requestHandler(req, res);
    } else {
      next();
    }
  }
}
