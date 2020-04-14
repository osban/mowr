const {MongoClient, ObjectId} = require('mongodb')

module.exports = (url, opts = {}) => {
  if (!url.includes('mongodb://')) url = 'mongodb://' + url
  if (!opts.useUnifiedTopology) opts.useUnifiedTopology = true

  const client = new MongoClient(url, opts)
  
  let db
  client.connect(err => {
    if (err) throw ('Osq failed to connect: ' + err)
    else db = client.db()
  })

  return {
    get: cname => {
      const coll  = db.collection(cname)
      const query = what => typeof what === 'string' ? ({_id: new ObjectId(what)}) : what
  
      return {
        find   : (what, opts = {}) => coll.find(query(what), opts).toArray(),
        findCur: (what, opts = {}) => coll.find(query(what), opts),
        findOne: (what, opts = {}) => coll.findOne(query(what), opts),
        insert : (what, opts = {}) => 
          Array.isArray(what)
          ? coll.insertMany(what, opts)
          : coll.insertOne(what, opts),
        insertOne : (what, opts = {}) => coll.insertOne(what, opts),
        insertMany: (what, opts = {}) => coll.insertMany(what, opts),
        updateOne : (what, update, opts = {}) => coll.updateOne(query(what), update, opts),
        updateMany: (what, update, opts = {}) => coll.updateMany(what, update, opts),
        deleteOne : (what, opts = {}) => coll.deleteOne(query(what), opts),
        deleteMany: (what, opts = {}) => coll.deleteMany(what, opts)
      }
    }
  }
}
