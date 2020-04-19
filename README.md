# Mowr 😺 makes using the Mongo client more comfy
![npm](https://img.shields.io/npm/v/mowr) ![GitHub file size in bytes](https://img.shields.io/github/size/osban/mowr/index.js?color=limegreen)  
A very thin convenience wrapper for the Mongo client.

## Installation
```
npm i mowr
```

## Usage
```js
const db = require('mowr')('localhost:27017/test', options)
const collection = db.get('collection')

const collection = require('mowr')('localhost/test', options).get('collection')
```

### Supported calls
```js
collection.find(query, options)    // returns array
collection.findc(query, options)   // returns cursor
collection.findOne(query, options) // returns object

collection.insert(object/array, options) // returns inserted object/array
collection.insertOne(object, options)    // returns inserted object
collection.insertMany(array, options)    // returns inserted array

collection.updateOne(query, update, options)  // -> {n: 1, nModified: 1, ok: 1}
collection.updateMany(query, update, options) // -> {n: 5, nModified: 5, ok: 1}
collection.replaceOne(query, update, options) // -> {n: 1, nModified: 1, ok: 1}

collection.deleteOne(query, options)  // -> {n: 1, ok: 1}
collection.deleteMany(query, options) // -> {n: 5, ok: 1}
```
Options are always optional, and passed as object.

When connecting, `'mongodb://'` is prepended if needed, and `useUnifiedTopology` is set to `true` (pass it as option to set it to `false`).

The `query` field can be an `_id` string (Mowr will convert it to an ObjectID) or a query object.

Depending on if an object or array is passed in, `insert` will call `insertOne` or `insertMany`.

If an update object contains an `_id` property, even if nested, it will be removed.

When passing options using `find`, `findc`, `findOne`, make sure to use a query (can be `{}`).

---
Thanks to [@fuzetsu](https://github.com/fuzetsu) for his invaluable help!