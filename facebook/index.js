import fetch from 'node-fetch'
import qs from 'querystring'


const profile = (user_id, access_token) =>
  api(`/${user_id}`, 'GET', { access_token, fields: 'id, name, locale, gender, timezone' })


const botProfile = (bot_id, { access_token }) =>
  api(`/${bot_id}`, 'GET', { access_token })


const exchangeAccessToken = (access_token) =>
  api('oauth/access_token', 'GET', {
    client_id         : process.env.FB_APP_ID,
    client_secret     : process.env.FB_APP_SECRET,
    fb_exchange_token : access_token,
    grant_type        : 'fb_exchange_token',
  }).then(({ access_token }) => access_token)


const subscribeToPage = (access_token) =>
  api('/me/subscribed_apps', 'POST', { access_token }).then(({ success }) => success)


const unsubscribeFromPage = (access_token) =>
  api('/me/subscribed_apps', 'DELETE', { access_token })


const api = (path, method, query, body) =>
  fetch(`https://graph.facebook.com/v${process.env.FB_API_VERSION}/${path}?${qs.stringify(query)}`, {
    method  : method,
    body    : JSON.stringify(body),
    headers : {
      'Accepts'       : 'application/json',
      'Content-Type'  : 'application/json'
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json.error)
        throw(json.error)
      return json
    })


export default {
  api,
  profile,
  botProfile,
  subscribeToPage,
  unsubscribeFromPage,
  exchangeAccessToken,
}
