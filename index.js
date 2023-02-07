const { Telegraf, Markup, Composer, Scenes, session} = require('telegraf');
require('dotenv').config();
const bot = new Telegraf('5856492718:AAFYH9lDst1Jy1Itou4EINFXUwYTpUoBDUo');
const productList = require('./productList.js')
const products = productList.productList
const btns = require('./constants.js');
const GARNISH_MEAL_IDS = btns.GARNISH_MEAL_IDS
const STOPLIST = btns.STOPLIST
const CAFE_NUM = btns.CAFE_NUM
const CAFE_ADDRESS = btns.CAFE_ADDRESS

// const GARNISH_MEAL_IDS = products.filter(item => item.garnish).map(item => item.id)

//+++++++++++++++++++++
const orderScene = require('./orderScene');
const stage = new Scenes.Stage([orderScene])
bot.use(session());
bot.use(stage.middleware());
//+++++++++++++++++++++




//Хэндлеры для канала. То, что будет происходить при нажатии на "Оплачен" или "Отклонён"
bot.action('accepted', async (ctx) => {
    try {
        await ctx.answerCbQuery()
        await ctx.editMessageReplyMarkup({inline_keyboard:
        [
            [Markup.button.callback('✅Заказ принят', 'orderAccepted')],
        ] 
        })
    } catch (error) {
        console.log(error.message);
    }
})
bot.action('rejected', async (ctx) => {
    try {
        await ctx.answerCbQuery()
        await ctx.editMessageReplyMarkup({inline_keyboard:
        [
        [Markup.button.callback('❌Заказ Отклонен', 'orderRejected')],
        ] 
        })
    } catch (error) {
        console.log(error.message);
    }
}) 


        

bot.on("photo", async (ctx) => {
    try {
        if (ctx.message.from.username == 'I_grok') {

        const captionPhoto = ctx.message.caption;
        const captionEntitiesPhoto = ctx.message.caption_entities;
        const chat_id = 859134174
        const fileIdPhoto = ctx.message.photo[ctx.message.photo.length-1].file_id;
        return ctx.replyWithHTML(`${fileIdPhoto}`);
        }
    } catch (error) {
        console.log(error.message);
    }
});
//price

//действия при нажатии на блюда с выбором гарнира
bot.action(GARNISH_MEAL_IDS, async (ctx) => {
    try {
        await ctx.editMessageText('Выберите гарнир')
        await ctx.editMessageReplyMarkup({inline_keyboard:[ 
             [Markup.button.callback('Картофель фри', `${ctx.match}Free`)],
             [Markup.button.callback('Рис', `${ctx.match}Rise`)],
             [Markup.button.callback('Картофель в мундире', `${ctx.match}Mundir`)],
             [Markup.button.callback('Картофельное пюре', `${ctx.match}Pure`)],
             [Markup.button.callback('Картофель по-деревенски', `${ctx.match}Village`)],
             [Markup.button.callback('Назад', 'cknMeal')],
            ]})
    } catch (error) {
        console.log(error.message);
    }
})




//меню, которое всплывёт для напитков (сделано мануально для нормального расположения кнопок)
bot.action('drinks', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.deleteMessage();
        await ctx.replyWithHTML('<b>_______НАПИТКИ:_______</b>',Markup.inlineKeyboard(btns.drinks));
    } catch (error) {
        console.log(error.message);
    }
}) 


//При нажатии на категорию
bot.action(products.map(product => product.categoryId), async (ctx) => {
    try {
        await ctx.answerCbQuery()
        await ctx.deleteMessage();
        // в строке ниже я привожу продукты в удобную форму через метод map, чтобы каждый продукт имел форму массива из двух элементов.
        // первый - название продукта + его цена, а второй - айди продукта. Дальше я добавляю в этот массив кнопку "назад" для перехода в меню
        const tappedCategoryProducts = products.filter(product =>product.categoryId == ctx.match).map(item => [item.title +` [${item.price}]`, item.id])
        tappedCategoryProducts.push(['🔙назад', 'menu'])
        ctx.sendMessage(`${products.find(item => ctx.match == item.categoryId).category}`, Markup.inlineKeyboard(tappedCategoryProducts.map(item=> [Markup.button.callback(item[0], item[1])])))
        //в строке выше я ищу в продуктах название категории того продукта, которое соответствует колбэку нажатой мной кнопки (например, я нажал на ('Банан', 'banana'), значит буду искать название категории того продукта, айди категории которого == 'banana')
    } catch (error) {
        console.log(error.message);
    }
})







