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

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dateToDayObjects = function dateToDayObjects(dateValue) {
  return {
    dateValue: dateValue,
    label: (0, _dateFns.getDate)(dateValue),
    dayOfWeek: (0, _dateFns.getDay)(dateValue)
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
      date: _this.props.startingDate,
      selectedDate: _this.props.startingDate
    }, _this.getDate = function () {
      var dateFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.defaultFormat;
      var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) {
        throw new _utils.DateError();
      }

      return (0, _dateFns.format)(date, dateFormat);
    }, _this.getSelectedDate = function () {
      var dateFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.defaultFormat;
      return (0, _dateFns.format)(_this.state.selectedDate, dateFormat);
    }, _this.getMonth = function () {
      var dateFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'MMM';
      var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.state.date;

      if (!(0, _utils.isValidMonthFormat)(dateFormat)) {
        throw new _utils.DateMonthFormatError();
      }

      return _this.getDate(dateFormat, date);
    }, _this.getDateNextMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      return (0, _dateFns.addMonths)(date, 1);
    }, _this.getDatePrevMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      return (0, _dateFns.subMonths)(date, 1);
    }, _this.getDay = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      return (0, _dateFns.getDate)(date);
    }, _this.getDaysInMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      return (0, _dateFns.eachDay)((0, _dateFns.startOfMonth)(date), (0, _dateFns.endOfMonth)(date)).map(dateToDayObjects);
    }, _this.getWeeksInMonth = function () {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.date;

      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();

      var firstDayOfMonth = (0, _dateFns.startOfMonth)(date);
      var lastDayOfMonth = (0, _dateFns.endOfMonth)(date);
      var lastDayOfFirstWeek = (0, _dateFns.endOfWeek)(firstDayOfMonth);

      var getWeeks = function getWeeks(startDay, endDay) {
        var weekArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var week = (0, _dateFns.eachDay)(startDay, endDay).map(dateToDayObjects);
        var weeks = [].concat(_toConsumableArray(weekArray), [week]);
        var nextWeek = (0, _dateFns.addWeeks)(startDay, 1);

        var firstDayNextWeek = (0, _dateFns.startOfWeek)(nextWeek);
        var lastDayNextWeek = (0, _dateFns.endOfWeek)(nextWeek);

        var firstDayNextWeekIsInMonth = (0, _dateFns.isSameMonth)(firstDayNextWeek, date);
        var lastDayNextWeekIsInMonth = (0, _dateFns.isSameMonth)(lastDayNextWeek, date);

        if (firstDayNextWeekIsInMonth) {
          return getWeeks(firstDayNextWeek, lastDayNextWeekIsInMonth ? lastDayNextWeek : lastDayOfMonth, weeks);
        }

        return weeks;
      };

      return getWeeks(firstDayOfMonth, lastDayOfFirstWeek);
    }, _this.setDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      _this.setState({ date: date });
    }, _this.setSelectedDate = function (selectedDate) {
      if (!(0, _dateFns.isDate)(selectedDate)) throw new _utils.DateError();
      _this.setState({ selectedDate: selectedDate });
    }, _this.selectDate = function (date) {
      if (!(0, _dateFns.isDate)(date)) throw new _utils.DateError();
      _this.setState({ date: date, selectedDate: date });
    }, _this.isWithinRange = function (date1, date2) {
      if (!(0, _dateFns.isDate)(date1) || !(0, _dateFns.isDate)(date2)) {
        throw new _utils.DateError();
      }
      return (0, _dateFns.differenceInDays)(date1, date2) >= 0;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Kalendaryo, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(_, prevState) {
      var selectedDate = this.state.selectedDate;
      var onSelectedChange = this.props.onSelectedChange;


      var selectedDateChanged = !(0, _dateFns.isEqual)(prevState.selectedDate, selectedDate);

      if (selectedDateChanged && onSelectedChange) {
        onSelectedChange(selectedDate);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var state = this.state,
          props = this.props,
          methods = _objectWithoutProperties(this, ['state', 'props']);

      return this.props.render(_extends({}, state, methods));
    }
  }]);

  return Kalendaryo;
}(_react.Component);

Kalendaryo.defaultProps = {
  startingDate: new Date(),
  defaultFormat: 'MMM Do, YYYY'
};
Kalendaryo.propTypes = {
  render: _propTypes2.default.func.isRequired,
  onSelectedChange: _propTypes2.default.func,
  defaultFormat: _propTypes2.default.string,
  startingDate: function startingDate(props) {
    return !(0, _dateFns.isDate)(props.startingDate) ? new _utils.DateError() : null;
  }
};
exports.default = Kalendaryo;