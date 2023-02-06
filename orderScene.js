const {Telegraf, Markup, Composer, Scenes} = require('telegraf');
const { helloText } = require('./constants');
require('dotenv').config();
const bot = new Telegraf('5856492718:AAFYH9lDst1Jy1Itou4EINFXUwYTpUoBDUo');
const productList = require('./productList')
const products = productList.productList

//инициализирую ctx.session.data, спрашиваю о способе доставки. тут вроде ок
const startWizard = new Composer()
startWizard.on('callback_query', async (ctx) => {
    try {
        let sum = ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
        ctx.session.data = {}
        await ctx.deleteMessage()
        await ctx.replyWithHTML(`${ sum>500? 'Выберите способ доставки': `
<b>Выберите способ доставки</b>
<i>Внимание! Для бесплатной доставки наберите товаров еще на ${500-sum}₽</i>`}`, Markup.keyboard([
            ['🚗Доставка', '🙋‍♂️Самовывоз'],
            ['Выйти в меню']
        ]).resize())
         return ctx.wizard.next()
    } catch (error) {
        console.log(error.message);
    }
})

//шаг доставки. Тут сохраняю в orderType прошлое сообщение (способ доставки) и спрашиваю имя.
const orderType = new Composer()
orderType.on('text', async (ctx) => {
    try {
        if (ctx.message.text === '🚗Доставка' || ctx.message.text === '🙋‍♂️Самовывоз') {
            ctx.session.data.orderType = ctx.message.text
        await ctx.reply('Напишите имя', Markup.keyboard([
            ['Выйти в меню']
        ]).resize())
        return ctx.wizard.next()
        } else if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, 
                    Markup.keyboard(
                        [
                            ['📝МЕНЮ'],['🛒КОРЗИНА']
                        ]
                    ).resize())
            return ctx.scene.leave()
        } else {
            await ctx.reply('Выберите способ доставки', Markup.keyboard([
                ['🚗Доставка', '🙋‍♂️Самовывоз']
            ]).resize())
            
        }
    } catch (error) {
        console.log(error.message);
    }
})


//Если сообщение меньше 3 символов или сообщение состоит не из букв - отправляю сбщ "введите имя!", 
//если всё норм, сохраняю сообщение в session.data.name и перехожу дальше
const firstName = new Composer()
firstName.on('text', async (ctx) => {
    try { 
        if (ctx.message.text.length<3 || ctx.message.text.match(/\P{L}/giu)) {
            ctx.reply('Введите имя!')
        } else if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, Markup.keyboard([ ['📝МЕНЮ'],['🛒КОРЗИНА'] ]).resize())
            return ctx.scene.leave()
        } else {
            ctx.session.data.name = ctx.message.text
            ctx.session.data.user = ctx.message.from.id
            await ctx.reply("Отправьте номер для связи", Markup.keyboard([ 
                [{
                    text: "Отправить одним касанием 📞",
                    request_contact: true
                }], ['Выйти в меню'] 
            ]).resize());
            return ctx.wizard.next()
        }
    } catch (error) {
        console.log(error.message);
    }
})

//если прошлое сбщ - это текст, я валидирую номер. если не текст - значит это номер. сохраняю номер в session.data.number
//потом отправляю
const number = new Composer()
number.on('message', async (ctx) => {
    try {
        if (ctx.message.text) {
            if (ctx.message.text == 'Выйти в меню') {
                await ctx.replyWithHTML(helloText, 
                        Markup.keyboard(
                            [
                                ['📝МЕНЮ'],['🛒КОРЗИНА']
                            ]
                        ).resize())
                return ctx.scene.leave()
            } else if (ctx.message.text.length !== 11 || ctx.message.text.match(/\D/gi)) {
                ctx.reply('Введите Номер телефона в формате 89123456677')
            } else {
                ctx.session.data.number = ctx.message.text
                if (ctx.session.data.orderType == '🙋‍♂️Самовывоз') {
                    await ctx.wizard.selectStep(6)
                }
                await ctx.replyWithHTML('Адрес доставки? \nНапишите улицу и номер дома')
                return ctx.wizard.next()
            }
        } else {
            ctx.session.data.number = ctx.message.contact.phone_number
            let k = 0;
            for(let i = 0; i < 3; i++ ){
            k =  ctx.message.message_id-i;
            ctx.deleteMessage(k)
        }
            await ctx.replyWithHTML('Адрес доставки? \nНапишите улицу и номер дома', Markup.keyboard([
                ['Выйти в меню']
            ]).resize())
            return ctx.wizard.next()
        }
    } catch (error) {
        console.log(error.message);
    }
})
//тут спрашиваю адрес. Потом спрашиваю хочет ли юзер отправить гео и отправляю клавиатуру с кнопкой оправки гео и с кнопкой "нет"
const address = new Composer()
address.on('message', async (ctx) => { 
    try {
        if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, 
            Markup.keyboard(
                [
                    ['📝МЕНЮ'],['🛒КОРЗИНА']
                ]
            ).resize())
    return ctx.scene.leave()
        } else if (!ctx.message.text.match(/\d/gu)) {
            ctx.replyWithHTML('Пожалуйста, напишите адрес <b>с номером дома</b>')
        } else { //отменён
        ctx.session.data.address = ctx.message.text
        await ctx.reply('Оставить геопозицию?', Markup.keyboard([
            [
                {
                    text: '📍Отправить одним касанием',
                    request_location: true
                }
            ], ['Нет', 'Выйти в меню']
        ]).resize()
        )
        ctx.wizard.next()
        }
    } catch (error) {
        console.log(error.message);
    }
})

