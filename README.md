db-utils
========

tools to interact with databases, esp. in the cloud

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/db-utils.svg)](https://npmjs.org/package/db-utils)
[![Downloads/week](https://img.shields.io/npm/dw/db-utils.svg)](https://npmjs.org/package/db-utils)
[![License](https://img.shields.io/npm/l/db-utils.svg)](https://github.com/cyrfer/db-utils/blob/master/package.json)

<!-- toc -->
- [db-utils](#db-utils)
- [Usage](#usage)
- [Commands](#commands)
  - [db-utils mongo](#db-utils-mongo)
  - [db-utils help [COMMAND]](#db-utils-help-command)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g db-utils
$ db-utils COMMAND
running command...
$ db-utils (-v|--version|version)
db-utils/0.1.0 darwin-x64 node-v12.3.1
$ db-utils --help [COMMAND]
USAGE
  $ db-utils COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [db-utils](#db-utils)
- [Usage](#usage)
- [Commands](#commands)
  - [db-utils mongo](#db-utils-mongo)
  - [db-utils help [COMMAND]](#db-utils-help-command)

## `db-utils mongo`

Interact with MongoDB

```bash
USAGE
  $ db-utils mongo -h

OPTIONS
  -a, --awsSecretUrl=awsSecretUrl  aws secret containing mongo connection string
  -b, --db=db                      (required) the mongo database name
  -c, --collection=collection      (required) the mongo collection name
  -d, --data=data                  (required) the data for the query
  -f, --filter=filter              (required) the json filter string
  -h, --help                       show CLI help
  -i, --stdin
  -m, --method=method              (required) the mongo method
  -o, --options=options            [default: {}] the json operations string
  -p, --projection=projection      [default: {}] the json projection string
  -u, --url=url                    (required) mongo connection string (URL)

DESCRIPTION
  Specify reads, writes, aggregations, with AWS integration to support secret connection strings
```


EXAMPLES - `UPSERT`

```bash
  db-utils mongo \
  -u mongodb://localhost:27018 \
  -b test \
  -c todo \
  -m updateOne \
  -f '{"id": "123"}' \
  -d '{"$set": {"id": "123", "title": "buy toothpaste"}}' \
  -o '{"upsert": true}'
```

EXAMPLES - `READ`

```bash
  db-utils mongo \
  -u mongodb://localhost:27018 \
  -b test \
  -c todo \
  -m findOne \
  -f '{"id": "123"}'
```




_See code: [src/commands/mongo.js](https://github.com/cyrfer/db-utils/blob/v0.1.0/src/commands/mongo.js)_

## `db-utils help [COMMAND]`

display help for db-utils

```
USAGE
  $ db-utils help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
