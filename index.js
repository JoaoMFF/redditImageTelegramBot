// Imports
const Telegraf = require("telegraf");
const axios = require("axios"); // add axios
const rn = require("random-number"); // random-number
const logger = require("./logger");
const delp = require("delp");


// Env
const {YOUR_TOKEN_GOES_HERE} = process.env;

// configuration for the possible bot commands
const botCommands = [
    {
        command: "/r",
        helper: "<subreddit name>",
        description: "Search a subreddit"
    },
    {
        command: "/subs",
        helper: "",
        description: "Shows as list of popular subreddits"
    },
    {
        command: "/spam",
        helper: "",
        description: "Send a huge message to hide messagens sent before"
    },
    {
        command: "/dic|/dictionary",
        helper: "<word>",
        description: "Search a dictionary for a portuguese word"
    },
    {
        command: "/debug",
        helper: "",
        description: "Show debug information"
    },
    {
        command: "/help",
        helper: "",
        description: "Show this help message"
    }
];


// random post selector
const randomNr = rn.generator({
    min: 2,
    max: 26,
    integer: true
});

// array with all of the possible commands
const commandList = botCommands.reduce((previousVal, commandObj) => {
    return [...previousVal, ...commandObj.command.split("|")];
}, []);

const app = new Telegraf(YOUR_TOKEN_GOES_HERE);

/*
let botName;
// get the current bot name
app.telegram.getMe().then(data => botName = data.first_name);
*/

app.command(ctx => {
    const commandObj = parseCommand(ctx.message.text);
    const selectedCommand = commandList.find(commandStr => commandObj.command === commandStr);

    switch (selectedCommand) {
    case "/r":
        getRandomRedditPost(ctx, commandObj.arg);
        break;

    case "/subs":
        showSubredditList(ctx);
        break;

    case "/spam":
        showSpacer(ctx);
        break;

    case "/dic":
    case "/dictionary" :
        getDictionaryMeaning(ctx, commandObj.arg);
        break;

    case "/debug" :
        showDebug(ctx);
        break;

    case "/help":
        showHelp(ctx);
        break;

    default:
        ctx.reply("Sorry, I can't do that");
        break;
    }
});


app.startPolling();


// Command Functions
const getRandomRedditPost = async function(context, subName) {
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

        context.reply(`${title }\n${ link}`);
    } catch (error) {
        logger.logError("Error when fetching subreddit", error);
        context.reply("Oh shit, i can't find that");
    }
};


const showHelp = function(context) {
    const message = botCommands.map(commandObj => {
        const escapedMessage = escapeIllegalChars(
            `${commandObj.command }${commandObj.helper ? ` \`${commandObj.helper}\`` : "" } : ${commandObj.description}`
        );
        return escapedMessage;
    });

    context.reply(`List of commands: \n${message.join("\n")}`, {parse_mode: "MarkdownV2"});
};


const showDebug = function(context) {
    try {
        let date;
        const text = context.message.text.trim().replace("/debug", "");
        if (text) {
            date = new Date(text).valueOf();
        }

        const logs = logger.debugErrors(date);
        context.reply(logs);
    } catch (error) {
        context.reply("Wrong usage of command, use it like `/debug 1970-01-01`");
    }
};


const showSpacer = function(context) {
    context.reply(`SPAM






























    SPAM`);
};


const showSubredditList = function(context) {
    context.reply(`Poputal subreddit list:
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
};


const getDictionaryMeaning = function(context, word) {
    try {
        if (word) {
            delp.getWordMeaning(word, (err, result) => {
                if (err) {
                    // handle the error
                    context.reply(`Can't find results for: "*${word}*"`, {parse_mode: "MarkdownV2"});
                    return;
                }
                // build the chat message
                const title = `Results for: "*${word}*" \n`;
                const startOfMessage = "```\n -> ";
                const endOfMessage = "\n ```";
                const footer = `\n See https\\:\\/\\/delpt\\.org\\/${word} for a more complete definiton`;
                const message = title + startOfMessage + result.join(".\n -> ") + endOfMessage + footer;

                context.reply(message, {parse_mode: "MarkdownV2"});
            });
        } else {
            context.reply("Usage: `/dic|/dictionary` \\<word to search\\>", {parse_mode: "MarkdownV2"});
        }
    } catch (error) {
        logger.logError("Error when fetching subreddit", error);
        context.reply("Oh shit, you really fucked that up..");
    }
};


// Helper functions
const parseCommand = function(commandString) {
    let argStr = "";
    let commandStr = "";
    let commandArr = [];
    let argArr = [];

    // split the different components of the command
    argArr = commandString.split(" ");

    // we know the command is the always the first
    commandStr = argArr.shift();

    // the remaining elements of the array are the command argument and can be joined.
    // not using spaces deliberatly, the "," can be replaced after if need be
    argStr = argArr.join(",");


    // separating the bot name from the command itself
    commandArr = commandStr.split("@");

    return {
        command: commandArr[0].toLowerCase(),
        botName: commandArr[1] || "",
        arg: argStr
    };
};


const escapeIllegalChars = function(string) {
    return string.replace(/[|<>]/ig, "\\$&");
};