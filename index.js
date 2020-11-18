const {MongoClient, ObjectId} = require('mongodb')

module.exports = (url, opts = {}) => {
  if (!url) throw ('Mowr cannot connect to url: ' + url)
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
          if (k !== '_id') a[k] = (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) ? remid(v) : v
          return a
        }, {})
  
      return {
        find      : (what, opts = {}) => getcoll.then(c => c.find(query(what), opts).toArray()),
        findc     : (what, opts = {}) => getcoll.then(c => c.find(query(what), opts)),
        findOne   : (what, opts = {}) => getcoll.then(c => c.findOne(query(what), opts)),
        insert    : (what, opts = {}) => 
          Array.isArray(what)
          ? getcoll.then(c => c.insertMany(what, opts).then(x => x.ops))
          : getcoll.then(c => c.insertOne(what, opts).then(x => x.ops[0])),
        insertOne : (what, opts = {}) => getcoll.then(c => c.insertOne(what, opts).then(x => x.ops[0])),
        insertMany: (what, opts = {}) => getcoll.then(c => c.insertMany(what, opts).then(x => x.ops)),
        updateOne : (what, update, opts = {}) => getcoll.then(c => c.updateOne(query(what), remid(update), opts).then(x => x.result)),
        updateMany: (what, update, opts = {}) => getcoll.then(c => c.updateMany(what, remid(update), opts).then(x => x.result)),
        replaceOne: (what, update, opts = {}) => getcoll.then(c => c.replaceOne(query(what), remid(update), opts).then(x => x.result)),
        deleteOne : (what, opts = {}) => getcoll.then(c => c.deleteOne(query(what), opts).then(x => x.result)),
        deleteMany: (what, opts = {}) => getcoll.then(c => c.deleteMany(what, opts).then(x => x.result)),
        findOneAndUpdate : (what, update, opts = {}) => getcoll.then(c => c.findOneAndUpdate(query(what), remid(update), opts).then(x => x.value)),
        findOneAndReplace: (what, update, opts = {}) => getcoll.then(c => c.findOneAndReplace(query(what), remid(update), opts).then(x => x.value)),
        findOneAndDelete : (what, opts = {}) => getcoll.then(c => c.findOneAndDelete(query(what), opts).then(x => x.value))
      }
    }
  }
}
