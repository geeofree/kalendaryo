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

var dateToDayObjects = function dateToDayObjects(dateValue) {
  return {
    dateValue: dateValue,
    label: (0, _dateFns.getDate)(dateValue)
  };
};

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
      date: _this.props.startCurrentDateAt,
      selectedDate: _this.props.startCurrentDateAt
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

      throw new Error('Invalid arguments passed');
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

      throw new Error('Invalid arguments passed');
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

      throw new Error('Invalid arguments passed');
    }, _this.getDaysInMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      return (0, _dateFns.eachDay)((0, _dateFns.startOfMonth)(date), (0, _dateFns.endOfMonth)(date)).map(dateToDayObjects);
    }, _this.getWeeksInMonth = function () {
      var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;
      var weekStartsOn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.startWeekAt;

      if (!(0, _dateFns.isDate)(arg) && !Number.isInteger(arg)) {
        throw new Error('First argument must be a date or an integer');
      }

      if (!Number.isInteger(weekStartsOn)) {
        throw new Error('Second argument must be an integer');
      }

      var weekOptions = { weekStartsOn: weekStartsOn };
      var firstDayOfMonth = (0, _dateFns.startOfMonth)(arg);
      var firstDayOfFirstWeek = (0, _dateFns.startOfWeek)(firstDayOfMonth, weekOptions);
      var lastDayOfFirstWeek = (0, _dateFns.endOfWeek)(firstDayOfMonth, weekOptions);

      var getWeeks = function getWeeks(startDay, endDay) {
        var weekArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var week = (0, _dateFns.eachDay)(startDay, endDay).map(dateToDayObjects);
        var weeks = [].concat(_toConsumableArray(weekArray), [week]);
        var nextWeek = (0, _dateFns.addWeeks)(startDay, 1);

        var firstDayNextWeek = (0, _dateFns.startOfWeek)(nextWeek, weekOptions);
        var lastDayNextWeek = (0, _dateFns.endOfWeek)(nextWeek, weekOptions);

        if ((0, _dateFns.isSameMonth)(firstDayNextWeek, arg)) {
          return getWeeks(firstDayNextWeek, lastDayNextWeek, weeks);
        }

        return weeks;
      };

      return getWeeks(firstDayOfFirstWeek, lastDayOfFirstWeek);
    }, _this.setDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      _this.setState({ date: date });
    }, _this.setSelectedDate = function (selectedDate) {
      if (!(0, _dateFns.isDate)(selectedDate)) throw new Error('Value is not an instance of Date');
      _this.setState({ selectedDate: selectedDate });
    }, _this.pickDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new Error('Value is not an instance of Date');
      _this.setState({ date: date, selectedDate: date });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

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
      var state = this.state,
          props = this.props,
          getFormattedDate = this.getFormattedDate,
          getDateNextMonth = this.getDateNextMonth,
          getDatePrevMonth = this.getDatePrevMonth,
          getDaysInMonth = this.getDaysInMonth,
          getWeeksInMonth = this.getWeeksInMonth,
          setDate = this.setDate,
          setSelectedDate = this.setSelectedDate,
          pickDate = this.pickDate;

      var startCurrentDateAt = props.startCurrentDateAt,
          defaultFormat = props.defaultFormat,
          onChange = props.onChange,
          onDateChange = props.onDateChange,
          onSelectedChange = props.onSelectedChange,
          render = props.render,
          rest = _objectWithoutProperties(props, ['startCurrentDateAt', 'defaultFormat', 'onChange', 'onDateChange', 'onSelectedChange', 'render']);

      return render(_extends({}, rest, state, {
        getFormattedDate: getFormattedDate,
        getDateNextMonth: getDateNextMonth,
        getDatePrevMonth: getDatePrevMonth,
        getDaysInMonth: getDaysInMonth,
        getWeeksInMonth: getWeeksInMonth,
        setDate: setDate,
        setSelectedDate: setSelectedDate,
        pickDate: pickDate
      }));
    }
  }]);

  return Kalendaryo;
}(_react.Component);

Kalendaryo.defaultProps = {
  startWeekAt: 0,
  startCurrentDateAt: new Date(),
  defaultFormat: 'MM/DD/YY'
};
Kalendaryo.propTypes = {
  render: _propTypes2.default.func.isRequired,
  onChange: _propTypes2.default.func,
  onDateChange: _propTypes2.default.func,
  onSelectedChange: _propTypes2.default.func,
  startWeekAt: _propTypes2.default.number,
  defaultFormat: _propTypes2.default.string,
  startCurrentDateAt: function startCurrentDateAt(props) {
    return !(0, _dateFns.isDate)(props.startCurrentDateAt) ? new Error('Value is not an instance of Date') : null;
  }
};
exports.default = Kalendaryo;