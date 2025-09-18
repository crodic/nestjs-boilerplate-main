import { AppAbility } from '@/utils/ability.factory';
import { SetMetadata } from '@nestjs/common';

export interface PolicyHandler {
  (ability: AppAbility): boolean;
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
