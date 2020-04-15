const {MongoClient, ObjectId} = require('mongodb')

module.exports = (url, opts = {}) => {
  if (!url.includes('mongodb://')) url = 'mongodb://' + url
  if (!opts.hasOwnProperty('useUnifiedTopology')) opts.useUnifiedTopology = true

  const client = new MongoClient(url, opts)
  
  const getdb = new Promise(rs =>
    client.connect(err => {
      if (err) throw ('Mowr failed to connect: ' + err)
      else rs(client.db())
    })
  )

  return {
    get: cname => {
      const getcoll = getdb.then(db => db.collection(cname))
      const query = what => typeof what === 'string' ? ({_id: new ObjectId(what)}) : what
  
      return {
        find   : (what, opts = {}) => getcoll.then(coll => coll.find(query(what), opts).toArray()),
        findCur: (what, opts = {}) => getcoll.then(coll => coll.find(query(what), opts)),
        findOne: (what, opts = {}) => getcoll.then(coll => coll.findOne(query(what), opts)),
        insert : (what, opts = {}) => 
          Array.isArray(what)
          ? getcoll.then(coll => coll.insertMany(what, opts))
          : getcoll.then(coll => coll.insertOne(what, opts)),
        insertOne : (what, opts = {}) => getcoll.then(coll => coll.insertOne(what, opts)),
        insertMany: (what, opts = {}) => getcoll.then(coll => coll.insertMany(what, opts)),
        updateOne : (what, update, opts = {}) => getcoll.then(coll => coll.updateOne(query(what), update, opts)),
        updateMany: (what, update, opts = {}) => getcoll.then(coll => coll.updateMany(what, update, opts)),
        deleteOne : (what, opts = {}) => getcoll.then(coll => coll.deleteOne(query(what), opts)),
        deleteMany: (what, opts = {}) => getcoll.then(coll => coll.deleteMany(what, opts))
      }
    }
  }
}