//MENU_________________________
bot.start((ctx) => {
    try {
        ctx.replyWithHTML(
btns.helloText, 
        Markup.keyboard(
            [
                ['📝МЕНЮ'],['🛒КОРЗИНА']
            ]
        ).resize())
    } catch (error) {
        console.log(error.message);
    }
})


bot.hears('📝МЕНЮ', async (ctx) => { //при нажатии на 📝МЕНЮ - отправляю категории продуктов в мануально настроенном формате. колбеки кнопок 📝МЕНЮ равны categoryId продуктов.
    try {
        await ctx.deleteMessage()
        await ctx.reply('Нео Шеф', Markup.keyboard([
            ['📝МЕНЮ'],['🛒КОРЗИНА']
        ]).resize())
        await ctx.reply('Выберите категорию', Markup.inlineKeyboard(btns.categoryBtns))
    } catch (error) {
        console.log(error.message);
    }
})
const date = new Date()
bot.hears('a', ctx => ctx.reply(`${date.getUTCHours()+3}`))
//enter
bot.hears('🛒КОРЗИНА', async ctx => {
    try {
        ctx.session ??= { cart: [] };
        ctx.session.cart ??= [];
        const cart = [...new Set(ctx.session.cart)]
        if(cart.length === 0 || cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)==0) {
            await ctx.replyWithHTML('<b>Корзина пуста...</b>', Markup.inlineKeyboard( 
                [
                    [Markup.button.callback(`📝Меню`, 'menu')],
                ]))
        } else {
            let sum = cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
            let discount = 0
            const date = new Date();
            if ((date.getUTCHours()+3) >= 20 && (date.getUTCHours()+3) < 24) {
                sum*= 0.85
                discount = 15
            } else if (sum >=500 && sum <1000) {
                sum = sum/100*97
                discount = 3
            } else if (sum >=1000) {
                sum = sum/100*95
                discount = 5
            }
            await ctx.replyWithHTML(`🛍<b>Ваш заказ:</b> \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${cart.filter(item => item.count>=1).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price+'|'+item.count*item.price+']')} \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n <b>💳 Общая сумма: ₽${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)}</b>\nСкидка: <b>${discount}%</b>\n<b><ins>Итог:</ins> ₽${Math.round(sum)}</b>`, Markup.inlineKeyboard([
            [Markup.button.callback(`✅ Перейти к оплате`, 'submitOrder')],
            [Markup.button.callback(`❌ Отменить заказ`, 'cancelOrder')],
            [Markup.button.callback(`🔙В категории`, 'menu')]
        ]))  }
    } catch (error) {
        console.log(error.message);
    }
})
bot.action('menu', ctx => {
    try {
        ctx.answerCbQuery()
        ctx.deleteMessage()
        ctx.reply('Выберите продукт', Markup.inlineKeyboard(btns.categoryBtns))
    } catch (error) {
        console.log(error.message);
    }
})
//_____________________MENU END








bot.hears('🚗Доставка', async (ctx) => {
    await ctx.scene.enter('delivertyScene')
})











