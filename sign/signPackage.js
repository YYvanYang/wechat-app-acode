var sign = require('./sign.js');
const Promise = require('bluebird');
var request = require('request');
var rp = require('request-promise');
const { appId, appSecret } = require('../config');
const { getCacheToken, updateCacheToken } = require('../utils/sqlHelper.js');

async function getAccessToken() {
  let cacheToken = await getCacheToken(appId);

  if (cacheToken) {
    if (cacheToken.expire_time > Date.now()) {
      console.log('cacheToken.access_token:', cacheToken.access_token);
      return cacheToken.access_token;
    }
  }

  var options = {
    uri: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      grant_type: 'client_credential',
      appid: appId,
      secret: appSecret
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  let result = await rp(options);

  updateCacheToken({
    appId,
    access_token: result.access_token,
    expire_time: Date.now() + 7000 * 1000
  });

  return result.access_token;
}

//  获取小程序码
async function getACode() {
  const token = await getAccessToken();

  // http://blog.csdn.net/u014477038/article/details/70056171
  let postData = {
    scene: 'xxx_xxx_xxx',
    width: 270,
    auto_color: false,
    line_color: { r: '0', g: '0', b: '0' }
  }

  let options = {
    method: 'POST',
    uri: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    qs: {
      access_token: token
    },
    body: JSON.stringify(postData) // important!!!
  };

  return request(options);
}

module.exports = {
  getACode
};
