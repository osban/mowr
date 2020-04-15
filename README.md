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

collection.find(query, options)    // returns array
collection.findCur(query, options) // returns cursor
collection.findOne(query, options)

collection.insert(object/array, options)
collection.insertOne(object, options)
collection.insertMany(array, options)

collection.updateOne(query, update, options)
collection.updateMany(query, update, options)

collection.deleteOne(query, options)
collection.deleteMany(query, options)
```
Options are always optional, and passed as object.  
When connecting, 'mongodb://' is prepended if needed, and `useUnifiedTopology` is set to `true` (pass it as option to set it to `false`).
The `query` field can be an `_id` string (Mowr will convert it to an ObjectID) or a query object.  
When passing options using `find`, `findCur`, `findOne`, make sure to use a query (can be `{}`).