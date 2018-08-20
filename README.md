# kalendaryo
[![Coverage Status][coveralls-badge]][coveralls]
[![Build Status][travis-badge]][travis]
[![npm][npm-badge]][npm]
[![npm][npm-dl-badge]][npm]
![license][mit]

Build flexible react date components using primitives :atom_symbol: + :date:fns

## Problem
You want a date component that's: <br />
  :heavy_check_mark: Laid out the way you want <br />
  :heavy_check_mark: Functions the way you want <br />
  :heavy_check_mark: Flexible for your use case <br />

## This solution
**Kalendaryo** is an unopinionated React component for building calendars. It has no opinions about what your calendar component should look or function like but rather only helps you deal with those unique constraints by providing various variables your calendar component needs such as the calendar's state data and methods for getting(*i.e. all the days in a month*) and setting(*i.e. selecting the date from a day*) plus many more!
<br /> <br />
See the [Basic Usage](#basic-usage) section to see how you can build a basic calendar component with **Kalendaryo**, or see the [Examples](#examples) section to see more examples built with Kalendaryo.

<hr />

## Table of Contents
* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [API](#api)
  * [State](#state)
    * [#date](#date)
    * [#selectedDate](#selecteddate)
  * [Props](#props)
    * [#startCurrentDateAt](#startcurrentdateat)
    * [#startSelectedDateAt](#startselecteddateat)
    * [#defaultFormat](#defaultformat)
    * [#startWeekAt](#startweekat)
    * [#onChange](#onchange)
    * [#onDateChange](#ondatechange)
    * [#onSelectedChange](#onselectedchange)
    * [#render](#render)
    * [Passing variables to the render prop](#passing-variables-to-the-render-prop)
  * [Methods](#methods)
    * [#getFormattedDate](#getformatteddate)
    * [#getDateNextMonth](#getdatenextmonth)
    * [#getDatePrevMonth](#getdateprevmonth)
    * [#getDaysInMonth](#getdaysinmonth)
    * [#getWeeksInMonth](#getweeksinmonth)
    * [#setDate](#setdate)
    * [#setSelectedDate](#setselecteddate)
    * [#pickDate](#pickdate)
* [Examples](#examples)
* [Inspiration](#inspiration)

## Installation
*This package expects you to have `>= react@0.14.x`*

```js
npm i -d kalendaryo // <-- for npm peeps
yarn add kalendaryo // <-- for yarn peeps
```

## Basic Usage
```jsx
// Step 1: Import the component
import Kalendaryo from 'kalendaryo'

// Step 2: Invoke and pass your desired calendar as a function in the render prop
const BasicCalendar = () => <Kalendaryo render={MyCalendar} />

// Step 3: Build your calendar!
function MyCalendar(kalendaryo) {
  const {
    getFormattedDate,
    getWeeksInMonth,
    getDatePrevMonth,
    getDateNextMonth,
    setSelectedDate,
    setDate
  } = kalendaryo

  const currentDate = getFormattedDate("MMMM YYYY")
  const weeksInCurrentMonth = getWeeksInMonth()

  const setDateNextMonth = () => setDate(getDateNextMonth())
  const setDatePrevMonth = () => setDate(getDatePrevMonth())
  const selectDay = date => () => setSelectedDate(date)

  /* For this basic example we're going to build a calendar that has:
   *  1. A header where you have:
   *      1.1 Controls for moving to the previous/next month of the current date
   *      1.2 A label for current month & year of the current date
   *  2. A body where you have:
   *      2.1 A row for the label of the days of a week
   *      2.2 Rows containing the days of each week in the current date's month where you can:
   *          2.2.1 Select a date by clicking on a day
   */
  return (
    <div className="my-calendar">
      // (1)
      <div className="my-calendar-header">
        // (1.1)
        <button onClick={setDatePrevMonth}>&larr;</button>

        // (1.2)
        <span className="text-white">{currentDate}</span>

        // (1.1)
        <button onClick={setDateNextMonth}>&rarr;</button>
      </div>

      // (2)
      <div className="my-calendar-body">
        // (2.1)
        <div className="week day-labels">
          <div className="day">Sun</div>
          <div className="day">Mon</div>
          <div className="day">Tue</div>
          <div className="day">Wed</div>
          <div className="day">Thu</div>
          <div className="day">Fri</div>
          <div className="day">Sat</div>
        </div>

        // (2.2)
        {weeksInCurrentMonth.map((week, i) => (
          <div className="week" key={i}>
            {week.map(day => (
              <div
                key={day.label}
                // (2.2.1)
                onClick={selectDay(day.dateValue)}
              >
                {day.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

See this basic usage snippet in action [here](https://codesandbox.io/s/vjkq15zj0y)!

## API
This section contains descriptions of the various things the `<Kalendaryo />` component has to offer which are split into three parts:

  * `state`: Description of the component's state that could change
  * `props`: Description of the component's props that you can change or hook into
  * `methods`: Description of the component's various helper methods you can use from the [render](#render) prop

### State
#### #date
<pre>
<b>type:</b> Date
<b>default:</b> new Date()
</pre>

Is the state for the *current date* the component is in. By convention, this should only change when the calendar changes its current date, *i.e.* moving to and from a month or year on the calendar.
<br /><br />

#### #selectedDate
<pre>
<b>type:</b> Date
<b>default:</b> new Date()
</pre>

Is the state for the *selected date* on the component. By convention, this should only change when the calendar receives a date selection input from the user, *i.e.* selecting a day on the calendar.
<br/></br>

### Props
#### #startCurrentDateAt
<pre>
<b>type:</b> Date
<b>required:</b> false
<b>default:</b> new Date()
</pre>

Modifies the initial value of [`#date`](#date). Great for when you want your calendar to boot up in some date other than today.

**Note:** Passing non-`Date` types to this prop sets the [`#date`](#date) state to today.

```jsx
const birthday = new Date(1995, 4, 27)

<Kalendaryo startCurrentDateAt={birthday} />
```
<br/>

#### #startSelectedDateAt
<pre>
<b>type:</b> Date
<b>required:</b> false
<b>default:</b> new Date()
</pre>

Modifies the initial value of [`#selectedDate`](#selecteddate). Great for when you want your calendar's selected date to boot up in another date than today.

**Note:** Passing non-`Date` types to this prop sets the [`#selectedDate`](#selecteddate) state to today.

```jsx
const birthday = new Date(1988, 4, 27)

<Kalendaryo startSelectedDateAt={birthday} />
```
<br/>

#### #defaultFormat
<pre>
<b>type:</b> String
<b>required:</b> false
<b>default:</b> 'MM/DD/YY'
</pre>

Modifies the default format value on the [`#getFormattedDate`](#getformatteddate) method. Accepts any format that [date-fns' `format` function](https://date-fns.org/docs/format) can support.

```jsx
const myFormat = 'yyyy-mm-dd'

<Kalendaryo defaultFormat={myFormat} />
```
<br/>

#### #startWeekAt
<pre>
<b>type:</b> Number[0..6]
<b>required:</b> false
<b>default:</b> 0
</pre>

Modifies the starting day index of the weeks returned from [`#getWeeksInMonth`](#getweeksinmonth). Defaults to `0 (sunday)`

```jsx
const monday = 1

<Kalendaryo startWeekAt={monday} />
```
<br/>

#### #onChange
<pre>
<b>type:</b> func(state: Object): void
<b>required:</b> false
</pre>

Callback prop for listening to state changes on the [`#date`](#date) & [`#selectedDate`](#selecteddate) states.

```jsx
const logState = (state) => console.log(state)

<Kalendaryo onChange={logState}/>
```
<br />

#### #onDateChange
<pre>
<b>type:</b> func(date: Date): void
<b>required:</b> false
</pre>

Callback prop for listening to state changes only to the [`#date`](#date) state.

```jsx
const logDateState = (date) => console.log(date)

<Kalendaryo onDateChange={logDateState} />
```
<br />

#### #onSelectedChange
<pre>
<b>type:</b> func(date: Date): void
<b>required:</b> false
</pre>

Callback prop for listening to state changes only to the [`#selectedDate`](#selecteddate) state.

```jsx
const logSelectedDateState = (selectedDate) => console.log(selectedDate)

<Kalendaryo onSelectedChange={logSelectedDateState} />
```
<br />

#### #render
<pre>
<b>type:</b> func(props: Object): void
<b>required:</b> true
</pre>

Callback prop responsible for rendering the date component. This function receives an object which has the [`state`](#state), [`methods`](#methods), as well as props you pass that are invalid(see [passing variables to the render prop](#passing-variables-to-the-render-prop) for more information).

```jsx
const MyCalendar = (kalendaryo) => {
  console.log(kalendaryo)
  return <p>Some layout</p>
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### Passing variables to the render prop
Sometimes you may need to have states other than the [`#date`](#date) and [`#selectedDate`](#selectedDate) state, *i.e* for a date range calendar component, you may need to have a state for its `startDate` and `endDate` and may need to create the calendar component as a method inside the date range calendar's class like so:

```jsx
class DateRangeCalendar extends React.Component {
  state = {
    startDate: null,
    endDate: null
  }

  Calendar = (props) => {
    const { startDate, endDate } = this.state
    return // Your calendar layout
  }

  setDateRange = (selectedDate) => {
    // Logic for updating the start and end date states
  }

  render() {
    return <Kalendaryo onSelectedChange={this.setDateRange} render={this.Calendar} />
  }
}
```

This however, leaves the `Calendar` component tightly coupled to the `DateRangeCalendar` component and makes it a little bit harder for us to keep track of what's going on with what.

*If only we could separate the `DateRangeCalendar`'s state logic and `Calendar`'s UI rendering*

To solve this, the `Kalendaryo` component can receive **unknown props**. These are props that gets passed to the `render` prop callback when it does not convey any meaning to the `Kalendaryo` component.

With **unknown props** we can pass any arbitrary variable to `Kalendaryo` as long as it does not know what to do with it *i.e.* the `startDate` and `endDate` states. We would then have no need to put the `Calendar` function inside of the `DateRangeCalendar` class since the states are now an injected dependency to the `Calendar` *e.g*

```jsx
class DateRangeCalendar extends React.Component {
  state = {
    startDate: null,
    endDate: null
  }

  setDateRange = (selectedDate) => {
    // Logic for updating the start and end date states
  }

  render() {
    return (
      <Kalendaryo
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onSelectedChange={this.setDateRange}
        render={Calendar}
      />
    )
  }
}

function Calendar(props) {
  const { startDate, endDate } = props
  return // Your calendar component
}
```

With this, the `Calendar` and `DateRangeCalendar` are now separated to the things they're solely responsible for.
<br /><br />

### Methods
#### #getFormattedDate
<pre>
<b>type:</b> func(date?: Date | format?: String, format?: String): String
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Returns the date formatted by the given format string. You can invoke this in four ways:
  * `getFormattedDate()` - Returns the [`#date`](#date) state formatted as the value set on the [`#defaultFormat`](#defaultformat) prop

  * `getFormattedDate(date)` - Returns the given *date argument* formatted as the value set on the [`#defaultFormat`](#defaultformat) prop

  * `getFormattedDate(format)` - Returns the [`#date`](#date) state formatted to the given *format string argument*

  * `getFormattedDate(date, format)` - Returns the given *date argument* formatted to the given *format string argument*

```jsx
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const myFormattedDate = kalendaryo.getFormattedDate(birthday, 'yyyy-mm-dd')

  return <p>My birthday is at {myFormattedDate}</p>
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #getDateNextMonth
<pre>
<b>type:</b> func(date?: Date | amount?: Number, amount?: Number): Date
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Returns a date with months added from the given amount. You can invoke this in four ways:
  * `getDateNextMonth()` - Returns the [`#date`](#date) state with *1 month* added to it

  * `getDateNextMonth(date)` - Returns the given *date argument* with *1 month* added to it

  * `getDateNextMonth(amount)` - Returns the [`#date`](#date) state with the months added to it from the given *amount argument*

  * `getDateNextMonth(date, amount)` - Returns the given *date argument* with the months added to it from the given *amount argument*

```jsx
function MyCalendar(kalendaryo) {
  const nextMonth = kalendaryo.getDateNextMonth()
  const nextMonthFormatted = kalendaryo.getFormattedDate(nextMonth, 'MMMM')

  return <p>The next month from today is: {nextMonthFormatted}</p>
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #getDatePrevMonth
<pre>
<b>type:</b> func(date?: Date | amount?: Number, amount?: Number): Date
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Returns a date with months subtracted from the given amount. You can invoke this in four ways:
  * `getDatePrevMonth()` - Returns the [`#date`](#date) state with *1 month* subtracted to it

  * `getDatePrevMonth(date)` - Returns the given *date argument* with *1 month* subtracted to it

  * `getDatePrevMonth(amount)` - Returns the [`#date`](#date) state with the months subtracted to it from the given *amount argument*

  * `getDatePrevMonth(date, amount)` - Returns the given *date argument* with the months subtracted to it from the given *amount argument*

```jsx
function MyCalendar(kalendaryo) {
  const prevMonth = kalendaryo.getDatePrevMonth()
  const prevMonthFormatted = kalendaryo.getFormattedDate(prevMonth, 'MMMM')

  return <p>The previous month from today is: {prevMonthFormatted}</p>
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #getDaysInMonth
<pre>
<b>type:</b> func(date?: Date): DayObject[]
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Returns an array of [Day Objects](#dayobject) for the month of a given date

  * `getDaysInMonth()` - Returns all the days in the month of the [`#date`](#date) state

  * `getDaysInMonth(date)` - Returns all the days in the month of the given *date argument*

```jsx
function MyCalendar(kalendaryo) {
  const nextMonth = kalendaryo.getDateNextMonth()
  const daysNextMonth = kalendaryo.getDaysInMonth(nextMonth)

  return (
    <div>
      {daysNextMonth.map((day) => (
        <p
          key={day.label}
          onClick={() => console.log(day.dateValue)}
        >
          {day.label}
        </p>
      ))}
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #getWeeksInMonth
<pre>
<b>type:</b> func(date?: Date, startingDayIndex?: Number): Week[DayObject[]]
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Returns an array of weeks, each containing their respective days for the month of the given date

  * `getWeeksInMonth()` - Returns an array of weeks for the month of the [`#date`](#date) state, with the weeks starting at the value specified from the [`#startWeekAt`](#startweekat) prop

  * `getWeeksInMonth(date)` - Returns an array of weeks for the month of the given *date argument*, with the weeks starting at the value specified from the [`#startWeekAt`](#startweekat) prop

  * `getWeeksInMonth(date, startingDayIndex)` - Returns an array of weeks for the month of the given *date argument*, with the weeks starting at the value specified from the given *startingDayIndex argument*

```jsx
function MyCalendar(kalendaryo) {
  const prevMonth = kalendaryo.getDatePrevMonth()
  const weeksPrevMonth = kalendaryo.getWeeksInMonth(prevMonth, 1)

  return (
    <div>
      {weeksPrevMonth.map((week, i) => (
        <div class="week" key={i}>
          {week.map((day) => (
            <p
              key={day.label}
              onClick={() => console.log(day.dateValue)}
            >
              {day.label}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #setDate
<pre>
<b>type:</b> func(date: Date): void
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Updates the [`#date`](#date) state to the given date

```jsx
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const currentDate = kalendaryo.getFormattedDate()
  const setDateToBday = () => kalendaryo.setDate(birthday)

  return (
    <div>
      <p>The date is: {currentDate}</p>
      <button onClick={setDateToBday}>Set date to my birthday</button>
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #setSelectedDate
<pre>
<b>type:</b> func(selectedDate: Date): void
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Updates the [`#selectedDate`](#selecteddate) state to the given selected date

```jsx
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const currentDate = kalendaryo.getFormattedDate()
  const selectedDate = kalendaryo.getFormattedDate(kalendaryo.selectedDate)
  const selectBdayDate = () => kalendaryo.setSelectedDate(birthday)

  return (
    <div>
      <p>The date is: {currentDate}</p>
      <p>The selected date is: {selectedDate}</p>
      <button onClick={selectBdayDate}>Set selected date to my birthday!</button>
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```
<br />

#### #pickDate
<pre>
<b>type:</b> func(date: Date): void
<b>throws:</b> Error exception when the types of the given argument are invalid
</pre>

Updates both the [`#date`](#date) & [`#selectedDate`](#selecteddate) state to the given date

```jsx
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const currentDate = kalendaryo.getFormattedDate()
  const selectedDate = kalendaryo.getFormattedDate(kalendaryo.selectedDate)
  const selectBday = () => kalendaryo.pickDate(birthday)

  return (
    <div>
      <p>The date is: {currentDate}</p>
      <p>The selected date is: {selectedDate}</p>
      <button onClick={selectBday}>Set date and selected date to my birthday!</button>
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```

## Examples
* [Basic Calendar](https://codesandbox.io/s/vjkq15zj0y)
* [Date Range Calendar](https://codesandbox.io/s/7yk8x627j6)
* [Date Picker Input (Downshift x Kalendaryo)](https://codesandbox.io/s/j47zv28xkw)

## Inspiration
This project is heavily inspired from [Downshift](https://github.com/paypal/downshift) by [Kent C. Dodds](https://twitter.com/kentcdodds), a component library that uses render props to expose certain APIs for you to build flexible and accessible autocomplete, dropdown, combobox, etc. components.
<br /> <br />
Without it, I would not have been able to create this very first OSS project of mine, so thanks Mr. Dodds and Contributors for it! :heart:


[coveralls-badge]: https://coveralls.io/repos/github/geeofree/kalendaryo/badge.svg
[coveralls]: https://coveralls.io/github/geeofree/kalendaryo

[travis-badge]: https://travis-ci.org/geeofree/kalendaryo.svg?branch=master
[travis]: https://travis-ci.org/geeofree/kalendaryo

[npm-badge]: https://img.shields.io/npm/v/kalendaryo.svg
[npm-dl-badge]: https://img.shields.io/npm/dt/kalendaryo.svg
[npm]: https://www.npmjs.com/package/kalendaryo

[mit]: https://img.shields.io/github/license/mashape/apistatus.svg
