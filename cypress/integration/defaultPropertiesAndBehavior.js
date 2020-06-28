import selectors from '../selectors'
import pickerProperties from '../pickerProperties'

const {
  singleDatepickerInput,
  daterangeInputStart,
  daterangeInputEnd,
} = selectors
const { singleDatepickerProperties, getDaterangeProperties } = pickerProperties

/*
  TODO: add a test for the navigate method.
*/

// Temporary while writing new tests
const x = { describe: () => {} }

function checkPickerProperties(picker, isDaterange, id) {
  return function({ property, defaultValue, domElement, selector, deepEqual, isFunction, notOwnProperty }) {
    const value = picker[property]

    if (!notOwnProperty) {
      // The property should exist on the picker.
      expect(picker, `(checkPickerProperties) isDaterange<${isDaterange}>`).to.haveOwnProperty(property)
    }

    // Special case for id.
    if (isDaterange && property === 'id') {
      expect(value, 'id').to.equal(id)

    // First get the dom element, then ensure it has the correct default value.
    } else if (domElement) {
      cy.get(selector).then(elements => {
        expect(value, property).to.equal(defaultValue(elements))
        expect(elements, selector).to.have.lengthOf(1)
      })

    // Ensure the value is a function.
    } else if (isFunction) {
      expect(value, property).to.be.a('function')

    // The property should have the correct default value.
    } else if (deepEqual) {
      expect(value, property).to.deep.equal(defaultValue)
    } else {
      expect(value, property).to.equal(defaultValue)
    }
  }
}

function testDomStructure(pickerType, selectorObj) {
  const date = new Date()
  const multiplier = pickerType === 'single' ? 1 : 2

  cy.get(selectorObj.calendarContainer).as('calendarContainer')
  cy.get(selectorObj.calendar).as('calendar')
  cy.get(selectorObj.controls).as('controls')
  cy.get(`${selectorObj.controls} .qs-arrow`).as('arrows')
  cy.get(`${selectorObj.controls} .qs-month-year`).as('monthYear')
  cy.get(`${selectorObj.controls} .qs-month`).as('month')
  cy.get(`${selectorObj.controls} .qs-year`).as('year')
  cy.get(selectorObj.squaresContainer).as('squaresContainer')
  cy.get(`${selectorObj.squaresContainer} ${selectors.common.everySquare}`).as('squares')
  cy.get(selectorObj.overlay).as('overlay')
  cy.get(selectorObj.overlayInputContainer).as('overlayInputContainer')
  cy.get(`${selectorObj.overlayInputContainer} .qs-overlay-year`).as('overlayYearInput')
  cy.get(`${selectorObj.overlayInputContainer} .qs-close`).as('overlayClose')
  cy.get(selectorObj.overlayMonthContainer).as('overlayMonthContainer')


  // calendarContainer
  cy.get(selectors.common.container).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@calendarContainer').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@calendarContainer').children().should('have.length', 1)
  cy.get('@calendarContainer').should('have.attr', 'class', 'qs-datepicker-container qs-hidden')

  // calendar
  cy.get(selectors.common.calendar).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@calendar').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@calendar').children().should('have.length', 3)
  cy.get('@calendar').should('have.attr', 'class', 'qs-datepicker')

  // calendar => controls
  cy.get(selectors.common.controls).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@controls').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@controls').children().should('have.length', 3)
  cy.get('@controls').should('have.attr', 'class', 'qs-controls')

  // calendar => controls => arrows
  cy.get(`${selectors.common.controls} .qs-arrow`).should('have.length', 2 * multiplier) // Searching the whole document.
  cy.get('@arrows').should('have.length', 2) // Searching within the specified section of the document.
  cy.get('@arrows').then($arrows => {
    cy.get($arrows[0]).children().should('have.length', 0)
    cy.get($arrows[1]).children().should('have.length', 0)

    expect($arrows[0], '@arrows - left').to.have.attr('class', 'qs-arrow qs-left')
    expect($arrows[1], '@arrows - right').to.have.attr('class', 'qs-arrow qs-right')
  })

  // calendar => controls => month/year
  cy.get(`${selectors.common.controls} .qs-month-year`).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@monthYear').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@monthYear').children().should('have.length', 2)
  cy.get('@monthYear').should('have.attr', 'class', 'qs-month-year')

  // calendar => controls => month/year => month
  cy.get(`${selectors.common.controls} .qs-month`).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@month').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@month').children().should('have.length', 0)
  cy.get('@month').should('have.text', pickerProperties.months[date.getMonth()])
  cy.get('@month').should('have.attr', 'class', 'qs-month')

  // calendar => controls => month/year => year
  cy.get(`${selectors.common.controls} .qs-year`).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@year').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@year').children().should('have.length', 0)
  cy.get('@year').should('have.text', date.getFullYear())
  cy.get('@year').should('have.attr', 'class', 'qs-year')

  // calendar => squares
  cy.get(selectors.common.squaresContainer).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@squaresContainer').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@squaresContainer').should('have.attr', 'class', 'qs-squares')

  // calendar => squares => various types of squares
  cy.get('@squaresContainer').children().then($allSquares => {
    cy.get(selectors.common.everySquare).should('have.length', $allSquares.length * multiplier)

    /*
      It's a little hard to test the correct number of total squares since there's a lot
      of logic involved. I don't want to simply repeat the logic in the library, defeating the
      purpose of testing.

      https://github.com/qodesmith/datepicker/issues/86
      One thing we can do to guage if we have extra days is to test the 1st 7 and last 7 calendar days.
      If any one of those sets are completely empty, we've got an extra row that shouldn't be there.
    */

    const arrayOfSquares = Array.from($allSquares)

    // 1st 7 days - NOT the days of the week header.
    const firstWeekHasContent = arrayOfSquares.slice(7, 14).some(square => square.textContent === '1')

    // Last 7 days.
    const lastWeekHasContent = arrayOfSquares.slice(-7).some(square => {
      // The last day of any month will be on of these numbers. One of them should be found in the last week.
      return ['28', '29', '30', '31'].some(num => square.textContent === num)
    })

    expect(firstWeekHasContent, '@squaresContainer - First week has content').to.equal(true)
    expect(lastWeekHasContent, '@squaresContainer - Last week has content').to.equal(true)
  })
  cy.get('@squares').filter('.qs-day')
    .should('have.length', 7)
    .should('have.attr', 'class', 'qs-square qs-day')
    .then($qsDays => {
      const message = '@squaresContainer/.qs-day'
      $qsDays.each((i, qsDay) => {
        pickerProperties.days.forEach(day => {
          expect(qsDay.classList.contains(day), `${message} (day of week class: ${day})`).to.equal(false)
        })
        expect(qsDay.textContent, message).to.be.oneOf(pickerProperties.days)
        expect(qsDay, message).to.not.have.attr('data-direction')
      })
    })
  cy.get('@squares').filter('.qs-outside-current-month').then($outsides => {
    $outsides.each((_, outside) => {
      const message = '@squaresContainer/.qs-outside-current-month'
      const hasDayClass = pickerProperties.days.reduce((found, day) => {
        return found || outside.classList.contains(day)
      }, false)

      expect(hasDayClass, `${message} (has day of week class)`).to.equal(true)
      expect(outside, message).to.have.text('')
      expect(outside, message).to.have.class('qs-empty')
      expect(outside, message).to.have.attr('data-direction')
      expect(outside.dataset.direction, message).to.be.oneOf(['-1', '1'])
    })
  })
  cy.get('@squares').filter('.qs-num').then($qsNums => {
    const numOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const message = '@squaresContainer/.qs-num'

    expect($qsNums.length, message).to.equal(numOfDays)

    $qsNums.each((i, qsNum) => {
      const hasDayClass = pickerProperties.days.reduce((found, day) => {
        return found || qsNum.classList.contains(day)
      }, false)

      expect(hasDayClass, `${message} (has day of week class)`).to.equal(true)
      expect(qsNum.dataset.direction, message).to.equal('0')
      expect(qsNum.textContent, message).to.equal(`${i + 1}`)
    })
  })
  cy.get('@squares').filter('.qs-current').then($qsCurrent => {
    const message = '@squaresContainer/.qs-num/.qs-current'
    const hasDayClass = pickerProperties.days.reduce((found, day) => {
      return found || $qsCurrent[0].classList.contains(day)
    }, false)

    expect(hasDayClass, `${message} (has day of week class)`).to.equal(true)

    expect($qsCurrent, message).to.have.length(1)
    expect($qsCurrent.text(), message).to.equal(`${date.getDate()}`)
  })

  // calendar => overlay
  cy.get(selectors.common.overlay).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlay').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@overlay').should('have.attr', 'class', 'qs-overlay qs-hidden')
  cy.get('@overlay').children().should('have.length', 3)

  // calendar => overlay => overlayInputContainer
  cy.get(selectors.common.overlayInputContainer).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlayInputContainer').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@overlayInputContainer').children().should('have.length', 2)
  cy.get('@overlayInputContainer').should('not.have.attr', 'class')
  cy.get('@overlayInputContainer').then($overlayInputContainer => {
    expect($overlayInputContainer[0].getAttributeNames(), '@overlayInputContainer - getAttributeNames()').to.deep.equal([])
  })

  // calendar => overlay => overlayInputContainer => year input
  cy.get(selectors.common.overlayYearInput).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlayYearInput').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@overlayYearInput').should('have.prop', 'tagName').should('eq', 'INPUT')
  cy.get('@overlayYearInput').should('have.attr', 'class', 'qs-overlay-year')
  cy.get('@overlayYearInput').should('have.attr', 'placeholder', '4-digit year')
  cy.get('@overlayYearInput').should('have.prop', 'value', '')

  // calendar => overlay => overlayInputContainer => close
  cy.get(selectors.common.overlayClose).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlayClose').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@overlayClose').should('have.attr', 'class', 'qs-close')
  cy.get('@overlayClose').should('have.text', '✕')

  // calendar => overlay => overlayMonthContainer
  cy.get(selectors.common.overlayMonthContainer).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlayMonthContainer').should('have.length', 1) // Searching within the specified section of the document.
  cy.get('@overlayMonthContainer').children().should('have.length', 12)
  cy.get('@overlayMonthContainer').should('have.attr', 'class', 'qs-overlay-month-container')

  // calendar => overlay => overlayMonthContainer => overlayMonth
  cy.get(selectors.common.overlayMonth).should('have.length', 12 * multiplier) // Searching the whole document.
  cy.get('@overlayMonthContainer').children().then($qsOverlayMonths => {
    $qsOverlayMonths.each((i, overlayMonth) => {
      const message = `.qs-overlay-month [${i}]`

      expect(overlayMonth.textContent, message).to.have.length(3)
      expect(overlayMonth.textContent, message).to.equal(pickerProperties.months[i].slice(0, 3))
      expect(overlayMonth, message).to.have.attr('class', 'qs-overlay-month')
      expect(overlayMonth, message).to.have.attr('data-month-num', `${i}`)
    })
  })

  // calendar => overlay => overlaySubmit
  cy.get(selectors.common.overlaySubmit).should('have.length', 1 * multiplier) // Searching the whole document.
  cy.get('@overlay').find(selectors.common.overlaySubmit) // Searching within the specified section of the document.
    .should('have.length', 1)
    .should('have.text', 'Submit')
    .should('have.attr', 'class', 'qs-submit qs-disabled')
    .should('have.prop', 'tagName').should('eq', 'DIV') // This element is not a <button> or <input type="submit"/>.
}

