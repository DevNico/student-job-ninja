import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';
import { Logger } from '@nestjs/common';

export function apiLogger(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('ApiLogger', true);
  logger.log(
    chalk.blue.magentaBright(req.method) + ' -- ' + JSON.stringify(req.body),
    req.url,
  );
  next();
}
