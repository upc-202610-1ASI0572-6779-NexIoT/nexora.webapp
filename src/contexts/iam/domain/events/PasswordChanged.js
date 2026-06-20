import { DomainEvent } from '@/shared/domain/DomainEvent';

export class PasswordChanged extends DomainEvent {
  constructor(userId) {
    super();
    this.name = 'PasswordChanged';
    this.userId = userId;
  }
}
