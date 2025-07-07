const logger = require("../logger");

const escapeIllegalChars = function(string) {
    return string.replace(/[|<>]/ig, "\\$&");
};

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
        command: "/spit",
        helper: "",
        description: "Spits back"
    },
    {
        command: "/urban",
        helper: "<expression>",
        description: "Search Urban dictionary for a expression"
    },
    {
        command: "/here",
        helper: "",
        description: "Tag every admin in the group chat"
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

function parseCommand (commandString) {
    let argStr = "";
    let commandStr = "";
    let commandArr = [];
    let argArr = [];

    // split the different components of the command
    argArr = commandString.split(" ");

    // we know the command is always the first
    commandStr = argArr.shift();

    // the remaining elements of the array are the command argument and can be joined.
    // not using spaces deliberately, the "," can be replaced after if need be
    argStr = argArr.join(",");


    // separating the bot name from the command itself
    commandArr = commandStr.split("@");

    return {
        command: commandArr[0].toLowerCase(),
        botName: commandArr[1] || "",
        arg: argStr
    };
}

function showHelp (context) {
    const message = botCommands.map(commandObj => {
        return escapeIllegalChars(
            `${commandObj.command}${commandObj.helper ? ` \`${commandObj.helper}\`` : ""} : ${commandObj.description}`
        );
    });

    context.reply(`List of commands: \n${message.join("\n")}`, {parse_mode: "MarkdownV2"});
}


function showDebug (context) {
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
}

module.exports = {
    botCommands,
    parseCommand,
    showHelp,
    showDebug
}