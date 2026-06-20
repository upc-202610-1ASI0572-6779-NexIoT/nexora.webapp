export class Location {
  constructor(value) {
    this.value = value || 'Unassigned';
  }

  isAssigned() {
    return this.value !== 'Unassigned';
  }

  equals(other) {
    return other instanceof Location && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
