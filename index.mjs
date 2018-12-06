import express from 'express'
import * as greenLock from 'greenlock'

import imagesUpload from './imagesUpload.mjs'

const { NODE_ENV, HTTP_PORT, HTTPS_PORT } = process.env
if (NODE_ENV !== 'production' && NODE_ENV !== 'development' && NODE_ENV !== 'staging') {
  console.error(`Error: .env variable NODE_ENV should be one of 'development', 'staging' or 'production'.`)
  process.exit()
}

if (!HTTP_PORT || !HTTPS_PORT) {
  console.error(`Error: .env variable HTTP_PORT and HTTPS should be set.`)
  process.exit()
}

const app = express()
app.use('/static', express.static('./static'))

app.get('/*', (req, res) => {
  res.send('All systems go.')
})

app.post('/multiple', imagesUpload(
  './server/static/multipleFiles',
  `http://localhost:${HTTP_PORT}/static/multipleFiles`,
  true
))

if (NODE_ENV === 'development') { app.listen(HTTP_PORT, () => { console.info(`App listening on port ${HTTP_PORT}`) }) } else {
  greenLock.create({
    version: 'draft-11',
    server: NODE_ENV === 'production'
      ? 'https://acme-v02.api.letsencrypt.org/directory'
      : 'https://acme-staging-v02.api.letsencrypt.org/directory',
    configDir: '~/.config/acme/images-to-ipfs',
    email: 'tim@feesimple.io',
    approveDomains: [ 'fsmanager.io', 'www.fsmanager.io' ],
    agreeTos: true,
    app
  }).listen(HTTPS_PORT, HTTPS_PORT)
}
