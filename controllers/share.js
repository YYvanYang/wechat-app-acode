const ShareView = require('../view/share');
const puppeteer = require('puppeteer');

// 获取小程序分享页
const share = async (ctx, next) => {
  
  try {
    ctx.type = 'html';
    ctx.body = new ShareView(ctx);
  } catch (err) {
    console.log("获取小程序分享页:", err)
    ctx.body = err; // TypeError: failed to fetch
  }
}

const shareImg = async (ctx, next) => {
  
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('/weapp/share');
        ctx.body = await page.screenshot();
        await browser.close();
    } catch (err) {
      console.log("生成小程序分享页:", err)
      ctx.body = err; // TypeError: failed to fetch
    }
  }

module.exports = {
    share,
    shareImg
}
