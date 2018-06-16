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
    describe('#startCurrentDateAt', () => {
      test("is set to today's date with default format", () => {
        expect(format(props.startCurrentDateAt, props.defaultFormat)).toEqual(
          format(dateToday, props.defaultFormat)
        )
      })

      test('is as a Date object by default', () => {
        expect(props.startCurrentDateAt).toBeInstanceOf(Date)
      })

      test('prints a console error for non-date type values', () => {
        getComponentInstance({ startCurrentDateAt: false })
        expect(console.warn).toThrow()
      })
    })

    describe('#defaultFormat', () => {
      test('is set to `MM/DD/YY` by default', () => {
        expect(props.defaultFormat).toEqual('MM/DD/YY')
      })

      test('prints a console error for non-string type values', () => {
        getComponentInstance({ defaultFormat: false })
        expect(console.warn).toThrow()
      })
    })

    describe('#onChange', () => {
      test('prints a console error for non-function type values', () => {
        getComponentInstance({ onChange: false })
        expect(console.warn).toThrow()
      })

      test('it is invoked when `date` state changes', () => {
        const { defaultFormat } = props
        const onChange = jest.fn()
        const component = getComponent({ onChange }, mount)

        component.setState({ date: birthday })
        expect(onChange).toHaveBeenCalled()

        const dateValue = format(onChange.mock.calls[0][0].date, defaultFormat)
        const birthdayValue = format(birthday, defaultFormat)
        expect(dateValue).toBe(birthdayValue)
      })

      test('it is invoked when `selectedDate` state changes', () => {
        const { defaultFormat } = props
        const onChange = jest.fn()
        const component = getComponent({ onChange }, mount)

        component.setState({ selectedDate: birthday })
        expect(onChange).toHaveBeenCalled()

        const selectedDateValue = format(onChange.mock.calls[0][0].selectedDate, defaultFormat)
        const birthdayValue = format(birthday, defaultFormat)
        expect(selectedDateValue).toBe(birthdayValue)
      })

      test('it is not invoked when the state does not change', () => {
        const onChange = jest.fn()
        const component = getComponentInstance({ onChange }, mount)

        component.setState(prevState => prevState)
        expect(onChange).not.toHaveBeenCalled()
      })
    })

    describe('#onDateChange', () => {
      test('prints a console error for non-function type values', () => {
        getComponentInstance({ onDateChange: false })
        expect(console.warn).toThrow()
      })

      test('it is invoked when `date` state changes', () => {
        const { defaultFormat } = props
        const onDateChange = jest.fn()
        const component = getComponent({ onDateChange }, mount)

        component.setState({ date: birthday })
        expect(onDateChange).toHaveBeenCalled()

        const dateValue = format(onDateChange.mock.calls[0][0], defaultFormat)
        const birthdayValue = format(birthday, defaultFormat)
        expect(dateValue).toBe(birthdayValue)
      })

      test('it is not invoked when the `date` state does not change', () => {
        const onDateChange = jest.fn()
        const component = getComponentInstance({ onDateChange }, mount)

        component.setState(prevState => prevState)
        expect(onDateChange).not.toHaveBeenCalled()
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

        const dateValue = format(onSelectedChange.mock.calls[0][0], defaultFormat)
        const birthdayValue = format(birthday, defaultFormat)
        expect(dateValue).toBe(birthdayValue)
      })

      test('it is not invoked when the `date` state does not change', () => {
        const onSelectedChange = jest.fn()
        const component = getComponentInstance({ onSelectedChange }, mount)

        component.setState(prevState => prevState)
        expect(onSelectedChange).not.toHaveBeenCalled()
      })
    })

    describe('#render', () => {
      test('it receives an object argument', () => {
        const callback = jest.fn()
        getComponentInstance({ render: callback })
        expect(callback).toHaveBeenCalled()
        expect(callback.mock.calls[0]).toHaveLength(1)
        expect(typeof callback.mock.calls[0][0]).toBe('object')
      })

      test('object argument has `date` and `selectedDate` states', () => {
        const callback = jest.fn()
        getComponentInstance({ render: callback })
        expect(callback).toHaveBeenCalled()
        expect(callback.mock.calls[0]).toHaveLength(1)

        const mockCalls = callback.mock.calls[0][0]
        expect('date' in mockCalls).toBe(true)
        expect(mockCalls.date).toBeInstanceOf(Date)

        expect('selectedDate' in mockCalls).toBe(true)
        expect(mockCalls.selectedDate).toBeInstanceOf(Date)
      })

      test('object argument has Kalendaryo\'s various methods', () => {
        const callback = jest.fn()
        getComponentInstance({ render: callback })
        expect(callback).toHaveBeenCalled()
        expect(callback.mock.calls[0]).toHaveLength(1)

        const mockCalls = callback.mock.calls[0][0]
        expect('getFormattedDate' in mockCalls).toBe(true)
        expect(typeof mockCalls.getFormattedDate).toBe('function')

        expect('getDateNextMonth' in mockCalls).toBe(true)
        expect(typeof mockCalls.getDatePrevMonth).toBe('function')

        expect('getDatePrevMonth' in mockCalls).toBe(true)
        expect(typeof mockCalls.getDatePrevMonth).toBe('function')

        expect('getDaysInMonth' in mockCalls).toBe(true)
        expect(typeof mockCalls.getDaysInMonth).toBe('function')

        expect('getWeeksInMonth' in mockCalls).toBe(true)
        expect(typeof mockCalls.getWeeksInMonth).toBe('function')

        expect('setDate' in mockCalls).toBe(true)
        expect(typeof mockCalls.setDate).toBe('function')

        expect('setSelectedDate' in mockCalls).toBe(true)
        expect(typeof mockCalls.setSelectedDate).toBe('function')

        expect('pickDate' in mockCalls).toBe(true)
        expect(typeof mockCalls.pickDate).toBe('function')
      })

      test('can have dynamic arguments from the unknown props', () => {
        const callback = jest.fn()
        getComponentInstance({ foo: 'bar', baz: 2, cb: () => false, render: callback })
        expect(callback).toHaveBeenCalled()
        expect(callback.mock.calls[0]).toHaveLength(1)

        const mockCalls = callback.mock.calls[0][0]

        expect('foo' in mockCalls).toBe(true)
        expect('baz' in mockCalls).toBe(true)
        expect('cb' in mockCalls).toBe(true)

        expect(typeof mockCalls.foo).toBe('string')
        expect(mockCalls.foo).toBe('bar')

        expect(typeof mockCalls.baz).toBe('number')
        expect(mockCalls.baz).toBe(2)

        expect(typeof mockCalls.cb).toBe('function')
        expect(mockCalls.cb()).toBe(false)
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

      test('has array items of objects with key/value pairs of { label: integer, dateValue: date }', () => {
        kalendaryo.getDaysInMonth().forEach(day => {
          expect(day.label).toEqual(getDate(day.dateValue))
          expect(day.dateValue).toBeInstanceOf(Date)
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

      test('returns the correct weeks for the current month of the current date by default', () => {
        const firstDayOfMonth = startOfMonth(dateToday)
        let weekOfMonth = startOfWeek(firstDayOfMonth)

        kalendaryo.getWeeksInMonth().forEach(week => {
          week.forEach((day) => {
            expect(isSameWeek(day.dateValue, weekOfMonth)).toBe(true)
          })
          weekOfMonth = addWeeks(weekOfMonth, 1)
        })
      })

      test('returns the correct weeks for the date of May 23, 1996', () => {
        const firstDayOfMonth = startOfMonth(birthday)
        let weekOfMonth = startOfWeek(firstDayOfMonth)

        kalendaryo.getWeeksInMonth(birthday).forEach(week => {
          week.forEach((day) => {
            expect(isSameWeek(day.dateValue, weekOfMonth)).toBe(true)
          })
          weekOfMonth = addWeeks(weekOfMonth, 1)
        })
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

    describe('#pickDate', () => {
      test('it throws an error on invalid date values given the argument: (notADateObject)', () => {
        expect(() => kalendaryo.pickDate(false)).toThrow()
      })

      test('it updates both the `date` & `selectedDate` state to May 23, 1996 given the argument: (new Date(1996, 4, 23))', () => {
        let { date, selectedDate } = kalendaryo.state
        const { defaultFormat } = props
        const dateNow = format(date, defaultFormat)
        const selectedDateNow = format(selectedDate, defaultFormat)

        kalendaryo.pickDate(birthday)
        date = kalendaryo.state.date
        selectedDate = kalendaryo.state.selectedDate
        const dateAfter = format(date, defaultFormat)
        const selectedDateAfter = format(selectedDate, defaultFormat)

        expect(dateAfter).not.toBe(dateNow)
        expect(selectedDateAfter).not.toBe(selectedDateNow)
      })
    })
  })
})
