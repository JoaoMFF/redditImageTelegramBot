let Telegraf = require('telegraf');

const {YOUR_TOKEN_GOES_HERE} = process.env;

let app = new Telegraf(YOUR_TOKEN_GOES_HERE);
let axios = require('axios'); // add axios
let rn = require('random-number'); // random-number

app.command(['/r', '/R'], (ctx) => {
    let text = ctx.message.text.split('/r '),
        subreddit = '';
    subreddit = text[1].replace(/\s/g, "");

    // random post selector
    let randomNr = rn.generator({
        min: 2,
        max: 26,
        integer: true
    })

    axios
        .get(`https://reddit.com/r/${subreddit}/hot.json?sort=hot&t=all`)
        .then(res => {
            // data recieved from Reddit
            let data = res.data.data,
                length = data.children.length;

            // if subbreddit does not exist
            if (length < 1)
                return ctx.reply("That name doesn't seem to exist!");

            let rand = randomNr(2, length, true);
            let link = `${data.children[rand].data.url}`;
            let title = `${data.children[rand].data.title}`;

            ctx.reply(title + '\n' + link);
            //ctx.reply(link);
        })

        // if there's any error in request
        .catch(err => ctx.reply("Oh shit, i can't find that"));
});

app.command('/help', (ctx) => {
    ctx.reply('List of commands: \n/r <subreddit name> \n/subs \n/spam')
});

app.command('/subs', (ctx) => {
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
  `)
});

app.command(["/spam", "/Spam", "/SPAM"], (ctx) => {
    ctx.reply(`SPAM






























SPAM`)
});

app.startPolling();