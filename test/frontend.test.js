require( "../index" )

const assert = require( "assert" )
const firefox = require( "selenium-webdriver/firefox" )
const chrome = require( "selenium-webdriver/chrome" )
const { Builder, Browser, By, Key, until } = require( "selenium-webdriver" )

const config = require( "../config" )
const { attributesmatch } = require( "../util/objects" )

const homepageurl = `http://localhost:${config.port}`

describe( "Frontend tests", function () {
  this.retries( 2 )
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
        assert.equal( pagetitle, expectedtitle )
      } )

      it( "should correctly display the users in the database on the table", async function () {
        const getresponse = await fetch( `${homepageurl}/api/people` )
        if( !getresponse.ok ) {
          throw new Error( getresponse )
        }
        const apipeople = await getresponse.json()
        await driver.get( homepageurl )
        const tablerows = await getpeopletablerows( driver )
        assert.equal( tablerows.length, apipeople.length )
        for( let i = 0; i < apipeople.length; i++ ) {
          const apipersonname = apipeople[i].name
          const rowcolumns = await tablerows[i].findElements( By.css( "td" ) )
          const tablepersonname = await rowcolumns[0].getText()
          assert.equal( tablepersonname, apipersonname )
        }
      } )

      it( "should allow adding a new person", async function () {
        await driver.get( homepageurl )
        // Check that the "add person" button can be accessed
        const addpersonbutton = await driver.findElement( By.id( "addperson" ) )
        const personform = await driver.findElement( By.id( "personform" ) )
        await addpersonbutton.click()
        await driver.wait( until.elementIsVisible( personform ) )
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
        await driver.wait( until.elementIsNotVisible( personform ) )
        assert( !( await personform.isDisplayed() ) )
        // Check that the new user is added to the table
        const tablerows = await getpeopletablerows( driver )
        const lastaddedrow = tablerows.at( -1 )
        const addedperson = await lastaddedrow.getProperty( "person" )
        assert( attributesmatch( person, addedperson ) )
      } )

      it( "should allow editing an existing person", async function () {
        await driver.get( homepageurl )
        // Check that the "edit" button can be accessed for a specified row
        const targeteditid = 1
        const personform = await driver.findElement( By.id( "personform" ) )
        let tablerows = await getpeopletablerows( driver )
        let targetrow = tablerows.at( targeteditid - 1 )
        const editpersonbutton = await targetrow.findElement( By.className( "editperson" ) )
        await editpersonbutton.click()
        await driver.wait( until.elementIsVisible( personform ) )
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
        await driver.wait( until.elementIsNotVisible( personform ) )
        assert( !( await personform.isDisplayed() ) )
        // Check edits are correctly applied
        tablerows = await getpeopletablerows( driver )
        targetrow = tablerows.at( targeteditid - 1 )
        const editedperson = await targetrow.getProperty( "person" )
        assert( attributesmatch( person, editedperson ) )
      } )

      it( "should allow deleting an existing person", async function () {
        await driver.get( homepageurl )
        // Check the confirmation form is displayed
        const targetrownumber = 0
        let tablerows = await getpeopletablerows( driver )
        const deleteform = await driver.findElement( By.id( "confirmdeletionform" ) )
        const targetrow = await tablerows.at( targetrownumber )
        const personid = await targetrow.getProperty( "person" )
          .then( person => person.id )
        const deletepersonbutton = await targetrow.findElement( By.className( "deleteperson" ) )

        await deletepersonbutton.click()
        await driver.wait( until.elementIsVisible( deleteform ) )
        assert( await deleteform.isDisplayed() )
        // Check that the delete confirmation can be submitted
        const confirmbutton = await driver.findElement( By.id( "confirmdeletionform-submit" ) )
        await confirmbutton.click()
        await driver.wait( until.elementIsNotVisible( deleteform ) )
        assert( !( await deleteform.isDisplayed() ) )
        // Check that the user is successfully removed from the table
        // const users = await tablerows.map( async row => await row.getProperty( "person" ) )
        const users = []
        tablerows = await getpeopletablerows( driver )
        for( const row of tablerows ) {
          const person = await row.getProperty( "person" )
          users.push( person )
        }
        const targetuser = users.filter( user => user.id === personid )[0]
        assert.strictEqual( targetuser, undefined )
      } )

      after( async function () {
        await driver.quit()
      } )
    } )
  } )
} )

async function getpeopletablerows( driver ) {
  return await driver.findElement( By.id( "peopletable" ) )
    .then( async peopletable => await peopletable.findElements( By.css( "tbody > tr" ) ) )
}