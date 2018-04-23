const Telegraf = require('telegraf');
const app = new Telegraf('498772438:AAEVNh8CfFa1eeETnX7w0sWykd713qlkfaA');
const axios = require('axios'); // add axios
const rn = require('random-number'); // random-number

app.command('/reddit', (ctx) =>{
  const subreddit = ctx.message.text.replace('/reddit ','');

  axios
    .get(`https://reddit.com/r/${subreddit}/hot.json?sort=hot&t=all`)
    .then(res => {
      // data recieved from Reddit
      const data = res.data.data;

      // if subbreddit does not exist
      if (data.children.length < 1)
        return ctx.reply("The subreddit couldn't be found.");

      // random post selector
      const randomNr = rn.generator({
        min:  2,
        max:  26,
        integer: true
      })

      const link = `${data.children[randomNr()].data.url}`;
      const title = `${data.children[randomNr()].data.title}`;
      ctx.reply(title + '\n' + link);
      //ctx.reply(link);
    })

    // if there's any error in request
    .catch(err => ctx.reply("The subreddit couldn't be found."));
});

app.startPolling();