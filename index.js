const TelegramApi = require("node-telegram-bot-api")
const token = "5541321754:AAHKQuQ3sqY-ROUXYmHr5qqcVUp3ZW6TFqo"

const bot = new TelegramApi(token, {polling: true});
let notes = [];

const options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Напоминать об утренних эфирах", callback_data: "Morning"}],
            [{text: "Напоминать о вечерних эфирах", callback_data: "Evening"}],
            [{text: "Напоминать о всех эфирах", callback_data: "All"}],
            [{text: "Отключить напоминания", callback_data: "Disable"}],
        ]
    }),
    parse_mode: 'HTML',
};

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начальное приветсвие"},
        {command: "/change", description: "Изменить время"},

    ]);
    
    bot.on("message", async(msg) => {
        console.log('msg', msg)
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === "/start") {
            return bot.sendMessage(chatId, `Здравствуйте, ${msg.from.first_name}!
Благодарим за использование нашего Колокола! 
Вы будете получать сообщения о грядущем вечернем эфире на канале " <a href="https://t.me/bibleyskie">Библейские чтения</a>" за 10 минут до начала.
Утренние  эфиры в 06:40 в Среду и в Воскресенье.
Вечерние эфиры в 20:40 во Вторник и Субботу.
Пожалуйста, выберите удобное для вас время!
Вы можете изменить его в любой момент с помощью команды /change`, options);
        }

        if (text === "/change") {
            return bot.sendMessage(chatId, `Пожалуйста, выберите удобное для вас время!`, options);
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз!)")
    });

    bot.on("callback_query", (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        switch (data) {
            case "Morning":
                notes.push({ 'id': chatId, 'time': ['6:30'], 'days': [3, 0]});
                break;
            case "Evening":
                notes.push({ 'id': chatId, 'time': ['20:30'], 'days': [2, 6]});
                break;
            case "All":
                notes.push({ 'id': chatId, 'time': ['6:30'], 'days': [3, 0]});
                notes.push({ 'id': chatId, 'time': ['20:30'], 'days': [2, 6]});
                break;
            default:
                notes = [];
                break;
        }
        bot.sendMessage(chatId, `Договорились!)` )
    });
}

setInterval(() => {
    for (let i = 0; i < notes.length; i++) {
    const curDate = new Date().getHours() + ':' + new Date().getMinutes();
    const curDay = new Date().getDay()
    console.log('notes', notes)
    if (notes[i].time.some(el => el === curDate) && notes[i].days.some(el => el === curDay)) {
      bot.sendMessage(notes[i].id, 'Напоминаю, что через 10 минут начнется эфир!!!');
    }
  }
}, 10000);

start()