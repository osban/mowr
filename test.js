const ca       = require('./node_modules/clean-assert')
const ObjectId = require('./node_modules/mongodb').ObjectId
const coll     = require('./index.js')('localhost/test').get('coll')

const ins1 = {foo: 'foo', bar: 'bar', baz: 'baz'}
const ins2 = [{foo: 'foo', bar: 'bar', baz: 'baz'}, {omg: 'omg', wtf: 'wtf', bbq: 'bbq'}]
const upd1 = {foo: 'abc', def: 'def', baz: 'ghi'}
const rep1 = {abc: 'abc', def: 'def', ghi: 'ghi'}
const rep2 = {def: 'foo'}
const rep3 = {ghi: 'foo'}

let count = 0
let cur = ''

const c = {
  redd : '31m',
  redl : '31;1m',
  cyan : '36;1m',
  green: '32;1m'
}
const logit = (color, msg) => console.log('\x1b[%s%s\x1b[0m', color, msg)
const clone = x => JSON.parse(JSON.stringify(x))

let list = []

;(async () => {
  try {
    console.log('')

    cur = 'insert (one)'
    const x01 = await coll.insert(clone(ins1))
    ca.is('object', x01)
    ca.hasAllOwn(x01, ins1)
    count++

    cur = 'insert (many)'
    const x02 = await coll.insert(clone(ins2))
    ca.is('array', x02)
    ca.equal(x02.length, 2)
    count++

    cur = 'find'
    const x03 = await coll.find()
    ca.is('array', x03)
    list = x03
    count++

    cur = 'findc'
    const x04 = await coll.findc()
    const res = await x04.count()
    ca.equal(res, 3)
    count++

    cur = 'findOne string _id'
    const x05 = await coll.findOne((list[0]._id + ''))
    ca.hasAllOwn(x05, ins1)
    count++

    cur = 'findOne object _id'
    const x06 = await coll.findOne({_id: ObjectId(list[0]._id + '')})
    ca.hasAllOwn(x06, ins1)
    count++

    cur = 'updateOne without _id'
    const x07 = await coll.updateOne((list[0]._id + ''), {$set: upd1})
    ca.hasIn(x07, 'n', 1)
    ca.hasIn(x07, 'nModified', 1)
    ca.hasIn(x07, 'ok', 1)
    count++

    cur = 'updateOne with _id'
    const x08 = await coll.updateOne((list[0]._id + ''), {$set: {...ins1, _id: (list[0]._id + '')}})
    ca.hasIn(x08, 'n', 1)
    ca.hasIn(x08, 'nModified', 1)
    ca.hasIn(x08, 'ok', 1)
    count++

    cur = 'replaceOne without _id'
    const x09 = await coll.replaceOne({def: 'def'}, rep1)
    ca.hasIn(x09, 'n', 1)
    ca.hasIn(x09, 'nModified', 1)
    ca.hasIn(x09, 'ok', 1)
    count++

    cur = 'replaceOne with _id'
    const x10 = await coll.replaceOne({foo: 'foo'}, {...rep1, _id: (list[0]._id + '')})
    ca.hasIn(x10, 'n', 1)
    ca.hasIn(x10, 'nModified', 1)
    ca.hasIn(x10, 'ok', 1)
    count++

    cur = 'updateMany without _id'
    const x11 = await coll.updateMany({abc: 'abc'}, {$set: rep2})
    ca.hasIn(x11, 'n', 2)
    ca.hasIn(x11, 'nModified', 2)
    ca.hasIn(x11, 'ok', 1)
    count++

    cur = 'updateMany with _id'
    const x12 = await coll.updateMany({abc: 'abc'}, {$set: {...rep3, _id: (list[0]._id + '')}})
    ca.hasIn(x12, 'n', 2)
    ca.hasIn(x12, 'nModified', 2)
    ca.hasIn(x12, 'ok', 1)
    count++

    cur = 'insertOne'
    const x13 = await coll.insertOne(clone(ins1))
    ca.is('object', x13)
    ca.hasAllOwn(x13, ins1)
    count++

    cur = 'insertMany'
    const x14 = await coll.insertMany(clone(ins2))
    ca.is('array', x14)
    ca.equal(x14.length, 2)
    count++

    cur = 'deleteOne'
    const x15 = await coll.deleteOne({omg: 'omg'})
    ca.hasIn(x15, 'n', 1)
    ca.hasIn(x15, 'ok', 1)
    count++

    cur = 'deleteMany'
    const x16 = await coll.deleteMany({$or: [{abc: 'abc'}, {omg: 'omg'}, {foo: 'foo'}]})
    ca.hasIn(x16, 'n', 5)
    ca.hasIn(x16, 'ok', 1)
    count++

    logit(c.green, `Every test PASSED (Total: ${count})`)
    console.log('')
    process.exit()
  }
  catch (err) {
    logit(c.redl, `Failed: ${cur}`)
    logit(c.redd, err)
    logit(c.cyan, `Number of tests passed: ${count}`)
    console.log('')
    process.exit(1)
  }
})()