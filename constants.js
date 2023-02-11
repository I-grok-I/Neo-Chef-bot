const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('5917878557:AAFZK9yI3Qju7-UfpyM1J-K5wyI626vLmQ4');
const productList = require('./productList');
const products = productList.productList
//ok
const GARNISH_MEAL_IDS = [
'cknFile',    'cknShnizzel',
'friedCkn',   'friedCknL',
'toriSet',    'toriSetL',   
'arabCkn',    'arabCknL',
'frenchCkn',  'frenchCknL',
'arabBeef',   'frenchBeef',
'grillForel', 'grillDorado',
'semgaStake', 'tomahawk',
'tibon',      'antrekot',
'cknSteak',   'turkeySteak'
]
module.exports.GARNISH_MEAL_IDS = GARNISH_MEAL_IDS

const helloText = `<b>Добро пожаловать в Нео Шеф!
Вкусная еда в паре кликов</b>
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
◽Автоматическое начисление бонусов в размере 3% от суммы
◽За покупку свыше 500₽ - скидка 3%, свыше 1000₽ - 5%
◽Бесплатная доставка по городу от 500₽

🔘<b>АКЦИЯ:</b> 
с 06.02 по 12.02 включительно <b>с 20:00 на покупки скидка 15%</b>`
module.exports.helloText = helloText

const STOPLIST = `Блюда, которые на данный момент находятся в стоп-листе:`
module.exports.STOPLIST = STOPLIST

const CAFE_NUM = `
По всем вопросам вы можете обращаться по номеру +79283090099
Либо <a href="https://t.me/NeoChef2">напишите нам в telegram</a>`
module.exports.CAFE_NUM = CAFE_NUM

const CAFE_ADDRESS = `Адрес: <b>ул. Тотурбиева 133</b>\n Работаем с 9:00 до 23:00`
module.exports.CAFE_ADDRESS = CAFE_ADDRESS
console.log((new Date()).getUTCHours() + 5);

if (((new Date()).getUTCHours()+3) < 12) {
    const categoryBtns = [ 
        [Markup.button.callback('завтраки до 12', 'breakfasts'),Markup.button.callback('салаты', 'salads'),Markup.button.callback('супы', 'soups')],
        [Markup.button.callback('блюда на грилле-углях', 'bbq')],
        [Markup.button.callback('шашлык', 'shashlyk'),Markup.button.callback('фастфуд', 'fastFood'), Markup.button.callback('пицца', 'pizza')],
        [Markup.button.callback('тёплые роллы', 'warmRolls')],
        [Markup.button.callback('холодные роллы', 'coldRls')],
        [Markup.button.callback('курица', 'cknMeal'), Markup.button.callback('рыба', 'fishMeal'),Markup.button.callback('телятина', 'beefMeal')],
        [Markup.button.callback('паста', 'pasta')],
        [Markup.button.callback('мороженое', 'iceCream'),Markup.button.callback('десерты', 'desserts')],
        [Markup.button.callback('кофе карта', 'coffee')],
        [Markup.button.callback('фреш', 'fresh'), Markup.button.callback('компоты', 'compotes'),Markup.button.callback('напитки', 'drinks')],
        [Markup.button.callback('коктейли', 'cocktails'),Markup.button.callback('лимонады', 'lemonade')],
        [Markup.button.callback('хлеб', 'bakery')],
    ]
    module.exports.categoryBtns = categoryBtns
} else if (((new Date()).getUTCHours()+3) > 12) {
    const categoryBtns = [ 
        [Markup.button.callback('салаты', 'salads'),Markup.button.callback('супы', 'soups')],
        [Markup.button.callback('блюда на грилле-углях', 'bbq')],
        [Markup.button.callback('шашлык', 'shashlyk'),Markup.button.callback('фастфуд', 'fastFood'), Markup.button.callback('пицца', 'pizza')],
        [Markup.button.callback('тёплые роллы', 'warmRolls')],
        [Markup.button.callback('холодные роллы', 'coldRls')],
        [Markup.button.callback('курица', 'cknMeal'), Markup.button.callback('рыба', 'fishMeal'),Markup.button.callback('телятина', 'beefMeal')],
        [Markup.button.callback('паста', 'pasta')],
        [Markup.button.callback('мороженое', 'iceCream'),Markup.button.callback('десерты', 'desserts')],
        [Markup.button.callback('кофе карта', 'coffee')],
        [Markup.button.callback('фреш', 'fresh'), Markup.button.callback('компоты', 'compotes'),Markup.button.callback('напитки', 'drinks')],
        [Markup.button.callback('коктейли', 'cocktails'),Markup.button.callback('лимонады', 'lemonade')],
        [Markup.button.callback('хлеб', 'bakery')],
    ]
    module.exports.categoryBtns = categoryBtns
}

