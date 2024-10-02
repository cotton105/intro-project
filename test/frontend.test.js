require( "../index" )

const assert = require( "assert" )
const firefox = require( "selenium-webdriver/firefox" )
const chrome = require( "selenium-webdriver/chrome" )
const { Builder, Browser, By, Key, until } = require( "selenium-webdriver" )

const config = require( "../config" )
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
        assert( expectedtitle === pagetitle, `Page title was "${pagetitle}" - expected "${expectedtitle}".` )
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

      after( async function () {
        await driver.quit()
      } )
    } )
  } )
} )