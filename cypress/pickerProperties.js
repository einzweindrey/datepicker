import selectors from './selectors'

const getFirstElement = elements => elements[0]
const tempDate = new Date()
const date = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const singleDatepickerProperties = [
  {
    property: 'alwaysShow',
    defaultValue: false,
  },
  {
    property: 'calendar',
    defaultValue: getFirstElement,
    domElement: true,
    selector: selectors.calendar,
  },
  {
    property: 'calendarContainer',
    defaultValue: getFirstElement,
    domElement: true,
    selector: selectors.calendarContainer,
  },
  {
    property: 'currentMonth',
    defaultValue: date.getMonth(),
  },
  {
    property: 'currentMonthName',
    defaultValue: months[date.getMonth()],
  },
  {
    property: 'currentYear',
    defaultValue: date.getFullYear(),
  },
  {
    property: 'customElement',
    defaultValue: undefined,
  },
  {
    property: 'dateSelected',
    defaultValue: undefined,
  },
  {
    property: 'days',
    defaultValue: days,
    deepEqual: true,
  },
  {
    property: 'disableMobile',
    defaultValue: false,
  },
  {
    property: 'disableYearOverlay',
    defaultValue: false,
  },
  {
    property: 'disabledDates',
    defaultValue: {},
    deepEqual: true,
  },
  {
    property: 'disabler',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'el',
    defaultValue: getFirstElement,
    domElement: true,
    selector: selectors.singleDatepickerInput,
  },
  {
    property: 'events',
    defaultValue: {},
    deepEqual: true,
  },
  {
    property: 'first',
    defaultValue: undefined,
  },
  {
    property: 'formatter',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'hide',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'id',
    defaultValue: undefined,
  },
  {
    property: 'inlinePosition',
    defaultValue: true,
  },
  {
    property: 'isMobile',
    defaultValue: false,
  },
  {
    property: 'maxDate',
    defaultValue: undefined,
  },
  {
    property: 'minDate',
    defaultValue: undefined,
  },
  {
    property: 'months',
    defaultValue: months,
    deepEqual: true,
  },
  {
    property: 'navigate',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'noPosition',
    defaultValue: false,
  },
  {
    property: 'noWeekends',
    defaultValue: false,
  },
  {
    property: 'nonInput',
    defaultValue: false,
  },
  {
    property: 'onHide',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'onMonthChange',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'onSelect',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'onShow',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'overlayButton',
    defaultValue: 'Submit',
  },
  {
    property: 'overlayMonths',
    defaultValue: months.map(month => month.slice(0, 3)),
    deepEqual: true,
  },
  {
    property: 'overlayPlaceholder',
    defaultValue: '4-digit year',
  },
  {
    property: 'parent',
    defaultValue: getFirstElement,
    domElement: true,
    selector: selectors.singleDatepickerInputParent,
  },
  {
    property: 'position',
    defaultValue: { bottom: 1, left: 1 },
    deepEqual: true,
  },
  {
    property: 'positionedEl',
    defaultValue: getFirstElement,
    domElement: true,
    selector: selectors.singleDatepickerInputParent,
  },
  {
    property: 'remove',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'respectDisabledReadOnly',
    defaultValue: false,
  },
  {
    property: 'second',
    defaultValue: undefined,
  },
  {
    property: 'setDate',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'setMax',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'setMin',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'shadowDom',
    defaultValue: undefined,
  },
  {
    property: 'show',
    // defaultValue: '',
    isFunction: true,
  },
  {
    property: 'showAllDates',
    defaultValue: false,
  },
  {
    property: 'startDate',
    defaultValue: date,
    deepEqual: true,
  },
  {
    property: 'startDay',
    defaultValue: 0,
  },
  {
    property: 'weekendIndices',
    defaultValue: [6, 0],
    deepEqual: true,
  },
]

function getDaterangeProperties(type) {
  const daterangeProperties = [
    ...singleDatepickerProperties,
    {
      property: 'calendar',
      defaultValue: getFirstElement,
      domElement: true,
      selector: selectors.calendar,
    },
    {
      property: 'calendarContainer',
      defaultValue: getFirstElement,
      domElement: true,
      selector: selectors.calendarContainer,
    },
  ]

  return daterangeProperties
}

const pickerProperties = {
  singleDatepickerProperties,
  daterangeProperties,
}

export default pickerProperties