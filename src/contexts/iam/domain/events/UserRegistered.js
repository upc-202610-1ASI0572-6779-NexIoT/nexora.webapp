import { DomainEvent } from '@/shared/domain/DomainEvent';

export class UserRegistered extends DomainEvent {
  constructor(userId, email) {
    super();
    this.name = 'UserRegistered';
    this.userId = userId;
    this.email = email;
  }
}
