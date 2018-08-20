import {Component} from 'react'
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

/**
 * @typedef {Object} DayObject - Represents the metadata of a "day"
 * @property {Date} dateValue - The value of a day's date
 * @property {number} label - The day's numerical label
 */

/**
 * Factory function for creating a {DayObject}
 * @param {Date} dateValue
 * @returns {DayObject}
 */
function createDayObject (dateValue) {
  return {
    dateValue,
    label: getDate(dateValue)
  }
}

/**
 * Throws an {Error} with a helpful link for misproperly used methods
 * @param {string} methodName - The name of the method that is being misproperly used
 * @throws {Error} Exception for misproperly used methods with a link for their proper use
 */
function misusageThrow (methodName) {
  throw new Error(
    'Invalid usage of #' + methodName + '. ' +
    'Please see https://github.com/geeofree/kalendaryo/#' + methodName.toLowerCase() + ' ' +
    'to see the proper usage of this method.'
  )
}

class Kalendaryo extends Component {
  /**
   * @typedef {Object} State - The interal data that can change on this component
   */
  state = {
    /**
     * @state {Date} date
     * @description - State for the current date. Users should only modify this when their calendar
     * moves to and from a date i.e. changing the month or year of their calendar.
     * @default [new Date()]
     */
    date: isDate(this.props.startCurrentDateAt) ? this.props.startCurrentDateAt : new Date(),

    /**
     * @state {Date} selectedDate
     * @description - State for the selected date. Users should only modify this when their calendar
     * receives a user input such as click events for selecting a day on a calendar
     * @default [new Date()]
     */
    selectedDate: isDate(this.props.startSelectedDateAt) ? this.props.startSelectedDateAt : new Date()
  }

  static propTypes = {
    /**
     * @prop {string} defaultFormat
     * @description - Modifies the `getFormattedDate` method's date string format
     * @default ['MM/DD/YY']
     * @see {@link https://date-fns.org/docs/format} for all the possible string formats
     */
    defaultFormat: pt.string,

    /**
     * @prop {(Date|any)} startCurrentDateAt
     * @description - Modifies the initial state value of `date`
     * @note - If the given value is not a {Date}, the `date` state will default to today's date
     */
    startCurrentDateAt: pt.any,

    /**
     * @prop {(Date|any)} startSelectedDateAt
     * @description - Modifies the initial state value of `selectedDate`
     * @note - If the given value is not a {Date}, the `selectedDate` state will default to today's date
     */
    startSelectedDateAt: pt.any,

    /**
     * @prop {number[0..6]} startWeekAt
     * @description - Modifies the starting day week of the month for the `getWeeksInMonth` method
     * @note - The values must be in the range of Sunday(0) to Saturday(6)
     * @default [0]
     */
    startWeekAt: pt.number,

    /**
     * @callback onChangeCallback
     * @prop {func} onChange
     * @param {State} state
     * @description - Callback Prop for listening to changes on the component's `state`
     * @returns {void}
     */
    onChange: pt.func,

    /**
     * @callback onDateChangeCallback
     * @prop {func} onDateChange
     * @param {Date} date
     * @description - Callback Prop for listening to changes only to the component's `date` state
     * @returns {void}
     */
    onDateChange: pt.func,

    /**
     * @callback onSelectedChangeCallback
     * @prop {func} onSelectedChange
     * @param {Date} selectedDate
     * @description - Callback Prop for listening to changes only to the component's `selectedDate` state
     * @returns {void}
     */
    onSelectedChange: pt.func,

    /**
     * @required
     * @callback renderPropCallback
     * @prop {func} render
     * @param {Date} date
     * @param {Date} selectedDate
     * @param {func} getFormattedDate
     * @param {func} getDateNextMonth
     * @param {func} getDatePrevMonth
     * @param {func} getDaysInMonth
     * @param {func} getWeeksInMonth
     * @param {func} setDate
     * @param {func} setSelectedDate
     * @param {func} pickDate
     * @param {any} [...unknownProps]
     * @description - Callback prop responsible for rendering the calendar's layout and functionality.
     * Receives both the `date` and `selectedDate` states, all of the component's methods, as well
     * as any unknown props given to the component
     * @returns {?ReactElement}
     */
    render: pt.func.isRequired
  }

  static defaultProps = {
    startWeekAt: 0,
    defaultFormat: 'MM/DD/YY',
    startCurrentDateAt: new Date(),
    startSelectedDateAt: new Date()
  }

  /**
   * Formats a given {Date} base on the {string} format
   * @name getFormattedDate
   * @param {(Date|string)} [arg=this.state.date] - The date to format or a string for formatting
   * @param {string} [dateFormat] - String for formatting
   * @returns {string} - Formatted date string
   * @throws {Error} Exception when argument types are invalid
   * @see {@link https://date-fns.org/docs/format} for all the possible {String} formats
   */
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

