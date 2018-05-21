export class DateError extends Error {
  constructor (message) {
    super(message || 'Value is not an instance of Date')
    this.name = 'Invalid Date Object'
  }
}
