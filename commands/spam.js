function getSpacer (context) {
    const space = Array(30).fill('\n')
    context.reply(`SPAM${space.join('')}SPAM`, { parse_mode: 'HTML' });
}

module.exports = {
    getSpacer
}