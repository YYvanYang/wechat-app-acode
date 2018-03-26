'use strict';

const Readable = require('stream').Readable;
const co = require('co');
const { appName, host } = require('../config');

module.exports = class ShareView extends Readable {
  constructor(context) {
    super();

    // render the view on a different loop
    co.call(this, this.render).catch(context.onerror);
  }

  _read() {}

  *render() {
    // push the <head> immediately
    this.push(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><link rel="stylesheet" href="../css/style.css"><title>${appName}</title></head>`);

    this.push('<body>');

    // render the <pageTitle> on the next tick
    const pageTitle = yield done => {
      setImmediate(() => done(null, '<img class="page-title" src="../img/logo.png">'));
    };

    this.push(pageTitle);

    this.push('</body>');

    // close the document
    this.push('</html>');

    // end the stream
    this.push(null);
  }
};
