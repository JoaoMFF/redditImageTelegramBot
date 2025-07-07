const logger = require("../logger");

async function tagEveryone (context) {
    try {
        // only works in group chats
        if (context.chat.type !== "group") return

        const admins = await context.getChatAdministrators(context.chat.id)

        // does not work in a group with a single admin
        if (admins.length <= 1) return

        let tags = []
        admins.forEach(admin => {
            tags.push(`<a href="tg://user?id=${admin.user.id}">@${admin.user.username}</a>`)
        })
        context.reply('👋 ' + tags.join(' '), { parse_mode: 'HTML' });
    } catch (error) {
        logger.logError("Error when tagging everyone", error);
        context.reply("Oops something went wrong!");
    }
}

module.exports = {tagEveryone};