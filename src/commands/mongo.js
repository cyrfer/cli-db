const {Command, flags} = require('@oclif/command')
const {setupDataStore, shutdownDataStore} = require('../db/mongo')
const AWS = require('aws-sdk')
const fs = require('fs')
const {assignByKey} = require('deepdown')

const parseReducer = ctx => (accum, flag) => {
  if (!ctx[flag]) {
    return accum
  }

  return {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...accum,
    [flag]: JSON.parse(ctx[flag]),
  }
}

const methodArgs = {
  updateOne: ['query', 'data', 'options'],
  findOne: ['query', 'projection'],
}

class MongoCommand extends Command {
  async run() {
    const {flags} = this.parse(MongoCommand)

    // eslint-disable-next-line no-warning-comments
    // TODO: shell support might make this unnecessary
    let file
    if (flags.file) {
      const buffer = fs.readFileSync(flags.file)
      file = buffer.toString()
      try {
        file = JSON.parse(file)
      } catch (error) {
        // no change, no need to log
      }
    }

    const parsed = methodArgs[flags.method].reduce(parseReducer(flags), {})
    if (file) {
      assignByKey(parsed, ['data', ...(flags.input ? flags.input.split('.') : [])], file)
    }
    const mArgs = methodArgs[flags.method].map(a => parsed[a])

    const credentials = new AWS.SharedIniFileCredentials({profile: flags.awsProfile})
    const secrets = flags.awsRegion && new AWS.SecretsManager({region: flags.awsRegion, credentials})
    const client = await setupDataStore({url: flags.url, secretUrl: flags.awsSecretUrl}, {secrets})

    // this.log(`db.${flags.collection}.${flags.method}( ${JSON.stringify(mArgs)} ) on [${flags.url || flags.awsSecretUrl}/${flags.db}/${flags.collection}],`)
    const collection = client.db(flags.db).collection(flags.collection)
    const result = await collection[flags.method](...mArgs)
    this.log(JSON.stringify(result))
    shutdownDataStore()
  }
}

MongoCommand.description = `Describe the command here
...
Extra documentation goes here
`

MongoCommand.flags = {
  help: flags.help({char: 'h'}),

  db: flags.string({
    char: 'b',
    description: 'the mongo database name',
    required: true,
    env: 'MONGO_DB',
  }),

  collection: flags.string({
    char: 'c',
    description: 'the mongo collection name',
    required: true,
    env: 'MONGO_COLLECTION',
  }),

  data: flags.string({
    char: 'd',
    description: 'the data for the query',
    required: false,
  }),

  file: flags.string({
    char: 'f',
    description: 'the file path with content for the data',
    required: false,
    dependsOn: ['data', 'input'],
  }),

  input: flags.string({
    char: 'i',
    description: 'the path to assign input for the data query',
    required: false,
    dependsOn: ['data'],
  }),

  awsProfile: flags.string({
    char: 'l',
    description: 'aws profile containing secrets',
    env: 'AWS_PROFILE',
    required: false,
  }),

  method: flags.string({
    char: 'm',
    description: 'the mongo method',
    required: true,
  }),

  options: flags.string({
    char: 'o',
    description: 'the json string for mongo query options',
    required: false,
    default: '{}',
  }),

  projection: flags.string({
    char: 'p',
    description: 'the json projection string',
    required: false,
    default: '{}',
  }),

  query: flags.string({
    char: 'q',
    description: 'the json query filter string',
    required: true,
  }),

  awsRegion: flags.string({
    char: 'r',
    description: 'aws region containing secrets',
    env: 'AWS_SECRET_MONGO_CONNECTION_URL',
    required: false,
    exclusive: ['url'],
  }),

  awsSecretUrl: flags.string({
    char: 's',
    description: 'aws secret containing mongo connection string',
    env: 'AWS_SECRET_MONGO_CONNECTION_URL',
    required: false,
    dependsOn: ['awsRegion', 'awsProfile'],
    exclusive: ['url'],
  }),

  url: flags.string({
    char: 'u',
    description: 'mongo connection string (URL)',
    env: 'MONGO_CONNECTION_URL',
    required: false,
    exclusive: ['aws-secret-url'],
  }),
}

module.exports = MongoCommand
