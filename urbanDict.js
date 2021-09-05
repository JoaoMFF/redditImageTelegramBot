const axios = require("axios"); // add axios
const logger = require("./logger");
const slugify = require("slugify");

const getMeaning = async function (context, expression) {
    const {RAPID_API_KEY} = process.env;
    const expressionFormated = expression.split(",").join(" ");
    const options = {
        method: "GET",
        url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        params: {term: expressionFormated},
        headers: {
            "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "x-rapidapi-key": RAPID_API_KEY
        }
    };
    await axios.request(options).then(response => {
        if (!response.data.list.length) {
            context.reply(`Can't find results for: "*${expressionFormated}*"`, {parse_mode: "MarkdownV2"});
            return;
        }
        const definitionObj = response.data.list[0];
        const title = `*${expressionFormated}*\n`;
        const startOfMessage = "```\n";
        const endOfMessage = "\n```";
        const definition = `\n${formatString(definitionObj.definition)}\n`;
        const example = `\nexample: ${formatString(definitionObj.example)}`;
        const footer = `\nhttp\\:\\/\\/${slugify(expressionFormated).split("-").join("\\-")}\\.urbanup\\.com`;
        const message = title + startOfMessage + definition + example + endOfMessage + footer;

        context.reply(message, {
            parse_mode: "MarkdownV2",
            disable_web_page_preview: true
        });
    }).catch(error => {
        logger.logError("Error when fetching urban dictionary", error);
        context.reply("Bruh, that makes no sense..");
    });
};

function formatString(string) {
    return string.split("[").join("").split("]").join("");
}

module.exports = {getMeaning};
