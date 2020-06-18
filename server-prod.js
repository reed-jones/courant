const Koa = require('koa');
const app = module.exports = new Koa();
app.use((ctx) => {
    ctx.body = "hi"
})
if (!module.parent) app.listen(3000);
