const AWS = require('aws-sdk')

const toQueryString = params => Object.keys(params)
.map(qKey => `${qKey}=${params[qKey]}`)
.join('&')

module.exports = (req, creds, region, service) => {
  const fixReq = {
    ...req,
    data: req.body,
    region,
    pathname: () => req.pathname,
    search: () => toQueryString(req.query || {}),
  }
  const signer = new AWS.Signers.V4(fixReq, service, {signatureCache: true})
  signer.addAuthorization(creds, new Date())

  return fixReq.headers
}
