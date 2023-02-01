const { Telegraf, Markup, Composer, Scenes, session} = require('telegraf');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const productList = require('./productList')
const products = productList.productList
const btns = require('./constants');
const garnishMealsIds = products.filter(item => item.garnish).map(item => item.id)





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const orderScene = require('./orderScene');

const stage = new Scenes.Stage([orderScene])
bot.use(session());
bot.use(stage.middleware());
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        
bot.on("photo", async (ctx) => {
    
    const captionPhoto = ctx.message.caption;
    const captionEntitiesPhoto = ctx.message.caption_entities;
    const chat_id = 859134174
    const fileIdPhoto = ctx.message.photo[ctx.message.photo.length-1].file_id;

    return ctx.replyWithHTML(`${fileIdPhoto}`);
});

bot.action(garnishMealsIds, async (ctx) => {
   await ctx.editMessageText('Выберите гарнир')
   await ctx.editMessageReplyMarkup({inline_keyboard: [ 
        [Markup.button.callback('Картофель фри', `${ctx.match}Free`)],
        [Markup.button.callback('Рис', `${ctx.match}Rise`)],
        [Markup.button.callback('Картофель в мундире', `${ctx.match}Mundir`)],
        [Markup.button.callback('Картофельное пюре', `${ctx.match}Pure`)],
        [Markup.button.callback('Картофель по-деревенски', `${ctx.match}Village`)],
        [Markup.button.callback('Назад', 'cknMeal')],

    ]})
})


//Хэндлеры для канала. То, что будет происходить при нажатии на "Оплачен" или "Отклонён"
bot.action('accepted', async (ctx) => {
    await ctx.editMessageReplyMarkup({inline_keyboard:[
        [Markup.button.callback('✅Заказ принят', 'orderAccepted')],
    ] })
})
bot.action('rejected', async (ctx) => {
    await ctx.editMessageReplyMarkup({inline_keyboard:[
        [Markup.button.callback('❌Заказ Отклонен', 'orderRejected')],
      ] })
}) 

bot.action('drinks', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.deleteMessage();
    
    await ctx.replyWithHTML('<b>_______НАПИТКИ:_______</b>',Markup.inlineKeyboard(btns.drinks))
}) 


//При нажатии на категорию
bot.action(products.map(product => product.categoryId), async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.deleteMessage();
    let tappedCategoryProducts = products.filter(product =>product.categoryId == ctx.match).map(item => [item.title +` [${item.price[0]}]`, item.id])
    tappedCategoryProducts.push(['🔙назад', 'menu'])
    ctx.sendMessage(`${products.find(item => ctx.match == item.categoryId).category}`, Markup.inlineKeyboard(tappedCategoryProducts.map(item=> [Markup.button.callback(item[0], item[1])])))
    
})







//MENU_________________________
bot.start((ctx) => {
    ctx.sendMessage("Добро пожаловать в Нео Шеф.", Markup.keyboard(
        [
            ['Меню'],['Корзина']
        ]
    ).resize())
    // ctx.reply('Выберите', Markup.inlineKeyboard(btns.categoryBtns))
})
bot.hears('Меню', async (ctx) => {
    for(let i = 0; i < 3; i++ ){
        k =  ctx.message.message_id-i;
        await ctx.deleteMessage(k)
    }
    await ctx.reply('Выберите', Markup.inlineKeyboard(btns.categoryBtns))
})
bot.hears('Корзина', async ctx => {
    ctx.session ??= { cart: [] };
    ctx.session.cart ??= [];
    var cart = ctx.session.cart
    if(cart.length === 0 || cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)==0) {
        await ctx.replyWithHTML('<b>Корзина пуста...</b>', Markup.inlineKeyboard( 
            [
                [Markup.button.callback(`📝Меню`, 'menu')],
            ]))
    } else {
        let sum = cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)
        if (sum >=500 && sum <1000) {sum = sum/100*97}
        else if (sum >=1000) {sum = sum/100*95}
        let discount = 0
        if (sum >=500 && sum <1000) {discount = 3}
        else if (sum >=1000) {discount = 5}
        await ctx.replyWithHTML(`🛍<b>Ваш заказ:</b> \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${cart.filter(item => item.count>=1).map(item => '\n'+ "◽" + item.title +' - ['+item.count+'*'+item.price[0]+'|'+item.count*item.price[0]+']')} \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n <b>💳 Общая сумма: ₽${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)}</b>\nСкидка: <b>${discount}%</b>\n<b><ins>Итог:</ins> ₽${Math.round(sum)}</b>`, Markup.inlineKeyboard([
        [Markup.button.callback(`✅ Перейти к оплате`, 'submitOrder')],
        [Markup.button.callback(`❌ Отменить заказ`, 'cancelOrder')],
        [Markup.button.callback(`🔙В категории`, 'menu')]
    ]))  }
})
bot.action('menu', ctx => {
    ctx.answerCbQuery()
    ctx.deleteMessage()
    ctx.reply('Выберите продукт', Markup.inlineKeyboard(btns.categoryBtns))
})
//_____________________MENU END