    misusageThrow('getFormattedDate')
  }

  /**
   * Gets the {Date} of the month added by the given {number} amount of months
   * @name getDateNextMonth
   * @param {(Date|number)} [arg=this.state.date] - Date to be added or the amount of months to add
   * @param {number} amount - Amount of months to add on a date
   * @returns {Date} - A new date with the added months
   * @throws {Error} Exception when argument types are invalid
   */
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

    misusageThrow('getDateNextMonth')
  }

  /**
   * Gets the {Date} of the month subtracted by the given {number} amount of months
   * @name getDatePrevMonth
   * @param {(Date|number)} [arg=this.state.date] - Date to be subtracted or the amount of months to subtract
   * @param {number} amount - Amount of months to subtract on a date
   * @returns {Date} - A new date with the subtracted months
   * @throws {Error} Exception when argument types are invalid
   */
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

    misusageThrow('getDatePrevMonth')
  }

  /**
   * Gets the days in a given month of a {Date}
   * @name getDaysInMonth
   * @param {Date} [date=this.state.date] - Date of the desired days in the month
   * @returns {DayObject[]} - The days in the month of the given date
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */
  getDaysInMonth = (date = this.state.date) => {
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    return eachDay(startOfMonth(date), endOfMonth(date)).map(createDayObject)
  }

  /**
   * Gets the weeks in a given month of a {Date}
   * @name getWeeksInMonth
   * @param {Date} [date=this.state.date] - Date of the desired weeks in the month
   * @param {number[0..6]} [startingDayIndex=this.props.startWeekAt] - Starting day of the weeks
   * @returns {Week[DayObject[]]} - The weeks with their respective days of the given month in the date
   * @throws {Error} Exception when argument types are invalid
   */
  getWeeksInMonth = (date = this.state.date, startingDayIndex = this.props.startWeekAt) => {
    if (!isDate(date) || !Number.isInteger(startingDayIndex)) {
      misusageThrow('getWeeksInMonth')
    }

    const weekOptions = { weekStartsOn: startingDayIndex }
    const firstDayOfMonth = startOfMonth(date)
    const firstDayOfFirstWeek = startOfWeek(firstDayOfMonth, weekOptions)
    const lastDayOfFirstWeek = endOfWeek(firstDayOfMonth, weekOptions)

    const getWeeks = (startDay, endDay, weekArray = []) => {
      const week = eachDay(startDay, endDay).map(createDayObject)
      const weeks = [...weekArray, week]
      const nextWeek = addWeeks(startDay, 1)

      const firstDayNextWeek = startOfWeek(nextWeek, weekOptions)
      const lastDayNextWeek = endOfWeek(nextWeek, weekOptions)

      if (isSameMonth(firstDayNextWeek, date)) {
        return getWeeks(firstDayNextWeek, lastDayNextWeek, weeks)
      }

      return weeks
    }

    return getWeeks(firstDayOfFirstWeek, lastDayOfFirstWeek)
  }

  /**
   * Gets the labels of the days on a week
   * @name getDayLabelsInWeek
   * @param {string} [dayLabelFormat='ddd'] - Format of the day labels
   * @returns {string[]} - An array of each day on a week
   */
  getDayLabelsInWeek = (dayLabelFormat = 'ddd') => {
    const weekOptions = { weekStartsOn: this.props.startingDayIndex }
    const firstDayOfMonth = startOfMonth(this.state.date)
    const firstDayOfFirstWeek = startOfWeek(firstDayOfMonth, weekOptions)
    const lastDayOfFirstWeek = endOfWeek(firstDayOfMonth, weekOptions)

    return eachDay(firstDayOfFirstWeek, lastDayOfFirstWeek).map(d => format(d, dayLabelFormat))
  }

  /**
   * Updates the `date` state to a given {Date}
   * @name setDate
   * @param {Date} date - The new date value of the `date` state
   * @returns {void}
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */
  setDate = date => {
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    this.setState({ date })
  }

  /**
   * Updates the `selectedDate` state to a given {Date}
   * @name setSelectedDate
   * @param {Date} selectedDate - The new date value of the `selectedDate` state
   * @returns {void}
   * @throws {Error} Exception when the `selectedDate` argument is not a {Date}
   */
  setSelectedDate = selectedDate => {
    if (!isDate(selectedDate)) throw new Error('Value is not an instance of Date')
    this.setState({ selectedDate })
  }

  /**
   * Updates both the `date` and `selectedDate` states to a given {Date}
   * @name pickDate
   * @param {Date} date - The new date value of the `date` and `selectedDate` states
   * @returns {void}
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */
  pickDate = date => {
    if (!isDate(date)) throw new Error('Value is not an instance of Date')
    this.setState({ date, selectedDate: date })
  }

  /**
   * Updates the `date` state by 1 month more
   * @name setDateNextMonth
   * @returns {void}
   */
  setDateNextMonth = () => {
    this.setDate(this.getDateNextMonth())
  }

  /**
   * Updates the `date` state by 1 month less
   * @name setDatePrevMonth
   * @returns {void}
   */
  setDatePrevMonth = () => {
    this.setDate(this.getDatePrevMonth())
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

  getMethods = () => ({
    getFormattedDate: this.getFormattedDate,
    getDateNextMonth: this.getDateNextMonth,
    getDatePrevMonth: this.getDatePrevMonth,
    getDaysInMonth: this.getDaysInMonth,
    getWeeksInMonth: this.getWeeksInMonth,
    getDayLabelsInWeek: this.getDayLabelsInWeek,
    setDate: this.setDate,
    setSelectedDate: this.setSelectedDate,
    pickDate: this.pickDate,
    setDateNextMonth: this.setDateNextMonth,
    setDatePrevMonth: this.setDatePrevMonth
  })

  getUnknownProps = () => {
    const {
      startCurrentDateAt,
      startSelectedDateAt,
      defaultFormat,
      onChange,
      onDateChange,
      onSelectedChange,
      render,
      ...unknownProps
    } = this.props

    return unknownProps
  }

  getRenderArguments = () => ({
    ...this.state,
    ...this.getMethods(),
    ...this.getUnknownProps()
  })

  render () {
    return this.props.render(this.getRenderArguments())
  }
}

export default Kalendaryo
