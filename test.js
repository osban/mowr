const ca       = require("./node_modules/clean-assert/index.js")
const ObjectId = require('./node_modules/mongodb/index.js').ObjectId
const coll     = require('./index.js')('localhost/test').get('coll')

const ins1 = {foo: 'foo', bar: 'bar', baz: 'baz'}
const ins2 = [{foo: 'foo', bar: 'bar', baz: 'baz'}, {omg: 'omg', wtf: 'wtf', bbq: 'bbq'}]
const upd1 = {foo: 'abc', def: 'def', baz: 'ghi'}
const rep1 = {abc: 'abc', def: 'def', ghi: 'ghi'}
const rep2 = {def: 'foo'}
const rep3 = {ghi: 'foo'}

let list = []

const logit = (...args) => console.log(...args)
const clone = x => JSON.parse(JSON.stringify(x))

;(async () => {
  try {
    logit('---------------------------------------------')
    await coll.insert(clone(ins1))
    .then(x => {
      ca.hasIn(x, 'insertedCount', 1)
      logit('01 - insert (one) PASSED')
    })

    await coll.insert(clone(ins2))
    .then(x => {
      ca.hasIn(x, 'insertedCount', 2)
      ca.equal(Object.keys(x.insertedIds).length, 2)
      logit('02 - insert (many) PASSED')
    })

    await coll.find()
    .then(x => {
      ca.is('array', x)
      list = x
      logit('03 - find PASSED')
    })

    await coll.findc()
    .then(x => {
      x.count()
      .then(res => {
        ca.equal(res, 3)
        logit('04 - findc PASSED')
      })
    })

    await coll.findOne((list[0]._id + ''))
    .then(x => {
      ca.hasAllOwn(x, ins1)
      logit('05 - findOne string _id PASSED')
    })

    await coll.findOne({_id: ObjectId(list[0]._id + '')})
    .then(x => {
      ca.hasAllOwn(x, ins1)
      logit('06 - findOne object _id PASSED')
    })

    await coll.updateOne((list[0]._id + ''), {$set: upd1})
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 1, modifiedCount: 1})
      logit('07 - updateOne without _id PASSED')
    })

    await coll.updateOne((list[0]._id + ''), {$set: {...ins1, _id: (list[0]._id + '')}})
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 1, modifiedCount: 1})
      logit('08 - updateOne with _id PASSED')
    })

    await coll.replaceOne({def: 'def'}, rep1)
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 1, modifiedCount: 1})
      logit('09 - replaceOne without _id PASSED')
    })

    await coll.replaceOne({foo: 'foo'}, {...rep1, _id: (list[0]._id + '')})
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 1, modifiedCount: 1})
      logit('10 - replaceOne with _id PASSED')
    })

    await coll.updateMany({abc: 'abc'}, {$set: rep2})
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 2, modifiedCount: 2})
      logit('11 - updateMany without _id PASSED')
    })

    await coll.updateMany({abc: 'abc'}, {$set: {...rep3, _id: (list[0]._id + '')}})
    .then(x => {
      ca.hasAllOwn(x, {matchedCount: 2, modifiedCount: 2})
      logit('12 - updateMany with _id PASSED')
    })

    await coll.insertOne(clone(ins1))
    .then(x => {
      ca.hasIn(x, 'insertedCount', 1)
      logit('13 - insertOne PASSED')
    })

    await coll.insertMany(clone(ins2))
    .then(x => {
      ca.hasIn(x, 'insertedCount', 2)
      ca.equal(Object.keys(x.insertedIds).length, 2)
      logit('14 - insertMany PASSED')
    })

    await coll.deleteOne({omg: 'omg'})
    .then(x => {
      ca.hasIn(x, 'deletedCount', 1)
      logit('15 - deleteOne PASSED')
    })

    await coll.deleteMany({$or: [{abc: 'abc'}, {omg: 'omg'}, {foo: 'foo'}]})
    .then(x => {
      ca.hasIn(x, 'deletedCount', 5)
      logit('16 - deleteMany PASSED')
    })

    logit('---------------------------------------------')
    logit('All tests PASSED.')
    logit('---------------------------------------------')
  }

  catch (err) {logit(err)}
})()