//
const breakfasts = [
    [Markup.button.callback('Английский', 'engBfast')],
    [Markup.button.callback('Дагестанский', 'dagBfast')],
    [Markup.button.callback('Баварский', 'bavarBfast')],
    [Markup.button.callback('Спортивный', 'sportBfast')],  
    [Markup.button.callback('Фермерский', 'farmBfast')], 
    [Markup.button.callback('Арабский', 'arabBfast')],
    [Markup.button.callback('Венгерский', 'hungarBfast')],
    [Markup.button.callback('Глазунья', 'glazunia')],
    [Markup.button.callback('Яичница с помидорами и луком','tomatoOnionEgg')],
    [Markup.button.callback('Омлет с помидорами', 'tomatoOmelet')],
    [Markup.button.callback('Омлет с колбасой и сыром', 'sausageCheeseOmelet')],
    [Markup.button.callback('Яйцо варёное', 'boiledEgg')],
    [Markup.button.callback('Пышки(6шт)', 'pishki'),Markup.button.callback('Творог', 'tvorog')],
    [Markup.button.callback('↓ _____КАШИ:______ ↓', '.')],
    [Markup.button.callback('Овсяная', 'ovsPorridge'), Markup.button.callback('Пшеничная', 'pshenPorridge')],
    [Markup.button.callback('Рисовая', 'risePorridge'),Markup.button.callback('Манная', 'mannPorridge', )], 
    [Markup.button.callback('Калмыцкий чай', 'kalmykTea')],
    [Markup.button.callback('↓ _____БЛИНЫ:______ ↓', '..')],
    [Markup.button.callback('С бананом и шоколадом', 'bananaChokoPancake')],
    [Markup.button.callback('Cо сметаной', 'smetanaPancake')],
    [Markup.button.callback('C малиновым джемом', 'malinaPancake')],
    [Markup.button.callback('Cо сгущёнкой', 'sgushenkaPancake')],
    [Markup.button.callback('С творогом и джемом', 'tvorogJamPancake')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],

] 
module.exports.breakfasts = breakfasts

