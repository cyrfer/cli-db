const {Command, flags} = require('@oclif/command')

const AWS = require('aws-sdk')
const URL = require('url')
const sign = require('../db/sigv4')
const got = require('got')

const hostRegex = /^host$/i

const reduceKeyValue = (accum, {key, value}) => {
  return {
    ...accum,
    [key]: value,
  }
}

class HttpCommand extends Command {
  async run() {
    const {args, flags} = this.parse(HttpCommand)
    const opts = URL.parse(args.url, true)
    const {host, pathname, port, protocol, query} = opts
    const req = {
      host,
      pathname,
      protocol,
      query,
      method: (flags.method || 'GET').toUpperCase(),
      headers: flags.headers.reduce(reduceKeyValue, {}),
    }

    if (flags.data) {
      req.body = flags.data
    }

    if (port) {
      req.port = port
    }

    const hasHostHeader = Object.keys(req.headers || {}).reduce((accum, hKey) => {
      return accum || (hostRegex.test(hKey) && req.headers[hKey])
    }, false)

    if (!hasHostHeader) {
      req.headers.Host = opts.host
    }

    if (flags['aws-profile'] || flags['aws-access-key-id']) {
      const creds = flags['aws-profile']
        // eslint-disable-next-line operator-linebreak
        ? new AWS.SharedIniFileCredentials({profile: flags['aws-profile']})
        // eslint-disable-next-line operator-linebreak
        : {
          accessKeyId: flags['aws-access-key-id'],
          secretAccessKey: flags['aws-secret-access-key'],
          sessionToken: flags['aws-session-token'],
        }

      // req = aws4.sign({req, region: flags['aws-region'] || creds.region, service: flags['aws-service']}, creds)
      const headersSigned = sign(req, creds, flags['aws-region'], flags['aws-service'])

      // mutate request
      req.headers = headersSigned
    }

    return got(req).then(resp => {
      this.log(resp.body)
    })
  }
}

HttpCommand.description = `make http requests
`

HttpCommand.args = [
  {name: 'url', required: true, description: 'the complete url, i.e. fully qualified domain name'},
]

const parseHeaders = input => {
  const [key, value] = input.split(':')
  return {
    key: key.trim(),
    value: value.trim(),
  }
}

HttpCommand.flags = {
  method: flags.string({char: 'X', default: 'GET', required: true, description: 'http method to use: GET, POST, PUT,...'}),
  headers: flags.string({char: 'H', required: false, multiple: true, parse: parseHeaders, description: 'JSON map of headers to use in the request'}),
  data: flags.string({char: 'd', required: false, dependsOn: [], description: 'the payload for write methods'}),
  'aws-profile': flags.string({char: 'p', required: false, description: 'profile name for AWS CLI and SDK', dependsOn: ['aws-region', 'aws-service']}),
  'aws-region': flags.string({char: 'r', required: false, env: 'AWS_REGION', description: 'AWS region of service'}),
  'aws-service': flags.string({char: 's', required: false, default: 'execute-api', description: 'AWS service, e.g. appsync'}),
  'aws-secret-access-key': flags.string({char: 'k', required: false, description: 'secret key for AWS signing', dependsOn: ['aws-region', 'aws-service']}),
  'aws-access-key-id': flags.string({char: 'i', required: false, description: 'access key id for AWS signing', dependsOn: ['aws-region', 'aws-service']}),
  'aws-session-token': flags.string({char: 't', required: false, description: 'session token for AWS signing', dependsOn: ['aws-access-key-id', 'aws-secret-access-key']}),
}

module.exports = HttpCommand
