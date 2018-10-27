import { render, cleanup } from 'react-testing-library'
import {
  format,
  isToday,
  addDays,
  subDays,
  addMonths,
  subMonths
} from 'date-fns'

beforeEach(() => {
  expect.hasAssertions()
  console.error = jest.fn()
})

afterEach(cleanup)

describe('Props', () => {
  describe('#defaultFormat', () => {
    test('Formats the value in `getFormattedDate()` as MM/DD/YY by default', () => {
      const { getFormattedDate, date } = setup()
      expect(getFormattedDate()).toBe(format(date, 'MM/DD/YY'))
    })

    test('Properly modifies the format string of `getFormattedDate()`', () => {
      const dateFormats = ['YYYY-MM-DD', 'MMM Do, YYYY', 'MMMM Do, YYYY']
      dateFormats.forEach(dateFormat => {
        const { getFormattedDate, date } = setup({ defaultFormat: dateFormat })
        expect(getFormattedDate()).toBe(format(date, dateFormat))
      })
    })

    test('Prints a `console.error` on the browser if the prop-type is not a string', () => {
      const invalidArgs = [false, 1, [], {}]
      invalidArgs.forEach(invalidArg => {
        setup({ defaultFormat: invalidArg })
      })
      expect(console.error).toHaveBeenCalledTimes(invalidArgs.length)
    })
  })

  describe('#startCurrentDateAt', () => {
    test('Sets the `date` state to today by default', () => {
      const { date } = setup()
      expect(isToday(date)).toBe(true)
    })

    test('Properly sets the `date` state to the given Date value', () => {
      const today = new Date()
      const tomorrow = addDays(today, 1)
      const yesterday = subDays(today, 1)
      const nextMonth = addMonths(today, 1)
      const prevMonth = subMonths(today, 1)
      const testDates = [tomorrow, yesterday, nextMonth, prevMonth]
      testDates.forEach(testDate => {
        const { getFormattedDate } = setup({ startCurrentDateAt: testDate })
        expect(getFormattedDate()).toBe(getFormattedDate(testDate))
      })
    })

    test('Sets the `date` state to today if the given value is a non-Date type', () => {
      const invalidArgs = [1, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        const { date } = setup({ startCurrentDateAt: invalidArg })
        expect(isToday(date)).toBe(true)
      })
    })
  })

  describe('#startSelectedDateAt', () => {
    test('Sets the `selectedDate` state to today by default', () => {
      const { selectedDate } = setup()
      expect(isToday(selectedDate)).toBe(true)
    })

    test('Properly sets the `selectedDate` state to the given Date value', () => {
      const today = new Date()
      const tomorrow = addDays(today, 1)
      const yesterday = subDays(today, 1)
      const nextMonth = addMonths(today, 1)
      const prevMonth = subMonths(today, 1)
      const testDates = [tomorrow, yesterday, nextMonth, prevMonth]
      testDates.forEach(testDate => {
        const { getFormattedDate, selectedDate } = setup({
          startSelectedDateAt: testDate
        })
        expect(getFormattedDate(selectedDate)).toBe(getFormattedDate(testDate))
      })
    })

    test('Sets the `selectedDate` state to today if the given value is a non-Date type', () => {
      const invalidArgs = [1, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        const { selectedDate } = setup({ startSelectedDateAt: invalidArg })
        expect(isToday(selectedDate)).toBe(true)
      })
    })
  })

  describe('#startWeekAt', () => {
    test('Sets the starting week index of `getWeeksInMonth()` to Sunday(0) by default', () => {
      const weeks = setup().getWeeksInMonth()
      weeks.forEach(week => {
        const firstDayOfWeek = week[0].dateValue
        expect(format(firstDayOfWeek, 'dddd')).toBe('Sunday')
      })
    })

    test('Properly sets the starting week index of `getWeeksInMonth()` to the given value', () => {
      const daysInWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      daysInWeek.forEach((dayLabel, dayIndex) => {
        const weeks = setup({ startWeekAt: dayIndex }).getWeeksInMonth()
        weeks.forEach(week => {
          const firstDayOfWeek = week[0].dateValue
          expect(format(firstDayOfWeek, 'dddd')).toBe(dayLabel)
        })
      })
    })

    test('Prints a `console.error` on the browser if the prop-type is not a number', () => {
      const invalidArgs = ['', false, {}, []]
      invalidArgs.forEach(invalidArg => {
        setup({ startWeekAt: invalidArg })
      })
      expect(console.error).toHaveBeenCalledTimes(invalidArgs.length)
    })
  })

  describe('#onChange', () => {
    test('Gets called with the `state` object whenever the states update', () => {
      const handleChange = jest.fn()
      const {
        setDate,
        pickDate,
        setSelectedDate,
        date,
        selectedDate
      } = setup({ onChange: handleChange })

      const today = new Date()
      const tomorrow = addDays(today, 1)
      const nextMonth = addMonths(today, 1)

      function getNextState (date_ = date, selectedDate_ = selectedDate) {
        return { date: date_, selectedDate: selectedDate_ }
      }

      setDate(tomorrow)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(getNextState(tomorrow))
      handleChange.mockClear()

      setSelectedDate(tomorrow)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(getNextState(tomorrow, tomorrow))
      handleChange.mockClear()

      pickDate(nextMonth)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(getNextState(nextMonth, nextMonth))
      handleChange.mockClear()
    })

    test('Prints a `console.error` on the browser if the prop-type is not a function', () => {
      const invalidArgs = ['', 1, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        setup({ onChange: invalidArg })
      })
      expect(console.error).toHaveBeenCalledTimes(invalidArgs.length)
    })
  })

  describe('#onDateChange', () => {
    test('Gets called with the `date` state whenever the `date` state updates', () => {
      const handleChange = jest.fn()
      const { setDate, pickDate, setSelectedDate } = setup({
        onDateChange: handleChange
      })
      const today = new Date()
      const tomorrow = addDays(today, 1)
      const nextMonth = addMonths(today, 1)

      setDate(tomorrow)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(tomorrow)
      handleChange.mockClear()

      setSelectedDate(tomorrow)
      expect(handleChange).not.toHaveBeenCalled()
      handleChange.mockClear()

      pickDate(nextMonth)
      expect(handleChange).toHaveBeenCalledWith(nextMonth)
    })

    test('Prints a `console.error` on the browser if the prop-type is not a function', () => {
      const invalidArgs = ['', 1, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        setup({ onDateChange: invalidArg })
      })
      expect(console.error).toHaveBeenCalledTimes(invalidArgs.length)
    })
  })

  describe('#onSelectedChange', () => {
    test('Gets called with the `selectedDate` state whenever the `selectedDate` state updates', () => {
      const handleChange = jest.fn()
      const { setDate, pickDate, setSelectedDate } = setup({
        onSelectedChange: handleChange
      })
      const today = new Date()
      const tomorrow = addDays(today, 1)
      const nextMonth = addMonths(today, 1)

      setDate(tomorrow)
      expect(handleChange).not.toHaveBeenCalled()
      handleChange.mockClear()

      setSelectedDate(tomorrow)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(tomorrow)
      handleChange.mockClear()

      pickDate(nextMonth)
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(nextMonth)
    })

    test('Prints a `console.error` on the browser if the prop-type is not a function', () => {
      const invalidArgs = ['', 1, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        setup({ onSelectedChange: invalidArg })
      })
      expect(console.error).toHaveBeenCalledTimes(invalidArgs.length)
    })
  })

  describe('#render', () => {
    test('Throws an error if the prop-type is not a function', () => {
      const invalidArgs = ['', 1, null, false, [], {}]
      invalidArgs.forEach(invalidArg => {
        expect(() => setup({ render: invalidArg })).toThrow()
      })
    })

    test('Adds unknown props to the object argument of the callback', () => {
      const unknownProps = {
        foo: '',
        bar: 1,
        baz: [],
        qux: {},
        wex: false,
        exo: null
      }
      const { renderSpy } = setup(unknownProps)
      expect(renderSpy).toHaveBeenCalledWith(expect.objectContaining(unknownProps))
    })
  })
})

function setup ({ render: layout = () => <div />, ...props } = {}) {
  let renderArgs
  const renderSpy = jest.fn(props => {
    renderArgs = props
    return layout()
  })
  const utils = render(<Kalendaryo {...props} render={renderSpy} />)
  return { renderSpy, ...renderArgs, ...utils }
}
