import { HttpStatus } from '@nestjs/common';


export enum TransferStatus {
  LOCKED = 'locked',
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVERSED = 'reversed',
  REFUND = 'refund',
  RELEASE = 'release',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export const OK = HttpStatus.OK;
export const CONFLICT = HttpStatus.CONFLICT;
export const INTERNAL_SERVER_ERROR = HttpStatus.INTERNAL_SERVER_ERROR;
export const CREATED = HttpStatus.CREATED;
export const BAD_REQUEST = HttpStatus.BAD_REQUEST;
export const FORBIDDEN = HttpStatus.FORBIDDEN;
export const NOT_FOUND = HttpStatus.NOT_FOUND;
export const NO_CONTENT = HttpStatus.NO_CONTENT;
export const METHOD_NOT_ALLOWED = HttpStatus.METHOD_NOT_ALLOWED;
export const UNAUTHORIZED = HttpStatus.UNAUTHORIZED;
