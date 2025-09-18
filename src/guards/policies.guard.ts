import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@/decorators/policies.decorator';
import { CaslAbilityFactory } from '@/utils/ability.factory';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: any }>();
    const user = request.user;

    const ability = this.caslFactory.createForUser(user);

    return handlers.every((handler) => handler(ability));
  }
}
