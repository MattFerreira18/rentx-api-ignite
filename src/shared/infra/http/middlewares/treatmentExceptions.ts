import { Request, Response, NextFunction } from 'express';

import { AppError } from '@errors/AppError';

export function treatmentExceptions(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  return res
    .status(500)
    .json({ statusCode: 500, error: `internal server error ${err.message}` });
}
