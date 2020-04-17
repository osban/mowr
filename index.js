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
      const remid = obj =>
        Object.entries(obj).reduce((a,[k,v]) => { 
          if (k !== '_id') a[k] = typeof v === 'object' ? remid(v) : v
          return a
        }, {})
  
      return {
        find   : (what, opts = {}) => getcoll.then(c => c.find(query(what), opts).toArray()),
        findc  : (what, opts = {}) => getcoll.then(c => c.find(query(what), opts)),
        findOne: (what, opts = {}) => getcoll.then(c => c.findOne(query(what), opts)),
        insert : (what, opts = {}) => 
          Array.isArray(what)
          ? getcoll.then(c => c.insertMany(what, opts))
          : getcoll.then(c => c.insertOne(what, opts)),
        insertOne : (what, opts = {}) => getcoll.then(c => c.insertOne(what, opts)),
        insertMany: (what, opts = {}) => getcoll.then(c => c.insertMany(what, opts)),
        updateOne : (what, update, opts = {}) => getcoll.then(c => c.updateOne(query(what), remid(update), opts)),
        updateMany: (what, update, opts = {}) => getcoll.then(c => c.updateMany(what, remid(update), opts)),
        replaceOne: (what, update, opts = {}) => getcoll.then(c => c.replaceOne(query(what), remid(update), opts)),
        deleteOne : (what, opts = {}) => getcoll.then(c => c.deleteOne(query(what), opts)),
        deleteMany: (what, opts = {}) => getcoll.then(c => c.deleteMany(what, opts))
      }
    }
  }
}
