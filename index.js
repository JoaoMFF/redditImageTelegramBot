// Imports
require('dotenv').config();
const { Telegraf } = require("telegraf");
const logger = require("./logger");
const urbanDict = require("./commands/urbanDict");
const reddit = require("./commands/reddit");
const spam = require("./commands/spam");
const helper = require("./commands/helper");
const everyone = require("./commands/everyone");

// Env
const {YOUR_TOKEN_GOES_HERE} = process.env;

// array with all the possible commands
const commandList = helper.botCommands.reduce((previousVal, commandObj) => {
    return [...previousVal, ...commandObj.command.split("|")];
}, []);

const app = new Telegraf(YOUR_TOKEN_GOES_HERE);

app.command(ctx => {
    const commandObj = helper.parseCommand(ctx.message.text);
    const selectedCommand = commandList.find(commandStr => commandObj.command === commandStr);

    if (commandObj.command && commandObj.command.charAt(0) === "/") {
        switch (selectedCommand) {
        case "/r":
            reddit.getRandomRedditPost(ctx, commandObj.arg);
            break;

        case "/subs":
            reddit.getPopularSubs(ctx);
            break;

        case "/spam":
            spam.getSpacer(ctx);
            break;

        case "/urban":
            urbanDict.getMeaning(ctx, commandObj.arg);
            break;

        case "/spit":
            ctx.reply("*spits back*", {
                parse_mode: "MarkdownV2",
                reply_to_message_id: ctx.message.message_id
            });
            break;

        case "/everyone":
        case "/here":
            everyone.tagEveryone(ctx);
            break;

        case "/debug" :
            helper.showDebug(ctx);
            break;

        case "/help":
            helper.showHelp(ctx);
            break;

        default:
            ctx.sendMessage("Sorry, I can't do that");
            break;
        }
    }
});

app.startPolling();