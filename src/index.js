import { Component } from 'react'
import pt from 'prop-types'
import {
  format,
  addMonths,
  subMonths,
  isDate,
  getDate,
  isEqual as isEqualDates,
  isWithinRange,
  startOfMonth,
  endOfMonth,
  eachDay,
  getDay
} from 'date-fns'

import { isValidMonthFormat, DateMonthFormatError, DateError } from './utils'

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

    const dayObjects = dateValue => ({
      dateValue,
      label: getDate(dateValue),
      dayOfWeek: getDay(dateValue)
    })

    return eachDay(startOfMonth(date), endOfMonth(date)).map(dayObjects)
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

    return this.props.render({
      ...state,
      ...methods,
      isWithinRange
    })
  }
}

export default Kalendaryo
