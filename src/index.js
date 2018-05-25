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
  isWithinRange,
  differenceInDays,
  addWeeks,
  startOfWeek,
  endOfWeek,
  isSameYear,
  isSameMonth
} from 'date-fns'

import { DateError } from './utils'

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
    defaultFormat: 'MM/DD/YY'
  }

  static propTypes = {
    render: pt.func.isRequired,
    onChange: pt.func,
    defaultFormat: pt.string,
    startingDate: props =>
      !isDate(props.startingDate) ? new DateError() : null
  }

  getFormattedDate = (arg = this.state.date, dateFormat) => {
    if (isDate(arg) && dateFormat === undefined) {
      return format(arg, this.props.defaultFormat)
    }

    if (typeof arg === 'string' && dateFormat === undefined) {
      return format(this.state.date, arg)
    }

    if (isDate(arg) && typeof dateFormat === 'string') {
      return format(arg, dateFormat)
    }

    throw new Error('Invalid arguments passed')
  }

  getDateNextMonth = (arg = this.state.date, amount) => {
    if (isDate(arg) && amount === undefined) {
      return addMonths(arg, 1)
    }

    if (Number.isInteger(arg) && amount === undefined) {
      return addMonths(this.state.date, arg)
    }

    if (isDate(arg) && Number.isInteger(amount)) {
      return addMonths(arg, amount)
    }

    throw new Error('Invalid arguments passed')
  }

  getDatePrevMonth = (arg = this.state.date, amount) => {
    if (isDate(arg) && amount === undefined) {
      return subMonths(arg, 1)
    }

    if (Number.isInteger(arg) && amount === undefined) {
      return subMonths(this.state.date, arg)
    }

    if (isDate(arg) && Number.isInteger(amount)) {
      return subMonths(arg, amount)
    }

    throw new Error('Invalid arguments passed')
  }

  getDaysInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()
    return eachDay(startOfMonth(date), endOfMonth(date)).map(dateToDayObjects)
  }

  getWeeksInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new DateError()

    const firstDayOfMonth = startOfMonth(date)
    const firstDayOfFirstWeek = startOfWeek(firstDayOfMonth)
    const lastDayOfFirstWeek = endOfWeek(firstDayOfMonth)

    const getWeeks = (startDay, endDay, weekArray = []) => {
      const week = eachDay(startDay, endDay).map(dateToDayObjects)
      const weeks = [...weekArray, week]
      const nextWeek = addWeeks(startDay, 1)

      const firstDayNextWeek = startOfWeek(nextWeek)
      const lastDayNextWeek = endOfWeek(nextWeek)

      if (isSameMonth(firstDayNextWeek, date)) {
        return getWeeks(firstDayNextWeek, lastDayNextWeek, weeks)
      }

      return weeks
    }

    return getWeeks(firstDayOfFirstWeek, lastDayOfFirstWeek)
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

  dateIsInRange = (date, startDate, endDate) => {
    if (!isDate(date) || !isDate(startDate) || !isDate(endDate)) {
      throw new DateError()
    }
    return differenceInDays(startDate, endDate) < 1
      ? isWithinRange(date, startDate, endDate)
      : false
  }

  isHighlightedDay = (day) => {
    if (Number.isInteger(day) === false) {
      throw new Error('Not a valid number')
    }
    return getDate(this.state.selectedDate) === day
  }

  isSelectedDay = (day) => {
    const { date, selectedDate } = this.state
    return (
      isSameMonth(date, selectedDate) &&
      isSameYear(date, selectedDate) &&
      this.isHighlightedDay(day)
    )
  }

  componentDidUpdate (_, prevState) {
    const { onChange } = this.props

    const dateChanged = !isEqualDates(prevState.date, this.state.date)
    const selectedDateChanged = !isEqualDates(prevState.selectedDate, this.state.selectedDate)
    const stateUpdated = dateChanged || selectedDateChanged

    if (stateUpdated && onChange) {
      onChange(this.state)
    }
  }

  render () {
    const { state, props, ...methods } = this
    return this.props.render({ ...state, ...methods })
  }
}

export default Kalendaryo
