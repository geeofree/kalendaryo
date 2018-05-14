let kalendaryo, props

beforeEach(() => {
  kalendaryo = getComponentInstance()
  props = kalendaryo.props
  console.warn = jest.fn(warn => {
    throw new Error(warn)
  })
})

describe('<Kalendaryo />', () => {
  describe('Props', () => {
    describe('#startingDate', () => {
      test("is set to today's date with default format", () => {
        expect(format(props.startingDate, props.defaultFormat)).toEqual(
          format(dateToday, props.defaultFormat)
        )
      })

      test('is as a Date object by default', () => {
        expect(props.startingDate).toBeInstanceOf(Date)
      })

      test('prints a console error for non-date type values', () => {
        getComponentInstance({ startingDate: false })
        expect(console.warn).toThrow()
      })
    })

    describe('#defaultFormat', () => {
      test('is set to `MMM Do, YYYY` by default', () => {
        expect(props.defaultFormat).toEqual('MMM Do, YYYY')
      })

      test('prints a console error for non-string type values', () => {
        getComponentInstance({ defaultFormat: false })
        expect(console.warn).toThrow()
      })
    })

    describe('#onSelectedChange', () => {
      test('prints a console error for non-function type values', () => {
        getComponentInstance({ onSelectedChange: false })
        expect(console.warn).toThrow()
      })
    })
  })

  describe('Methods', () => {
    describe('#getDate', () => {
      test("is equal to today's date with the default format when no arguments are given", () => {
        expect(kalendaryo.getDate()).toEqual(
          format(dateToday, props.defaultFormat)
        )
      })

      test("is equal to today's date formatted as 'MM/DD/YY' given the argument: ('MM/DD/YY')", () => {
        expect(kalendaryo.getDate('MM/DD/YY')).toEqual(
          format(dateToday, 'MM/DD/YY')
        )
      })

      test('is equal to May 23, 1996 given the arguments: (defaultFormat, new Date(1996, 4, 23))', () => {
        expect(kalendaryo.getDate(props.defaultFormat, birthday)).toEqual(
          format(birthday, props.defaultFormat)
        )
      })

      test('throws an error given the argument: (defaultFormat, notADateObject)', () => {
        expect(() => kalendaryo.getDate(props.defaultFormat, false)).toThrow()
      })
    })

    describe('#getSelectedDate', () => {
      test("is equal to today's date with the default date format when no arguments are given", () => {
        expect(kalendaryo.getSelectedDate()).toEqual(
          format(dateToday, props.defaultFormat)
        )
      })

      test("is equal to today's date formatted as 'MM/DD/YY' given the argument: ('MM/DD/YY')", () => {
        expect(kalendaryo.getSelectedDate('MM/DD/YY')).toEqual(
          format(dateToday, 'MM/DD/YY')
        )
      })
    })

    describe('#getMonth', () => {
      test("is equal to today's month with the default format of 'MMM' when no arguments are given", () => {
        expect(kalendaryo.getMonth()).toEqual(format(dateToday, 'MMM'))
      })

      test("is to equal 'Dec' given the arguments: ('MMM', new Date(1996, 11, 23))", () => {
        const december = new Date(1996, 11, 23)
        expect(kalendaryo.getMonth('MMM', december)).toEqual('Dec')
      })

      test('throws an error given the argument: (invalidMonthFormat)', () => {
        expect(() => kalendaryo.getMonth('')).toThrow()
      })
    })

    describe('#getDateNextMonth', () => {
      test("is equal to the next month of today's date when no arguments are given", () => {
        const dateNextMonthToTest = format(
          kalendaryo.getDateNextMonth(),
          props.defaultFormat
        )
        const dateNextMonth = format(
          addMonths(dateToday, 1),
          props.defaultFormat
        )
        expect(dateNextMonthToTest).toEqual(dateNextMonth)
      })

      test('throws an error given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.getDateNextMonth(false)).toThrow()
      })

      test("is equal to the next month of 'May 23, 1996' given the argument: (new Date(1996, 4, 23))", () => {
        const nextMonthToTest = kalendaryo.getDateNextMonth(
          new Date(1996, 4, 23)
        )
        expect(getMonth(nextMonthToTest)).toEqual(5)
      })
    })

    describe('#getDatePrevMonth', () => {
      test("is equal to the previous month of today's date when no arguments are given", () => {
        const datePrevMonthToTest = format(
          kalendaryo.getDatePrevMonth(),
          props.defaultFormat
        )
        const datePrevMonth = format(
          subMonths(dateToday, 1),
          props.defaultFormat
        )
        expect(datePrevMonthToTest).toEqual(datePrevMonth)
      })

      test('throws an error given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.getDatePrevMonth(false)).toThrow()
      })

      test("is equal to the previous month of 'May 23, 1996' given the argument: (new Date(1996, 4, 23))", () => {
        const prevMonthToTest = kalendaryo.getDatePrevMonth(
          new Date(1996, 4, 23)
        )
        expect(getMonth(prevMonthToTest)).toEqual(3)
      })
    })

    describe('#getDay', () => {
      test("is equal to today's day when given no arguments", () => {
        expect(kalendaryo.getDay()).toEqual(getDate(dateToday))
      })

      test('is equal to 23 given the argument: (new Date(1996, 4, 23))', () => {
        expect(kalendaryo.getDay(birthday)).toEqual(23)
      })

      test('throws an error given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.getDay(false)).toThrow()
      })
    })

    describe('#getDaysInMonth', () => {
      test('returns an Array', () => {
        expect(kalendaryo.getDaysInMonth()).toBeInstanceOf(Array)
      })

      test("has an array length equal to the number of days of today's month when given no arguments", () => {
        const totalDaysThisMonth = getDaysInMonth(dateToday)
        expect(kalendaryo.getDaysInMonth()).toHaveLength(totalDaysThisMonth)
      })

      test('has array items of objects with key/value pairs of {label: dayNumber, date: dateObjValueOfDay}', () => {
        kalendaryo.getDaysInMonth().forEach(day => {
          expect(day.label).toEqual(getDate(day.date))
          expect(day.date).toBeInstanceOf(Date)
          expect(format(day.date, 'MM/DD/YY')).toEqual(
            format(setDate(day.date, day.label), 'MM/DD/YY')
          )
        })
      })
    })
  })
})
