# coaction

**coaction** is a container for sets of clients that you wish to manage as a distributed transaction.

### `Unreleased PRE-ALPHA status`

## Project Goal

The coaction module is intended to manage transactions over diverse data stores, via their clients, keeping them all as consistent as practical, using a very simple interface.

Where possible more sophisticated distributed transaction handlers are to be implemented, wrapped by simple methods. As long as the core methods remain easy to use by a junior developer.

## Development

I am humbled, participating fully in a family with children. Until you see a release version, please consider this project somewhere between a pipe dream and hubris.

That said, the project is agile and incremental. When practical larger features will be released as a series of smaller features. Features have unit and integration tests, primarily covering the happy path until such time as folks show interest in using coaction in real world production environments.

Keeping things simple, feature stories and bugs are organized in the github Project tab. There will be a blog-like thing for the project in the next milestone -- for debate, soliloquy and to lure in coders who have time on their hands.

## User Documentation

### tl;dr

```javascript
let coact = new CoAction({ dbMaster: mysql2, legacyDb: mysql })
coact.transaction();
Promise.all([ coact.dbMaster.query(<Update the things>), coact.legacyDb.query(<Update old crap>) ])
.then(() => coact.commit())
.catch((err) => coact.rollback())
```

### constructor(clientObjectMap)

For now all clients are passed to the `CoAction` constructor as an object map of name - client pairs. The object keys are used to define getters for the clients directly on the coaction instance.

```javascript
let coact = new CoAction({ dbMaster: mysql2, legacyDb: mysql }) // names meaningful to the caller
coact.dbMaster.execute('SELECT * FROM `kids_toys LIMIT 1000')   // coact has a dbMaster getter!
```

### Transaction Management

All of these methods return a promise of an array containing the return value(s) of the individual client methods. This is a temporary measure and will be replaced by another data structure containing the client results by name.

If any client returns an error, the return value is the first rejected promise resolving to a client's Error object. This is also a temporary measure, the plan is to return a coaction error, containing a named map of client(s) errors.

#### `transaction(), commit() and rollback()`

Calls the respective method on each client. For now the client must support that method itself, but down the roadmap a bit, there will be wrappers for an increasing number of data store clients.

### Client Management

Bare bones for now, more are planned, including adding and removing clients.

#### `size()`

Returns the count of named clients passed to this instance's constructor.

#### `clients()`

Returns the original object map passed to the constructor.  This will change soon, perhaps to a frozen client collection wrapper.

#### `names()`

Returns the client names in an array, in the order returned by Object.keys(). This is used as a convenience method internally.
