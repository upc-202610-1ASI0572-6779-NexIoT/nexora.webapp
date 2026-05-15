export class UserProfile {
  constructor({ name, lastName, email, location }) {
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.location = location;
  }

  get fullName() {
    return `${this.name} ${this.lastName}`;
  }
}

export class TeamMember {
  constructor({ name, role }) {
    this.name = name;
    this.role = role;
  }

  get initials() {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  get badgeClass() {
    const badges = {
      'ADMIN': 'badge--admin',
      'LANDLORD': 'badge--landlord',
      'TENANT': 'badge--tenant'
    };
    return badges[this.role] || 'badge--tenant';
  }
}

export class PaymentMethod {
  constructor({ type, lastFour, expiry }) {
    this.type = type;
    this.lastFour = lastFour;
    this.expiry = expiry;
  }

  get displayLabel() {
    return `${this.type} **** ${this.lastFour}`;
  }
}
