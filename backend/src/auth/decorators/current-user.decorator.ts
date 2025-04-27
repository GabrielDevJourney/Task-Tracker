import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt.payload';
import { Request } from 'express';
interface RequestWithUser extends Request {
  user: JwtPayload;
}
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
