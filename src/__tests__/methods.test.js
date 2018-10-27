import {fireEvent, render, cleanup} from 'react-testing-library'
import {
  format,
  addMonths,
  subMonths,
  setDate,
  getDate,
  startOfMonth,
  startOfWeek,
  addWeeks,
  isSameWeek
} from 'date-fns'

beforeEach(() => {
  expect.hasAssertions()
  console.error = jest.fn()
})

afterEach(cleanup)

describe('Methods', () => {
  describe('#getFormattedDate', () => {
    test('Formats state.date as \'MM/DD/YY\' by default when no arguments are given', () => {
      const {getFormattedDate} = setup().renderArgs
      const today = new Date()
      const defaultFormat = 'MM/DD/YY'
      expect(getFormattedDate()).toBe(format(today, defaultFormat))
    })

    test('Properly formats a date from the given format string', () => {
      const {date, getFormattedDate} = setup().renderArgs
      const dateFormats = ['MM/DD/YYYY', 'MMMM Do, YYYY', 'MMM Mo']

      dateFormats.forEach(df => {
        expect(getFormattedDate(df)).toBe(format(date, df))
        expect(getFormattedDate(date, df)).toBe(format(date, df))
      })
    })

    test('Throws an error when passed arguments are invalid', () => {
      const {date, getFormattedDate} = setup().renderArgs
      const invalidArgs = [1, null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => getFormattedDate(arg)).toThrow()
        expect(() => getFormattedDate(date, arg)).toThrow()
      })
    })
  })

  describe('#getDateNextMonth', () => {
    test('Adds 1 month to state.date when no arguments are given', () => {
      const {date, getFormattedDate, getDateNextMonth} = setup().renderArgs
      const nextMonth = getFormattedDate(getDateNextMonth())
      const actualNextMonth = getFormattedDate(addMonths(date, 1))
      expect(nextMonth).toBe(actualNextMonth)
    })

    test('Properly adds a given month to a date', () => {
      const {date, getFormattedDate, getDateNextMonth} = setup().renderArgs
      const threshold = 3
      let index = 0
      while (index < threshold) {
        const n = getRandomNum(10)
        const month = getFormattedDate(getDateNextMonth(n))
        const monthWithDate = getFormattedDate(getDateNextMonth(date, n))
        const actualMonth = getFormattedDate(addMonths(date, n))
        expect(month).toBe(actualMonth)
        expect(monthWithDate).toBe(actualMonth)
        index += 1
      }
    })

    test('Throws an error when passed arguments are invalid', () => {
      const {date, getDateNextMonth} = setup().renderArgs
      const invalidArgs = ['', null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => getDateNextMonth(arg)).toThrow()
        expect(() => getDateNextMonth(date, arg)).toThrow()
      })
    })
  })

  describe('#getDatePrevMonth', () => {
    test('Subtracts 1 month to state.date when no arguments are given', () => {
      const {date, getFormattedDate, getDatePrevMonth} = setup().renderArgs
      const prevMonth = getFormattedDate(getDatePrevMonth())
      const actualPrevMonth = getFormattedDate(subMonths(date, 1))
      expect(prevMonth).toBe(actualPrevMonth)
    })

    test('Properly subtracts a given month to a date', () => {
      const {date, getFormattedDate, getDatePrevMonth} = setup().renderArgs
      const threshold = 3
      let index = 0
      while (index < threshold) {
        const n = getRandomNum(10)
        const month = getFormattedDate(getDatePrevMonth(n))
        const monthWithDate = getFormattedDate(getDatePrevMonth(date, n))
        const actualMonth = getFormattedDate(subMonths(date, n))
        expect(month).toBe(actualMonth)
        expect(monthWithDate).toBe(actualMonth)
        index += 1
      }
    })

    test('Throws an error when passed arguments are invalid', () => {
      const {date, getDatePrevMonth} = setup().renderArgs
      const invalidArgs = ['', null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => getDatePrevMonth(arg)).toThrow()
        expect(() => getDatePrevMonth(date, arg)).toThrow()
      })
    })
  })

  describe('#getDaysInMonth', () => {
    test('Returns an array of days in the month of state.date if no arguments are given', () => {
      const {getFormattedDate, getDaysInMonth, date} = setup().renderArgs
      getDaysInMonth().forEach(day => {
        const {dateValue, label} = day
        expect(label).toEqual(getDate(dateValue))
        const theDay = getFormattedDate(dateValue)
        const theActualDay = getFormattedDate(setDate(date, label))
        expect(theDay).toBe(theActualDay)
      })
    })

    test('Properly returns an array of days in the month of the given date', () => {
      const {
        getFormattedDate,
        getDaysInMonth,
        getDateNextMonth,
        getDatePrevMonth
      } = setup().renderArgs

      const dice = getRandomNum(2)
      const num = getRandomNum(2)
      const date = (
        dice === 2
          ? getDateNextMonth(num)
          : getDatePrevMonth(num)
      )

      getDaysInMonth(date).forEach(day => {
        const {dateValue, label} = day
        const theDay = getFormattedDate(dateValue)
        const theActualDay = getFormattedDate(setDate(date, label))
        expect(theDay).toBe(theActualDay)
      })
    })

    test('Throws an error if the passed argument is not a Date', () => {
      const {getDaysInMonth} = setup().renderArgs
      const invalidArgs = ['', 1, null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => getDaysInMonth(arg)).toThrow()
      })
    })
  })

  describe('#getWeeksInMonth', () => {
    test('Returns an array of weeks for the month in state.date when no arguments are given', () => {
      const {getWeeksInMonth, date} = setup().renderArgs
      const firstDayOfMonth = startOfMonth(date)
      let weekOfMonth = startOfWeek(firstDayOfMonth)
      getWeeksInMonth().forEach(week => {
        expect(week).toBeInstanceOf(Array)
        week.forEach(day => {
          const {dateValue} = day
          expect(isSameWeek(dateValue, weekOfMonth)).toBe(true)
        })
        weekOfMonth = addWeeks(weekOfMonth, 1)
      })
    })

    test('Properly returns an array with weeks starting at a certain day', () => {
      const {getWeeksInMonth, date} = setup().renderArgs
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const dayIndex = getRandomNum(days.length - 1)
      const actualDay = days[dayIndex]
      getWeeksInMonth(date, dayIndex).forEach(week => {
        const {dateValue} = week[0]
        const day = format(dateValue, 'ddd').toLowerCase()
        expect(day).toBe(actualDay)
      })
    })

    test('Throws an error when arguments are invalid', () => {
      const {getWeeksInMonth, date} = setup().renderArgs
      const invalidArgs = ['', null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => getWeeksInMonth(arg)).toThrow()
        expect(() => getWeeksInMonth(date, arg)).toThrow()
      })
    })
  })

  describe('#getDayLabelsInWeek', () => {
    test('Returns the array of days on a week that starts on sunday by default', () => {
      const {getDayLabelsInWeek} = setup().renderArgs
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      getDayLabelsInWeek().forEach((dayOfWeek, i) => {
        const actualDayOfWeek = days[i]
        expect(dayOfWeek.toLowerCase()).toBe(actualDayOfWeek)
      })
    })

    test('Properly sets the starting day base on the given argument on props.startWeekAt', () => {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const startWeekAt = getRandomNum(days.length - 1)
      const actualFirstDayOfWeek = days[startWeekAt]
      const {getDayLabelsInWeek} = setup({startWeekAt}).renderArgs
      const firstDayOfWeek = getDayLabelsInWeek()[0].toLowerCase()
      expect(firstDayOfWeek).toBe(actualFirstDayOfWeek)
    })
  })

  describe('#setDate', () => {
    test('Properly updates state.date base on the given argument', () => {
      const today = new Date()
      const dice = getRandomNum(2)
      const num = getRandomNum(5)
      const date = dice === 2 ? addMonths(today, num) : subMonths(today, num)

      const layout = ({getFormattedDate, setDate}) => (
        <div>
          <button onClick={() => setDate(date)}>Click</button>
          <p data-testid="value">{getFormattedDate()}</p>
        </div>
      )

      const {getByText, getByTestId, renderArgs} = setup({render: layout})
      const {getFormattedDate} = renderArgs

      fireEvent.click(getByText('Click'))
      const actualDateText = getFormattedDate(date)
      const dateText = getByTestId('value').innerHTML
      expect(dateText).toBe(actualDateText)
    })

    test('Throws an error if the passed argument is not a Date', () => {
      const {setDate} = setup().renderArgs
      const invalidArgs = ['', 1, null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => setDate(arg)).toThrow()
      })
    })
  })

  describe('#setSelectedDate', () => {
    test('Properly updates state.selectedDate base on the given argument', () => {
      const today = new Date()
      const dice = getRandomNum(2)
      const num = getRandomNum(5)
      const date = dice === 2 ? addMonths(today, num) : subMonths(today, num)

      const layout = ({getFormattedDate, setSelectedDate, selectedDate}) => (
        <div>
          <button onClick={() => setSelectedDate(date)}>Click</button>
          <p data-testid="value">{getFormattedDate(selectedDate)}</p>
        </div>
      )

      const {getByText, getByTestId, renderArgs} = setup({render: layout})
      const {getFormattedDate} = renderArgs

      fireEvent.click(getByText('Click'))
      const actualDateText = getFormattedDate(date)
      const dateText = getByTestId('value').innerHTML
      expect(dateText).toBe(actualDateText)
    })

    test('Throws an error if the passed argument is not a Date', () => {
      const {setSelectedDate} = setup().renderArgs
      const invalidArgs = ['', 1, null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => setSelectedDate(arg)).toThrow()
      })
    })
  })

  describe('#pickDate', () => {
    test('Properly updates both state.date and state.selectedDate to a given value', () => {
      const today = new Date()
      const dice = getRandomNum(2)
      const num = getRandomNum(5)
      const date = dice === 2 ? addMonths(today, num) : subMonths(today, num)

      const layout = ({getFormattedDate, pickDate, selectedDate}) => (
        <div>
          <button onClick={() => pickDate(date)}>Click</button>
          <p data-testid="date">{getFormattedDate()}</p>
          <p data-testid="selected-date">{getFormattedDate(selectedDate)}</p>
        </div>
      )

      const {getByText, getByTestId, renderArgs} = setup({render: layout})
      const {getFormattedDate} = renderArgs

      fireEvent.click(getByText('Click'))
      const actualDateText = getFormattedDate(date)
      const dateText = getByTestId('date').innerHTML
      const selectedDateText = getByTestId('selected-date').innerHTML
      expect(dateText).toBe(actualDateText)
      expect(selectedDateText).toBe(actualDateText)
    })

    test('Throws an error if the passed argument is not a Date', () => {
      const {pickDate} = setup().renderArgs
      const invalidArgs = ['', 1, null, false, [], {}]
      invalidArgs.forEach(arg => {
        expect(() => pickDate(arg)).toThrow()
      })
    })
  })

  describe('#setDateNextMonth', () => {
    test('Properly updates state.date by 1 additional month', () => {
      const layout = ({getFormattedDate, setDateNextMonth}) => (
        <div>
          <button onClick={setDateNextMonth}>Click</button>
          <p data-testid="date">{getFormattedDate()}</p>
        </div>
      )

      const {getByText, getByTestId, renderArgs} = setup({render: layout})
      const {getFormattedDate, date} = renderArgs

      const threshold = getRandomNum(5)
      let num = 1
      const oldNum = num

      while (num < threshold) {
        fireEvent.click(getByText('Click'))
        num += 1
      }
      num = num === oldNum ? num : num - 1

      const dateText = getByTestId('date').innerHTML
      const actualDateText = getFormattedDate(addMonths(date, num))
      expect(dateText).toBe(actualDateText)
    })
  })

  describe('#setDatePrevMonth', () => {
    test('Properly updates state.date by 1 less month', () => {
      const layout = ({getFormattedDate, setDatePrevMonth}) => (
        <div>
          <button onClick={setDatePrevMonth}>Click</button>
          <p data-testid="date">{getFormattedDate()}</p>
        </div>
      )

      const {getByText, getByTestId, renderArgs} = setup({render: layout})
      const {getFormattedDate, date} = renderArgs

      const threshold = getRandomNum(5)
      let num = 1
      const oldNum = num

      while (num <= threshold) {
        fireEvent.click(getByText('Click'))
        num += 1
      }
      num = num === oldNum ? num : num - 1

      const dateText = getByTestId('date').innerHTML
      const actualDateText = getFormattedDate(subMonths(date, num))
      expect(dateText).toBe(actualDateText)
    })
  })
})

function setup ({ render: layout = () => <div />, ...props } = {}) {
  let renderArgs
  const renderSpy = jest.fn(props => {
    renderArgs = props
    return layout(props)
  })
  const utils = render(<Kalendaryo {...props} render={renderSpy} />)
  return {renderSpy, renderArgs, ...utils}
}

function getRandomNum (num) {
  return Math.ceil(Math.random() * num)
}
