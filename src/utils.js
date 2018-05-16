export const validMonthFormats = ['M', 'Mo', 'MM', 'MMM', 'MMMM']

export const isValidMonthFormat = format => validMonthFormats.includes(format)

export class DateError extends Error {
  constructor (message) {
    super(message || 'Value is not an instance of Date')
    this.name = 'Invalid Date Object'
  }
}

export class DateMonthFormatError extends DateError {
  constructor (message) {
    super(
      message ||
        `Not a valid month format. Should be one of the following: ${validMonthFormats.join(
          ', '
        )}`
    )
    this.name = 'Invalid Date Month Format Error'
  }
}
