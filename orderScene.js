const {Telegraf, Markup, Composer, Scenes} = require('telegraf')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const productList = require('./productList')
const products = productList.productList

//инициализирую ctx.session.data, спрашиваю о способе доставки. тут вроде ок
const startWizard = new Composer()
startWizard.on('callback_query', async (ctx) => {
    ctx.session.data = {}
    await ctx.reply('Выберите способ достаки', Markup.keyboard([
        ['🚗Доставка', '🙋‍♂️Самовывоз'],
        ['Выйти в меню']
    ]).oneTime().resize())
     return ctx.wizard.next()
})

//шаг доставки. Тут сохраняю в orderType прошлое сообщение (способ доставки) и спрашиваю имя.
const orderType = new Composer()
orderType.on('text', async (ctx) => {
    if (ctx.message.text === '🚗Доставка' || ctx.message.text === '🙋‍♂️Самовывоз') {
        ctx.session.data.orderType = ctx.message.text
    await ctx.reply('Напишите имя', Markup.keyboard([
        ['Выйти в меню']
    ]).oneTime().resize())
    return ctx.wizard.next()
    } else if (ctx.message.text == 'Выйти в меню') {
        await ctx.replyWithHTML(
`<b>Добро пожаловать в Нео Шеф!
 Заказ еды в пару кликов</b>
◽Автоматическое начисление бонусов в размере 3% от суммы
◽За покупку свыше 300₽ - скидка 3%, свыше 500₽ - 5%
◽Бесплатная доставка по городу от 500₽`, 
                Markup.keyboard(
                    [
                        ['Меню'],['Корзина']
                    ]
                ).resize())
        return ctx.scene.leave()
    } else {
        await ctx.reply('Выберите способ достаки', Markup.keyboard([
            ['🚗Доставка', '🙋‍♂️Самовывоз']
        ]).oneTime().resize())
        
    }
})


//Если сообщение меньше 3 символов или сообщение состоит не из букв - отправляю сбщ "введите имя!", 
//если всё норм, сохраняю сообщение в session.data.name и перехожу дальше
const firstName = new Composer()
firstName.on('text', async (ctx) => {
    if (ctx.message.text == 'Выйти в меню') {
        await ctx.replyWithHTML(
`<b>Добро пожаловать в Нео Шеф!
 Заказ еды в пару кликов</b>
◽Автоматическое начисление бонусов в размере 3% от суммы
◽За покупку свыше 300₽ - скидка 3%, свыше 500₽ - 5%
◽Бесплатная доставка по городу от 500₽`, 
                Markup.keyboard(
                    [
                        ['Меню'],['Корзина']
                    ]
                ).resize())
        return ctx.scene.leave()
    }else if (ctx.message.text.length<3 || ctx.message.text.match(/\P{L}/giu)) {
        ctx.reply('Введите имя!')
    } else {
        ctx.session.data.name = ctx.message.text
        ctx.session.data.user = ctx.message.from.username
        await ctx.reply("Отправьте номер для связи", Markup.keyboard([ 
            [
              {
                 text: "Отправить номер телефона 📞",
                 request_contact: true
              }
           ], ['Выйти в меню']
        ]).oneTime().resize());
        return ctx.wizard.next()
    }
})

//если прошлое сбщ - это текст, я валидирую номер. если не текст - значит это номер. сохраняю номер в session.data.number
//потом отправляю
const number = new Composer()
number.on('message', async (ctx) => {
    if (ctx.message.text) {
        if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(
    `<b>Добро пожаловать в Нео Шеф!
     Заказ еды в пару кликов</b>
    ◽Автоматическое начисление бонусов в размере 3% от суммы
    ◽За покупку свыше 300₽ - скидка 3%, свыше 500₽ - 5%
    ◽Бесплатная доставка по городу от 500₽`, 
                    Markup.keyboard(
                        [
                            ['Меню'],['Корзина']
                        ]
                    ).resize())
            return ctx.scene.leave()
        } else if (ctx.message.text.length !== 11 || ctx.message.text.match(/\D/gi)) {
            ctx.reply('Введите Номер телефона в формате 89123456677')
        } else {
            ctx.session.data.number = ctx.message.text
            await ctx.replyWithHTML('Напишите Ваш адрес')
            return ctx.wizard.next()
        }
    } else {
        ctx.session.data.number = ctx.message.contact.phone_number
        let k = 0;
        for(let i = 0; i < 3; i++ ){
        k =  ctx.message.message_id-i;
        ctx.deleteMessage(k)
    }
        await ctx.replyWithHTML('Напишите Ваш адрес', Markup.keyboard([
            ['Выйти в меню']
        ]).oneTime().resize())
        return ctx.wizard.next()
    }
})
//тут спрашиваю адрес. Потом спрашиваю хочет ли юзер отправить гео и отправляю клавиатуру с кнопкой оправки гео и с кнопкой "нет"
const address = new Composer()
address.on('message', async (ctx) => { 
        ctx.session.data.address = ctx.message.text
        await ctx.reply('Оставить геопозицию?', Markup.keyboard([
            [
                {
                    text: '📍Отправить геопозицию',
                    request_location: true
                }
            ], ['Нет', 'Выйти в меню']
        ]).resize().oneTime()
        )
        ctx.wizard.next()
})

