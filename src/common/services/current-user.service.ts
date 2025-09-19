import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CurrentUserService {
  private readonly als = new AsyncLocalStorage<{ userId: string }>();

  run(userId: string, cb: () => void) {
    this.als.run({ userId }, cb);
  }

  get userId() {
    return this.als.getStore()?.userId;
  }
}
