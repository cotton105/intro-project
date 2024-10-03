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
        // Check that the "add person" button can be accessed
        const addpersonbutton = await driver.findElement( By.id( "addperson" ) )
        const personform = await driver.findElement( By.id( "personform" ) )
        await addpersonbutton.click()
        driver.wait( until.elementIsVisible( personform ) )
        assert( await personform.isDisplayed() )
        // Check that new user information can be submitted through the form
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
        assert( !( await personform.isDisplayed() ) )
        // Check that the new user is added to the table
        const peopletable = await driver.findElement( By.id( "peopletable" ) )
        const lastaddedrow = await peopletable.findElements( By.css( "tbody > tr" ) ).then( rows => rows.at( -1 ) )
        const addedperson = await lastaddedrow.getProperty( "person" )
        assert( attributesmatch( person, addedperson ) )
      } )

      it( "should allow editing an existing person", async function () {
        await driver.get( homepageurl )
        // Check that the "edit" button can be accessed for a specified row
        const targeteditid = 1
        const peopletable = await driver.findElement( By.id( "peopletable" ) )
        const personform = await driver.findElement( By.id( "personform" ) )
        const editpersonbutton = await peopletable.findElements( By.css( "tbody > tr" ) )
          .then( rows => rows.at( targeteditid - 1 ) )
          .then( async targetrow => await targetrow.findElement( By.className( "editperson" ) ) )
        await editpersonbutton.click()
        driver.wait( until.elementIsVisible( personform ) )
        assert( await personform.isDisplayed() )
        // Check that new details can be entered for the existing user
        const person = {
          name: "Frontend test (edit)",
          email: "test@example.com",
          notes: "Edited by frontend test for editing an existing user"
        }
        for( const attribute of Object.keys( person ) ) {
          const personvalue = person[attribute]
          const forminput = await driver.findElement( By.id( `personform-${attribute}` ) )
          await forminput.clear()
          await forminput.sendKeys( personvalue )
        }
        const submitbutton = await personform.findElement( By.id( "personform-submit" ) )
        await submitbutton.click()
        driver.wait( until.elementIsNotVisible( personform ) )
        assert( !( await personform.isDisplayed() ) )
        // Check edits are correctly applied
        const targetrow = await peopletable.findElements( By.css( "tbody > tr" ) )
          .then( rows => rows.at( targeteditid - 1 ) )
        const editedperson = await targetrow.getProperty( "person" )
        assert( attributesmatch( person, editedperson ) )
      } )

      after( async function () {
        await driver.quit()
      } )
    } )
  } )
} )