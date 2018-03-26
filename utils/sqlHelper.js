const { mysql: config } = require('../config');
const qcloud = require('../qcloud');
const Promise = require('bluebird');
const { mysql } = qcloud;

function getCacheToken(appId) {
  return new Promise((resolve, reject) => {
    mysql('cAccessToken')
      .where({ appid: appId })
      .first()
      .then(resolve)
      .catch(reject);
  });
}

function updateCacheToken({ appId, access_token, expire_time }) {
  getCacheToken(appId).then(cacheToken => {
    if (cacheToken) {
      mysql('cAccessToken')
        .where({ appid: appId })
        .update({
          access_token,
          expire_time
        }).then(function(resp) {
          console.log(resp);
        }).catch(function(e) {
          console.log(e.stack);
        });
    } else {
      mysql('cAccessToken')
      .insert({ appid: appId, access_token, expire_time })
      .then(function(resp) {
        console.log(resp);
      }).catch(function(e) {
        console.log(e.stack);
      });
    }
  }).catch(error => {
      console.log(error)
  });
}

module.exports = {
  getCacheToken,
  updateCacheToken
};
