const {Telegraf, Markup, Composer, Scenes} = require('telegraf');
const { helloText } = require('./constants');
require('dotenv').config();
const bot = new Telegraf('5856492718:AAFYH9lDst1Jy1Itou4EINFXUwYTpUoBDUo');
const productList = require('./productList')
const products = productList.productList

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
const chooseOrderType = new Composer()
chooseOrderType.on('text',async(ctx)=> {
    if (ctx.message.text == '🚗Доставка') {
        ctx.scene.enter('delivery')
    }
})
const orderScene = new Scenes.WizardScene('orderScene', startWizard, chooseOrderType)


module.exports = orderScene