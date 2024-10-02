require( "../index" )

const assert = require( "assert" )
const firefox = require( "selenium-webdriver/firefox" )
const { Builder, Browser, By, Key, until } = require( "selenium-webdriver" )

const config = require( "../config" )

let driver

describe( "Frontend tests", async function () {
  before( async function () {
    driver = await new Builder()
      .forBrowser( Browser.FIREFOX )
      .setFirefoxOptions( new firefox.Options().addArguments( "--headless" ) )
      .build()
  } )

  it( "web page should be accessible", async function () {
    await driver.get( `http://localhost:${config.port}` )
    const expectedtitle = "Work!"
    const pagetitle = await driver.getTitle()
    assert( expectedtitle === pagetitle, `Page title was "${pagetitle}" - expected "${expectedtitle}".` )
  } )

  it( "should correctly display the users in the database on the table", async function () {
    throw new Error( "Unimplemented test." )
  } )

  after( async function () {
    await driver.quit()
  } )
} )
