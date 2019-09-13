// Imports
const Telegraf = require("telegraf");
const axios = require("axios"); // add axios
const rn = require("random-number"); // random-number
const logger = require("./logger");
const puppeteer = require("puppeteer");
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
    ctx.reply("List of commands: \n/r <subreddit name> \n/subs \n/spam");
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

app.command(["/spam", "/Spam", "/SPAM"], ctx => {
    ctx.reply(`SPAM






























SPAM`);
});

const botImageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam1.jpg?alt=media&token=abf827cd-1763-41d2-8f7d-11979481df3a",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam2.jpg?alt=media&token=a130fcc5-a2b5-4461-8baf-6934bf70bde8",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam3.jpg?alt=media&token=b377c0c6-c088-4c9a-808f-4ab7608c8dca",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam4.jpg?alt=media&token=5fba94bb-08bd-487f-8579-8de47ac553a7",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam5.jpg?alt=media&token=ad2da02c-4295-4bd3-98f2-a7926039f456",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam6.jpg?alt=media&token=b1fac5eb-8777-4770-97ce-0e95b19eee32",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam7.jpg?alt=media&token=306b071e-22ed-4dfc-878d-c17edaf99376",
    "https://firebasestorage.googleapis.com/v0/b/website-jordao.appspot.com/o/telegram_bot_spam%2FbotSpam8.jpg?alt=media&token=c32391f3-2b3d-4e49-8553-1378fbeffc18"
];

app.command(["/trela", "/Trela", "/TRELA"], async ctx => {
    const chatId = ctx.chat.id;
    for (let index = 0; index < botImageUrls.length; index++) {
        await ctx.telegram.sendPhoto(chatId, botImageUrls[index]);
    }
});

app.command(["/g", "/G"], async ctx => {
    try {
        const text = ctx.message.text.toLowerCase().split("/g ");
        const searchTerm = text[1].replace(/\s/g, "+");

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/chromium-browser",
            args: ["--no-sandbox", "--headless", "--disable-gpu", "--disable-dev-shm-usage"]
        });
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/search?q=${searchTerm}&sxsrf=ACYBGNQ1__8B_vt2WQMF60JxxDrUvnr1cA:1568407245700&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiA0_il1M7kAhWIohQKHecvAVIQ_AUIESgB&biw=2560&bih=1338`);
        const linkResults = await page.evaluate(() => {
            const elements = document.getElementsByClassName("rg_l");
            const firstTenResults = [];
            let iterator = 0;
            for (const element of elements) {
                if (iterator >= 10) {
                    return firstTenResults;
                }

                const link = element.getAttribute("href");
                if (link && link !== "#") {
                    firstTenResults.push(link);
                    iterator++;
                }
            }

            return firstTenResults;
        });

        if (!linkResults || linkResults.length === 0) {
            return ctx.reply("No images found");
        }

        const rand = randomNr(0, linkResults.length, true);
        const link = linkResults[rand];

        await page.goto(`https://google.com/${link}`);
        const imageLink = await page.evaluate(() => {
            const title = document.title;
            const tokens = title.split(" ");
            for (const token of tokens) {
                if (token.includes("http")) {
                    return token;
                }
            }

            return null;
        });

        if (!imageLink) {
            return ctx.reply("The image I selected for you doesn't appear to be valid, please forgive me and try again :(");
        }

        browser.close();

        ctx.reply(imageLink);
    } catch (error) {
        logger.logError("Error when fetching image", error);
        ctx.reply("Oh shit, either you or me have messed up");
        ctx.reply("To use this command type something like: `/g dogs`");
    }

});


app.startPolling();