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
  setDate
} from 'date-fns'

const adapter = new Adapter()
configure({ adapter })

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
global.getComponentInstance = (props, Component = Kalendaryo) =>
  shallow(<Component render={() => null} {...props} />).instance()