const salads = [
    [Markup.button.callback('Цезарь с курицей', 'caesarCknSalad')],
    [Markup.button.callback('Цезарь с креветкой', 'caesarSmpSalad')],
    [Markup.button.callback('Баклажан и креветка', 'bakSmpSalad')],
    [Markup.button.callback('🌶Барселона', 'barselonaSalad'), Markup.button.callback('🌶Кармен', 'carmenSalad')],
    [Markup.button.callback('🌶Мексиканский', 'mexicanSalad'), Markup.button.callback('По-деревенски', 'ruralSalad')],
    [Markup.button.callback('С фунчозой', 'funchozaSalad'), Markup.button.callback('Оливье', 'olivieSalad')],
    [Markup.button.callback('Греческий', 'greekSalad'), Markup.button.callback('Весенний', 'springSalad')],
    [Markup.button.callback('Овощное ассорти', 'veganAssorti')], 
    [Markup.button.callback('По-домашнему', 'homeSalad')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.salads = salads

const soups = [
    [Markup.button.callback('Турецкий крем-суп', 'chechSoup')],
    [Markup.button.callback('Сырный крем-суп', 'cheeseSoup')],
    [Markup.button.callback('Куриный', 'cknSoup')], 
    [Markup.button.callback('Лагман', 'lagmanSoup')], 
    [Markup.button.callback('Фасолевый', 'beanSoup')],
    [Markup.button.callback('Том-ям', 'tomYamSoup')],
    [Markup.button.callback('Том-ям куриный', 'cknTomYam')],
    [Markup.button.callback('Рамен с лососем', 'salmonRamen')],
    [Markup.button.callback('Рамен с курицей', 'cknRamen')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
  ]
  module.exports.soups = soups

const pizza = [
    [Markup.button.callback('Курица с грибами', 'pizzaCkn')],
    [Markup.button.callback('Гринвич', 'grinvich')],
    [Markup.button.callback('C лососем', 'salmonPizza')],
    [Markup.button.callback('C морепродуктами', 'seaPizza')],
    [Markup.button.callback('Пеперони', 'pepperoni'),Markup.button.callback('Пиканте', 'picante')],
    [Markup.button.callback('Нью Нео', 'newNeo'),Markup.button.callback('Четыре сыра', '4cheese')],
    [Markup.button.callback('Сицилийская', 'sicillian'),Markup.button.callback('Мясная', 'meatPizza')],
    [Markup.button.callback('Цезарь"', 'caesarPizza'),Markup.button.callback('Маргарита', 'margarita')],
    [Markup.button.callback('Ассорти', 'assorti'),Markup.button.callback('Жульен', 'pizzaJulien')],
    [Markup.button.callback('↓ _____ФОКАЧЧА:______ ↓', 'fokachaBtn')],
    [Markup.button.callback('С сыром', 'fokachaCheese'),Markup.button.callback('С томатом', 'fokachaTomato')],
    [Markup.button.callback('Томатно-сырная', 'fokachaCheeseTomatos'),Markup.button.callback('Фокачча', 'fokacha')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
  ]
module.exports.pizza = pizza

  const cknMeal = [
    [Markup.button.callback('Жульен', 'julien'),Markup.button.callback('Тори-сет', 'toriSet')],
    [Markup.button.callback('Курица по-арабски', 'arabCkn')],
    [Markup.button.callback('Курица по-французски', 'frenchCkn')],
    [Markup.button.callback('Шницель наполи', 'napoliSnizzel')],
    [Markup.button.callback('Куриный шницель', 'cknShnizzel')],
    [Markup.button.callback('Курица жареная', 'friedCkn')],
    [Markup.button.callback('В сливочном соусе', 'cknCream')],
    [Markup.button.callback('Филе на гриле', 'cknFile')],
    [Markup.button.callback('Бедро в лодочке', 'hamInShip')],
    [Markup.button.callback('булгур по-турецки', 'turkishBulgur')],
    [Markup.button.callback('Микс мясо с овощами', 'meatMix')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
  ]
  module.exports.cknMeal = cknMeal

  const beefMeal = [
    [Markup.button.callback('По-филиппински', 'philippBeef')],
    [Markup.button.callback('По-арабски', 'arabBeef')],
    [Markup.button.callback('По-французски', 'frenchBeef')],
    [Markup.button.callback('На шпажках', 'stickBeef')],
    [Markup.button.callback('🌶️По-кавказски', 'kavkazBeef')],
    [Markup.button.callback('По-турецки', 'turkBeef')],
    [Markup.button.callback('Бефстроганов', 'beefStrgnv')],
    [Markup.button.callback('Скоблянка', 'skoblanka')],
    [Markup.button.callback('На жаровне', 'beefJrvn')],
    [Markup.button.callback('Жаркое с пюре', 'beefPrg')],
    [Markup.button.callback('Фахитос фри', 'fahitos')],
    [Markup.button.callback('Медальоны с булгуром', 'bulgurMedals')],
    [Markup.button.callback('Медальоны с овощами', 'vgblsMedals')],
    [Markup.button.callback('Медальоны под сыром', 'cheeseMedals')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
]
module.exports.beefMeal = beefMeal

const fishMeal = [
    [Markup.button.callback('Форель на гриле', 'bbqForel')],
    [Markup.button.callback('Дорадо на гриле', 'bbqDorado')],
    [Markup.button.callback('Стейк сёмги', 'semgaStake')],
    [Markup.button.callback('Лосось сливочный', 'creamSalmon')],
    [Markup.button.callback('Лосось филе', 'bulgurSalmon')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
]
module.exports.fishMeal = fishMeal

const pasta = [
    [Markup.button.callback('Лапша удон', 'udon')],
    [Markup.button.callback('Паста болоньезе', 'boloneise')],
    [Markup.button.callback('Фетучини с курицей', 'fetuCkn')],
    [Markup.button.callback('Фетучини с томатом с курицей', 'fetuTomatoCkn')],
    [Markup.button.callback('Фетучини с томатом с креветкой', 'fetuTomatoSmp')],
    [Markup.button.callback('Фетучини с тигровыми креветками', 'fetuRoyalSmp')],
    [Markup.button.callback('Паста спорт', 'pastaSport')],
    [Markup.button.callback('Фетучини с лососем и помидорами', 'fetuSalmonTomato')],
    [Markup.button.callback('Фетучини цезарь', 'fetuCaesar')],
    [Markup.button.callback('Фетучини с индейкой', 'fetuTurkey')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
]
module.exports.pasta = pasta

const bbq = [
    [Markup.button.callback('Стейк томагавк', 'tomahawk')],
    [Markup.button.callback('Стейк тибон', 'tibon')],
    [Markup.button.callback('Стейк антрекот', 'antrekot')],
    [Markup.button.callback('Стейк из курицы', 'cknSteak')],
    [Markup.button.callback('Стейк из индейки', 'turkeySteak')],
    [Markup.button.callback('Бедро на гриле', 'bbqHam')],
    [Markup.button.callback('Бедро с запечёнными грибами', 'shroomHam')],
    [Markup.button.callback('Люля с сыром', 'cheeseLula')],
    [Markup.button.callback('🔙Назад в меню', 'menu')]
]
module.exports.bbq = bbq

const shashlyk = [
    [Markup.button.callback('Шашлык из индейки', 'turkeyBbq')],
    [Markup.button.callback('Телятина мякоть', 'teliatinaMiakot')],
    [Markup.button.callback('Перепелки 2 шт.', 'perepel')],
    [Markup.button.callback('Грибы', 'shrooms')],
    [Markup.button.callback('Картофель', 'potaro')],
    [Markup.button.callback('Помидоры', 'tomato')],
    [Markup.button.callback('Садж большой', 'sajBig')],
    [Markup.button.callback('Садж маленький', 'sajSmall')],
    [Markup.button.callback('Люля в лаваше', 'luliaLavash')],
    [Markup.button.callback('Люля кебаб', 'luliaKebab')],
    [Markup.button.callback('Куриный люля', 'cknLulia')], 
    [Markup.button.callback('Куриный люля в лаваше', 'cknLuliaLavash')],
    [Markup.button.callback('Баранина пистолет', 'baraninaPistolet')],
    [Markup.button.callback('Баранина корейка', 'koreika')],
    [Markup.button.callback('Баранина мякоть', 'baraninaMiakot')],
    [Markup.button.callback('↓ ________КУРИЦА:_________ ↓','baranBtn')],
    [Markup.button.callback('Крылышки', 'wings'),Markup.button.callback('Шашлык', 'cknBbq')],
    [Markup.button.callback('Курица на углях', 'cknUgli')],
    [Markup.button.callback('↓ ________РЫБА:_________ ↓','baranBtn')],
    [Markup.button.callback('Дорадо', 'dorado'),Markup.button.callback('Форель', 'forel')],
    [Markup.button.callback('Семга на углях', 'salmonUgli'),Markup.button.callback('Сом', 'som')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],

]
module.exports.shashlyk = shashlyk

const warmRolls = [
    [Markup.button.callback('Смак', 'smak'),Markup.button.callback('Шик', 'shik')],
    [Markup.button.callback('Инь', 'inRoll'),Markup.button.callback('Янь', 'yanRoll')],
    [Markup.button.callback('С лососем', 'salmonRoll'),Markup.button.callback('Чикен', 'rollChicken')],
    [Markup.button.callback('С курицей', 'cknRoll'),Markup.button.callback('Рио', 'rioRoll')],
    [Markup.button.callback('Шик ойси', 'shikOisi'),Markup.button.callback('Ойси', 'oisiRoll')],
    [Markup.button.callback('Хрустящий хит', 'crispyHit')],
    [Markup.button.callback('Цезарь люкс', 'caesarLux')],
    [Markup.button.callback('Калифорния с креветкой', 'californiaSmp')],
    [Markup.button.callback('Цезарь с курицей', 'caesarCkn')],
    [Markup.button.callback('Цезарь с креветкой', 'caesarSmp')],
    [Markup.button.callback('Калифорния с лососем', 'salmonCalifornia')],
    [Markup.button.callback('С креветкой', 'smpRoll')],
    [Markup.button.callback('Шик с курицей', 'cknShik')],
    [Markup.button.callback('Green ойси', 'greenOisi')],
    [Markup.button.callback('СЕТ ассорти', 'assortiSet')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.warmRolls = warmRolls

const coldRls = [
    [Markup.button.callback('Ойси', 'oisi'),Markup.button.callback('Нео', 'neoRoll')],
    [Markup.button.callback('Дайдзу', 'daizu'),Markup.button.callback('Сайдзу', 'saizu')],
    [Markup.button.callback('ПП', 'pp'),Markup.button.callback('Эби', 'aby')],
    [Markup.button.callback('СЕТ Маки', 'makiSet')],
    [Markup.button.callback('Филадельфия', 'ffia')],
    [Markup.button.callback('Филадельфия с огурцом', 'ffiaCucumber')],
    [Markup.button.callback('Филадельфия люкс', 'ffiaLux')],
    [Markup.button.callback('Калифорния с креветкой', 'californiaSmp')],
    [Markup.button.callback('Калифорния с лососем', 'californiaSalmon')],
    [Markup.button.callback('Бешеный лосось', 'madSalmon')],
    [Markup.button.callback('Бешеная креветка', 'madSmp')],
    [Markup.button.callback('С лососем', 'salmonRollCold')],
    [Markup.button.callback('С креветкой', 'smpRollCold')],
    [Markup.button.callback('Ояки маки', 'oyakiMaki')],
    [Markup.button.callback('Филадельфия с креветкой', 'ffiaSmp')],
    [Markup.button.callback('Шикойси', 'shikOisiCold')],
    [Markup.button.callback('ойси с курицей', 'cknOisi')],
    [Markup.button.callback('Green ойси', 'greenOisiCold')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.coldRls = coldRls

const fastFood = [
    [Markup.button.callback('Beef бургер', 'beefBrg')],
    [Markup.button.callback('Бургер куриный', 'cknBrg')],
    [Markup.button.callback('Бургер из телятины', 'telatinaBrg')],
    [Markup.button.callback('Бургер в комплекте', 'brgSet')],
    [Markup.button.callback('Наггетсы 6 шт', 'naggets')],
    [Markup.button.callback('↓ ________ГАРНИРЫ:_________ ↓','baranBtn')],
    [Markup.button.callback('Картофель в мундире', 'potatoMundir')],
    [Markup.button.callback('Картофель по-деревенски', 'ruralPotato')],
    [Markup.button.callback('Фри соломинкой', 'free')],
    [Markup.button.callback('Картофельное пюре', 'mash')],
    [Markup.button.callback('Рис', 'rise')],
    [Markup.button.callback('↓ ________СОУСЫ:_________ ↓','baranBtn')],
    [Markup.button.callback('Цезарь', 'caesarSause'),Markup.button.callback('Кимчи', 'kimchiSause')],
    [Markup.button.callback('Барбекю', 'bbqSause'),Markup.button.callback('Наршараб', 'narsharabSause')],
    [Markup.button.callback('Сливочный', 'creamySause'),Markup.button.callback('Шашлычный', 'shashlykSause')],
    [Markup.button.callback('Сырный heinz', 'cheeseHeinzSause')],
    [Markup.button.callback('Кетчуп чили', 'ketchupChili')],
    [Markup.button.callback('Кетчуп heinz', 'ketchupHeinz')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.fastFood = fastFood

const desserts = [
    [Markup.button.callback('Венские вафли', 'hungarWaffles')],
    [Markup.button.callback('Шоколадный фондан', 'fondan')],
    [Markup.button.callback('Сан-себастьян', 'sanSebastian')],
    [Markup.button.callback('Круассан', 'croissant')],
    [Markup.button.callback('Круассан с мороженым', 'iceCreamCroissant')],
    [Markup.button.callback('Трайфл', 'triffle')],
    [Markup.button.callback('Тыква', 'pumpkin')],
    [Markup.button.callback('Сырники', 'syrniki')],
    [Markup.button.callback('Белая черешня', 'whiteChereshnia')],
    [Markup.button.callback('Мёд 80гр', 'honey')],
    [Markup.button.callback('Мёд с орехами 110гр', 'nutsHoney')],
    [Markup.button.callback('Сухофрукты 100гр', 'dryFruits')],
    [Markup.button.callback('↓ ________ВАРЕНЬЕ 80гр:_________ ↓','baranBtn')],
    [Markup.button.callback('Клубника ', 'strawberry'),Markup.button.callback('Малина ', 'malina')],
    [Markup.button.callback('Инжир ', 'injir'),Markup.button.callback('Айва ', 'aiva')],
    [Markup.button.callback('Виноградное', 'grape')],
    [Markup.button.callback('↓ ________БЛИНЫ:_________ ↓','baranBtn')],
    [Markup.button.callback('Сметана', 'sourCreamPancakes'),Markup.button.callback('Сгущёнка', 'cndPancakes')],
    [Markup.button.callback('Шоколадная паста', 'chokoPancakes')],
    [Markup.button.callback('Клубничный джем', 'strawberryPancakes')],
    [Markup.button.callback('Банан и шоколадная паста', 'chokoBananaPancakes')],
    [Markup.button.callback('Творог и джем', 'jamTvorogPancakes')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.desserts = desserts

const coffee = [
    [Markup.button.callback('↓ _____ЧЁРНЫЙ:______ ↓', 'blackBtn')],
    [Markup.button.callback('Эспрессо', 'espresso'),Markup.button.callback('Американо', 'americano')],
    [Markup.button.callback('Американо со сливками', 'americanoCream'),Markup.button.callback('Кофе в турке', 'turkaCoffe')],
    [Markup.button.callback('↓ ____КОФЕ НА МОЛОКЕ_____ ↓', 'milkBtn')],
    [Markup.button.callback('Флэт уайт', 'flatWhite'),Markup.button.callback('Капучино', 'kapuchino')], 
    [Markup.button.callback('Капучино соленая карамель', 'kapuchinoNuts')],
    [Markup.button.callback('Латте', 'latte'),Markup.button.callback('Латте печенье', 'latteCookie')],

    [Markup.button.callback('↓ ____ХОЛОДНЫЙ КОФЕ____ ↓', 'coldCoffeBtn')],
    [Markup.button.callback('Бамбл', 'bumble')],
    [Markup.button.callback('Айс латте', 'iceLatte')],
    [Markup.button.callback('Фраппучино', 'frappuchino')],
    [Markup.button.callback('↓ ____КОФЕ НА СЛИВКАХ____ ↓', 'creamCoffeBtn')],
    [Markup.button.callback('Раф лавандовый', 'rafLavanda')],
    [Markup.button.callback('Раф сливочная нежность', 'rafCream')],
    [Markup.button.callback('Раф урбечный', 'rafUrbech')],
    [Markup.button.callback('Раф арахисовый', 'rafPeanut')],
    [Markup.button.callback('Раф фундук', 'rafFunduk')],
    [Markup.button.callback('↓ _____НЕКОФЕ______ ↓', 'antiCoffeBtn')],
    [Markup.button.callback('Какао', 'cacao')],
    [Markup.button.callback('Горячий шоколад', 'hotChocolate')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],

]
module.exports.coffee = coffee




const compotes = [
    [Markup.button.callback('Курага', 'kuraga'),Markup.button.callback('Айва', 'aiva')],
    [Markup.button.callback('Кизил', 'kizil'), Markup.button.callback('Шпанка', 'shpanka')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.compotes = compotes


const fresh = [
    [Markup.button.callback('Морковь-яблоко', 'carrotApplePot')],
    [Markup.button.callback('Морковь', 'carrotPot')],
    [Markup.button.callback('Апельсин', 'orangePot')],
    [Markup.button.callback('Яблоко', 'applePot')],
    [Markup.button.callback('Апельсин-лимон', 'citrusPot')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.fresh = fresh


const cocktails = [
    [Markup.button.callback('Шоколадный', 'chokoCocktail')],
    [Markup.button.callback('Молочно-банановый', 'bananaMilkCocktail')],
    [Markup.button.callback('Молочный', 'milkCocktail')],
    [Markup.button.callback('Шоколадно-банановый', 'chokoBananaCocktail')],
    [Markup.button.callback('Клубнично-банановый', 'strawberryCocktail')],
    [Markup.button.callback('Ягодный микс', 'berryMix')],
    [Markup.button.callback('Клубничный', 'strawberry')],
    [Markup.button.callback('Орео', 'oreo')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.cocktails = cocktails


const lemonade = [
    [Markup.button.callback('Мохито', 'mojito')],
    [Markup.button.callback('Мохито клубничный', 'strawberryMojito')],
    [Markup.button.callback('Пина колада', 'pinaColada')],
    [Markup.button.callback('Цитрусовый лимонад', 'citrusLimonade')],
    [Markup.button.callback('Мандарин-мята', 'mandarineMint')],
    [Markup.button.callback('Тропики', 'tropics')],
    [Markup.button.callback('Ягодный', 'berryLemonade')],
    [Markup.button.callback('Грушевый', 'grusha')],
    [Markup.button.callback('Облепиховый', 'oblepiha')],
    [Markup.button.callback('Голубая лагуна', 'blueLaguna')],
    [Markup.button.callback('Вижн', 'vision')],
    [Markup.button.callback('Щавель', 'shavel')],
    [Markup.button.callback('Самурай', 'samurai')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.lemonade = lemonade


const drinks = [
    [Markup.button.callback('↓ __Добрый Cola__ ↓', 'coldCoffeBtn')],
    [Markup.button.callback('0.33л', 'Cola1'), Markup.button.callback('0.5л', 'Cola2'),Markup.button.callback('0.9л', 'Cola3')],
    [Markup.button.callback('↓ __Добрый Fanta__ ↓', 'coldCoffeBtn')],
    [Markup.button.callback('0.33л', 'Fanta1'),Markup.button.callback('0.9л', 'Fanta3')],
    [Markup.button.callback('↓ __Добрый Sprite__ ↓', 'coldCoffeBtn')],
    [Markup.button.callback('0.33л', 'Sprite1'),Markup.button.callback('0.9л', 'Sprite3')],
    [Markup.button.callback('Cola Стекло', 'colaGlass')],
    [Markup.button.callback('Сок "Вико"', 'viko')],
    [Markup.button.callback('Сок Добрый/Любимый', 'dobry')],
    [Markup.button.callback('Lipton чай', 'liptonTea'),Markup.button.callback('Денеб груша', 'deneb')],
    [Markup.button.callback('Менди 0.6', 'mendi1'),Markup.button.callback('Менди 1.25', 'mendi2')],
    [Markup.button.callback('Шиповник', 'shipovnik')],
    [Markup.button.callback('"Рычал-су" мин-вода', 'richalSu')],
    [Markup.button.callback('Горная вода', 'mtnWater')],
    [Markup.button.callback('Горная вода с лимоном', 'mtnLimonWater')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.drinks = drinks


const iceCream = [
    [Markup.button.callback('Шоколадное', 'chokoIce')],
    [Markup.button.callback('Клубничное', 'strawberryIce')],
    [Markup.button.callback('Сливочное', 'creamIce')],
    [Markup.button.callback('Банановое', 'bananaIce')],
    [Markup.button.callback('Ассорти', 'assortiIce')],
    [Markup.button.callback('🔙Назад в меню', 'menu')],
]
module.exports.iceCream = iceCream




