const axios = require("axios");
const logger = require("../logger");
const rn = require("random-number"); // random-number

// random post selector
const randomNr = rn.generator({
    min: 2,
    max: 26,
    integer: true
});

async function getRandomRedditPost (context, subName) {
    try {
        const response = await axios.get(`https://reddit.com/r/${subName}/hot.json?sort=hot&t=all`);
        // data recieved from Reddit
        const data = response.data.data;
        const length = data.children.length;

        // if subbreddit does not exist
        if (length < 1) {
            return context.reply("That name doesn't seem to exist!");
        }

        const rand = randomNr(2, length, true);
        const link = `${data.children[rand].data.url}`;
        const title = `${data.children[rand].data.title}`;

        context.sendMessage(`${title }\n${ link}`, { parse_mode: 'HTML' });
    } catch (error) {
        logger.logError("Error when fetching subreddit", error);
        context.reply("Oh shit, i can't find that");
    }
}

async function getPopularSubs (context) {
    try {
        const response = await axios.get('https://www.reddit.com/subreddits/popular.json');
        // data recieved from Reddit
        const data = response.data.data

        if (!data.children.length) {
            return context.reply("Reddit seems to be broken");
        }

        const topFive = data.children.slice(0, 5).map(sub => `${sub.data.display_name}\n`);

        return context.sendMessage(`Popular subreddit list:\n${topFive.join('')}`, { parse_mode: 'HTML' })
    } catch (error) {
        logger.logError("Error when fetching subreddit", error);
        context.reply("Oops something went wrong!");
    }
}

module.exports = {
    getRandomRedditPost,
    getPopularSubs,
}