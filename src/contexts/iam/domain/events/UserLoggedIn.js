import { DomainEvent } from '@/shared/domain/DomainEvent';

export class UserLoggedIn extends DomainEvent {
  constructor(userId, email) {
    super();
    this.name = 'UserLoggedIn';
    this.userId = userId;
    this.email = email;
  }
}
