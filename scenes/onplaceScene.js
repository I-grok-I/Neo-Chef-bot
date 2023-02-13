const {Telegraf, Markup, Composer, Scenes} = require('telegraf');
const { helloText } = require('../constants');
require('dotenv').config();
const bot = new Telegraf('5856492718:AAFYH9lDst1Jy1Itou4EINFXUwYTpUoBDUo');
const productList = require('../productList')
const products = productList.productList



//Инициализирую объект ctx.session.data, он создаётся отдельный для каждого процесса (каждому пользователю свой)
//Говорю, что способ доставки - самовывоз. (так как сцена предназначена для самовывоза)
//Даю выбрать способ оплаты: нал или перевод. Так же отправляю кнопку для выхода из визард сцены, если нужно что-то докупить.
//NEXT
const payment = new Composer()
payment.on('text', async (ctx) => {
    try {
        ctx.session.data = {}
        ctx.session.data.orderType = '🙋‍♂️Самовывоз'
        await ctx.reply('Выберите способ оплаты', Markup.keyboard( [['💳Перевод', '💰Наличные'], ['Выйти в меню']] ).resize())
        await ctx.wizard.next()
    } catch (error) {
        console.log(error.message);
    }
})

//если юзер нажал на кнопки "перевод" || "Наличные" - сохраняем это как способ оплаты в объект session.data.payment
//И тут же спрашивая имя и отправляя кнопку "Выйти в меню" делаем NEXT
//Если в прошлом шаге юзер нажал на "Выйти в меню" - отправляем helloText и выходим из сцены
//Если никакие из вышеперечисленных условий не выполнились - заново отправляем кнопки выбора способа оплаты и "выход в меню". 
const inputName = new Composer()
inputName.on('text', async (ctx) => {
    try {
        if (ctx.message.text === '💳Перевод' || ctx.message.text === '💰Наличные') {
            ctx.session.data.payment = ctx.message.text
            await ctx.reply('Напишите имя', Markup.keyboard( [['Выйти в меню']] ).resize())
            await ctx.wizard.next()
        } else if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, Markup.keyboard([ ['📝МЕНЮ'],['🛒КОРЗИНА'] ]).resize())
            return ctx.scene.leave()
        } else {
        await ctx.reply('Выберите способ оплаты', Markup.keyboard( [['💳Перевод', '💰Наличные'], ['Выйти в меню']] ).resize())
        }
    } catch (error) {
        console.log(error.message);
    }
})


//Если юзер нажал "Выйти в меню" - отправляем helloText, выходим из сцены
//Если сообщение меньше 3 символов или сообщение состоит не из букв - отправляю сбщ "введите имя!", 

