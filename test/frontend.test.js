require( "../index" )

const assert = require( "assert" )
const firefox = require( "selenium-webdriver/firefox" )
const chrome = require( "selenium-webdriver/chrome" )
const { Builder, Browser, By, Key, until } = require( "selenium-webdriver" )

const config = require( "../config" )
const { attributesmatch } = require( "../util/objects" )

const homepageurl = `http://localhost:${config.port}`

describe( "Frontend tests", function () {
  const browsers = [
    {
      name: "Firefox",
      driver: new Builder()
        .forBrowser( Browser.FIREFOX )
        .setFirefoxOptions( new firefox.Options().addArguments( "--headless" ) )
    },
    {
      name: "Chrome",
      driver: new Builder()
        .forBrowser( Browser.CHROME )
        .setChromeOptions( new chrome.Options().addArguments( "--headless" ) )
    }
  ]

  // Run tests for each configured browser sequentially
  browsers.forEach( browser => {
    describe( browser.name, function () {
      let driver
      before( async function() {
        driver = browser.driver.build()
      } )

      it( "should correctly display the web page", async function () {
        await driver.get( homepageurl )
        const expectedtitle = "Work!"
        const pagetitle = await driver.getTitle()
        assert.equal( expectedtitle, pagetitle )
      } )

      it( "should correctly display the users in the database on the table", async function () {
        const getresponse = await fetch( `${homepageurl}/api/people` )
        if( !getresponse.ok ) {
          throw new Error( getresponse )
        }
        const apipeople = await getresponse.json()
        await driver.get( homepageurl )
        const table = await driver.findElement( By.id( "peopletable" ) )
        const tablerows = await table.findElements( By.css( "tbody > tr" ) )
        assert.equal( apipeople.length, tablerows.length )
        for( let i = 0; i < apipeople.length; i++ ) {
          const apipersonname = apipeople[i].name
          const rowcolumns = await tablerows[i].findElements( By.css( "td" ) )
          const tablepersonname = await rowcolumns[0].getText()
          assert.equal( apipersonname, tablepersonname )
        }
      } )

      it( "should allow adding a new person", async function () {
        await driver.get( homepageurl )
        const addpersonbutton = await driver.findElement( By.id( "addperson" ) )
        const personform = await driver.findElement( By.id( "personform" ) )
        await addpersonbutton.click()
        driver.wait( until.elementIsVisible( personform ) )
        assert( await personform.isDisplayed() )
        const person = {
          name: "Frontend test",
          email: "test@example.com",
          notes: "Added by frontend test for submitting a new user"
        }
        for( const attribute of Object.keys( person ) ) {
          const personvalue = person[attribute]
          const forminput = await driver.findElement( By.id( `personform-${attribute}` ) )
          await forminput.sendKeys( personvalue )
        }
        const submitbutton = await personform.findElement( By.id( "personform-submit" ) )
        await submitbutton.click()
        driver.wait( until.elementIsNotVisible( personform ) )
        const peopletable = await driver.findElement( By.id( "peopletable" ) )
        const lastaddedrow = await peopletable.findElements( By.css( "tbody > tr" ) ).then( rows => rows.at( -1 ) )
        const addedperson = await lastaddedrow.getProperty( "person" )
        assert( attributesmatch( person, addedperson ) )
      } )

      after( async function () {
        await driver.quit()
      } )
    } )
  } )
} )