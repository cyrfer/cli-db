
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
    const params = {
      SecretId: secretName,
    }
    secrets.getSecretValue(params, (err, data) => {
      if (err) {
        return reject(new Error('error calling getSecret: ' + JSON.stringify(err)))
      }
      resolve(data)
    })
  })
}
