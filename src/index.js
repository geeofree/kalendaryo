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
  addWeeks,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns'

const dateToDayObjects = dateValue => ({
  dateValue,
  label: getDate(dateValue)
})

class Kalendaryo extends Component {
  state = {
    date: this.props.startCurrentDateAt,
    selectedDate: this.props.startCurrentDateAt
  }

  static defaultProps = {
    startCurrentDateAt: new Date(),
    defaultFormat: 'MM/DD/YY'
  }

  static propTypes = {
    render: pt.func.isRequired,
    onChange: pt.func,
    onDateChange: pt.func,
    onSelectedChange: pt.func,
    defaultFormat: pt.string,
    startCurrentDateAt: props =>
      !isDate(props.startCurrentDateAt) ? new Error('Value is not an instance of Date') : null
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
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    return eachDay(startOfMonth(date), endOfMonth(date)).map(dateToDayObjects)
  }

  getWeeksInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new Error('Value is not an instance of Date')

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
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    this.setState({ date })
  }

  setSelectedDate = selectedDate => {
    if (!isDate(selectedDate)) throw new Error('Value is not an instance of Date')
    this.setState({ selectedDate })
  }

  pickDate = date => {
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    this.setState({ date, selectedDate: date })
  }

  componentDidUpdate (_, prevState) {
    const { onChange, onDateChange, onSelectedChange } = this.props

    const dateChanged = !isEqualDates(prevState.date, this.state.date)
    const selectedDateChanged = !isEqualDates(prevState.selectedDate, this.state.selectedDate)
    const stateUpdated = dateChanged || selectedDateChanged

    if (dateChanged && onDateChange) {
      onDateChange(this.state.date)
    }

    if (selectedDateChanged && onSelectedChange) {
      onSelectedChange(this.state.selectedDate)
    }

    if (stateUpdated && onChange) {
      onChange(this.state)
    }
  }

  render () {
    const {
      state,
      props,
      getFormattedDate,
      getDateNextMonth,
      getDatePrevMonth,
      getDaysInMonth,
      getWeeksInMonth,
      setDate,
      setSelectedDate,
      pickDate
    } = this

    const {
      startCurrentDateAt,
      defaultFormat,
      onChange,
      onDateChange,
      onSelectedChange,
      render,
      ...rest
    } = props

    return render({
      ...rest,
      ...state,
      getFormattedDate,
      getDateNextMonth,
      getDatePrevMonth,
      getDaysInMonth,
      getWeeksInMonth,
      setDate,
      setSelectedDate,
      pickDate
    })
  }
}

export default Kalendaryo
