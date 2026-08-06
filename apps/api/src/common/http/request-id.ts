import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

type RequestWithRequestId = Request & {
  requestId?: string;
};

const normalizeHeaderValue = (value: string | string[] | undefined) => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  if (Array.isArray(value)) {
    const firstValue = value.find((item) => item.trim().length > 0);
    return firstValue?.trim() ?? null;
  }

  return null;
};

export const resolveRequestId = (
  request: Request,
  response?: Response,
): string => {
  const requestWithRequestId = request as RequestWithRequestId;

  if (requestWithRequestId.requestId) {
    if (response && !response.getHeader(REQUEST_ID_HEADER)) {
      response.setHeader(REQUEST_ID_HEADER, requestWithRequestId.requestId);
    }

    return requestWithRequestId.requestId;
  }

  const headerRequestId = normalizeHeaderValue(
    request.headers[REQUEST_ID_HEADER],
  );
  const requestId = headerRequestId ?? randomUUID();

  requestWithRequestId.requestId = requestId;

  if (response && !response.getHeader(REQUEST_ID_HEADER)) {
    response.setHeader(REQUEST_ID_HEADER, requestId);
  }

  return requestId;
};
