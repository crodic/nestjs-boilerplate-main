import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CurrentUserService {
  private readonly als = new AsyncLocalStorage<{ userId: string }>();

  run(userId: string | undefined, callback: () => void) {
    const store = new Map<string, any>();
    store.set('userId', userId);
    this.storage.run(store, callback);
  }

  get userId(): string | undefined {
    return this.storage.getStore()?.get('userId');
  }
}