//________________________________CALLBACK QUERY________________________
bot.on('callback_query', async (ctx) => {
    ctx.session ??= { cart: [] };
    ctx.session.cart ??= [];
    var cart = ctx.session.cart
    // console.log(ctx.session.cart)
    const data = ctx.update.callback_query.data
    // console.log(data)
    const tappedProduct = products.find(item => item.id == data)
    
    if(tappedProduct) {
        await ctx.answerCbQuery()
        ctx.session.cart.push(tappedProduct)                   
        // console.log(ctx.session.cart)
        await ctx.deleteMessage()

        await ctx.telegram.sendPhoto(ctx.chat.id, tappedProduct.photo_id || 'AgACAgIAAxkBAAIRVGPD-BlnteHFVOo43qK-Ps1fpyoRAAIPwjEboqAhSiqb19LkE4i3AQADAgADeQADLQQ', {
            caption: `<b>${tappedProduct.title} - [₽ ${tappedProduct.price[0]}]</b> \n〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\nСостав:\n${tappedProduct.content || ''}`,
            reply_markup:{
                inline_keyboard:[
                    [{text:"Добавить в корзину", callback_data:"+"}],
                    [{text:"Назад", callback_data:`${tappedProduct.categoryId}`}]
                ]
            }, parse_mode: 'HTML'
        });

    }
    if (data === '+') {
        cart.at(-1).count+=1
        await ctx.editMessageReplyMarkup({inline_keyboard:[
            [Markup.button.callback('➖', '-'), Markup.button.callback(`${cart.at(-1).count}`, 'count'), Markup.button.callback('➕', '+')],
            [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)})`, 'cart')],
            [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
        ]})
        // console.log(ctx.session.cart)
    }
    if (data === '-' && cart.length) {
        cart[cart.length-1].count-=1
        await ctx.editMessageReplyMarkup({inline_keyboard:[
            [Markup.button.callback('➖', '-'), Markup.button.callback(`${cart[cart.length-1].count}`, 'count'), Markup.button.callback('➕', '+')],
            [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)})`, 'cart')],
            [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
        ]})
    } 
    if (data === '-' && cart[cart.length-1].count==0) {
        
        await ctx.editMessageReplyMarkup({inline_keyboard:[
            [Markup.button.callback(`${cart[cart.length-1].count}`, 'count'), Markup.button.callback('➕', '+')],
            [Markup.button.callback(`🛒 (${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)})`, 'cart')],
            [Markup.button.callback('Назад', `${cart.at(-1).categoryId}`)]
        ]})
    }
    if (data === 'cancelOrder') { 
        await ctx.answerCbQuery('Вы очистили корзину.')
        ctx.session.cart = []
        products.forEach(item => item.count = 0)
        await ctx.editMessageText('Корзина пуста...')
        await ctx.editMessageReplyMarkup({inline_keyboard:[
          [Markup.button.callback('📝Меню', 'menu')],
        ]})
        ctx.session.cart.length = 0
    products.forEach(product => product.count = 0)
    } 
    if (data == 'cart') 
    {   
        
        ctx.answerCbQuery()
        ctx.deleteMessage()
        if(cart.length === 0 || cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)==0) {
            await ctx.replyWithHTML('<b>Корзина пуста...</b>', Markup.inlineKeyboard( 
                [
                    [Markup.button.callback(`📝Меню`, 'menu')],
                ]))
        } else {
            let sum = cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)
            if (sum >=500 && sum <1000) {sum = sum/100*97}
            else if (sum >=1000) {sum = sum/100*95}
            let discount = 0
            if (sum >=500 && sum <1000) {discount = 3}
            else if (sum >=1000) {discount = 5}
            await ctx.replyWithHTML(`🛍<b>Ваш заказ:</b> \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️ ${cart.filter(item => item.count>=1).map(item => '\n'+ "◽" + item.title +  ' - ['+item.count+'*'+item.price[0]+'|'+item.count*item.price[0]+']')} \n 〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n <b>💳 Общая сумма: ₽${ctx.session.cart.reduce((acc, curr)=> {return acc+=curr.price[0]*curr.count}, 0)}</b>\nСкидка: <b>${discount}%</b>\n<b><ins>Итог:</ins> ₽${Math.round(sum)}</b>`, Markup.inlineKeyboard([
            [Markup.button.callback(`✅ Перейти к оплате`, 'submitOrder')],
            [Markup.button.callback(`❌ Отменить заказ`, 'cancelOrder')],
            [Markup.button.callback(`🔙В категории`, 'menu')]
        ]))  }
    }
                                                                                                                                                  
    if (data === 'submitOrder') {
            await ctx.answerCbQuery()
            await ctx.scene.enter('orderScene')
    }
    else await ctx.answerCbQuery()

})
//________________________________CALLBACK QUERY________END________________


bot.hears('delete', (ctx) =>{
    let k = 0;
    for(let i = 0; i <= 100; i++ ){
        k =  ctx.message.message_id-i;
        ctx.deleteMessage(k)
    }
})



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



bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


