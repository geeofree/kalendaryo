'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dateFns = require('date-fns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
function createDayObject(dateValue) {
  return {
    dateValue: dateValue,
    label: (0, _dateFns.getDate)(dateValue)
  };
}

/**
 * Throws an {Error} with a helpful link for misproperly used methods
 * @param {string} methodName - The name of the method that is being misproperly used
 * @throws {Error} Exception for misproperly used methods with a link for their proper use
 */
function misusageThrow(methodName) {
  throw new Error('Invalid usage of #' + methodName + '. ' + 'Please see https://github.com/geeofree/kalendaryo/#' + methodName.toLowerCase() + ' ' + 'to see the proper usage of this method.');
}

var Kalendaryo = function (_Component) {
  _inherits(Kalendaryo, _Component);

  function Kalendaryo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Kalendaryo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Kalendaryo.__proto__ || Object.getPrototypeOf(Kalendaryo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      /**
       * @state {Date} date
       * @description - State for the current date. Users should only modify this when their calendar
       * moves to and from a date i.e. changing the month or year of their calendar.
       * @default [new Date()]
       */
      date: (0, _dateFns.isDate)(_this.props.startCurrentDateAt) ? _this.props.startCurrentDateAt : new Date(),

      /**
       * @state {Date} selectedDate
       * @description - State for the selected date. Users should only modify this when their calendar
       * receives a user input such as click events for selecting a day on a calendar
       * @default [new Date()]
       */
      selectedDate: (0, _dateFns.isDate)(_this.props.startSelectedDateAt) ? _this.props.startSelectedDateAt : new Date()
    }, _this.getFormattedDate = function () {
      var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;
      var dateFormat = arguments[1];

      if ((0, _dateFns.isDate)(arg) && dateFormat === undefined) {
        return (0, _dateFns.format)(arg, _this.props.defaultFormat);
      }

      if (typeof arg === 'string' && dateFormat === undefined) {
        return (0, _dateFns.format)(_this.state.date, arg);
      }

      if ((0, _dateFns.isDate)(arg) && typeof dateFormat === 'string') {
        return (0, _dateFns.format)(arg, dateFormat);
      }

      misusageThrow('getFormattedDate');
    }, _this.getDateNextMonth = function () {
      var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;
      var amount = arguments[1];

      if ((0, _dateFns.isDate)(arg) && amount === undefined) {
        return (0, _dateFns.addMonths)(arg, 1);
      }

      if (Number.isInteger(arg) && amount === undefined) {
        return (0, _dateFns.addMonths)(_this.state.date, arg);
      }

      if ((0, _dateFns.isDate)(arg) && Number.isInteger(amount)) {
        return (0, _dateFns.addMonths)(arg, amount);
      }

      misusageThrow('getDateNextMonth');
    }, _this.getDatePrevMonth = function () {
      var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;
      var amount = arguments[1];

      if ((0, _dateFns.isDate)(arg) && amount === undefined) {
        return (0, _dateFns.subMonths)(arg, 1);
      }

      if (Number.isInteger(arg) && amount === undefined) {
        return (0, _dateFns.subMonths)(_this.state.date, arg);
      }

      if ((0, _dateFns.isDate)(arg) && Number.isInteger(amount)) {
        return (0, _dateFns.subMonths)(arg, amount);
      }

      misusageThrow('getDatePrevMonth');
    }, _this.getDaysInMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      return (0, _dateFns.eachDay)((0, _dateFns.startOfMonth)(date), (0, _dateFns.endOfMonth)(date)).map(createDayObject);
    }, _this.getWeeksInMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;
      var startingDayIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.startWeekAt;

      if (!(0, _dateFns.isDate)(date) || !Number.isInteger(startingDayIndex)) {
        misusageThrow('getWeeksInMonth');
      }

      var weekOptions = { weekStartsOn: startingDayIndex };
      var firstDayOfMonth = (0, _dateFns.startOfMonth)(date);
      var firstDayOfFirstWeek = (0, _dateFns.startOfWeek)(firstDayOfMonth, weekOptions);
      var lastDayOfFirstWeek = (0, _dateFns.endOfWeek)(firstDayOfMonth, weekOptions);

      var getWeeks = function getWeeks(startDay, endDay) {
        var weekArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var week = (0, _dateFns.eachDay)(startDay, endDay).map(createDayObject);
        var weeks = [].concat(_toConsumableArray(weekArray), [week]);
        var nextWeek = (0, _dateFns.addWeeks)(startDay, 1);

        var firstDayNextWeek = (0, _dateFns.startOfWeek)(nextWeek, weekOptions);
        var lastDayNextWeek = (0, _dateFns.endOfWeek)(nextWeek, weekOptions);

        if ((0, _dateFns.isSameMonth)(firstDayNextWeek, date)) {
          return getWeeks(firstDayNextWeek, lastDayNextWeek, weeks);
        }

        return weeks;
      };

      return getWeeks(firstDayOfFirstWeek, lastDayOfFirstWeek);
    }, _this.getDayLabelsInWeek = function () {
      var dayLabelFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ddd';

      var weekOptions = { weekStartsOn: _this.props.startingDayIndex };
      var firstDayOfMonth = (0, _dateFns.startOfMonth)(_this.state.date);
      var firstDayOfFirstWeek = (0, _dateFns.startOfWeek)(firstDayOfMonth, weekOptions);
      var lastDayOfFirstWeek = (0, _dateFns.endOfWeek)(firstDayOfMonth, weekOptions);

      return (0, _dateFns.eachDay)(firstDayOfFirstWeek, lastDayOfFirstWeek).map(function (d) {
        return (0, _dateFns.format)(d, dayLabelFormat);
      });
    }, _this.setDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      _this.setState({ date: date });
    }, _this.setSelectedDate = function (selectedDate) {
      if (!(0, _dateFns.isDate)(selectedDate)) throw new Error('Value is not an instance of Date');
      _this.setState({ selectedDate: selectedDate });
    }, _this.pickDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      _this.setState({ date: date, selectedDate: date });
    }, _this.setDateNextMonth = function () {
      _this.setDate(_this.getDateNextMonth());
    }, _this.setDatePrevMonth = function () {
      _this.setDate(_this.getDatePrevMonth());
    }, _this.getMethods = function () {
      return {
        getFormattedDate: _this.getFormattedDate,
        getDateNextMonth: _this.getDateNextMonth,
        getDatePrevMonth: _this.getDatePrevMonth,
        getDaysInMonth: _this.getDaysInMonth,
        getWeeksInMonth: _this.getWeeksInMonth,
        getDayLabelsInWeek: _this.getDayLabelsInWeek,
        setDate: _this.setDate,
        setSelectedDate: _this.setSelectedDate,
        pickDate: _this.pickDate,
        setDateNextMonth: _this.setDateNextMonth,
        setDatePrevMonth: _this.setDatePrevMonth
      };
    }, _this.getUnknownProps = function () {
      var _this$props = _this.props,
          startCurrentDateAt = _this$props.startCurrentDateAt,
          startSelectedDateAt = _this$props.startSelectedDateAt,
          defaultFormat = _this$props.defaultFormat,
          onChange = _this$props.onChange,
          onDateChange = _this$props.onDateChange,
          onSelectedChange = _this$props.onSelectedChange,
          render = _this$props.render,
          unknownProps = _objectWithoutProperties(_this$props, ['startCurrentDateAt', 'startSelectedDateAt', 'defaultFormat', 'onChange', 'onDateChange', 'onSelectedChange', 'render']);

      return unknownProps;
    }, _this.getRenderArguments = function () {
      return _extends({}, _this.state, _this.getMethods(), _this.getUnknownProps());
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * @typedef {Object} State - The interal data that can change on this component
   */


  /**
   * Formats a given {Date} base on the {string} format
   * @name getFormattedDate
   * @param {(Date|string)} [arg=this.state.date] - The date to format or a string for formatting
   * @param {string} [dateFormat] - String for formatting
   * @returns {string} - Formatted date string
   * @throws {Error} Exception when argument types are invalid
   * @see {@link https://date-fns.org/docs/format} for all the possible {String} formats
   */


  /**
   * Gets the {Date} of the month added by the given {number} amount of months
   * @name getDateNextMonth
   * @param {(Date|number)} [arg=this.state.date] - Date to be added or the amount of months to add
   * @param {number} amount - Amount of months to add on a date
   * @returns {Date} - A new date with the added months
   * @throws {Error} Exception when argument types are invalid
   */


  /**
   * Gets the {Date} of the month subtracted by the given {number} amount of months
   * @name getDatePrevMonth
   * @param {(Date|number)} [arg=this.state.date] - Date to be subtracted or the amount of months to subtract
   * @param {number} amount - Amount of months to subtract on a date
   * @returns {Date} - A new date with the subtracted months
   * @throws {Error} Exception when argument types are invalid
   */


  /**
   * Gets the days in a given month of a {Date}
   * @name getDaysInMonth
   * @param {Date} [date=this.state.date] - Date of the desired days in the month
   * @returns {DayObject[]} - The days in the month of the given date
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */


  /**
   * Gets the weeks in a given month of a {Date}
   * @name getWeeksInMonth
   * @param {Date} [date=this.state.date] - Date of the desired weeks in the month
   * @param {number[0..6]} [startingDayIndex=this.props.startWeekAt] - Starting day of the weeks
   * @returns {Week[DayObject[]]} - The weeks with their respective days of the given month in the date
   * @throws {Error} Exception when argument types are invalid
   */


  /**
   * Gets the labels of the days on a week
   * @name getDayLabelsInWeek
   * @param {string} [dayLabelFormat='ddd'] - Format of the day labels
   * @returns {string[]} - An array of each day on a week
   */


  /**
   * Updates the `date` state to a given {Date}
   * @name setDate
   * @param {Date} date - The new date value of the `date` state
   * @returns {void}
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */


  /**
   * Updates the `selectedDate` state to a given {Date}
   * @name setSelectedDate
   * @param {Date} selectedDate - The new date value of the `selectedDate` state
   * @returns {void}
   * @throws {Error} Exception when the `selectedDate` argument is not a {Date}
   */


  /**
   * Updates both the `date` and `selectedDate` states to a given {Date}
   * @name pickDate
   * @param {Date} date - The new date value of the `date` and `selectedDate` states
   * @returns {void}
   * @throws {Error} Exception when the `date` argument is not a {Date}
   */


  /**
   * Updates the `date` state by 1 month more
   * @name setDateNextMonth
   * @returns {void}
   */


  /**
   * Updates the `date` state by 1 month less
   * @name setDatePrevMonth
   * @returns {void}
   */


  _createClass(Kalendaryo, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(_, prevState) {
      var _props = this.props,
          onChange = _props.onChange,
          onDateChange = _props.onDateChange,
          onSelectedChange = _props.onSelectedChange;


      var dateChanged = !(0, _dateFns.isEqual)(prevState.date, this.state.date);
      var selectedDateChanged = !(0, _dateFns.isEqual)(prevState.selectedDate, this.state.selectedDate);
      var stateUpdated = dateChanged || selectedDateChanged;

      if (dateChanged && onDateChange) {
        onDateChange(this.state.date);
      }

      if (selectedDateChanged && onSelectedChange) {
        onSelectedChange(this.state.selectedDate);
      }

      if (stateUpdated && onChange) {
        onChange(this.state);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.render(this.getRenderArguments());
    }
  }]);

  return Kalendaryo;
}(_react.Component);