//_________CALLBACK QUERY________________________
bot.on('callback_query', async (ctx) => {
    try {
        ctx.session ??= { cart: [] };
        ctx.session.cart ??= [];
        const cart = [...new Set(ctx.session.cart)]
        // console.log(ctx.session.cart)
        const data = ctx.update.callback_query.data
        // console.log(data)
        const tappedProduct = products.find(item => item.id == data)
            
        if(tappedProduct) {
            await ctx.answerCbQuery()
            ctx.session.cart.push(tappedProduct)                   
            // console.log(ctx.session.cart)
            await ctx.deleteMessage()
            await ctx.telegram.sendPhoto(ctx.chat.id, tappedProduct.photo_id || 'AgACAgIAAxkBAAItwWPeVi9Y4E5i0rwiQzXLLghmwJPzAAIWxzEbyjj4Sh5BQTr4yZqgAQADAgADeQADLgQ', 
                {
                    caption: 
`<b>${tappedProduct.title} - [₽ ${tappedProduct.price}]</b> 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
${tappedProduct.content ? 'Состав: ' + tappedProduct.content : ''}`,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:"Добавить в корзину", callback_data:"+"}],
                            [{text:"Назад", callback_data:`${tappedProduct.categoryId}`}]
                        ]
                    }, parse_mode: 'HTML'
                });        
        }
        if (data === '+') {
            cart.at(-1).count+=1 || ctx.reply('ok')
            await ctx.editMessageReplyMarkup({inline_keyboard:[
                [Markup.button.callback('➖', '-'), Markup.button.callback(`${cart.at(-1).count}`, 'count'), Markup.button.callback('➕', '+')],
                [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)})`, 'cart')],
                [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
            ]})
            // console.log(ctx.session.cart)
        }
        if (data === '-' && cart.length) {
            cart.at(-1).count-=1
            await ctx.editMessageReplyMarkup({inline_keyboard:[
                [Markup.button.callback('➖', '-'), Markup.button.callback(`${cart.at(-1).count}`, 'count'), Markup.button.callback('➕', '+')],
                [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)})`, 'cart')],
                [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
            ]})
        } 
        if (data === '-' && cart.at(-1).count==0 && cart.length) {
                
            await ctx.editMessageReplyMarkup({inline_keyboard:[
                [Markup.button.callback(`${cart.at(-1).count}`, 'count'), Markup.button.callback('➕', '+')],
                [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)})`, 'cart')],
                [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
            ]})
        } 
        if (data === 'cancelOrder') { 
            await ctx.answerCbQuery('Вы очистили корзину.')
            ctx.session.cart = []
            products.forEach(item => item.count = null)
            await ctx.editMessageText('Корзина пуста...')
            await ctx.editMessageReplyMarkup({inline_keyboard:
                [
                    [{text:"📝Меню", callback_data:"menu"}],
                ]
            })
        } 
        if (data == 'cart') 
        {   
            ctx.answerCbQuery()
            ctx.deleteMessage()
            if(cart.length === 0 || cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)==0) {
                await ctx.replyWithHTML('<b>Корзина пуста...</b>', Markup.inlineKeyboard( 
                    [
                        [Markup.button.callback(`📝Меню`, 'menu')],
                    ]))
            } else {
                let sum = cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)
                let discount = 0
                const date = new Date();
                if ((date.getUTCHours()+3) >= 20 && (date.getUTCHours()+3) < 24) {
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
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${cart.filter(item => item.count>=1).map(item => '\n'+ "◽" + item.title +  ' - ['+item.count+'*'+item.price+'| '+item.count*item.price+']')} 
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
<b>💳 Общая сумма: ₽${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price*curr.count}, 0)}</b>
Скидка: <b>${discount}%</b>
<b><ins>Итог:</ins> ₽${Math.round(sum)}</b>
${sum>500?'\n<b>Бесплатная доставка по городу</b>':`\n<i>Для бесплатной доставки закажите товаров еще на ${500-sum}₽</i>`}
`, Markup.inlineKeyboard([
                    [Markup.button.callback(`✅ Перейти к оплате`, 'submitOrder')],
                    [Markup.button.callback(`❌ Отменить заказ`, 'cancelOrder')],
                    [Markup.button.callback(`🔙В категории`, 'menu')]
                ]))  
            }
        }                                                                                                                                                
        if (data === 'submitOrder' && ctx.session.cart.length>0) {
            await ctx.answerCbQuery()
            await ctx.replyWithHTML('Выберите способ доставки', Markup.keyboard([
                ['🚗Доставка', '🙋‍♂️Самовывоз'],
                ['📝МЕНЮ']
            ]).resize())
        } else await ctx.answerCbQuery()
    } catch (error) {
        console.log(error.message);
    }
})
//________________________________CALLBACK QUERY_____END

bot.command('stoplist', async (ctx) => {
    await ctx.reply(STOPLIST)
})
bot.command('num', async (ctx) => {
    await ctx.replyWithHTML(`${CAFE_NUM}`)
})
bot.command('add', async (ctx) => {
    await ctx.replyWithHTML(`${CAFE_ADDRESS}`)
})


bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
                
                

                // bot.on("message", async (ctx) => {
                    
                    //     const captionPhoto = 'my cap'
                    //     const captionEntitiesPhoto = ctx.message.caption_entities;
                    //     const fileIdPhoto = 'AgACAgIAAxkBAAIQXGPDm2WtW_hd53yyPOojK8YqCOF0AAIPxjEboMYgSp0wA3Q0mrVaAQADAgADeQADLQQ'
                    
                    //     await ctx.telegram.sendPhoto(ctx.chat.id, fileIdPhoto, {
                        //         caption: captionPhoto,
                        //         reply_markup:{
                            //             inline_keyboard:[
                                //                 [{text:"Hii",callback_data:"Byy"}]
                                //             ]
                                //         }
                                //     });
                                // });
                                
                                
                // bot.hears('delete', (ctx) =>{
                //     let k = 0;
                //     for(let i = 0; i <= 100; i++ ){
                //         k =  ctx.message.message_id-i;
                //         ctx.deleteMessage(k)
                 //     }
                // })