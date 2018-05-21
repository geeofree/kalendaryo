let kalendaryo, props

beforeEach(() => {
  kalendaryo = getComponent().instance()
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

      test('it is invoked when `selectedDate` state changes', () => {
        const { defaultFormat } = props
        const onSelectedChange = jest.fn()
        const component = getComponent({ onSelectedChange }, mount)

        component.setState({ selectedDate: birthday })
        expect(onSelectedChange).toHaveBeenCalled()

        const selectedDateValue = format(onSelectedChange.mock.calls[0], defaultFormat)
        const birthdayValue = format(birthday, defaultFormat)
        expect(selectedDateValue).toBe(birthdayValue)
      })

      test('it is not invoked when `selectedDate` state does not change', () => {
        const onSelectedChange = jest.fn()
        const component = getComponentInstance({ onSelectedChange }, mount)

        component.setState(prevState => prevState)
        expect(onSelectedChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('Methods', () => {
    describe('#getFormattedDate', () => {
      test('returns the current date state with the default format when given no arguments', () => {
        expect(kalendaryo.getFormattedDate()).toEqual(format(dateToday, props.defaultFormat))
      })

      test('returns the current date state with the format of \'MM/DD/YY\' given the argument: (\'MM/DD/YY\')', () => {
        expect(kalendaryo.getFormattedDate('MM/DD/YY')).toEqual(format(dateToday, 'MM/DD/YY'))
      })

      test('returns \'05/23/96\' given the arguments: (new Date(1996, 4, 23), \'MM/DD/YY\')', () => {
        expect(kalendaryo.getFormattedDate(birthday, 'MM/DD/YY')).toEqual(format(birthday, 'MM/DD/YY'))
      })

      test('throws when given invalid arguments', () => {
        expect(() => kalendaryo.getFormattedDate(false)).toThrow()
        expect(() => kalendaryo.getFormattedDate('MM/DD/YY', '')).toThrow()
        expect(() => kalendaryo.getFormattedDate(dateToday, false)).toThrow()
        expect(() => kalendaryo.getFormattedDate(dateToday, null)).toThrow()
      })
    })

    describe('#getDateNextMonth', () => {
      test('is equal to the next month of the current date when no arguments are given', () => {
        const nextMonthToTest = kalendaryo.getDateNextMonth()
        const nextMonth = getMonth(addMonths(dateToday, 1))
        expect(getMonth(nextMonthToTest)).toEqual(nextMonth)
      })

      test('is equal to the next 2 months of the current date when given the argument: (2)', () => {
        const nextMonthToTest = kalendaryo.getDateNextMonth(2)
        const nextMonth = getMonth(addMonths(dateToday, 2))
        expect(getMonth(nextMonthToTest)).toEqual(nextMonth)
      })

      test('is equal to the next 3 months of the date: May 23, 1996 given the arguments: (new Date(1996, 4, 23), 3)', () => {
        const nextMonthToTest = kalendaryo.getDateNextMonth(birthday, 3)
        const nextMonth = getMonth(addMonths(birthday, 3))
        expect(getMonth(nextMonthToTest)).toEqual(nextMonth)
      })

      test('throws an error when given invalid arguments', () => {
        expect(() => kalendaryo.getDateNextMonth(false)).toThrow()
        expect(() => kalendaryo.getDateNextMonth(1, 1)).toThrow()
        expect(() => kalendaryo.getDateNextMonth(dateToday, false)).toThrow()
      })
    })

    describe('#getDatePrevMonth', () => {
      test('is equal to the previous month of the current date when no arguments are given', () => {
        const prevMonthToTest = kalendaryo.getDatePrevMonth()
        const prevMonth = getMonth(subMonths(dateToday, 1))
        expect(getMonth(prevMonthToTest)).toEqual(prevMonth)
      })

      test('is equal to the previous 2 months of the current date when given the argument: (2)', () => {
        const prevMonthToTest = kalendaryo.getDatePrevMonth(2)
        const prevMonth = getMonth(subMonths(dateToday, 2))
        expect(getMonth(prevMonthToTest)).toEqual(prevMonth)
      })

      test('is equal to the previous 3 months of the date: May 23, 1996 given the arguments: (new Date(1996, 4, 23), 3)', () => {
        const prevMonthToTest = kalendaryo.getDatePrevMonth(birthday, 3)
        const prevMonth = getMonth(subMonths(birthday, 3))
        expect(getMonth(prevMonthToTest)).toEqual(prevMonth)
      })

      test('throws an error when given invalid arguments', () => {
        expect(() => kalendaryo.getDatePrevMonth(false)).toThrow()
        expect(() => kalendaryo.getDatePrevMonth(1, 1)).toThrow()
        expect(() => kalendaryo.getDatePrevMonth(dateToday, false)).toThrow()
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
      test('throws an error on invalid date objects given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.getDaysInMonth(false)).toThrow()
      })

      test('returns an Array', () => {
        expect(kalendaryo.getDaysInMonth()).toBeInstanceOf(Array)
      })

      test("has an array length equal to the number of days of today's month when given no arguments", () => {
        const totalDaysThisMonth = getDaysInMonth(dateToday)
        expect(kalendaryo.getDaysInMonth()).toHaveLength(totalDaysThisMonth)
      })

      test('has array items of objects with key/value pairs of { label: dayNumber, dateValue: dateObjValueOfDay, dayOfWeek: dayOfWeekNumber }', () => {
        kalendaryo.getDaysInMonth().forEach(day => {
          expect(day.label).toEqual(getDate(day.dateValue))
          expect(day.dateValue).toBeInstanceOf(Date)
          expect(day.dayOfWeek).toEqual(getDay(day.dateValue))
          expect(format(day.dateValue, 'MM/DD/YY')).toEqual(
            format(setDate(day.dateValue, day.label), 'MM/DD/YY')
          )
        })
      })
    })

    describe('#getWeeksInMonth', () => {
      test('throws an error when given an invalid date value', () => {
        expect(() => kalendaryo.getWeeksInMonth(false)).toThrow()
      })

      test('returns an Array', () => {
        expect(kalendaryo.getWeeksInMonth()).toBeInstanceOf(Array)
      })

      test('returns the correct number of days in the month of the current date', () => {
        const totalDaysThisMonth = getDaysInMonth(dateToday)
        const totalDaysToTest = kalendaryo.getWeeksInMonth()
          .map((item) => item.length)
          .reduce((a, b) => a + b)

        expect(totalDaysToTest).toEqual(totalDaysThisMonth)
      })

      test('returns the correct number of days in the month of the date: \'May 23, 1996\'', () => {
        const totalDaysInBirthdate = getDaysInMonth(birthday)
        const totalDaysToTest = kalendaryo.getWeeksInMonth()
          .map((item) => item.length)
          .reduce((a, b) => a + b)

        expect(totalDaysToTest).toEqual(totalDaysInBirthdate)
      })
    })

    describe('#setDate', () => {
      test('it throws an error on invalid date values given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.setDate(false)).toThrow()
      })

      test('it updates the `date` state to May 23, 1996 given the argument: (new Date(1996, 4, 23))', () => {
        let { date } = kalendaryo.state
        const { defaultFormat } = props
        const dateNow = format(date, defaultFormat)

        kalendaryo.setDate(birthday)
        date = kalendaryo.state.date
        const dateAfter = format(date, defaultFormat)

        expect(dateAfter).not.toBe(dateNow)
      })
    })

    describe('#setSelectedDate', () => {
      test('it throws an error on invalid date values given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.setSelectedDate(false)).toThrow()
      })

      test('it updates the `selectedDate` state to May 23, 1996 given the argument: (new Date(1996, 4, 23))', () => {
        let { selectedDate } = kalendaryo.state
        const { defaultFormat } = props
        const selectedDateNow = format(selectedDate, defaultFormat)

        kalendaryo.setSelectedDate(birthday)
        selectedDate = kalendaryo.state.selectedDate
        const selectedDateAfter = format(selectedDate, defaultFormat)

        expect(selectedDateAfter).not.toBe(selectedDateNow)
      })
    })

    describe('#selectDate', () => {
      test('it throws an error on invalid date values given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.selectDate(false)).toThrow()
      })

      test('it updates both the `date` & `selectedDate` state to May 23, 1996 given the argument: (new Date(1996, 4, 23))', () => {
        let { date, selectedDate } = kalendaryo.state
        const { defaultFormat } = props
        const dateNow = format(date, defaultFormat)
        const selectedDateNow = format(selectedDate, defaultFormat)

        kalendaryo.selectDate(birthday)
        date = kalendaryo.state.date
        selectedDate = kalendaryo.state.selectedDate
        const dateAfter = format(date, defaultFormat)
        const selectedDateAfter = format(selectedDate, defaultFormat)

        expect(dateAfter).not.toBe(dateNow)
        expect(selectedDateAfter).not.toBe(selectedDateNow)
      })
    })

    describe('#isWithinRange', () => {
      test('throws an error on invalid date values given for `date1` argument', () => {
        expect(() => kalendaryo.isWithinRange(false, dateToday)).toThrow()
      })

      test('throws an error on invalid date values given for `date2` argument', () => {
        expect(() => kalendaryo.isWithinRange(dateToday, false)).toThrow()
      })

      test('returns true if the diff. between `date1` & `date2` is >= 0', () => {
        expect(kalendaryo.isWithinRange(dateToday, birthday)).toBe(true)
        expect(kalendaryo.isWithinRange(dateToday, dateToday)).toBe(true)
      })

      test('returns false if the diff. between `date1` & `date2` is < 0', () => {
        expect(kalendaryo.isWithinRange(birthday, dateToday)).toBe(false)
      })
    })
  })
})
