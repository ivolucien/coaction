# coaction

**coaction** is a container for clients that you wish to manage as a distributed transaction.

## `Unreleased PRE-ALPHA status`

I am humbled, participating fully in a family with children. Until you see a release version, please consider this project somewhere between a pipe dream and hubris.

## Project Goal

The coaction module is intended to manage transactions over diverse data stores, via their clients, keeping them all as eventually consistent as practical, using a very simple interface.

Where possible more sophisticated distributed transaction handlers are to be implemented, wrapped by simple methods. However the core methods must remain easy to use by a junior developer.

## User Documentation

### tl;dr

```bash
$ npm install coaction
```

```javascript
const CoAction = require('coaction')
const log = require('my-log')

let coAct = new CoAction({ dbMaster: mysql2, legacyDb: mysql }, { logger: log })
coAct.transaction();

Promise.all([
  coAct.dbMaster.query(<Update the shiny>),
  coAct.legacyDb.query(<Update zombie db>)
])
.then(() => coAct.commit())
.catch((err) => coAct.rollback())
```

### constructor(clientObjectMap)

For now all clients are passed to the `CoAction` constructor as an object map of name - client pairs. The object keys are used to define getters for the clients directly on the coaction instance.

Options, if any, are passed as properties of the 2nd argument.

```javascript
// names meaningful to the caller:
let coAct = new CoAction({ dbMaster: mysql2, legacyDb: mysql }, { logger: log })

coAct.dbMaster.execute('SELECT * FROM `kids_toys LIMIT 1000')   // coAct has a dbMaster getter!
```

### Transaction Management

All of these methods return a promise of an array containing the return value(s) of the individual client methods. This is a temporary measure and will be replaced by another data structure containing the client results by name.

If any client returns an error, the return value is the first rejected promise resolving to a client's Error object. This is also a temporary measure, the plan is to return a coaction error, containing a named map of client(s) errors.

Each of the below methods call the equivalent method on each client. For now the client must support a method with the same name itself, but down the roadmap a bit there will be client wrappers for an increasing number of data store clients.

#### `transaction()'

Begin distributed transaction for all clients.

#### `commit()`

Accept changes and end transaction.

#### `rollback()`

Reject changes and end transaction.

### Client Management

Bare bones for now, more are planned, including adding and removing clients.

#### `size()`

Returns the count of named clients passed to this instance's constructor.

#### `clients()`

Returns the original object map passed to the constructor.  This will change soon, perhaps to a frozen client collection wrapper.

#### `names()`

Returns the client names in an array, in the order returned by Object.keys(). This is used as a convenience method internally.

## Ongoing Development

This project is agile and incremental. When practical larger features will be released as a series of smaller features. Features have unit and integration tests, primarily covering the happy path until such time as folks show interest in using coaction in real world production environments.

No functionality will be added that interferes with keeping the module easy to understand and use.

Feature stories and bugs are organized in the github Project tab, just a click away. And there will be a blog-like thing for the project in a future milestone -- for debate, soliloquy and to lure in coders who have time on their hands.

### Project Management

[github project](https://github.com/ivolucien/coaction/projects/1) for coaction
