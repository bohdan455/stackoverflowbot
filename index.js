const {Telegraf, Markup} = require('telegraf')
const googleresults = require("./googleresults.js");
const parse = require('./parse-stack-overflow')
const TOKEN = "5330199369:AAGw-sP45rlGeDYb3zqq62pfIxuTC1bVyBs";
const bot = new Telegraf(TOKEN);
let prevText = "wrong operation";
let postId;
bot.start(ctx => {
    ctx.reply("Write your question");
});
bot.hears(/\/question/, ctx => {
    if (ctx.message.text.match(/\d+$/)) {  //if command contains numbers
        let id = ctx.message.text.match(/\d+$/)[0];
        let type = ctx.message.text.split('_')[1];
        type = type ? "ru." : ''
        return parse(id,type).then(result => {

            ctx.reply(`<b>${result.title}</b>  \n ${result.text}`, {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        Markup.button.callback("Back", "back"),
                        Markup.button.url('Open', `${type}stackoverflow.com/questions/${id}`),
                    ])
                }
            )
        }).catch(err => console.log(err));
    } else {
        ctx.reply("wrong operation");
    }

})
bot.action('back', ctx => {
    ctx.deleteMessage(postId);
    ctx.reply(prevText);
})
bot.on('message', ctx => {
    googleresults(ctx.message.text).then(result => {
        if (result[0]) {
            let resultsText = `<b>${ctx.message.text}</b> \n`;
            result.forEach(item => {
                resultsText += `--------------------------- \n 🔷Title: ${item.title} \n 🔶View solution: /question${item.type ? '_ru_' : ""}${item.url} \n `
            })
            prevText = resultsText;
            ctx.reply(resultsText,{parse_mode: 'HTML'});
            postId = ctx.message.id;
        } else {
            ctx.reply("Nothing found")
        }
    }).catch(err => console.log(err));
})
bot.launch();