Kalendaryo.propTypes = {
  /**
   * @prop {string} defaultFormat
   * @description - Modifies the `getFormattedDate` method's date string format
   * @default ['MM/DD/YY']
   * @see {@link https://date-fns.org/docs/format} for all the possible string formats
   */
  defaultFormat: _propTypes2.default.string,

  /**
   * @prop {(Date|any)} startCurrentDateAt
   * @description - Modifies the initial state value of `date`
   * @note - If the given value is not a {Date}, the `date` state will default to today's date
   */
  startCurrentDateAt: _propTypes2.default.any,

  /**
   * @prop {(Date|any)} startSelectedDateAt
   * @description - Modifies the initial state value of `selectedDate`
   * @note - If the given value is not a {Date}, the `selectedDate` state will default to today's date
   */
  startSelectedDateAt: _propTypes2.default.any,

  /**
   * @prop {number[0..6]} startWeekAt
   * @description - Modifies the starting day of the weeks  on the `getWeeksInMonth` & `getDayLabelsInWeek` methods
   * @note - The values must be in the range of Sunday(0) to Saturday(6)
   * @default [0]
   */
  startWeekAt: _propTypes2.default.number,

  /**
   * @callback onChangeCallback
   * @prop {func} onChange
   * @param {State} state
   * @description - Callback Prop for listening to changes on the component's `state`
   * @returns {void}
   */
  onChange: _propTypes2.default.func,

  /**
   * @callback onDateChangeCallback
   * @prop {func} onDateChange
   * @param {Date} date
   * @description - Callback Prop for listening to changes only to the component's `date` state
   * @returns {void}
   */
  onDateChange: _propTypes2.default.func,

  /**
   * @callback onSelectedChangeCallback
   * @prop {func} onSelectedChange
   * @param {Date} selectedDate
   * @description - Callback Prop for listening to changes only to the component's `selectedDate` state
   * @returns {void}
   */
  onSelectedChange: _propTypes2.default.func,

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
  render: _propTypes2.default.func.isRequired
};
Kalendaryo.defaultProps = {
  startWeekAt: 0,
  defaultFormat: 'MM/DD/YY',
  startCurrentDateAt: new Date(),
  startSelectedDateAt: new Date() };
exports.default = Kalendaryo;