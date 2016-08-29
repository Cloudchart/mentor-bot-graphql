import fetch from 'node-fetch'

// Get bot information
//
const getMe = (access_token) =>
  api('getMe', access_token)


// Set webhook
//
const setWebhook = (access_token, webhook_url) =>
  api('setWebhook', access_token, { url: webhook_url })


// API endpoint
//
const api = (path, access_token, body) =>
  fetch(`https://api.telegram.org/bot${access_token}/${path}`, {
    method  : 'POST',
    body    : JSON.stringify(body),
    headers : {
      'Accept'        : 'application/json',
      'Content-Type'  : 'application/json'
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.ok === true)
        return json.result
      else
        throw new Error(JSON.stringify(json))
    })


// Exports
//
export default {
  getMe
}
