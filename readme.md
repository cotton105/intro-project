

# Implementations
With the below instructions in mind, here are the additions I have made to the repo:
- Added Mocha tests.
- Implemented UI "edit" functionality.
- Implemented persistent data with SQLite (configurable with `DB_PATH` env variable).
- Added *Landlord* & *Building* columns.
- Restored subheaders under *Schedule*.
- Adjusted button colours.
- Fixed several linting errors.

## My Run Configuration
Because there are no specified program versions, here is the configuration I'm using:
```bash
$ npm --version
10.5.0
$ node --version
v21.7.3
```

# Example starter project

## Running

This is a complete Node application. It can be run from the command line or within a Docker container:

```
node ./index.js
```

Then point a browser to `http://localhost:3000`

## Fork

Please fork this repo before you start work. When you have completed your project we would like you to present your work.

## Tasks

Some tasks - choose as many or as few as you would like to complete.

1. Add some tests - a test suite such as Mocha will require adding. The Node backend functions require testing as well as front end functions.
2. The person table needs to be completed - at the very least complete the edit function.
3. Convert the backend to use a non-volatile data store - a simple option would be to build in support for SQLite to save data to a database.
4. We need to add further elements - Landlords and Buildings. Buildings require Rooms.
5. Consider the UI - can it be improved - what would you suggest?

## Gotchas

1. Style matters.
2. ESlint and Javascript checking are enabled in this project for VScode - keep an eye on this (you can check for linting errors by running ``` npx eslint index.js ``` ).
3. Show us your git etiquette.
