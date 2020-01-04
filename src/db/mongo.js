const {MongoClient} = require('mongodb')
const {fetchSecret} = require('./fetch-secret')

let cachedClient

exports.setupDataStore = async (options, {ssm} = {}) => {
  if (cachedClient) {
    // console.debug('mongo client is already cached')
    return Promise.resolve(cachedClient)
  }
  // console.debug('mongo will need a url to connect')
  let url = options.url
  if (!url) {
    // console.debug('mongo config without url')
    if (!options.secretUrl) {
      // console.debug('mongo config missing secret for url')
      return Promise.reject(new Error('options have no connection url for mongodb'))
    }
    try {
      // console.debug('about to fetch secret')
      const secretString = await fetchSecret(options.secretUrl, ssm)
      // console.debug('about to parse secret')
      url = `mongodb://${secretString}`
    } catch (error) {
      const message = `error using secret: ${JSON.stringify(error)}`
      // console.error(message)
      return Promise.reject(new Error(message))
    }
  }
  // console.debug('creating MongoClient')
  const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true})
  return new Promise((resolve, reject) => {
    // console.debug('about to connect to mongo')
    client.connect(err => {
      if (err) {
        // console.error("Failed to connect to mongodb server", err)
        return reject(err)
      }
      // console.debug("Connected successfully to mongodb server")
      cachedClient = client
      resolve(client)
    })
  })
}

exports.shutdownDataStore = () => {
  if (cachedClient) {
    cachedClient.close()
    cachedClient = undefined
  }
}
