import React from 'react'
import { configure, shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Kalendaryo from '../src'

import {
  format,
  addMonths,
  subMonths,
  getDate,
  getDaysInMonth,
  getMonth,
  setDate,
  addDays,
  subDays,
  getDay
} from 'date-fns'

const adapter = new Adapter()
configure({ adapter })

const getComponent = (props, renderFn = shallow, Component = Kalendaryo) =>
  renderFn(<Component render={() => null} {...props} />)

global.shallow = shallow
global.mount = mount
global.render = render
global.React = React
global.birthday = new Date(1996, 4, 23)
global.dateToday = new Date()
global.format = format
global.addMonths = addMonths
global.subMonths = subMonths
global.getDate = getDate
global.getDaysInMonth = getDaysInMonth
global.getMonth = getMonth
global.setDate = setDate
global.addDays = addDays
global.subDays = subDays
global.getDay = getDay
global.getComponent = getComponent
global.getComponentInstance = (props, renderFn = shallow, Component = Kalendaryo) =>
  getComponent(props, renderFn, Component).instance()
