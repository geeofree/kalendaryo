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
**Kalendaryo** is a React component that provides the toolsets for you to build calendar components with that works for your use cases. It has no layout or functionalities other than the ones you can think of to build through its API.
<br /> <br />
The component uses the [render props](https://reactjs.org/docs/render-props.html) pattern which helps in exposing various variables for you to use and also gives you the flexibility to build your calendar's layout anyway you want due to its inline rendering nature.
<br /> <br />
See the [Basic Usage](#basic-usage) section to see how you can build a basic calendar component using Kalendaryo or see the [Examples](#examples) section to see more examples built with Kalendaryo.

<hr />

## Table of Contents
* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [API](#api)
  * [State](#state)
    * [#date](#date)
    * [#selectedDate](#selecteddate)
  * [Props](#props)
    * [#startingDate](#startingdate)
    * [#defaultFormat](#defaultformat)
    * [#onChange](#onchange)
    * [#onDateChange](#ondatechange)
    * [#onSelectedChange](#onselectedchange)
    * [#render](#render)
  * [Methods](#methods)
    * [#getFormattedDate](#getformatteddate)
    * [#getDateNextMonth](#getdatenextmonth)
    * [#getDatePrevMonth](#getdateprevmonth)
    * [#getDaysInMonth](#getdaysinmonth)
    * [#getWeeksInMonth](#getweeksinmonth)
    * [#setDate](#setdate)
    * [#setSelectedDate](#setselecteddate)
    * [#selectDate](#selectdate)
    * [#dateIsInRange](#dateisinrange)
    * [#isHighlightedDay](#ishighlightedday)
    * [#isSelectedDay](#isselectedday)
* [Examples](#examples)
* [Inspiration](#inspiration)

## Installation
This package expects you to have `>= react@0.14.x`, `>= prop-types@15`, and `date-fns@1.x`  

Once you're done installing these peer dependencies, install the package like so:

```js
npm i -d kalendaryo // <-- for npm peeps
yarn add kalendaryo // <-- for yarn peeps
```

After doing all of those, hopefully everything should work and be ready for use :thumbsup: :eyes: :ok_hand:

## Basic Usage
```js
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
    setDate,
    isSelectedDay
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
   *          2.2.2 Highlight the selected day
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
                // (2.2.2)
                className={isSelectedDay(day.label) ? "day is-selected" : "day"}
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

See this basic usage snippet in action [here](https://codesandbox.io/s/xpwzxo2my4)!

## API
This section contains descriptions of the various things the `<Kalendaryo />` component has to offer which are split into three parts:

  * `state`: Description of the component's state that could change
  * `props`: Description of the component's props that you can change or hook into
  * `methods`: Description of the component's various helper methods you can use from the [render](#render) prop

### State
#### #date
<pre><b>type:</b> Date</pre>

Is the state for the *current date* the component is in. By convention, you should only change this when the calendar you're building changes it's current date, *i.e.* moving to and from a month or year on the calendar. Defaults to today's date if [startingDate](#startingdate) prop is not set.
<br />

#### #selectedDate
<pre><b>type:</b> Date</pre>

Is the state for the *selected date* on the component. By convention, you should only change this when the calendar you're building receives a date selection input from the user, *i.e.* selecting a day on the calendar. Defaults to today's date if [startingDate](#startingdate) prop is not set.

### Props
#### #startingDate
<pre>
<b>type:</b> Date
<b>required:</b> false
<b>default:</b> new Date()
</pre>

Modifies the initial value of [`#date`](#date) & [`#selectedDate`](#selecteddate) states. Great for when you want your calendar to boot up in some date other than today.

```js
const birthday = new Date(1988, 4, 27)

<Kalendaryo startingDate={birthday} />
```

#### #defaultFormat
<pre>
<b>type:</b> String
<b>required:</b> false
<b>default</b> 'MM/DD/YY'
</pre>

Modifies the default format value on the [`#getFormattedDate`](#getformatteddate) method. Accepts any format that [date-fns' `format` function](https://date-fns.org/v1.29.0/docs/format) can support.

```js
const myFormat = 'yyyy-mm-dd'

<Kalendaryo defaultFormat={myFormat} />
```

#### #onChange
<pre>
<b>type:</b> func(state: Object): void
<b>required:</b> false
</pre>

Callback for listening to state changes on the [`#date`](#date) & [`#selectedDate`](#selecteddate) states.

```js
const logState = (state) => console.log(state)

<Kalendaryo onChange={logState}/>
```

#### #onDateChange
<pre>
<b>type:</b> func(date: Date): void
<b>required:</b> false
</pre>

Callback for listening to state changes only to the [`#date`](#date) state.

```js
const logDateState = (date) => console.log(date)

<Kalendaryo onDateChange={logDateState} />
```

#### #onSelectedChange
<pre>
<b>type:</b> func(date: Date): void
<b>required:</b> false
</pre>

Callback for listening to state changes only to the [`#selectedDate`](#selecteddate) state.

```js
const logSelectedDateState = (selectedDate) => console.log(selectedDate)

<Kalendaryo onSelectedChange={logSelectedDateState} />
```

#### #render
<pre>
<b>type:</b> func(kalendaryo: Object): void
<b>required:</b> true
</pre>

Callback for rendering your date component. This function receives an object which has `<Kalendaryo />`'s [`state`](#state) and [`methods`](#methods).

```js
const MyCalendar = (kalendaryo) => {
  console.log(kalendaryo)
  return <p>Some layout</p>
}

<Kalendaryo render={MyCalendar} />
```

### Methods
#### #getFormattedDate
<pre>
<b>type:</b> func(date?: Date | format?: String, format?: String): String
</pre>

Returns the date formatted by the given format string. You can invoke this in four ways:
  * `getFormattedDate()` - When **no arguments** are given, by default `#getFormattedDate` returns the current value in the [`#date`](#date) state formatted as the value given in the [`#defaultFormat`](#defaultformat) prop

  * `getFormattedDate(date)` - When a **date object** is given in the first argument and the second argument is not given, `#getFormattedDate` returns the given date object formatted as the value given in the [`#defaultFormat`](#defaultformat) prop

  * `getFormattedDate(formatString)` - When a **string** is given in the first argument and the second argument is not given, `#getFormattedDate` returns the current value in the [`#date`](#date) state formatted as the value from the given string

  * `getFormattedDate(date, formatString)` - When the **second argument** is given, the first argument must be a date object, this will return the given date object formatted as the value from the given string value on the second argument

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const myFormattedDate = kalendaryo.getFormattedDate(birthday, 'yyyy-mm-dd')

  return <p>My birthday is at {myFormattedDate}</p>
}

<Kalendaryo render={MyCalendar} />
```

#### #getDateNextMonth
<pre>
<b>type:</b> func(date?: Date | integer?: Integer, integer?: Integer): Date
</pre>

Returns a date object with months added from some given integer. You can invoke this in four ways:
  * `getDateNextMonth()` - When **no arguments** are given, by default `#getDateNextMonth` will add 1 month to the value of the [`#date`](#date) state

  * `getDateNextMonth(date)` - When a **date object** is given in the first argument and the second argument is not given, `#getDateNextMonth` will add 1 month by default to the given date object

  * `getDateNextMonth(integer)` - When an **integer** is given in the first argument and the second argument is not given, `#getDateNextMonth` will add a month to the value of the [`#date`](#date) state by the specified integer value

  * `getDateNextMonth(date, integer)` - When the **second argument** is given, the first value must be a date object, this will return the given date object from the first argument that has a month added from the specified integer value on the second argument

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const nextMonth = kalendaryo.getDateNextMonth()
  const nextMonthFormatted = kalendaryo.getFormattedDate(nextMonth, 'MMMM')

  return <p>The next month from today is: {nextMonthFormatted}</p>
}

<Kalendaryo render={MyCalendar} />
```

#### #getDatePrevMonth
<pre>
<b>type:</b> func(date?: Date | integer?: Integer, integer?: Integer): Date
</pre>

Returns a date object with months subtracted from some given integer. You can invoke this in four ways:
  * `getDatePrevMonth()` - When **no arguments** are given, by default `#getDatePrevMonth` will subtract 1 month to the value of the [`#date`](#date) state

  * `getDatePrevMonth(date)` - When a **date object** is given in the first argument and the second argument is not given, `#getDatePrevMonth` will subtract 1 month by default to the given date object

  * `getDatePrevMonth(integer)` - When an **integer** is given in the first argument and the second argument is not given, `#getDatePrevMonth` will subtract a month to the value of the [`#date`](#date) state by the specified integer value

  * `getDatePrevMonth(date, integer)` - When the **second argument** is given, the first value must be a date object, this will return the given date object from the first argument that has a month subtracted from the specified integer value on the second argument

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const prevMonth = kalendaryo.getDatePrevMonth()
  const prevMonthFormatted = kalendaryo.getFormattedDate(prevMonth, 'MMMM')

  return <p>The previous month from today is: {prevMonthFormatted}</p>
}

<Kalendaryo render={MyCalendar} />
```

#### #getDaysInMonth
<pre>
<b>type:</b> func(date?: Date): Array: { label: Integer, dateValue: Date }
</pre>

Returns an array of objects that represents each of the days in the given date. You can invoke this in two ways:

  * `getDaysInMonth()` - When **no argument** is given, by default `#getDaysInMonth` returns an array of objects that represent each day of the [`#date`](#date) state's value

  * `getDaysInMonth(date)` - When a **date object** is given, `#getDaysInMonth` returns an array of objects that represent each day of the given date object

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
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

#### #getWeeksInMonth
<pre>
<b>type:</b> func(date?: Date): Array: Array: { label: Integer, dateValue: Date }
</pre>

Returns an array of each weeks, which are arrays that contain objects that represent each day of the week on the month of the given date. You can invoke this in two ways:

  * `getWeeksInMonth()` - When **no argument** is given, by default `#getWeeksInMonth` returns an array of week arrays that contains objects which represent each day of the [`#date`](#date) state's value

  * `getWeeksInMonth(date)` - When a **date object** is given, `#getWeeksInMonth` returns an array of week arrays that contains objects which represent each day of the given date object

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const prevMonth = kalendaryo.getDateNextMonth()
  const weeksPrevMonth = kalendaryo.getWeeksInMonth(prevMonth)

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

#### #setDate
<pre>
<b>type:</b> func(date: Date): void
</pre>

Updates the [`#date`](#date) state to the given date object

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
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

#### #setSelectedDate
<pre>
<b>type:</b> func(date: Date): void
</pre>

Updates the [`#selectedDate`](#selecteddate) state to the given date object

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
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

#### #selectDate
<pre>
<b>type:</b> func(date: Date): void
</pre>

Updates both the [`#date`](#date) & [`#selectedDate`](#selecteddate) state to the given date object

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const birthday = new Date(1988, 4, 27)
  const currentDate = kalendaryo.getFormattedDate()
  const selectedDate = kalendaryo.getFormattedDate(kalendaryo.selectedDate)
  const selectBday = () => kalendaryo.selectDate(birthday)

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

#### #dateIsInRange
<pre>
<b>type:</b> func(date: Date, startDate: Date, endDate: Date): Boolean
</pre>

Returns true if the first argument is within the range of the given `startDate` and `endDate` arguments, false otherwise or if `endDate` is a date before `startDate`

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const currentDate = kalendaryo.date
  const nextMonth = kalendaryo.getDateNextMonth()
  const weeksInCurrentMonth = kalendaryo.getWeeksInMonth()
  const dateIsWithinNextMonth = (date) => kalendaryo.dateIsInRange(date, currentDate, nextMonth)

  return (
    <div>
      {weeksInCurrentMonth.map((week, i) => (
        <div class="week" key={i}>
          {week.map((day) => (
            <p
              key={day.label}
              disabled={dateIsWithinNextMonth(day.dateValue) === false}
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

#### #isHighlightedDay
<pre>
<b>type:</b> func(day: Integer): Boolean
</pre>

Returns `true` if the given day is equal to the day of the [`#selectedDate`](#selecteddate) state, `false` otherwise

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const daysInCurrMonth = kalendaryo.getDaysInMonth()

  return (
    <div>
      {daysInCurrMonth.map((day) => (
        <p
          key={day.label}
          className={kalendaryo.isHighlightedDay(day.label) ? "day highlighted" : "day"}
        >
          {day.label}
        </p>
      ))}
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```

#### #isSelectedDay
<pre>
<b>type:</b> func(day: Integer): Boolean
</pre>

Same as [`#isHighlightedDay`](#ishighlightedday) but also checks if the day on the [`#selectedDate`](#selecteddate) state is on the same month & year of the current value in the [`#date`](#date) state

**NOTE:** Throws an error if an invalid argument value is passed to the function

```js
function MyCalendar(kalendaryo) {
  const daysInCurrMonth = kalendaryo.getDaysInMonth()

  return (
    <div>
      {daysInCurrMonth.map((day) => (
        <p
          key={day.label}
          className={kalendaryo.isSelectedDay(day.label) ? "day selected" : "day"}
        >
          {day.label}
        </p>
      ))}
    </div>
  )
}

<Kalendaryo render={MyCalendar} />
```

## Examples
TO DO: Add working example links
* [Date Picker](#)
* [Date Range Picker](#)
* [Downshift-Kalendaryo Integration](#)

## Inspiration
This project is inspired by the react component package,  [Downshift](https://github.com/paypal/downshift) by [Kent C. Dodds](https://twitter.com/kentcdodds), which is a component that exposes various things through a render prop that lets you build autocomplete, dropdown, combo box, or any components that you can imagine to build through its API.
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
