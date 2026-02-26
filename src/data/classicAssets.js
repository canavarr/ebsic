export const ASSET_DATA = [
  { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', price2015: 27, price2025: 190, growthRate: 6.037, category: 'USA', description: 'Apple disainib, toodab ja müüb nutitelefone, personaalarvuteid, tahvelarvuteid, kantavaid seadmeid ja pakub nendega seotud tarkvara ja teenuseid.', historicalEvent: '2015-2016: iPhone müük kasvab. 2018: Apple saab esimeseks $1 triljoni ettevõtteks. 2020: COVID suurendab nõudlust. 2024-2025: AI fookus.' },
  { id: 'tkm1t', name: 'Kaubamaja Grupp', ticker: 'TKM1T', price2015: 0.77, price2025: 11.22, growthRate: 13.57, category: 'Eesti', description: 'Eestist pärit jaekaubanduse ettevõte, mis opereerib kaubamaju, supermarketeid ja automüüki.', historicalEvent: '2015-2019: Eesti majanduse kasv. 2020: COVID vähendab külastusi. 2022: inflatsioon. 2023-2025: stabiliseerumine.' },
  { id: 'msft', name: 'Microsoft', ticker: 'MSFT', price2015: 47, price2025: 420, growthRate: 7.936, category: 'USA', description: 'Microsoft arendab tarkvara, teenuseid, seadmeid ja lahendusi.', historicalEvent: '2015-2019: Azure pilveteenus kasvab. 2020: COVID suurendab pilveteenuste kasutust. 2023: OpenAI investeering.' },
  { id: 'amzn', name: 'Amazon.com Inc.', ticker: 'AMZN', price2015: 15, price2025: 180, growthRate: 11, category: 'USA', description: 'Amazon pakub veebipõhiseid jaemüügi-, pilvandmetöötluse ja digitaalseid teenuseid.', historicalEvent: '2015-2019: AWS kasvab. 2020: COVID suurendab e-kaubandust. 2022: kulude kasv. 2023-2025: efektiivsuse parandamine.' },
  { id: 'tsla', name: 'Tesla Inc.', ticker: 'TSLA', price2015: 14, price2025: 250, growthRate: 16.85, category: 'USA', description: 'Tesla disainib, arendab, toodab ja müüb elektrisõidukeid ning energiasalvestamise lahendusi.', historicalEvent: '2017-2018: Model 3 probleemid. 2020: aktsia tõuseb kiiresti. 2021: elektriautode nõudlus kasvab. 2024-2025: turu kasv aeglustub.' },
  { id: 'meta', name: 'Meta Platforms Inc.', ticker: 'META', price2015: 78, price2025: 480, growthRate: 5.15, category: 'USA', description: 'Meta arendab tehnoloogiaid ja platvorme sotsiaalseks suhtluseks.', historicalEvent: '2015-2020: Facebook ja Instagram kasvavad. 2022: suur langus metaverse tõttu. 2023: taastumine ja kulude vähendamine.' },
  { id: 'nflx', name: 'Netflix Inc.', ticker: 'NFLX', price2015: 49, price2025: 480, growthRate: 8.79, category: 'USA', description: 'Netflix pakub tellimuspõhist voogedastusteenust.', historicalEvent: '2015-2020: subscriberite kiire kasv. 2020: COVID suurendab nõudlust. 2022: subscriberite langus. 2023-2025: stabiliseerumine.' },
  { id: 'googl', name: 'Alphabet Inc.', ticker: 'GOOGL', price2015: 26, price2025: 140, growthRate: 4.38, category: 'USA', description: 'Alphabet pakub internetipõhiseid tooteid ja teenuseid, sealhulgas otsingut ja reklaami.', historicalEvent: '2015-2020: reklaamitulu kasv. 2020: COVID mõju. 2023: AI arenduse kasv. 2024-2025: AI konkurents suureneb.' },
  { id: 'amd', name: 'Advanced Micro Devices Inc.', ticker: 'AMD', price2015: 2.5, price2025: 160, growthRate: 63, category: 'USA', description: 'AMD arendab ja toodab protsessoreid ja graafikakiipe.', historicalEvent: '2016-2020: uued protsessorid. 2020: tehno sektori kasv. 2023-2025: AI ja serverikiipide nõudlus kasvab.' },
  { id: 'mcd', name: "McDonald's Corporation", ticker: 'MCD', price2015: 94, price2025: 290, growthRate: 2.08, category: 'USA', description: "McDonald's opereerib ja frantsiisib kiirtoidurestorane.", historicalEvent: '2015-2019: digitaalne tellimine. 2020: COVID mõju. 2021-2025: stabiliseerumine ja kasv.' },
  { id: 'nke', name: 'Nike Inc.', ticker: 'NKE', price2015: 46, price2025: 105, growthRate: 1.28, category: 'USA', description: 'Nike disainib ja turustab spordijalanõusid ja -rõivaid.', historicalEvent: '2015-2019: online müük kasvab. 2020: COVID mõju. 2022-2025: globaalne nõudlus stabiliseerub.' },
  { id: 'uber', name: 'Uber Technologies Inc.', ticker: 'UBER', price2015: 45, price2025: 65, growthRate: 0.44, category: 'USA', description: 'Uber arendab tehnoloogiaplatvormi sõidujagamiseks.', historicalEvent: '2019: IPO. 2020: COVID vähendab sõitude arvu. 2021-2025: taastumine ja kasv.' },
  { id: 'dis', name: 'Walt Disney Company', ticker: 'DIS', price2015: 94, price2025: 110, growthRate: 0.17, category: 'USA', description: 'Disney toodab meelelahutussisu ja opereerib teemaparke.', historicalEvent: '2019: Disney+ launch. 2020: COVID sulgeb teemapargid. 2022-2025: streaming ja parkide taastumine.' },
  { id: 'lhv', name: 'LHV Group AS', ticker: 'LHV1T', price2015: 0.7, price2025: 3.4, growthRate: 3.85, category: 'Eesti', description: 'LHV Group pakub pangandus- ja finantsteenuseid.', historicalEvent: '2015-2021: klientide arvu kasv. 2020: COVID mõju. 2022-2025: intresside tõus suurendab pankade tulusid.' },
  { id: 'tal1t', name: 'Tallink Grupp AS', ticker: 'TAL1T', price2015: 0.9, price2025: 0.65, growthRate: -0.27, category: 'Eesti', description: 'Tallink Grupp pakub reisijate- ja kaubaveoteenuseid merel.', historicalEvent: '2020: COVID peatab laevaliikluse. 2021-2023: aeglane taastumine. 2024-2025: stabiliseerumine.' },
  { id: 'egr1t', name: 'Enefit Green AS', ticker: 'EGR1T', price2015: 2.9, price2025: 3.2, growthRate: 0.1, category: 'Eesti', description: 'Enefit Green toodab elektrienergiat taastuvatest energiaallikatest.', historicalEvent: '2021: IPO. 2022: energiakriis. 2023-2025: taastuvenergia investeeringud.' },
  { id: 'asml', name: 'ASML Holding NV', ticker: 'ASML', price2015: 90, price2025: 680, growthRate: 6.55, category: 'Holland', description: 'ASML arendab ja toodab litograafiaseadmeid pooljuhtide tootmiseks.', historicalEvent: '2015-2020: pooljuhtide nõudlus kasvab. 2020: COVID suurendab nõudlust. 2023-2025: AI ja kiipide nõudlus.' },
  { id: 'sap', name: 'SAP SE', ticker: 'SAP', price2015: 58, price2025: 170, growthRate: 1.93, category: 'Saksamaa', description: 'SAP arendab ettevõtetele mõeldud tarkvara.', historicalEvent: '2015-2020: pilveteenuste kasv. 2022: turu langus. 2023-2025: stabiliseerumine.' },
  { id: 'wdi', name: 'Wirecard AG', ticker: 'WDI', price2015: 39.80, price2025: 0.02, growthRate: -0.9995, category: 'Saksamaa', description: 'Saksamaa kiireima kasvuga finantstehnoloogia (Fintech) ettevõte, mis muudab digitaalsed maksed globaalseks standardiks.', historicalEvent: '2015-2019: kiire kasv. 2020: pettus avastatakse, ettevõte pankrotistub.' },
  { id: 'nokia', name: 'Nokia Oyj', ticker: 'NOKIA', price2015: 6.80, price2025: 4.50, growthRate: -0.338, category: 'Soome', description: 'Maailma juhtiv 5G võrkude arendaja. Ettevõte on edukalt väljunud mobiiliärist ja keskendub nüüd tuleviku infrastruktuurile.', historicalEvent: '2015-2020: mobiilitehnoloogia ümberorienteerumine. 2021-2025: 5G ja võrguinfrastruktuuri fookus.' },
  { id: 'pton', name: 'Peloton Interactive Inc.', ticker: 'PTON', price2015: 25.10, price2025: 0.80, growthRate: -0.968, category: 'USA', description: 'Revolutsiooniline treeningtehnoloogia, mis toob jõusaali elamuse otse sinu elutuppa läbi tipptasemel riistvara.', historicalEvent: '2020: COVID suurendab nõudlust. 2021-2022: ülehindamine, juhtimisvahetus. 2023-2025: langus.' },
  { id: 'cs', name: 'Credit Suisse Group', ticker: 'CS', price2015: 21, price2025: 7.75, growthRate: -0.631, category: 'Šveits', description: 'Üks maailma prestiižsemaid panku, mis pakub ülimat Šveitsi stabiilsust ja globaalset varahaldust.', historicalEvent: '2021-2022: skandaalid ja kaotused. 2023: UBS võtab üle. 2024-2025: integratsioon.' },
  { id: 'nvo', name: 'Novo Nordisk A/S', ticker: 'NVO', price2015: 18, price2025: 110, growthRate: 5.11, category: 'Taani', description: 'Novo Nordisk toodab ravimeid krooniliste haiguste raviks.', historicalEvent: '2015-2020: ravimite müük kasvab. 2022-2025: kaalulangetusravimite nõudlus tõstab aktsiat.' },
  { id: 'nio', name: 'NIO Inc.', ticker: 'NIO', price2015: 6.26, price2025: 8, growthRate: 0.27, category: 'Hiina', description: 'NIO arendab ja müüb elektrisõidukeid.', historicalEvent: '2018: IPO. 2020: elektriautode buum. 2022-2025: konkurents ja volatiilsus.' },
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', price2015: 320, price2025: 42000, growthRate: 130.25, category: 'Krüpto', description: 'Bitcoin on detsentraliseeritud digitaalne vara.', historicalEvent: '2017: suur tõus. 2018: crash. 2020-2021: uus tõus. 2022: crash. 2024-2025: taastumine.' },
  { id: 'xrp', name: 'XRP', ticker: 'XRP', price2015: 0.02, price2025: 0.6, growthRate: 29, category: 'Krüpto', description: 'XRP on digitaalne vara maksete töötlemiseks.', historicalEvent: '2017: suur tõus. 2020: SEC lawsuit. 2023-2025: osaline taastumine.' },
  { id: 'xau', name: 'Kuld', ticker: 'XAU', price2015: 1200, price2025: 2400, growthRate: 1, category: 'Tooraine', description: 'Kuld on väärismetall investeerimiseks ja tööstuseks.', historicalEvent: '2020: COVID tõstab hinda. 2022-2025: inflatsioon ja ebakindlus.' },
  { id: 'brent', name: 'Nafta', ticker: 'BRENT', price2015: 57, price2025: 75, growthRate: 0.31, category: 'Tooraine', description: 'Nafta on looduslik fossiilkütus.', historicalEvent: '2020: COVID crash. 2022: energiakriis. 2023-2025: stabiliseerumine.' },
]

export const ASSET_EN = {
  aapl: { name: 'Apple Inc.', description: 'Apple designs, manufactures and sells smartphones, personal computers, tablets, wearable devices and related software and services.' },
  tkm1t: { name: 'Kaubamaja Group', description: 'Estonian retail company operating department stores, supermarkets and auto sales.' },
  msft: { name: 'Microsoft', description: 'Microsoft develops software, services, devices and solutions.' },
  amzn: { name: 'Amazon.com Inc.', description: 'Amazon provides e-commerce, cloud computing and digital services.' },
  tsla: { name: 'Tesla Inc.', description: 'Tesla designs, develops, manufactures and sells electric vehicles and energy storage solutions.' },
  meta: { name: 'Meta Platforms Inc.', description: 'Meta develops technologies and platforms for social connection.' },
  nflx: { name: 'Netflix Inc.', description: 'Netflix provides subscription-based streaming services.' },
  googl: { name: 'Alphabet Inc.', description: 'Alphabet provides internet-based products and services, including search and advertising.' },
  amd: { name: 'Advanced Micro Devices Inc.', description: 'AMD develops and manufactures processors and graphics cards.' },
  mcd: { name: "McDonald's Corporation", description: "McDonald's operates and franchises quick-service restaurants." },
  nke: { name: 'Nike Inc.', description: 'Nike designs and markets athletic footwear and apparel.' },
  uber: { name: 'Uber Technologies Inc.', description: 'Uber develops a technology platform for ride-sharing.' },
  dis: { name: 'Walt Disney Company', description: 'Disney produces entertainment content and operates theme parks.' },
  lhv: { name: 'LHV Group AS', description: 'LHV Group provides banking and financial services.' },
  tal1t: { name: 'Tallink Grupp AS', description: 'Tallink Grupp provides passenger and cargo ferry services.' },
  egr1t: { name: 'Enefit Green AS', description: 'Enefit Green produces electricity from renewable energy sources.' },
  asml: { name: 'ASML Holding NV', description: 'ASML develops and manufactures lithography equipment for semiconductors.' },
  sap: { name: 'SAP SE', description: 'SAP develops enterprise software.' },
  wdi: { name: 'Wirecard AG', description: "Germany's fastest-growing fintech company, making digital payments a global standard." },
  nokia: { name: 'Nokia Oyj', description: "World-leading 5G network developer. Successfully exited mobile business, now focused on future infrastructure." },
  pton: { name: 'Peloton Interactive Inc.', description: 'Revolutionary fitness technology bringing the gym experience home through premium hardware.' },
  cs: { name: 'Credit Suisse Group', description: "One of the world's most prestigious banks, offering Swiss stability and global wealth management." },
  nvo: { name: 'Novo Nordisk A/S', description: 'Novo Nordisk manufactures drugs for chronic diseases.' },
  nio: { name: 'NIO Inc.', description: 'NIO develops and sells electric vehicles.' },
  btc: { name: 'Bitcoin', description: 'Bitcoin is a decentralized digital asset.' },
  xrp: { name: 'XRP', description: 'XRP is a digital asset for payment processing.' },
  xau: { name: 'Gold', description: 'Gold is a precious metal for investment and industry.' },
  brent: { name: 'Oil (Brent)', description: 'Oil is a natural fossil fuel.' },
}

export function getAssetDisplay(asset, lang) {
  if (lang === 'en' && ASSET_EN[asset.id]) {
    return { name: ASSET_EN[asset.id].name, description: ASSET_EN[asset.id].description }
  }
  return { name: asset.name, description: asset.description }
}

export const CATEGORY_ORDER = ['USA', 'Eesti', 'Holland', 'Saksamaa', 'Soome', 'Šveits', 'Taani', 'Hiina', 'Krüpto', 'Tooraine']

export const TICKER_ICON = {
  AAPL: 'AAPL', AMD: 'AMD', AMZN: 'AMZN', ASML: 'ASML', CS: 'CS', DIS: 'DIS', EGR1T: 'EGR1T',
  GOOGL: 'GOOG', LHV1T: 'LHV1T', MCD: 'MCD', META: 'META', MSFT: 'MSFT', NFLX: 'NFLX',
  NIO: 'NIO', NKE: 'NKE', NOKIA: 'NOKIA', NVO: 'NVO', PTON: 'PTON', SAP: 'SAP', TAL1T: 'TAL1T', TKM1T: 'TKM1T',
  TSLA: 'TSLA', UBER: 'UBER', WDI: 'WDI', BTC: 'BTC', XRP: 'XRP', XAU: 'XAU', BRENT: 'BRENT', CASH: 'CASH',
}