function daterangeSanityCheck(pickerStart, pickerEnd) {
  expect(pickerStart.id, 'pickerStart.id (sanity check)').not.to.be.undefined
  expect(pickerEnd.id, 'pickerEnd.id (sanity check)').not.to.be.undefined

  expect(pickerStart.id, 'pickerStart.id (sanity check)').to.equal(pickerEnd.id)
  expect(pickerEnd.id, 'pickerEnd.id (sanity check)').to.equal(pickerStart.id)

  expect(pickerStart.sibling, 'pickerStart.sibling (sanity check)').to.equal(pickerEnd)
  expect(pickerEnd.sibling, 'pickerEnd.sibling (sanity check)').to.equal(pickerStart)
}

describe('Default properties and behavior', function() {
  beforeEach(function() {
    cy.visit('http://localhost:9001')

    /*
      We can't simply import the datepicker library up at the top because it will not
      be associated with the correct window object. Instead, we can use a Cypress alias
      that will expose what we want on `this`, so long as we avoid using arrow functions.
      This is possible because datepicker is assigned a value on the window object in `sandbox.js`.
    */
    cy.window().then(global => cy.wrap(global.datepicker).as('datepicker'))
  })

  describe('Single instance', function() {
    it('should have the correct properties and values', function() {
      const picker = this.datepicker(singleDatepickerInput)

      singleDatepickerProperties.forEach(checkPickerProperties(picker))

      // Ensure that only and all the properties are in the picker instance.
      const pickerKeys = Object.keys(picker)
      const numOfPropertiesExpected = singleDatepickerProperties.length
      expect(pickerKeys).to.have.length(numOfPropertiesExpected)

      singleDatepickerProperties.forEach(({ property }) => {
        expect(picker, property).to.haveOwnProperty(property)
      })
    })

    it('should have the correct DOM structure', function() {
      this.datepicker(singleDatepickerInput)
      testDomStructure('single', selectors.single)
    })

    describe('Basic visuals, behavior, and property changes', function() {
      it('is initially hidden in the DOM', function() {
        this.datepicker(singleDatepickerInput)
        cy.get(selectors.single.calendarContainer).should('not.be.visible')
      })

      it('should show the calendar when clicking into the input (and not show the overlay)', function() {
        this.datepicker(singleDatepickerInput)

        cy.get(singleDatepickerInput).click()
        cy.get(selectors.single.calendarContainer).should('be.visible')
        cy.get(selectors.single.overlay).then($overlay => {
          const message = '.qs-overlay styles'
          const styles = getComputedStyle($overlay[0])

          expect(styles.opacity, message).to.equal('0')
          expect(styles.zIndex, message).to.equal('-1')
        })
      })

      it('should show todays date bold and underlined, all others regular', function() {
        const today = new Date()
        this.datepicker(singleDatepickerInput)

        cy.get(singleDatepickerInput).click()
        cy.get(`${selectors.single.squaresContainer} .qs-current`)
          .should('have.text', today.getDate())
          .then($qsCurrent => {
            const message = '.qs-current styles'
            const styles = getComputedStyle($qsCurrent[0])

            expect(styles.fontWeight, message).to.equal('700')
            expect(styles.textDecoration, message).to.equal('underline solid rgb(0, 0, 0)')
            expect(styles.backgroundColor, message).to.equal('rgba(0, 0, 0, 0)')
          })

        cy.get(`${selectors.single.squaresContainer} [data-direction="0"]:not(.qs-current)`)
          .should('have.length', new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - 1)
          .then($allDaysButCurrentDay => {
            const message = 'calendar day styles (not .qs-current)'

            cy.wait(1).then(() => {
              Array.from($allDaysButCurrentDay).forEach(el => {
                const styles = getComputedStyle(el)

                expect(styles.fontWeight, message).to.equal('400')
                expect(styles.textDecoration, message).to.equal('none solid rgb(0, 0, 0)')
                expect(styles.backgroundColor, message).to.equal('rgba(0, 0, 0, 0)')
              })
            })
          })
      })

      it('hides the calendar when clicking outside the calendar and input', function() {
        this.datepicker(singleDatepickerInput)

        cy.get(singleDatepickerInput).click()
        cy.get(selectors.single.calendarContainer).should('be.visible')
        cy.get('body').click()
        cy.get(selectors.single.calendarContainer).should('not.be.visible')
      })

      it('should change months when the arrows are clicked', function() {
        const today = new Date()
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const picker = this.datepicker(singleDatepickerInput)

        cy.get(singleDatepickerInput).click()
        cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.single.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
        expect(picker.currentMonth, 'picker.currentMonth').to.equal(today.getMonth())
        expect(picker.currentMonthName, 'picker.currentMonthName').to.equal(pickerProperties.months[today.getMonth()])
        expect(picker.currentYear, 'picker.currentYear').to.equal(today.getFullYear())

        cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click()
        cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[previousMonthDate.getMonth()])
        cy.get(`${selectors.single.controls} .qs-year`)
          .should('have.text', `${previousMonthDate.getFullYear()}`)
          .then(() => {
            expect(picker.currentMonth, 'picker.currentMonth').to.equal(previousMonthDate.getMonth())
            expect(picker.currentMonthName, 'picker.currentMonthName').to.equal(pickerProperties.months[previousMonthDate.getMonth()])
            expect(picker.currentYear, 'picker.currentYear').to.equal(previousMonthDate.getFullYear())
          })

        cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click()
        cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.single.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
      })

      describe('Overlay', function() {
        it('should show the overlay when the month/year is clicked', function() {
          this.datepicker(singleDatepickerInput)

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.get(selectors.single.controls).then($controls => {
            cy.wait(400).then(() => {
              const message = '.qs-controls blurred when overlay is open'
              const styles = getComputedStyle($controls[0])

              expect(styles.filter, message).to.equal('blur(5px)')
            })
          })
          cy.get(selectors.single.squaresContainer).then($squaresContainer => {
            const message = '.qs-squares (container) blurred when overlay is open'
            const styles = getComputedStyle($squaresContainer[0])

            expect(styles.filter, message).to.equal('blur(5px)')
          })
          cy.get(selectors.single.overlay).then($overlay => {
            const message = '.qs-overlay styles when open'
            const styles = getComputedStyle($overlay[0])

            expect(styles.opacity, message).to.equal('1')
            expect(styles.zIndex, message).to.equal('1')
          })
        })

        it('should focus the overlay year input', function() {
          this.datepicker(singleDatepickerInput)

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.wait(1)
          cy.focused().should('have.attr', 'class', 'qs-overlay-year')
        })

        it('should change the year when using the input and hitting enter or clicking the submit button', function() {
          /*
            Datepicker uses requestAnimationFrame in order to toggle the overlay.
            cy.clock will help us cy.wait the correct way. Look, it just works, k?
          */
          cy.clock()

          const today = new Date()
          const nextYear = today.getFullYear() + 1
          this.datepicker(singleDatepickerInput)

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
          cy.get(`${selectors.single.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
          cy.get(`${selectors.single.overlay} .qs-submit`).should('have.attr', 'class', 'qs-submit qs-disabled')

          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.wait(1)
          cy.get(`${selectors.single.overlayInputContainer} .qs-overlay-year`).type(`${nextYear}`)
          cy.get(`${selectors.single.overlay} .qs-submit`).should('have.attr', 'class', 'qs-submit')
          cy.get(`${selectors.single.overlayInputContainer} .qs-overlay-year`).focus().type('{enter}')

          /*
            Why do we need both cy.tick AND cy.wait? Because it's the only way the tests pass
            for when the test browser is visible and when it's not. Don't ask me why.
          */
          cy.tick(400).then(() => {
            cy.wait(400).then(() => {
              cy.get(selectors.single.overlay).then($overlay => {
                const message = '.qs-overlay styles after entering year'
                const styles = getComputedStyle($overlay[0])

                expect(styles.opacity, message).to.equal('0')
                expect(styles.zIndex, message).to.equal('-1')
              })
            })
          })
          cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
          cy.get(`${selectors.single.controls} .qs-year`).should('have.text', `${nextYear}`)

          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.wait(1)
          cy.get(`${selectors.single.overlayInputContainer} .qs-overlay-year`).type(`${today.getFullYear()}`)
          cy.get(`${selectors.single.overlay} .qs-submit`)
            .should('have.attr', 'class', 'qs-submit')
            .click()
          cy.wait(1)
          cy.get(`${selectors.single.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
          cy.get(`${selectors.single.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
        })

        it('should not allow leading zeros or change the year if 4 digits have not been entered', function() {
          this.datepicker(singleDatepickerInput)

          // Set up some variables
          cy.get(selectors.single.overlay).as('overlay')
          cy.get(`${selectors.single.overlay} .qs-submit`).as('submit')
          cy.get(`${selectors.single.overlayInputContainer} .qs-overlay-year`).as('yearInput')

          // Open the overlay.
          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.get('@overlay').then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('1')
              expect(styles.zIndex, message).to.equal('1')
            })
          })

          // Clicking the submit button should not change any styles (since it's a noop).
          cy.get('@submit').click()
          cy.get('@overlay').then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('1')
              expect(styles.zIndex, message).to.equal('1')
            })
          })

          // Hitting the enter button while focused in the input should not change any styles (since it's a noop).
          cy.get('@yearInput').focus().type('{enter}')
          cy.get('@overlay').then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('1')
              expect(styles.zIndex, message).to.equal('1')
            })
          })

          cy.get('@yearInput')
            .should('have.value', '')
            .type('0000')
            .should('have.value', '')

          cy.get('@submit').should('have.attr', 'class', 'qs-submit qs-disabled')
          cy.get('@yearInput').type('1').should('have.value', '1')
          cy.get('@submit').should('have.attr', 'class', 'qs-submit qs-disabled')
          cy.get('@yearInput').type('2').should('have.value', '12')
          cy.get('@submit').should('have.attr', 'class', 'qs-submit qs-disabled')
          cy.get('@yearInput').type('3').should('have.value', '123')
          cy.get('@submit').should('have.attr', 'class', 'qs-submit qs-disabled')
          cy.get('@yearInput').type('4').should('have.value', '1234')
          cy.get('@submit').should('have.attr', 'class', 'qs-submit')
        })

        it('should change the month when a month name is clicked', function() {
          const today = new Date()
          this.datepicker(singleDatepickerInput)

          cy.clock()

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.get(selectors.single.overlay).then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay styles after clicking month'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('1')
              expect(styles.zIndex, message).to.equal('1')
            })
          })

          cy.get(`${selectors.single.overlayMonthContainer} [data-month-num="0"]`).click()
          cy.tick(400).then(() => {
            cy.wait(400).then(() => {
              cy.get(selectors.single.overlay).then($overlay => {
                const message = '.qs-overlay styles after clicking month'
                const styles = getComputedStyle($overlay[0])

                expect(styles.opacity, message).to.equal('0')
                expect(styles.zIndex, message).to.equal('-1')
              })
            })
          })
          cy.get(`${selectors.single.controls} .qs-month-year .qs-month`)
            .should('have.text', pickerProperties.months[0])

          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.tick(400).then(() => {
            cy.get(selectors.single.overlay).then($overlay => {
              cy.wait(400).then(() => {
                const message = '.qs-overlay styles after clicking month'
                const styles = getComputedStyle($overlay[0])

                expect(styles.opacity, message).to.equal('1')
                expect(styles.zIndex, message).to.equal('1')
              })
            })
          })
          cy.get(`${selectors.single.overlayMonthContainer} [data-month-num="11"]`).click()
          cy.tick(400).then(() => {
            cy.wait(400).then(() => {
              cy.get(selectors.single.overlay).then($overlay => {
                const message = '.qs-overlay styles after clicking month'
                const styles = getComputedStyle($overlay[0])

                expect(styles.opacity, message).to.equal('0')
                expect(styles.zIndex, message).to.equal('-1')
              })
            })
          })
          cy.get(`${selectors.single.controls} .qs-month-year .qs-month`)
            .should('have.text', pickerProperties.months[11])
        })

        it('should close the overlay when clicking the close button', function() {
          this.datepicker(singleDatepickerInput)

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-month-year`).click()
          cy.get(selectors.single.overlay).then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('1')
              expect(styles.zIndex, message).to.equal('1')
            })
          })

          cy.get(`${selectors.single.overlay} .qs-close`).click()
          cy.get(selectors.single.overlay).then($overlay => {
            cy.wait(400).then(() => {
              const message = '.qs-overlay'
              const styles = getComputedStyle($overlay[0])

              expect(styles.opacity, message).to.equal('0')
              expect(styles.zIndex, message).to.equal('-1')
            })
          })
        })
      })
    })

    describe('Date changes', function() {
      it('should select a date when clicking a day, fill in the input field, and change a picker prop', function() {
        const today = new Date()
        const todaysDate = today.getDate()
        const dayIndex = todaysDate === 1 ? 1 : 0
        const picker = this.datepicker(singleDatepickerInput)
        const dateSelected = new Date(today.getFullYear(), today.getMonth(), dayIndex + 1)

        expect(picker.dateSelected, 'picker.dateSelected').to.be.undefined
        cy.get(selectors.single.calendarContainer).should('not.be.visible')
        cy.get(singleDatepickerInput).should('have.value', '').click()
        cy.get(selectors.single.calendarContainer).should('be.visible')

        cy.get(`${selectors.single.squaresContainer} .qs-active`).should('have.length', 0)
        cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(dayIndex).click()
        cy.get(selectors.single.calendarContainer).should('not.be.visible')
        cy.get(`${selectors.single.squaresContainer} .qs-active`).should('have.length', 1)
        cy.get(singleDatepickerInput).then($input => {
          const message = 'The input should be populated with the `toDateString()` method'
          expect($input.val(), message).to.equal(dateSelected.toDateString())
          expect(+picker.dateSelected, '`picker.dateSelected` date value').to.equal(+dateSelected)
        })

        cy.get(singleDatepickerInput).click()
        cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(dayIndex).then($selectedDay => {
          const styles = getComputedStyle($selectedDay[0])
          expect(styles.backgroundColor, 'Selected day').to.equal('rgb(173, 216, 230)')
        })
      })

      it('should de-select a date, clear the input field, and clear the picker prop', function() {
        const today = new Date()
        const todaysDate = today.getDate()
        const dayIndex = todaysDate === 1 ? 1 : 0
        const picker = this.datepicker(singleDatepickerInput)
        const dateSelected = new Date(today.getFullYear(), today.getMonth(), dayIndex + 1)

        cy.get(singleDatepickerInput).click()
        cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(dayIndex).click()
        cy.get(selectors.single.calendarContainer).should('not.be.visible')
        cy.get(`${selectors.single.squaresContainer} .qs-active`).should('have.length', 1).then(() => {
          expect(+picker.dateSelected, '`picker.dateSelected` should be filled').to.equal(+dateSelected)
        })

        cy.get(singleDatepickerInput).click()
        cy.get(`${selectors.single.squaresContainer} .qs-active`)
          .then($selectedDay => {
            const styles = getComputedStyle($selectedDay[0])
            expect(styles.backgroundColor, 'Selected day color').to.equal('rgb(173, 216, 230)')
          })
          .click()
        cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(dayIndex).then($selectedDay => {
          cy.wait(400).then(() => {
            const styles = getComputedStyle($selectedDay[0])
            expect(styles.backgroundColor, 'Selected day color after de-selecting').to.equal('rgba(0, 0, 0, 0)')
          })
        })
        cy.get(selectors.single.calendarContainer).should('be.visible')
        cy.get(`${selectors.single.squaresContainer} .qs-active`).should('have.length', 0).then(() => {
          expect(picker.dateSelected, 'picker.dateSelected').to.be.undefined
        })
      })
    })

    describe('Instance methods', function() {
      it('should not have a getRange method', function() {
        const picker = this.datepicker(singleDatepickerInput)
        expect(picker.getRange).to.be.undefined
      })

      describe('setDate', function() {
        it('should be a function', function() {
          const picker = this.datepicker(singleDatepickerInput)
          expect(picker.setDate).to.be.a('function')
        })

        it('should populate `dateSelected` on the instance object', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const date = new Date()

          expect(picker.dateSelected).to.be.undefined
          picker.setDate(date)
          expect(+picker.dateSelected).to.equal(+new Date(date.getFullYear(), date.getMonth(), date.getDate()))
        })

        it('should programmatically select a date on the calendar', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const today = new Date()

          expect(picker.dateSelected).to.be.undefined
          cy.get(`${selectors.single.squaresContainer} .qs-active`)
            .should('have.length', 0)
            .then(() => picker.setDate(today))
          cy.get(`${selectors.single.squaresContainer} .qs-active`).should('have.length', 1)
        })

        it('should populate the input field with that date', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const today = new Date()

          cy.get(singleDatepickerInput).should('have.value', '')
            .then(() => picker.setDate(today))
          cy.get(singleDatepickerInput).should('have.value', today.toDateString())
        })

        it('should navigate the calendar to a date with the 2nd argument', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const today = new Date()
          const date = new Date()
          date.setMonth(today.getMonth() + 1)

          cy.get(`${selectors.single.controls} .qs-month`)
            .should('have.text', pickerProperties.months[today.getMonth() % 12])
            .then(() => picker.setDate(date, true))
          cy.get(`${selectors.single.controls} .qs-month`)
            .should('have.text', pickerProperties.months[date.getMonth() % 12])
        })

        it('should remove the selected date when no arguments are passed', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const date = new Date()

          expect(picker.dateSelected).to.be.undefined
          cy.get(`${selectors.single.squaresContainer} .qs-active`)
            .should('have.length', 0)
            .then(() => {
              picker.setDate(date)
              expect(+picker.dateSelected).to.equal(+new Date(date.getFullYear(), date.getMonth(), date.getDate()))
            })
          cy.get(`${selectors.single.squaresContainer} .qs-active`)
            .should('have.length', 1)
            .then(() => {
              picker.setDate()
              expect(picker.dateSelected).to.be.undefined
            })
          cy.get(`${selectors.single.squaresContainer} .qs-active`)
            .should('have.length', 0)
        })
      })

      describe('setMin', function() {
        it('should be a function', function() {
          const picker = this.datepicker(singleDatepickerInput)
          expect(picker.setMin).to.be.a('function')
        })

        it('should populate `minDate` on the instance object', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const date = new Date()

          expect(picker.minDate).to.be.undefined
          picker.setMin(date)
          expect(+picker.minDate).to.equal(+new Date(date.getFullYear(), date.getMonth(), date.getDate()))
        })

        it('should disable dates prior to the provided value (including previous months)', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const minDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), minDay)

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('1')
              expect(day, `Days shouldn't have qs-disabled class prior to calling setMin.`).not.to.have.class('qs-disabled')
            })

            picker.setMin(date)
          })

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach((day, i) => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal(i < (minDay - 1) ? '0.2' : '1')

              if (i < (minDay - 1)) {
                expect(day, 'Disabled days from setMin').to.have.class('qs-disabled')
              } else {
                expect(day, 'Unaffected days from setMin').not.to.have.class('qs-disabled')
              }
            })
          })

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('0.2')
              expect(day).to.have.class('qs-disabled')
            })
          })

          cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click()
          cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('1')
              expect(day).not.to.have.class('qs-disabled')
            })
          })
        })

        it('should prevent disabled dates from being selected', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const minDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), minDay)
          picker.setMin(date)

          // Assert a few values prior to clicking.
          cy.get(singleDatepickerInput).should('have.value', '')
          expect(picker.dateSelected).to.be.undefined

          // Click a disabled date (the 1st of the month) and assert a few more values.
          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(0).click()
          cy.wait(1).then(() => {
            cy.get(singleDatepickerInput).should('have.value', '')
            expect(picker.dateSelected).to.be.undefined
          })

          // Navigate to the previous month and assert you can't click dates.
          cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click().then(() => {
            cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(0).click()
            cy.wait(1).then(() => {
              cy.get(singleDatepickerInput).should('have.value', '')
              expect(picker.dateSelected).to.be.undefined
            })
          })

          // For sanity reasons, assert that clicking a non-disabled date works.
          cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(14).click()
          cy.wait(1).then(() => {
            cy.get(singleDatepickerInput).should('not.have.value', '')
            expect(picker.dateSelected).not.to.be.undefined
          })
        })

        it('should remove the minimum selectable date when called with no argument', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const minDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), minDay)
          picker.setMin(date)

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"].qs-disabled`)
            .should('have.length', minDay - 1)
            .then(() => {
              expect(picker.minDate).not.to.be.undefined
              picker.setMin()
            })
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"].qs-disabled`)
            .should('have.length', 0)
            .then(() => expect(picker.minDate).to.be.undefined)
        })
      })

      describe('setMax', function() {
        it('should be a function', function() {
          const picker = this.datepicker(singleDatepickerInput)
          expect(picker.setMax).to.be.a('function')
        })

        it('should populate `maxDate` on the instance object', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const date = new Date()

          expect(picker.maxDate).to.be.undefined
          picker.setMax(date)
          expect(+picker.maxDate).to.equal(+new Date(date.getFullYear(), date.getMonth(), date.getDate()))
        })

        it('should disable dates after to the provided value (including later months)', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const maxDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), maxDay)

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('1')
              expect(day, `Days shouldn't have qs-disabled class prior to calling setMax.`).not.to.have.class('qs-disabled')
            })

            picker.setMax(date)
          })

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach((day, i) => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal(i < maxDay ? '1' : '0.2')

              if (i < maxDay) {
                expect(day, 'Unaffected days from setMax').not.to.have.class('qs-disabled')
              } else {
                expect(day, 'Disabled days from setMax').to.have.class('qs-disabled')
              }
            })
          })

          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('0.2')
              expect(day).to.have.class('qs-disabled')
            })
          })

          cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click()
          cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).then($days => {
            Array.from($days).forEach(day => {
              const styles = getComputedStyle(day)

              expect(styles.opacity).to.equal('1')
              expect(day).not.to.have.class('qs-disabled')
            })
          })
        })

        it('should prevent disabled dates from being selected', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const maxDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), maxDay)
          picker.setMax(date)

          // Assert a few values prior to clicking.
          cy.get(singleDatepickerInput).should('have.value', '')
          expect(picker.dateSelected).to.be.undefined

          // Click a disabled date and assert a few more values.
          cy.get(singleDatepickerInput).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(maxDay + 1).click()
          cy.wait(1).then(() => {
            cy.get(singleDatepickerInput).should('have.value', '')
            expect(picker.dateSelected).to.be.undefined
          })

          // Navigate to the next month and assert you can't click dates.
          cy.get(`${selectors.single.controls} .qs-arrow.qs-right`).click().then(() => {
            cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(0).click()
            cy.wait(1).then(() => {
              cy.get(singleDatepickerInput).should('have.value', '')
              expect(picker.dateSelected).to.be.undefined
            })
          })

          // For sanity reasons, assert that clicking a non-disabled date works.
          cy.get(`${selectors.single.controls} .qs-arrow.qs-left`).click()
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"]`).eq(maxDay - 1).click()
          cy.wait(1).then(() => {
            cy.get(singleDatepickerInput).should('not.have.value', '')
            expect(picker.dateSelected).not.to.be.undefined
          })
        })

        it('should remove the maximum selectable date when called with no argument', function() {
          const picker = this.datepicker(singleDatepickerInput)
          const maxDay = 15
          const today = new Date()
          const date = new Date(today.getFullYear(), today.getMonth(), maxDay)
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
          picker.setMax(date)

          cy.get(`${selectors.single.squaresContainer} [data-direction="0"].qs-disabled`)
            .should('have.length', daysInMonth - maxDay)
            .then(() => {
              expect(picker.maxDate).not.to.be.undefined
              picker.setMax()
            })
          cy.get(`${selectors.single.squaresContainer} [data-direction="0"].qs-disabled`)
            .should('have.length', 0)
            .then(() => expect(picker.maxDate).to.be.undefined)
        })
      })

      describe.only('show', function() {

      })

      describe('hide', function() {})
      describe('remove', function() {})
      describe('navigate', function() {})
      describe('setDate', function() {})
    })
  })

  describe('Daterange pair', function() {
    it('(they) should have the correct properties and values', function() {
      const options = { id: Math.random() } // Using Math.random to showcase that the id just needs to be consistent between both instances.
      const startPicker = this.datepicker(daterangeInputStart, options)
      const endPicker = this.datepicker(daterangeInputEnd, options)

      daterangeSanityCheck(startPicker, endPicker)

      ;['start', 'end'].forEach(type => {
        const pickerToCheck = type === 'start' ? startPicker : endPicker
        const pickerProperties = getDaterangeProperties(type, startPicker, endPicker)
        pickerProperties.forEach(checkPickerProperties(pickerToCheck, true, options.id))

        // Ensure that only and all the properties are in the picker instance.
        const pickerKeys = Object.keys(pickerToCheck)
        const numOfPropertiesExpected = pickerProperties.length

        expect(pickerKeys).to.have.length(numOfPropertiesExpected)

        pickerProperties.forEach(({ property }) => {
          expect(pickerToCheck, property).to.haveOwnProperty(property)
        })
      })
    })

    it('(they) should have the correct DOM structure(s)', function() {
      const startPicker = this.datepicker(daterangeInputStart, { id: 1 })
      const endPicker = this.datepicker(daterangeInputEnd, { id: 1 })

      daterangeSanityCheck(startPicker, endPicker)
      testDomStructure('daterangeStart', selectors.range.start)
      testDomStructure('daterangeEnd', selectors.range.end)
    })

    describe('Basic visuals and behavior', function() {
      it('(they) are initially hidden in the DOM', function() {
        const startPicker = this.datepicker(daterangeInputStart, { id: 1 })
        const endPicker = this.datepicker(daterangeInputEnd, { id: 1 })

        daterangeSanityCheck(startPicker, endPicker)

        cy.get(selectors.range.start.calendarContainer).should('not.be.visible')
        cy.get(selectors.range.end.calendarContainer).should('not.be.visible')
      })

      it('(they) should show the calendar (individually) when clicking into the input (and not show the overlay)', function() {
        const startPicker = this.datepicker(daterangeInputStart, { id: 1 })
        const endPicker = this.datepicker(daterangeInputEnd, { id: 1 })

        daterangeSanityCheck(startPicker, endPicker)

        cy.get(daterangeInputStart).click()
        cy.get(selectors.range.start.calendarContainer).should('be.visible')
        cy.get(selectors.range.start.overlay).then($overlay => {
          const message = '.qs-overlay (start) styles'
          const styles = getComputedStyle($overlay[0])

          expect(styles.opacity, message).to.equal('0')
          expect(styles.zIndex, message).to.equal('-1')
        })

        cy.get(daterangeInputEnd).click()
        cy.get(selectors.range.start.calendarContainer).should('not.be.visible')
        cy.get(selectors.range.end.calendarContainer).should('be.visible')
        cy.get(selectors.range.end.overlay).then($overlay => {
          const message = '.qs-overlay (end) styles'
          const styles = getComputedStyle($overlay[0])

          expect(styles.opacity, message).to.equal('0')
          expect(styles.zIndex, message).to.equal('-1')
        })
      })

      it('(they) should change months when the arrows are clicked, not affecting the other', function() {
        const today = new Date()
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const startPicker = this.datepicker(daterangeInputStart, { id: 1 })
        const endPicker = this.datepicker(daterangeInputEnd, { id: 1 })

        daterangeSanityCheck(startPicker, endPicker)

        cy.get(daterangeInputStart).click()
        cy.get(`${selectors.range.start.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.range.start.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
        cy.get(daterangeInputEnd).click()
        cy.get(`${selectors.range.end.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.range.end.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)

        cy.get(daterangeInputStart).click()
        cy.get(`${selectors.range.start.controls} .qs-arrow.qs-left`).click()
        cy.get(`${selectors.range.start.controls} .qs-month`).should('have.text', pickerProperties.months[previousMonthDate.getMonth()])
        cy.get(`${selectors.range.start.controls} .qs-year`).should('have.text', `${previousMonthDate.getFullYear()}`)
        cy.get(daterangeInputEnd).click()
        cy.get(`${selectors.range.end.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.range.end.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)

        cy.get(daterangeInputStart).click()
        cy.get(`${selectors.range.start.controls} .qs-arrow.qs-right`).click()
        cy.get(`${selectors.range.start.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.range.start.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
        cy.get(daterangeInputEnd).click()
        cy.get(`${selectors.range.end.controls} .qs-month`).should('have.text', pickerProperties.months[today.getMonth()])
        cy.get(`${selectors.range.end.controls} .qs-year`).should('have.text', `${today.getFullYear()}`)
      })
    })

    describe('Date changes', function() {
      let today
      let todaysDate
      let startDayIndex
      let endDayIndex
      let startDateSelected
      let endDateSelected
      let dataDir0
      let pickerStart
      let pickerEnd
      let daysInRange

      beforeEach(function () {
        today = new Date()
        todaysDate = today.getDate()
        startDayIndex = todaysDate === 1 ? 1 : 0
        endDayIndex = 19
        startDateSelected = new Date(today.getFullYear(), today.getMonth(), startDayIndex + 1)
        endDateSelected = new Date(today.getFullYear(), today.getMonth(), endDayIndex + 1)
        dataDir0 = '[data-direction="0"]'
        pickerStart = this.datepicker(daterangeInputStart, { id: 1 })
        pickerEnd = this.datepicker(daterangeInputEnd, { id: 1 })
        daysInRange = (endDayIndex + 1) - (startDayIndex + 1) - 1

        daterangeSanityCheck(pickerStart, pickerEnd)
      })

      function selectStartDate() {
        // Open the START calendar and click on a day.
        cy.get(daterangeInputStart).should('have.value', '').click()
        cy.get(selectors.range.start.calendarContainer).should('be.visible')
        cy.get(`${selectors.range.start.squaresContainer} ${dataDir0}`).eq(startDayIndex).click()
      }

      function selectEndDate() {
        // Open the END calendar and click on a day.
        cy.get(daterangeInputEnd).click()
        cy.get(selectors.range.end.calendarContainer).should('be.visible')
        cy.get(`${selectors.range.end.squaresContainer} ${dataDir0}`).eq(endDayIndex).click()
      }

      it('should have the correct props on both pickers prior to date selection', function() {
        expect(pickerStart.dateSelected, 'pickerStart.dateSelected - before start date selection').to.be.undefined
        expect(pickerStart.minDate, 'pickerStart.minDate - before start date selection').to.be.undefined
        expect(pickerStart.maxDate, 'pickerStart.maxDate - before start date selection').to.be.undefined
        expect(pickerEnd.dateSelected, 'pickerEnd.dateSelected - before start date selection').to.be.undefined
        expect(pickerEnd.minDate, 'pickerEnd.minDate - before start date selection').to.be.undefined
        expect(pickerEnd.maxDate, 'pickerEnd.maxDate - before start date selection').to.be.undefined
      })

      it('should have both calendars hidden prior to any action', function() {
        cy.get(selectors.range.start.calendarContainer).should('not.be.visible')
        cy.get(selectors.range.end.calendarContainer).should('not.be.visible')
        cy.get(daterangeInputStart).should('have.value', '')
        cy.get(daterangeInputEnd).should('have.value', '')
      })

      // SELECTING START DATE ONLY

      it('should select a day on the start calendar and highlight it', function() {
        selectStartDate()

        cy.get('.qs-active').should('have.length', 1) // Only 1 selected day in the entire DOM.
        cy.get(`${selectors.range.start.squaresContainer} .qs-active`)
          .should('have.text', `${startDayIndex + 1}`)
          .should('not.have.class', 'qs-range-start') // This class should only be added once a range is selected.
          .then($selectedDay => {
            const { backgroundColor, borderRadius } = getComputedStyle($selectedDay[0])

            // Background color "highlighted" check.
            expect(backgroundColor, 'Selected day').to.equal('rgb(173, 216, 230)')

            // All 4 corners should have a border radius.
            expect(borderRadius.split(' ').length, 'border radius - 1 value for all 4 corners').to.equal(1)
            expect(borderRadius.endsWith('px'), 'border radius value ends with "px"').to.be.true
            expect(borderRadius.startsWith('0'), 'border radius should not be 0').to.be.false
          })
      })

      it('should only populate the start input field after selecting a start date', function() {
        selectStartDate()

        cy.get(daterangeInputStart).should('have.value', startDateSelected.toDateString())
        cy.get(daterangeInputEnd).should('have.value', '')
      })

      it('should set some props on both pickers after selecting a start date', function() {
        selectStartDate()

        cy.wait(1).then(() => {
          expect(+pickerStart.dateSelected, 'pickerStart.dateSelected - after start date selection').to.equal(+startDateSelected)
          expect(pickerStart.minDate, 'pickerStart.minDate - after start date selection').to.be.undefined
          expect(pickerStart.maxDate, 'pickerStart.maxDate - after start date selection').to.be.undefined
          expect(pickerEnd.dateSelected, 'pickerEnd.dateSelected - after start date selection').to.be.undefined
          expect(+pickerEnd.minDate, 'pickerEnd.minDate - after start date selection').to.equal(+startDateSelected)
          expect(pickerEnd.maxDate, 'pickerEnd.maxDate - after start date selection').to.be.undefined
        })
      })

      // SELECTING END DATE ONLY

      it('should select a day on the end calendar and highlight it', function() {
        selectEndDate()

        cy.get('.qs-active').should('have.length', 1) // Only 1 selected day in the entire DOM.
        cy.get(`${selectors.range.end.squaresContainer} .qs-active`)
          .should('have.text', `${endDayIndex + 1}`)
          .should('not.have.class', 'qs-range-endf') // This class should only be added once a range is selected.
          .then($selectedDay => {
            const { backgroundColor, borderRadius } = getComputedStyle($selectedDay[0])

            // Background color "highlighted" check.
            expect(backgroundColor, 'Selected day').to.equal('rgb(173, 216, 230)')

            // All 4 corners should have a border radius.
            expect(borderRadius.split(' ').length, 'border radius - 1 value for all 4 corners').to.equal(1)
            expect(borderRadius.endsWith('px'), 'border radius value ends with "px"').to.be.true
            expect(borderRadius.startsWith('0'), 'border radius should not be 0').to.be.false
          })
      })

      it('should only populate the end input field after selecting an end date', function() {
        selectEndDate()

        cy.get(daterangeInputEnd).should('have.value', endDateSelected.toDateString())
        cy.get(daterangeInputStart).should('have.value', '')
      })

      it('should set some props on both pickers after selecting an end date', function() {
        selectEndDate()

        cy.wait(1).then(() => {
          expect(pickerStart.dateSelected, 'pickerStart.dateSelected - after end date selection').to.be.undefined
          expect(pickerStart.minDate, 'pickerStart.minDate - after end date selection').to.be.undefined
          expect(+pickerStart.maxDate, 'pickerStart.maxDate - after end date selection').to.equal(+endDateSelected)
          expect(+pickerEnd.dateSelected, 'pickerEnd.dateSelected - after end date selection').to.equal(+endDateSelected)
          expect(pickerEnd.minDate, 'pickerEnd.minDate - after end date selection').to.be.undefined
          expect(pickerEnd.maxDate, 'pickerEnd.maxDate - after end date selection').to.be.undefined
        })
      })

      // SELECTING START AND END DATES

      it('should have two highlighted days and a range on each calendar after selecting start and end dates', function() {
        selectStartDate()
        selectEndDate()

        // We should now have 2 highlighted days (start and end dates) and a range on each calendar.
        cy.get(`${selectors.range.start.squaresContainer} .qs-active`)
          .should('have.length', 1)
          .should('have.class', 'qs-range-start')
        cy.get(`${selectors.range.start.squaresContainer} .qs-range-start`).should('have.length', 1)
        cy.get(`${selectors.range.start.squaresContainer} .qs-range-end`).should('have.length', 1)
        cy.get(`${selectors.range.end.squaresContainer} .qs-active`)
          .should('have.length', 1)
          .should('have.class', 'qs-range-end')
        cy.get(`${selectors.range.end.squaresContainer} .qs-range-start`).should('have.length', 1)
        cy.get(`${selectors.range.end.squaresContainer} .qs-range-end`).should('have.length', 1)

        // We should now have a range on each calendar (not including the start & end dates).
        cy.get(`${selectors.range.start.squaresContainer} .qs-range-middle`).should('have.length', daysInRange)
        cy.get(`${selectors.range.end.squaresContainer} .qs-range-middle`).should('have.length', daysInRange)

        // The selected dates on both calendars should have the correct bg-color & some rounded corners.
        ;[
          `${selectors.range.start.squaresContainer} .qs-active.qs-range-start`,
          `${selectors.range.start.squaresContainer} .qs-range-end`,
        ].forEach((selector, i) => {
          const isStart = i === 0
          cy.get(selector).then($el => {
            const { backgroundColor, borderRadius } = getComputedStyle($el[0])
            const radii = borderRadius.split(' ')
            const [topLeft, topRight, bottomRight, bottomLeft] = radii

            // Background color "highlighted" check.
            expect(backgroundColor, `Selected day (range ${isStart ? 'start' : 'end'} date) bg color`).to.equal('rgb(173, 216, 230)')

            // Only the right 2 corners should have a border radius.
            expect(radii.length, 'border radius - 4 values').to.equal(4)
            expect(topLeft.startsWith('0'), 'border-radius value - top left').to.equal(!isStart)
            expect(topRight.startsWith('0'), 'border-radius value - top right').to.equal(isStart)
            expect(bottomRight.startsWith('0'), 'border-radius value - bottom right').to.equal(isStart)
            expect(bottomLeft.startsWith('0'), 'border-radius value - bottom left').to.equal(!isStart)
          })
        })

        // The ranges on both calendars should have the correct bg-color and no rounded corners.
        ;[
          `${selectors.range.start.squaresContainer} .qs-range-middle`,
          `${selectors.range.start.squaresContainer} .qs-range-middle`,
        ].forEach((selector, i) => {
          const isStart = i === 0
          cy.get(selector).then($rangeDates => {
            Array.from($rangeDates).forEach(rangeDate => {
              const { backgroundColor, borderRadius } = getComputedStyle(rangeDate)

              // Background color "highlighted" check.
              expect(backgroundColor, `Range day (${isStart ? 'start' : 'end'} calendar) bg color`).to.equal('rgb(212, 235, 242)')

              // All 4 corners should have no radius
              expect(borderRadius, `border-radius value - ${isStart ? 'start' : 'end'} calendar`).to.equal('0px')
            })
          })
        })
      })

      it('should populate both input fields after selecting both dates', function() {
        selectStartDate()
        selectEndDate()

        cy.get(daterangeInputStart).should('have.value', startDateSelected.toDateString())
        cy.get(daterangeInputEnd).should('have.value', endDateSelected.toDateString())
      })

      it('should set some props on both pickers after selecting both dates', function() {
        selectStartDate()
        selectEndDate()

        cy.wait(1).then(() => {
          expect(+pickerStart.dateSelected, 'pickerStart.dateSelected - after end date selection').to.equal(+startDateSelected)
          expect(pickerStart.minDate, 'pickerStart.minDate - after end date selection').to.be.undefined
          expect(+pickerStart.maxDate, 'pickerStart.maxDate - after end date selection').to.equal(+endDateSelected)
          expect(+pickerEnd.dateSelected, 'pickerEnd.dateSelected - after end date selection').to.equal(+endDateSelected)
          expect(+pickerEnd.minDate, 'pickerEnd.minDate - after end date selection').to.equal(+startDateSelected)
          expect(pickerEnd.maxDate, 'pickerEnd.maxDate - after end date selection').to.be.undefined
        })
      })
    })
  })
})


x.describe('Initial calendar load with default settings', () => {


  describe('Instance methods', () => {
    describe('show', () => {
      before(() => {
        cy.get('body').click()
        cy.get('.qs-datepicker-container')
          .should('not.be.visible')
      })

      it('should show the calendar when called', () => {
        picker.show()
        cy.get('.qs-datepicker-container')
          .should('be.visible')
      })
    })

    describe('hide', () => {
      it('should hide the calendar when called', () => {
        picker.hide()
        cy.get('.qs-datepicker-container')
          .should('not.be.visible')
      })
    })

    describe('remove', () => {
      before(() => {
        cy.get('.qs-datepicker-container')
          .should('have.length', 1)
      })

      it('should completely nuke the instance object', () => {
        const originalNumOfProps = Object.keys(picker).length
        picker.remove()
        const numOfProps = Object.keys(picker).length

        expect(originalNumOfProps).to.be.gt(0)
        expect(numOfProps).to.equal(0)
      })

      it('should remove the calendar from the DOM', () => {
        cy.get('.qs-datepicker-container')
          .should('have.length', 0)
      })
    })
  })
})