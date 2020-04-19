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
    const x01 = await coll.insert(clone(ins1))
    ca.is('object', x01)
    ca.hasAllOwn(x01, ins1)
    logit('01 - insert (one) PASSED')

    const x02 = await coll.insert(clone(ins2))
    ca.is('array', x02)
    ca.equal(x02.length, 2)
    logit('02 - insert (many) PASSED')

    const x03 = await coll.find()
    ca.is('array', x03)
    list = x03
    logit('03 - find PASSED')

    const x04 = await coll.findc()
    const res = await x04.count()
    ca.equal(res, 3)
    logit('04 - findc PASSED')

    const x05 = await coll.findOne((list[0]._id + ''))
    ca.hasAllOwn(x05, ins1)
    logit('05 - findOne string _id PASSED')

    const x06 = await coll.findOne({_id: ObjectId(list[0]._id + '')})
    ca.hasAllOwn(x06, ins1)
    logit('06 - findOne object _id PASSED')

    const x07 = await coll.updateOne((list[0]._id + ''), {$set: upd1})
    ca.hasIn(x07, 'n', 1)
    ca.hasIn(x07, 'nModified', 1)
    ca.hasIn(x07, 'ok', 1)
    logit('07 - updateOne without _id PASSED')

    const x08 = await coll.updateOne((list[0]._id + ''), {$set: {...ins1, _id: (list[0]._id + '')}})
    ca.hasIn(x08, 'n', 1)
    ca.hasIn(x08, 'nModified', 1)
    ca.hasIn(x08, 'ok', 1)
    logit('08 - updateOne with _id PASSED')

    const x09 = await coll.replaceOne({def: 'def'}, rep1)
    ca.hasIn(x09, 'n', 1)
    ca.hasIn(x09, 'nModified', 1)
    ca.hasIn(x09, 'ok', 1)
    logit('09 - replaceOne without _id PASSED')

    const x10 = await coll.replaceOne({foo: 'foo'}, {...rep1, _id: (list[0]._id + '')})
    ca.hasIn(x10, 'n', 1)
    ca.hasIn(x10, 'nModified', 1)
    ca.hasIn(x10, 'ok', 1)
    logit('10 - replaceOne with _id PASSED')

    const x11 = await coll.updateMany({abc: 'abc'}, {$set: rep2})
    ca.hasIn(x11, 'n', 2)
    ca.hasIn(x11, 'nModified', 2)
    ca.hasIn(x11, 'ok', 1)
    logit('11 - updateMany without _id PASSED')

    const x12 = await coll.updateMany({abc: 'abc'}, {$set: {...rep3, _id: (list[0]._id + '')}})
    ca.hasIn(x12, 'n', 2)
    ca.hasIn(x12, 'nModified', 2)
    ca.hasIn(x12, 'ok', 1)
    logit('12 - updateMany with _id PASSED')

    const x13 = await coll.insertOne(clone(ins1))
    ca.is('object', x13)
    ca.hasAllOwn(x13, ins1)
    logit('13 - insertOne PASSED')

    const x14 = await coll.insertMany(clone(ins2))
    ca.is('array', x14)
    ca.equal(x14.length, 2)
    logit('14 - insertMany PASSED')

    const x15 = await coll.deleteOne({omg: 'omg'})
    ca.hasIn(x15, 'n', 1)
    ca.hasIn(x15, 'ok', 1)
    logit('15 - deleteOne PASSED')

    const x16 = await coll.deleteMany({$or: [{abc: 'abc'}, {omg: 'omg'}, {foo: 'foo'}]})
    ca.hasIn(x16, 'n', 5)
    ca.hasIn(x16, 'ok', 1)
    logit('16 - deleteMany PASSED')

    logit('---------------------------------------------')
    logit('All tests PASSED.')
    logit('---------------------------------------------')
  }

  catch (err) {logit(err)}
})()