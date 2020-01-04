
exports.fetchParameter = (paramName, ssm) => {
  return new Promise((resolve, reject) => {
    const params = {
      Name: paramName,
      WithDecryption: true,
    }
    ssm.getParameter(params, (err, data) => {
      if (err) {
        // console.error(`fetchSecret(${secretName}) error: ${err.message || JSON.stringify(err)}`)
        return reject(err)
      }
      resolve(data.Parameter.Value)
    })
  })
}

exports.fetchSecret = (secretName, secrets) => {
  return new Promise((resolve, reject) => {
    secrets.getSecretValue({SecretId: secretName}, (err, data) => {
      if (err) {
        return reject(new Error(`getSecretValue(${secretName}): ${JSON.stringify(err)}`))
      }
      if ('SecretString' in data) {
        resolve(data.SecretString)
      } else {
        const buff = Buffer.from(data.SecretBinary, 'base64')
        resolve(buff.toString('ascii'))
      }
    })
  })
}