//Если вышеперечисленные условия не исполнились:
// 1. сохраняю в объект session.data.name введенный текст
// 2. достаю из message.from.id айдишник юзера и сохраняю в объект session.data.user
// 3. Запрашиваю номер пользователя и отправляю кнопки "Отправить касанием" и "Выйти в меню"
// 4. NEXT
const requestNumber = new Composer()
requestNumber.on('text', async (ctx) => {
    try { 
         if (ctx.message.text == 'Выйти в меню') {
            await ctx.replyWithHTML(helloText, Markup.keyboard([ ['📝МЕНЮ'],['🛒КОРЗИНА'] ]).resize())
            return ctx.scene.leave()
        } else if (ctx.message.text.length<3 || ctx.message.text.match(/\P{L}/giu)) {
            ctx.reply('Введите имя!')
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


//Если прошлое сообщение - это текст:
    //Если пользователь нажал "Выйти в меню" - отправляем helloText с кнопками меню и корзины и выходим из сцены LEAVE
    //Если пользователь отправил текст который !=11 или в тексте нет цифр - опять просим ввести номер телефона, уточняем в каком формате надо вводить.
    //Иначе - сохраняем текст в session.data.number и спрашиваем КОММЕНТАРИЙ. NEXT
//Если прошлое сбщ - это контакт - сохраняем в session.data.number ctx.message.contact.phone_number(контакт) и спрашиваем КОММЕНТАРИЙ. NEXT
//Если прошлое сбщ - ни текст, ни контакт - заново запрашиваем номер телефона или контакт

const comment = new Composer()
comment.on('message', async (ctx) => {
    try {
        if (ctx.message.text) {
            if (ctx.message.text == 'Выйти в меню') {
                await ctx.replyWithHTML( helloText, Markup.keyboard( [['📝МЕНЮ'],['🛒КОРЗИНА']] ).resize() )
                return ctx.scene.leave()
            } else if (ctx.message.text.length !== 11 || ctx.message.text.match(/\D/gi)) {
                ctx.reply('Введите Номер телефона в формате 89123456677')
            } else {
                ctx.session.data.number = ctx.message.text
                await ctx.reply('Оставить комментарий?', Markup.keyboard(['Без комментария']).resize())
                return ctx.wizard.next()
            }
        } else if (ctx.message.contact.phone_number) {
                ctx.session.data.number = ctx.message.contact.phone_number
                await ctx.reply('Оставить комментарий?', Markup.keyboard( ['Без комментария'] ).resize());
                return ctx.wizard.next()
        } else {
                await ctx.reply("Отправьте номер для связи", Markup.keyboard([ 
                    [
                        {
                        text: "Отправить одним касанием 📞",
                        request_contact: true
                        }
                    ], ['Выйти в меню']] ).resize());
        }
    } catch (error) {
        console.log(error.message);
    }
})


//Оставляем в корзине только уникальные значения
//Заносим в объект comment прошлое сообщение
//удаляем 3 прошлых сообщения (*выяснить зачем)
//Объявляем сумму, скидку в зависимости от суммы заказа и времени. Сумма больше 500? скидка 3%. Больше 1000? 5% время позже 20:00? 15%
//
const paymentChoice = new Composer()
paymentChoice.on('message', async (ctx) => {
    try {
        ctx.session.cart = [...new Set(ctx.session.cart)]
        ctx.session.data.comment = ctx.message.text
        let cart = ctx.session.cart
        let k = 0;
        for(let i = 0; i < 3; i++ ){
            k =  ctx.message.message_id-i;
            await ctx.deleteMessage(k)}
        let sum = cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
                let discount = 0
                if (sum >=500 && sum <1000) {
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

Способ доставки: ${ctx.session.data.orderType}
Комментарий: ${ctx.session.data.comment}
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
${ctx.session.data.payment == '💳Перевод'? `Переведите ${Math.round(sum)}₽ по номеру <pre>89883090099</pre>
<a href="https://t.me/NeoChef2">Отправить чек об оплате</a>`:'Оплата: 💰Наличные'}
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
} })

const sendMsgToChanel = new Composer()
sendMsgToChanel.on('callback_query', async (ctx) => {
        try {
            let sum = ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
                let discount = 0
                if (sum >=500 && sum <1000) {
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
└✉️<a href="tg://user?id=${ctx.session.data.user}">Написать заказчику</a>
Способ доставки: ${ctx.session.data.orderType}
Способ оплаты: ${ctx.session.data.payment}
Комментарий: ${ctx.session.data.comment}
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
`, {
    reply_markup:{
        inline_keyboard:
        [
            [{text:"✅Оплачен", callback_data:"accepted"}],
            [{text:"❌Отклонить", callback_data:`rejected`}]
        ] }, parse_mode: 'HTML'
    })
        ctx.session.cart = []
        products.forEach(product => product.count = 0)
        
        }
         if (data == 'finallyReject') {
            await ctx.answerCbQuery('Заказ отменён')
            ctx.session.cart = []
            products.forEach(item => item.count = null)
            await ctx.editMessageReplyMarkup({inline_keyboard:
                [
                    [Markup.button.callback('Отменён', 'cancelled')],
                ]
            })
            await ctx.replyWithHTML('Вы отменили заказ', Markup.keyboard(
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


const onplaceScene = new Scenes.WizardScene('onplaceScene', payment, inputName, requestNumber, comment, paymentChoice, sendMsgToChanel )


module.exports = onplaceScene