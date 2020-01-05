cli-db
========

tools to interact with databases, esp. in the cloud

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli-db.svg)](https://npmjs.org/package/cli-db)
[![Downloads/week](https://img.shields.io/npm/dw/cli-db.svg)](https://npmjs.org/package/cli-db)
[![License](https://img.shields.io/npm/l/cli-db.svg)](https://github.com/cyrfer/cli-db/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli-db
$ cli-db COMMAND
running command...
$ cli-db (-v|--version|version)
cli-db/0.3.4 darwin-x64 node-v12.3.1
$ cli-db --help [COMMAND]
USAGE
  $ cli-db COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli-db help [COMMAND]`](#cli-db-help-command)
* [`cli-db mongo`](#cli-db-mongo)

## `cli-db help [COMMAND]`

display help for cli-db

```
USAGE
  $ cli-db help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `cli-db mongo`

Interact with MongoDb

```
USAGE
  $ cli-db mongo

OPTIONS
  -b, --db=db                      (required) the mongo database name
  -c, --collection=collection      (required) the mongo collection name
  -d, --data=data                  the data for the query
  -f, --file=file                  the file path with content for the data
  -h, --help                       show CLI help
  -i, --input=input                the path to assign input for the data query
  -l, --awsProfile=awsProfile      aws profile containing secrets
  -m, --method=method              (required) the mongo method
  -o, --options=options            [default: {}] the json string for mongo query options
  -p, --projection=projection      [default: {}] the json projection string
  -q, --query=query                (required) the json query filter string
  -r, --awsRegion=awsRegion        aws region containing secrets
  -s, --awsSecretUrl=awsSecretUrl  aws secret containing mongo connection string
  -u, --url=url                    mongo connection string (URL)

DESCRIPTION
  Specify reads, writes, aggregations, with AWS integration to support secret connection strings

EXAMPLES

  UPSERT

     cli-db mongo \
      -u 'mongodb://localhost:27018' \
      -b 'test' \
      -c 'todo' \
      -m 'updateOne' \
      -q '{"id": "123"}' \
      -d '{"$set": {"id": "123", "title": "buy toothpaste"}}' \
      -o '{"upsert": true}'

  READ (connection from AWS Secrets Manager)

     cli-db mongo \
      -l 'your-aws-profile-name-here' \
      -s 'test-mongo-local' \
      -r 'us-west-2' \
      -b 'test' \
      -c 'todo' \
      -m 'findOne' \
      -q '{"id": "123"}'
```

_See code: [src/commands/mongo.js](https://github.com/cyrfer/cli-db/blob/v0.3.4/src/commands/mongo.js)_
<!-- commandsstop -->
