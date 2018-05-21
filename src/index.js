import { Component } from 'react'
import pt from 'prop-types'
import {
  format,
  addMonths,
  subMonths,
  isDate,
  getDate,
  isEqual as isEqualDates,
  startOfMonth,
  endOfMonth,
  eachDay,
  getDay,
  differenceInDays,
  addWeeks,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns'

import { isValidMonthFormat, DateMonthFormatError, DateError } from './utils'

const dateToDayObjects = dateValue => ({
  dateValue,
  label: getDate(dateValue),
  dayOfWeek: getDay(dateValue)
})

class Kalendaryo extends Component {
  state = {
    date: this.props.startingDate,
    selectedDate: this.props.startingDate
  }

  static defaultProps = {
    startingDate: new Date(),
    defaultFormat: 'MMM Do, YYYY'
  }

  static propTypes = {
    render: pt.func.isRequired,
    onSelectedChange: pt.func,
    defaultFormat: pt.string,
    startingDate: props =>
      !isDate(props.startingDate) ? new DateError() : null
  }

  getDate = (dateFormat = this.props.defaultFormat, date = this.state.date) => {
    if (!isDate(date)) {
      throw new DateError()
    }

    return format(date, dateFormat)
  }

  getSelectedDate = (dateFormat = this.props.defaultFormat) =>
    format(this.state.selectedDate, dateFormat)

  getMonth = (dateFormat = 'MMM', date = this.state.date) => {
    if (!isValidMonthFormat(dateFormat)) {
      throw new DateMonthFormatError()
    }

    return this.getDate(dateFormat, date)
  }

  getDateNextMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()
    return addMonths(date, 1)
  }

  getDatePrevMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()
    return subMonths(date, 1)
  }

  getDay = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()
    return getDate(date)
  }

  getDaysInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()
    return eachDay(startOfMonth(date), endOfMonth(date)).map(dateToDayObjects)
  }

  getWeeksInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()

    const firstDayOfMonth = startOfMonth(date)
    const lastDayOfMonth = endOfMonth(date)
    const lastDayOfFirstWeek = endOfWeek(firstDayOfMonth)

    const getWeeks = (startDay, endDay, weekArray = []) => {
      const week = eachDay(startDay, endDay).map(dateToDayObjects)
      const weeks = [...weekArray, week]
      const nextWeek = addWeeks(startDay, 1)

      const firstDayNextWeek = startOfWeek(nextWeek)
      const lastDayNextWeek = endOfWeek(nextWeek)

      const firstDayNextWeekIsInMonth = isSameMonth(firstDayNextWeek, date)
      const lastDayNextWeekIsInMonth = isSameMonth(lastDayNextWeek, date)

      if (firstDayNextWeekIsInMonth) {
        return getWeeks(
          firstDayNextWeek,
          lastDayNextWeekIsInMonth ? lastDayNextWeek : lastDayOfMonth,
          weeks
        )
      }

      return weeks
    }

    return getWeeks(firstDayOfMonth, lastDayOfFirstWeek)
  }

  setDate = date => {
    if (!isDate(date)) throw new DateError()
    this.setState({ date })
  }

  setSelectedDate = selectedDate => {
    if (!isDate(selectedDate)) throw new DateError()
    this.setState({ selectedDate })
  }

  selectDate = date => {
    if (!isDate(date)) throw new DateError()
    this.setState({ date, selectedDate: date })
  }

  isWithinRange = (date1, date2) => {
    if (!isDate(date1) || !isDate(date2)) {
      throw new DateError()
    }
    return differenceInDays(date1, date2) >= 0
  }

  componentDidUpdate (_, prevState) {
    const { selectedDate } = this.state
    const { onSelectedChange } = this.props

    const selectedDateChanged = !isEqualDates(
      prevState.selectedDate,
      selectedDate
    )

    if (selectedDateChanged && onSelectedChange) {
      onSelectedChange(selectedDate)
    }
  }

  render () {
    const { state, props, ...methods } = this
    return this.props.render({ ...state, ...methods })
  }
}

export default Kalendaryo
