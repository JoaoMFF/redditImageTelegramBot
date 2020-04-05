// Imports
const Telegraf = require("telegraf");
const axios = require("axios"); // add axios
const rn = require("random-number"); // random-number
const logger = require("./logger");

// Env
const {YOUR_TOKEN_GOES_HERE} = process.env;

// random post selector
const randomNr = rn.generator({
    min: 2,
    max: 26,
    integer: true
});

const app = new Telegraf(YOUR_TOKEN_GOES_HERE);
app.command(["/r", "/R"], async ctx => {
    try {
        const text = ctx.message.text.split("/r ");
        const subreddit = text[1].replace(/\s/g, "");
        const response = await axios.get(`https://reddit.com/r/${subreddit}/hot.json?sort=hot&t=all`);
        // data recieved from Reddit
        const data = response.data.data;
        const length = data.children.length;

        // if subbreddit does not exist
        if (length < 1) {
            return ctx.reply("That name doesn't seem to exist!");
        }

        const rand = randomNr(2, length, true);
        const link = `${data.children[rand].data.url}`;
        const title = `${data.children[rand].data.title}`;

        ctx.reply(`${title }\n${ link}`);
    } catch (error) {
        logger.logError("Error when fetching subreddit", error);
        ctx.reply("Oh shit, i can't find that");
    }

});

app.command("/help", ctx => {
    ctx.reply("List of commands: \n/r <subreddit name> \n/subs \n/spam \n /debug");
});

app.command("/debug", ctx => {
    try {
        let date;
        const text = ctx.message.text.trim().replace("/debug", "");
        if (text) {
            date = new Date(text).valueOf();
        }

        const logs = logger.debugErrors(date);
        ctx.reply(logs);
    } catch (error) {
        ctx.reply("Wrong usage of command, use it like `/debug 1970-01-01`");
    }
});

app.command("/subs", ctx => {
    ctx.reply(`Poputal subreddit list:

  todayilearned
  pics
  aww
  EarthPorn
  mildlyinteresting
  Jokes
  tifu
  GetMotivated
  Unexpected
  CrappyDesign
  preetygirls
  `);
});

app.command(["/spam", "/Spam", "/SPAM", "/spam@RandImgRedditBot"], ctx => {
    ctx.reply(`SPAM






























SPAM`);
});


app.startPolling();