const requestGeo = new Composer()
requestGeo.on('message', async (ctx) => {
    try {
        if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, 
            Markup.keyboard(
                [
                    ['📝МЕНЮ'],['🛒КОРЗИНА']
                ]
            ).resize())
    return ctx.scene.leave()
        } else {
            ctx.session.data.geo = ctx.message.location || ctx.message.text
        await ctx.reply('Оставить комментарий?', Markup.keyboard(
            ['Без комментария']
            ).resize())
        return ctx.wizard.next()
        }
    } catch (error) {
        console.log(error.message);
    }
    
})


const paymentChoice = new Composer()
paymentChoice.on('message', async (ctx) => {
    try {
        ctx.session.cart = [...new Set(ctx.session.cart)]
        ctx.session.data.comment = ctx.message.text
        let cart = ctx.session.cart
        let k = 0;
        for(let i = 0; i < 3; i++ ){
            k =  ctx.message.message_id-i;
            ctx.deleteMessage(k)
        }
        let sum = cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
                let discount = 0
                const date = new Date();
                if ((date.getHours()+3) >= 20) {
                    sum*= 0.85
                    discount = 15
                } else if (sum >=500 && sum <1000) {
                    sum = sum/100*97
                    discount = 3
                } else if (sum >=1000) {
                    sum = sum/100*95
                    discount = 5
                }
    
        await ctx.replyWithHTML(`
🛍<b>Ваш заказ:</b>
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${ctx.session.cart.filter(item => item.count>0).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price+'|'+item.count*item.price+']')} 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
<b>💳 Общая сумма: ₽ ${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)}</b> 
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
    } catch (error) {
        console.log(error.message);
    }
})

const sendMsgToChanel = new Composer()
sendMsgToChanel.on('callback_query', async (ctx) => {
        try {
            ctx.session.data.userId = ctx.callbackQuery.from.id
            // console.log(ctx.callbackQuery)
            let sum = ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
                let discount = 0
                const date = new Date();
                if ((date.getHours()+3) >= 20) {
                    sum*= 0.85
                    discount = 15
                } else if (sum >=500 && sum <1000) {
                    sum = sum/100*97
                    discount = 3
                } else if (sum >=1000) {
                    sum = sum/100*95
                    discount = 5
                }
        
            const data = ctx.update.callback_query.data;
            if (data == 'finallyConfirm') {
                await ctx.answerCbQuery()
                await ctx.editMessageReplyMarkup({
                    inline_keyboard:
                    [
                        [{text:"Заказ отправлен", callback_data:"orderSent"}]
                    ]
                })
                await bot.telegram.sendMessage(-1001846120532, 
`🛍Новый заказ:
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${ctx.session.cart.filter(item => item.count>0).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price+'|'+item.count*item.price+']')} 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
💳 Общая сумма: ₽ ${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)} 
Скидка: ${discount}%
        
<ins><b>ИТОГ:</b></ins> ₽ ${Math.round(sum)}
Начислено бонусов: ₽ ${Math.round(sum*0.03)}🔸
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
👤Данные:
└Имя: ${ctx.session.data.name}
└Номер: <pre>${ctx.session.data.number}</pre>
└Адрес: ${ctx.session.data.address}
└<a href="tg://user?id=${ctx.session.data.user}">Написать заказчику</a>
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
        
        } if (data == 'finallyReject') {
            
            await ctx.answerCbQuery('Заказ отменён')
            ctx.session.cart = []
            products.forEach(item => item.count = null)
            await ctx.editMessageReplyMarkup({inline_keyboard:
                [
                    [Markup.button.callback('Отменён', 'cancelled')],
                ]
            })
            await ctx.replyWithHTML('Заказ отменён', Markup.keyboard(
                [
                    ['📝МЕНЮ'],['🛒КОРЗИНА']
                ]
            ).resize())
                    await ctx.scene.leave()
            
        } 
            return ctx.scene.leave()
    } catch (error) {
        console.log(error.message);
    }
})


const orderScene = new Scenes.WizardScene('orderScene', startWizard, orderType, firstName, number, address, requestGeo, paymentChoice, sendMsgToChanel )


module.exports = orderScene