const requestGeo = new Composer()
requestGeo.on('message', async (ctx) => {
    if (ctx.message.text == 'Выйти в меню') {
        await ctx.replyWithHTML(
`<b>Добро пожаловать в Нео Шеф!
 Заказ еды в пару кликов</b>
◽Автоматическое начисление бонусов в размере 3% от суммы
◽За покупку свыше 300₽ - скидка 3%, свыше 500₽ - 5%
◽Бесплатная доставка по городу от 500₽`, 
        Markup.keyboard(
            [
                ['Меню'],['Корзина']
            ]
        ).resize())
return ctx.scene.leave()
    } else {
        ctx.session.data.geo = ctx.message.location || ctx.message.text
    await ctx.reply('Оставить комментарий?', Markup.keyboard(
        ['Без комментария']
        ).oneTime().resize())
    return ctx.wizard.next()
    }
    
})


const paymentChoice = new Composer()
paymentChoice.on('message', async (ctx) => {
    ctx.session.data.comment = ctx.message.text
    let k = 0;
    for(let i = 0; i < 3; i++ ){
        k =  ctx.message.message_id-i;
        ctx.deleteMessage(k)
    }
    let sum = ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)
    if (sum >=500 && sum <1000) {sum = sum/100*97}
    else if (sum >=1000) {sum = sum/100*95}

    let discount = 0
    if (sum >=500 && sum <1000) {discount = 3}
    else if (sum >=1000) {discount = 5}

    await ctx.replyWithHTML(`
🛍<b>Ваш заказ:</b>
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${ctx.session.cart.filter(item => item.count>0).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price[0]+'|'+item.count*item.price[0]+']')} 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
<b>💳 Общая сумма: ₽ ${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)}</b> 
Скидка: <b>${discount}%</b>

<b><ins>ИТОГ:</ins> ₽ ${Math.round(sum)}</b>
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
👤Ваши данные:
└Имя: ${ctx.session.data.name}
└Номер: ${ctx.session.data.number}
└Адрес: ${ctx.session.data.address.longitude?'геопозиция':ctx.session.data.address}
Способ доставки: ${ctx.session.data.orderType}
Комментарий: ${ctx.session.data.comment}
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
Вам автоматически начислены бонусы на следующую покупку - ₽${(Math.round(sum*0.03))}🔸
`, Markup.inlineKeyboard(
        [
            [Markup.button.callback('✅Подтвердить заказ', 'finallyConfirm')],
            [Markup.button.callback('❌Отменить заказ', 'finallyReject')]
        ]
    ))
    return ctx.wizard.next()
})

const sendMsgToChanel = new Composer()
sendMsgToChanel.on('callback_query', async (ctx) => {
    ctx.session.data.userId = ctx.callbackQuery.from.id
    // console.log(ctx.callbackQuery)
    let sum = ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)
    if (sum >=500 && sum <1000) {sum = sum/100*97}
    else if (sum >=1000) {sum = sum/100*95}

    let discount = 0
    if (sum >=500 && sum <1000) {discount = 3}
    else if (sum >=1000) {discount = 5}

    const data = ctx.update.callback_query.data;
    if (data == 'finallyConfirm') {
        console.log(ctx.session.cart);
        await ctx.answerCbQuery()
        await bot.telegram.sendMessage(-1001846120532, 
`🛍Новый заказ:
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${ctx.session.cart.filter(item => item.count>0).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price[0]+'|'+item.count*item.price[0]+']')} 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
💳 Общая сумма: ₽ ${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)} 
Скидка: ${discount}%

<ins><b>ИТОГ:</b></ins> ₽ ${Math.round(sum)}
Начислено бонусов: ₽ ${Math.round(sum*0.03)}🔸
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
👤Данные:
└Имя: ${ctx.session.data.name}
└Номер: <pre>${ctx.session.data.number}</pre>
└Адрес: ${ctx.session.data.address}
└Телеграм: @${ctx.session.data.user}
Способ доставки: ${ctx.session.data.orderType}
Комментарий: ${ctx.session.data.comment}
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
`, {
    reply_markup:{
        inline_keyboard:[
            [{text:"✅Оплачен", callback_data:"accepted"}],
            [{text:"❌Отклонить", callback_data:`rejected`}]
        ]
    }, parse_mode: 'HTML'
})
await bot.telegram.sendLocation(-1001846120532, ctx.session.data.geo.latitude, ctx.session.data.geo.longitude)   
ctx.session.cart = []
products.forEach(product => product.count = 0)

} else if (data == 'finallyReject') {
    
    await ctx.answerCbQuery('Заказ отменён')
    ctx.session.cart = []
    products.forEach(item => item.count = null)
    await ctx.editMessageReplyMarkup({inline_keyboard:
        [
            [Markup.button.callback('Отменён', 'cancelled')],
        ]
    })
    await ctx.replyWithHTML('Заказ отменён',Markup.keyboard(
        [
            ['Меню'],['Корзина']
        ]
    ).resize())
            await ctx.scene.leave()
    
} 
    return ctx.scene.leave()
})


const orderScene = new Scenes.WizardScene('orderScene', startWizard, orderType, firstName, number, address, requestGeo, paymentChoice, sendMsgToChanel )


module.exports = orderScene