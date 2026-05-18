import { ProductCategory } from "@/types/product";

type LocalizedText = {
  pl: string;
  en: string;
};

export type HistoryCategory = ProductCategory;

export type HistoryTimelineItem = {
  period: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type HistoryProcessStep = {
  title: LocalizedText;
  description: LocalizedText;
};

export type HistoryEntry = {
  teaser: LocalizedText;
  origin: LocalizedText;
  evolution: LocalizedText;
  process: HistoryProcessStep[];
  gallery: LocalizedText[];
  curiosities: LocalizedText[];
  timeline: HistoryTimelineItem[];
  sources: { label: string; url: string }[];
};

export const HISTORY_CATEGORIES: HistoryCategory[] = [
  "vodka",
  "whisky",
  "wine",
  "beer",
  "liqueur",
  "rum",
];

export function isHistoryCategory(value: string): value is HistoryCategory {
  return HISTORY_CATEGORIES.includes(value as HistoryCategory);
}

export const historyContent: Record<HistoryCategory, HistoryEntry> = {
  vodka: {
    teaser: {
      pl: "Od medycznych destylatow do jednego z najbardziej rozpoznawalnych alkoholi Europy Wschodniej.",
      en: "From medicinal distillates to one of the most recognizable spirits in Eastern Europe.",
    },
    origin: {
      pl: "Pierwsze destylaty zbozowe i ziemniaczane pojawialy sie w Europie juz w sredniowieczu. Z czasem, szczegolnie na terenach Polski i Rosji, destylacja przeszla droge od zastosowan medycznych do produkcji napoju rekreacyjnego.",
      en: "Early grain and potato distillates appeared in Europe in the Middle Ages. Over time, especially in Poland and Russia, distillation moved from medicinal use to recreational drinking.",
    },
    evolution: {
      pl: "Nowoczesna wodka to efekt rozwoju technologii rektyfikacji, filtracji i standaryzacji jakosci. Dzisiaj oprocz wodki czystej popularne sa wersje smakowe i premium, a kategoria ma silne znaczenie kulturowe i eksportowe.",
      en: "Modern vodka is the result of advances in rectification, filtration, and quality standards. Today, besides plain vodka, flavored and premium variants are popular, and the category has strong cultural and export value.",
    },
    process: [
      {
        title: { pl: "Surowiec i zacier", en: "Raw material and mash" },
        description: {
          pl: "Produkcja zaczyna sie od surowcow rolniczych, najczesciej zboz lub ziemniakow, z ktorych przygotowuje sie zacier.",
          en: "Production starts with agricultural raw materials, most often grains or potatoes, used to prepare the mash.",
        },
      },
      {
        title: { pl: "Fermentacja", en: "Fermentation" },
        description: {
          pl: "Drozdze przetwarzaja cukry na alkohol, tworzac baze pod dalsza destylacje.",
          en: "Yeast converts sugars into alcohol, creating the base for further distillation.",
        },
      },
      {
        title: { pl: "Destylacja i rektyfikacja", en: "Distillation and rectification" },
        description: {
          pl: "Alkohol jest oczyszczany i standaryzowany, aby uzyskac neutralny profil i odpowiednia moc.",
          en: "Alcohol is purified and standardized to achieve a neutral profile and target strength.",
        },
      },
      {
        title: { pl: "Laczenie z woda i filtracja", en: "Blending with water and filtration" },
        description: {
          pl: "Spirytus miesza sie z woda do docelowej mocy, a finalny produkt przechodzi filtracje.",
          en: "Spirit is blended with water to the target ABV, and the final product goes through filtration.",
        },
      },
    ],
    gallery: [
      {
        pl: "Sposoby butelkowania wódki na przestrzeni dziejów.",
        en: "Methods of bottling vodka throughout history.",
      },
      {
        pl: "Archiwalne ujecie starszego mężczyny produkującego wódkę w ogrodzie.",
        en: "An archival view of  an older man making vodka in his garden.",
      },
      {
        pl: "Historyczna, rzemieslnicza produkcja wódki w Rosji w XX wieku.",
        en: "Historical, craft vodka production in Russia in the 20th century.",
      },
      {
        pl: "Wspolczesna kultura spozycia mocnych alkoholi.",
        en: "Contemporary spirits-drinking culture.",
      },
    ],
    curiosities: [
      {
        pl: "W wielu krajach definicja wodki jest prawnie regulowana (np. minimalna zawartosc alkoholu).",
        en: "In many countries vodka is legally defined (for example by minimum alcohol content).",
      },
      {
        pl: "Debata o „ojczyznie wodki” trwa od lat i najczesciej dotyczy Polski i Rosji.",
        en: "The debate over vodka's 'homeland' has lasted for years and most often concerns Poland and Russia.",
      },
      {
        pl: "Wspolczesna wodka moze byc produkowana z roznych surowcow rolniczych, nie tylko zboza.",
        en: "Modern vodka can be made from various agricultural raw materials, not only grain.",
      },
    ],
    timeline: [
      {
        period: "XIV-XVI w.",
        title: { pl: "Poczatki destylatow", en: "Early distillates" },
        description: {
          pl: "Destylowane alkohole funkcjonuja glownie jako preparaty lecznicze i apteczne, a nie napoje codzienne. Wiedza o destylacji rozprzestrzenia sie stopniowo miedzy osrodkami rzemieslniczymi i klasztornymi.",
          en: "Distilled alcohols are used mainly as medicinal and apothecary preparations rather than everyday drinks. Distillation knowledge spreads gradually between craft centers and monastic communities.",
        },
      },
      {
        period: "XVII-XVIII w.",
        title: { pl: "Rozwoj produkcji", en: "Production growth" },
        description: {
          pl: "Rozwoj gorzelnictwa zwieksza skale produkcji oraz dostepnosc trunku w handlu lokalnym. Wodka zaczyna pelnic nie tylko role praktyczna, ale tez towarzyska i obyczajowa.",
          en: "Distillery development increases production scale and makes the spirit more available in local trade. Vodka starts to play not only a practical role, but also a social and cultural one.",
        },
      },
      {
        period: "XIX-XX w.",
        title: { pl: "Standaryzacja", en: "Standardization" },
        description: {
          pl: "Rozwoj rektyfikacji, kontroli jakosci i norm produkcyjnych ujednolica profil trunku. Nowoczesne gorzelnie przechodza z rzemiosla lokalnego do bardziej przemyslowego modelu wytwarzania.",
          en: "Advances in rectification, quality control, and production standards make spirit profiles more consistent. Distilleries move from local craft toward a more industrial production model.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Rynek globalny", en: "Global market" },
        description: {
          pl: "Wodka staje sie kategoria globalna z silna obecnoscia marek premium i wersji smakowych. Rosnie znaczenie designu, pochodzenia surowca i narracji marki, nie tylko samej mocy alkoholu.",
          en: "Vodka becomes a global category with strong premium and flavored segments. Design, raw-material origin, and brand storytelling gain importance alongside alcohol strength.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Wódka", url: "https://pl.wikipedia.org/wiki/W%C3%B3dka" },
      {
        label: "TopAlko: Historia wódki",
        url: "https://topalko.pl/blog/news/historia-wodki-gdzie-i-kiedy-powstala",
      },
    ],
  },
  whisky: {
    teaser: {
      pl: "Historia od klasztornych destylatow po szkockie i irlandzkie style dojrzewane w beczkach.",
      en: "A story from monastic distillates to Scotch and Irish barrel-aged styles.",
    },
    origin: {
      pl: "Korzenie whisky prowadza do sredniowiecznych praktyk destylacyjnych w Irlandii i Szkocji. Wczesne wersje trunku byly surowsze, ale szybko zyskaly znaczenie lokalne i handlowe.",
      en: "Whisky roots lead to medieval distillation practices in Ireland and Scotland. Early forms were rougher, but quickly gained local and commercial importance.",
    },
    evolution: {
      pl: "Kluczowym krokiem bylo dojrzewanie w beczkach, ktore nadaje whisky charakter. Rewolucja przemyslowa oraz rozwoj eksportu spowodowaly, ze whisky stala sie kategoria globalna.",
      en: "A key step was barrel maturation, which gives whisky its character. Industrialization and export growth turned whisky into a global category.",
    },
    process: [
      {
        title: { pl: "Slodowanie i zacieranie", en: "Malting and mashing" },
        description: {
          pl: "Zboze jest przygotowywane i zacierane, aby uwolnic cukry potrzebne do fermentacji.",
          en: "Grain is prepared and mashed to release sugars needed for fermentation.",
        },
      },
      {
        title: { pl: "Fermentacja", en: "Fermentation" },
        description: {
          pl: "Drozdze zamieniaja cukry na alkohol, tworzac tzw. wash o nizszej mocy.",
          en: "Yeast turns sugars into alcohol, creating a lower-strength wash.",
        },
      },
      {
        title: { pl: "Destylacja", en: "Distillation" },
        description: {
          pl: "Destylacja koncentruje aromaty i alkohol, a styl zalezy od aparatury i metody.",
          en: "Distillation concentrates aromas and alcohol, and style depends on equipment and method.",
        },
      },
      {
        title: { pl: "Dojrzewanie w beczkach", en: "Cask maturation" },
        description: {
          pl: "Whisky dojrzewa przez lata, nabierajac koloru i charakteru smakowego.",
          en: "Whisky matures for years, gaining color and flavor character.",
        },
      },
    ],
    gallery: [
      {
        pl: "Zdjęcie z czasów prohibicji - lata 20. XX wieku. Fotografia dokumentuje masowe niszczenie zapasów whiskey, wylewajać je do ścieków.",
        en: "Photo from the Prohibition era - 1920s. The photograph documents the mass destruction of whiskey stocks, pouring them into sewers.",
      },
      {
        pl: "Według przypuszczeń znalezione whisky zostało destylowane w 1833 roku i rozlane do butelek w 1841 roku.",
        en: "The found whisky is believed to have been distilled in 1833 and bottled in 1841.",
      },
      {
        pl: "Najstarsza whisky to Old Glenlivet 1843, która jest własnością Nguyen Dinh Tuan Viet (Wietnam) w Ho Chi Minh City, Wietnam, co zostało zweryfikowane 23 kwietnia 2025 roku.",
        en: "The oldest whisky is the Old Glenlivet 1843 and is owned by Nguyen Dinh Tuan Viet (Vietnam) in Ho Chi Minh City, Vietnam, as verified on 23 April 2025.",
      },
      {
        pl: "Dopełnianie beczki starego szkockiego whisky w piwnicy handlarza winami na zachodnim końcu miasta, etykietowanie, butelkowanie i układanie na półkach. Rok 1927.",
        en: "Filling an old Scottish whisky cask in a cellar by a wine merchant at the western end of the city, labeling, bottling, and shelving. Year 1927.",
      },
    ],
    curiosities: [
      {
        pl: "Pisownia 'whisky' i 'whiskey' bywa zalezna od kraju i tradycji producenta.",
        en: "The spelling 'whisky' vs 'whiskey' often depends on country and producer tradition.",
      },
      {
        pl: "Rodzaj beczki mocno wplywa na aromat, kolor i profil smakowy trunku.",
        en: "Cask type strongly affects aroma, color, and flavor profile.",
      },
      {
        pl: "Whisky wystepuje w wielu stylach, m.in. single malt, blended czy bourbon.",
        en: "Whisky appears in many styles, including single malt, blended, and bourbon.",
      },
    ],
    timeline: [
      {
        period: "XV-XVI w.",
        title: { pl: "Wczesne destylaty", en: "Early distillates" },
        description: {
          pl: "Produkcja ma glownie skale lokalna i czesto jest powiazana z klasztorami oraz gospodarstwami. Trunek jest surowszy niz dzisiejsza whisky, ale tworzy fundament pod przyszle style regionalne.",
          en: "Production is mostly local and often linked to monasteries and farms. The drink is rougher than modern whisky, yet it lays the foundation for future regional styles.",
        },
      },
      {
        period: "XVIII w.",
        title: { pl: "Regulacje i podatki", en: "Regulation and taxation" },
        description: {
          pl: "Zmiany prawne i podatkowe porzadkuja rynek, ale rownoczesnie wywoluja napiecia wokol nielegalnej produkcji. Ujednolicenie zasad stopniowo wzmacnia legalne gorzelnie i jakość wyrobow.",
          en: "Legal and tax changes organize the market, while also creating tensions around illicit production. Standardized rules gradually strengthen licensed distilleries and product quality.",
        },
      },
      {
        period: "XIX w.",
        title: { pl: "Skala przemyslowa", en: "Industrial scale" },
        description: {
          pl: "Postep technologiczny w destylacji oraz logistyce umozliwia produkcje na duza skale i eksport. Powstaja silne marki, a whisky zaczyna byc rozpoznawalna poza rynkami lokalnymi.",
          en: "Advances in distillation technology and logistics enable large-scale production and exports. Strong brands emerge, and whisky becomes recognizable beyond local markets.",
        },
      },
      {
        period: "XX-XXI w.",
        title: { pl: "Globalna popularnosc", en: "Global popularity" },
        description: {
          pl: "Whisky staje sie jednym z filarow swiatowego rynku premium i kultury degustacyjnej. Rosnie zainteresowanie edycjami limitowanymi, pochodzeniem beczek i profilem smakowym regionow.",
          en: "Whisky becomes one of the pillars of the global premium and tasting market. Interest grows in limited releases, cask provenance, and regional flavor profiles.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Whisky", url: "https://pl.wikipedia.org/wiki/Whisky" },
      { label: "LubimyWhisky: Historia", url: "https://lubimywhisky.pl/historia/" },
    ],
  },
  wine: {
    teaser: {
      pl: "Tysiace lat tradycji: od starozytnych upraw winorosli po nowoczesne regiony i style.",
      en: "Thousands of years of tradition: from ancient vines to modern regions and styles.",
    },
    origin: {
      pl: "Historia wina sięga starożytności i cywilizacji basenu Morza Śródziemnego. Uprawa winorośli była elementem kultury, handlu i codziennego życia.",
      en: "Wine history reaches back to antiquity and Mediterranean civilizations. Viticulture was part of culture, trade, and daily life.",
    },
    evolution: {
      pl: "Na przestrzeni wiekow doskonalono metody fermentacji, przechowywania i selekcji szczepow. Dzisiaj wino ma ogromna roznorodnosc regionalna i stylowa, od trunkow codziennych po kolekcjonerskie.",
      en: "Over the centuries, fermentation, storage, and grape selection methods improved. Today wine shows huge regional and stylistic diversity, from everyday bottles to collectible labels.",
    },
    process: [
      {
        title: { pl: "Winobranie", en: "Harvest" },
        description: {
          pl: "Dojrzale winogrona sa zbierane recznie lub mechanicznie i selekcjonowane.",
          en: "Ripe grapes are harvested manually or mechanically and selected.",
        },
      },
      {
        title: { pl: "Fermentacja moszczu", en: "Must fermentation" },
        description: {
          pl: "Cukry z winogron sa zamieniane na alkohol przez drozdze.",
          en: "Grape sugars are converted into alcohol by yeast.",
        },
      },
      {
        title: { pl: "Dojrzewanie", en: "Aging" },
        description: {
          pl: "Wino dojrzewa w zbiornikach lub beczkach, stabilizujac smak i aromat.",
          en: "Wine ages in tanks or barrels, stabilizing flavor and aroma.",
        },
      },
      {
        title: { pl: "Butelkowanie", en: "Bottling" },
        description: {
          pl: "Po klarowaniu i kontroli jakosci wino trafia do butelek.",
          en: "After clarification and quality control, wine is bottled.",
        },
      },
    ],
    gallery: [
      {
        pl: "Starożytna rzymska mozaika przedstawiająca tradycyjny proces produkcji wina, stanowiąca ważny element codzienności antycznego świata śródziemnomorskiego.",
        en: "An ancient Roman mosaic depicting a traditional wine production process, a significant element of daily life in the ancient Mediterranean world.",
      },
      {
        pl: "Starożytne amfory i gliniane naczynia do przechowywania wina w piwnicach. Zdjęcie ilustruje początki winiarstwa i najstarsze dowody na uprawę winorośli w Gruzji około 7000 r. p.n.e.",
        en: "Ancient amphorae and clay vessels for storing wine in cellars. The photograph illustrates the origins of winemaking and the earliest evidence of grape cultivation in Georgia around 7000 BC.",
      },
      {
        pl: "Kolekcja XVIII- i XIX-wiecznych butelek madery (m.in. Lenox Madeira) i innych historycznych trunków. Zgodnie z podpisem, te rzadkie wina zostały odkryte w Liberty Hall Museum w miejscowości Union (w stanie New Jersey).",
        en: "Collection of 18th- and 19th-century Madeira (including Lenox Madeira) and other historical spirits bottles. According to the caption, these rare wines were discovered in the Liberty Hall Museum in the town of Union (in the state of New Jersey).",
      },
      {
        pl: "Fotografia ta ilustruje dawne metody magazynowania wina, nawiązując do najstarszych śladów winiarstwa datowanych na 7000–4100 r. p.n.e. (odkrytych m.in. w Chinach, Gruzji, Iranie czy Grecji).",
        en: "This photograph illustrates ancient methods of wine storage, referring to the earliest traces of winemaking dated to 7000–4100 BC (discovered in China, Georgia, Iran, or Greece).",
      },
    ],
    curiosities: [
      {
        pl: "Wino było jednym z najważniejszych towarów handlowych starożytności.",
        en: "Wine was one of the most important trade goods in antiquity.",
      },
      {
        pl: "Klimat i gleba (terroir) moga diametralnie zmienic charakter tego samego szczepu.",
        en: "Climate and soil (terroir) can dramatically change the character of the same grape variety.",
      },
      {
        pl: "Wspolczesna kultura wina laczy tradycje z nowoczesna technologia produkcji.",
        en: "Modern wine culture combines tradition with modern production technology.",
      },
    ],
    timeline: [
      {
        period: "starożytność",
        title: { pl: "Narodziny winiarstwa", en: "Birth of winemaking" },
        description: {
          pl: "Pojawiaja sie pierwsze udokumentowane praktyki fermentacji winogron i przechowywania wina. Wino staje sie elementem rytualow, handlu oraz codziennej diety w wielu cywilizacjach.",
          en: "The first documented practices of grape fermentation and wine storage appear. Wine becomes part of rituals, trade, and everyday diet in many civilizations.",
        },
      },
      {
        period: "średniowiecze",
        title: { pl: "Rozwoj klasztorny", en: "Monastic development" },
        description: {
          pl: "Klasztory utrzymuja ciaglosc wiedzy o uprawie winorosli, selekcji i przechowywaniu trunku. Dzieki temu wiele praktyk winiarskich przetrwalo i zostalo usystematyzowanych.",
          en: "Monasteries preserve continuity of knowledge about viticulture, selection, and storage. Thanks to this, many winemaking practices survive and become more systematized.",
        },
      },
      {
        period: "XVIII-XIX w.",
        title: { pl: "Ekspansja handlowa", en: "Commercial expansion" },
        description: {
          pl: "Wino umacnia pozycje na rynkach europejskich, a handel staje sie coraz bardziej miedzynarodowy. Regiony zaczynaja budowac reputacje oparta na stylu, szczepach i jakości.",
          en: "Wine strengthens its position in European markets, and trade becomes increasingly international. Regions begin building reputations based on style, grape varieties, and quality.",
        },
      },
      {
        period: "XX-XXI w.",
        title: { pl: "Nowe regiony", en: "New world regions" },
        description: {
          pl: "Do glownego nurtu wchodza regiony spoza klasycznej Europy, zmieniajac globalna mape wina. Jednoczesnie rosnie rola technologii, edukacji konsumentow i precyzyjnej kontroli jakosci.",
          en: "Regions outside classical Europe enter the mainstream, reshaping the global wine map. At the same time, technology, consumer education, and precise quality control gain importance.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Historia wina", url: "https://pl.wikipedia.org/wiki/Historia_wina" },
      {
        label: "o-winie.pl: Krotka historia wina",
        url: "https://o-winie.pl/jak-kupowac-i-jak-pic/krotka-historia-wina/",
      },
      { label: "Vinoe Bamino", url: "https://www.vinoecamino.it/history/" },
    ],
  },
  beer: {
    teaser: {
      pl: "Jeden z najstarszych napojow fermentowanych - od glinianych naczyn po nowoczesny kraft.",
      en: "One of the oldest fermented drinks - from clay vessels to modern craft brewing.",
    },
    origin: {
      pl: "Piwo ma bardzo dluga historie i bylo warzone juz w starozytnych spoleczenstwach. Na przestrzeni epok stalo sie codziennym napojem wielu regionow Europy.",
      en: "Beer has a very long history and was brewed already in ancient societies. Over time it became an everyday drink in many European regions.",
    },
    evolution: {
      pl: "Rozwoj technologii warzelniczych, drozdzy i kontroli jakosci doprowadzil do ogromnej roznorodnosci stylow. Wspolczesnie obok wielkich browarow dynamicznie rozwija sie scena kraftowa.",
      en: "Advances in brewing technology, yeast use, and quality control led to huge style diversity. Today, alongside large breweries, craft brewing grows rapidly.",
    },
    process: [
      {
        title: { pl: "Zacieranie", en: "Mashing" },
        description: {
          pl: "Slod miesza sie z woda, aby wydobyc cukry fermentowalne.",
          en: "Malted grain is mixed with water to extract fermentable sugars.",
        },
      },
      {
        title: { pl: "Gotowanie z chmielem", en: "Boiling with hops" },
        description: {
          pl: "Brzeczka jest gotowana i chmielona, co buduje goryczke i aromat.",
          en: "Wort is boiled and hopped, building bitterness and aroma.",
        },
      },
      {
        title: { pl: "Fermentacja", en: "Fermentation" },
        description: {
          pl: "Drozdze przeksztalcaja cukry w alkohol i CO2.",
          en: "Yeast converts sugars into alcohol and CO2.",
        },
      },
      {
        title: { pl: "Lezakowanie i rozlew", en: "Conditioning and packaging" },
        description: {
          pl: "Piwo dojrzewa, po czym trafia do butelek, puszek lub kegow.",
          en: "Beer conditions and is then packaged into bottles, cans, or kegs.",
        },
      },
    ],
    gallery: [
      {
        pl: "Fotografia przedstawia glinianą tabliczkę zapisaną pismem klinowym, służącą do ewidencjonowania przydziałów piwa. Piwo w starożytnej Mezopotamii było podstawą codziennej diety i miało gęstą konsystencję przypominającą owsiankę. To właśnie ta gęsta forma trunku (zawierająca kawałki chleba i ziół) sprawiła, że Sumerowie i Babilończycy wynaleźli słomki, aby móc wygodnie go pić.",
        en: "A clay tablet inscribed with cuneiform script, used for recording beer allocations. Beer in ancient Mesopotamia was the basis of daily diet and had a thick consistency resembling oatmeal. It was precisely this dense form of spirit (containing pieces of bread and herbs) that led the Sumerians and Babylonians to invent straws, so they could drink it conveniently.",
      },
      {
        pl: "Ilustracja przedstawia XIV-wieczny fresk o silnym charakterze moralizatorskim. Scena ukazuje duchownego toczącego trunek, którego otaczają groteskowe demony. Symbolizują one pokusę i ciągłe próby sprowadzenia pobożnych na złą drogę. To wymowne malowidło służyło jako bezpośrednia przestroga dla wiernych przed pijaństwem, łakomstwem i uleganiem grzesznym podszeptom.",
        en: "An illustration of a 14th-century fresco with a strong moralizing character. The scene shows a priest drinking a spirit, surrounded by grotesque demon figures. These symbols represent temptation and continuous attempts to lead pious people onto the wrong path. This striking painting served as a direct warning to the faithful against drunkenness, gluttony, and sinful whispers.",
      },
      {
        pl: "Karta kolekcjonerska przedstawiająca XVII-wieczny browar. Niemiecka firma Liebig Extract of Meat Company, założona w 1840 roku, dystrybuowała serię kart kolekcjonerskich ilustrujących historię piwa. Muzeum Minibrowaru Pike, Seattle, stan Waszyngton.",
        en: "Trade card depicting a 17th-century brewery. The German Liebig Extract of Meat Company, founded in 1840, distributed a series of trading cards illustrating the history of beer. pike microbrewery museum, seattle, wa",
      },
      {
        pl: "Archiwalna fotografia dokumentująca industrializację browarnictwa. Widoczne na hali maszyny oraz dziesiątki drewnianych beczek obrazują kluczowy moment przejścia od tradycyjnego rzemiosła do masowej, ustandaryzowanej produkcji piwa na przemysłową skalę.",
        en: "Archival photograph documenting the industrialization of brewing. Machines visible in the hall and dozens of wooden barrels illustrate the key moment of transition from traditional craft to mass, standardized production of beer on an industrial scale.",
      },
    ],
    curiosities: [
      {
        pl: "Przez wieki piwo bywalo bezpieczniejszym napojem niz surowa woda.",
        en: "For centuries, beer could be safer to drink than raw water.",
      },
      {
        pl: "Rozne drozdze i temperatury fermentacji tworza odmienne style piwa.",
        en: "Different yeasts and fermentation temperatures create distinct beer styles.",
      },
      {
        pl: "Ruch kraftowy odswiezyl tradycyjne style i wypromowal eksperymenty smakowe.",
        en: "The craft movement revived traditional styles and promoted flavor experimentation.",
      },
    ],
    timeline: [
      {
        period: "starożytność",
        title: { pl: "Pierwsze warzenie", en: "First brewing" },
        description: {
          pl: "Poczatki fermentowanych napojow zbozowych siegaja najstarszych cywilizacji rolniczych. Piwo ma wtedy charakter prostego napoju odzywczego, warzonego z lokalnych surowcow.",
          en: "The beginnings of fermented grain beverages trace back to the earliest agricultural civilizations. Beer then has the character of a simple nourishing drink brewed from local ingredients.",
        },
      },
      {
        period: "średniowiecze",
        title: { pl: "Lokalne browary", en: "Local breweries" },
        description: {
          pl: "Rzemioslo browarnicze rozwija sie w miastach i klasztorach, gdzie doskonalone sa techniki warzenia. Piwo staje sie waznym elementem codziennego zycia i lokalnej gospodarki.",
          en: "Brewing craft develops in towns and monasteries, where brewing techniques are refined. Beer becomes an important part of everyday life and local economies.",
        },
      },
      {
        period: "XIX w.",
        title: { pl: "Przemysl i standaryzacja", en: "Industry and standards" },
        description: {
          pl: "Rozwoj przemyslu i nauki o fermentacji pozwala lepiej kontrolowac jakosc i powtarzalnosc. Produkcja rosnie skokowo, a piwo zaczyna byc szeroko dystrybuowane.",
          en: "Industrial progress and fermentation science improve quality control and consistency. Production grows rapidly, and beer becomes widely distributed.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Renesans kraftu", en: "Craft renaissance" },
        description: {
          pl: "Renesans browarow rzemieslniczych przywraca eksperymenty i roznorodnosc stylow. Konsumenci coraz czesciej zwracaja uwage na sklad, pochodzenie i profil aromatyczny piwa.",
          en: "The craft brewery renaissance brings back experimentation and style diversity. Consumers increasingly focus on ingredients, origin, and aroma profile.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Historia piwa", url: "https://pl.wikipedia.org/wiki/Historia_piwa" },
      { label: "dietetycy.org.pl: Historia piwa", url: "https://dietetycy.org.pl/historia-piwa/" },
    ],
  },
  liqueur: {
    teaser: {
      pl: "Slodkie i aromatyczne trunki laczace destylaty z ziolami, owocami i przyprawami.",
      en: "Sweet and aromatic spirits combining distillates with herbs, fruits, and spices.",
    },
    origin: {
      pl: "Likiery wywodza sie z tradycji nalewow i preparatow ziolowych. Poczatkowo byly mocno zwiazane z zastosowaniem aptekarskim i klasztornym.",
      en: "Liqueurs originate from infused spirits and herbal preparations. At first, they were closely linked to pharmacy and monastic use.",
    },
    evolution: {
      pl: "Do konca XVIII wieku dominowaly likiery ziolowo-przyprawowe, czesto opisywane w kontekscie wspierania trawienia. W XIX i XX wieku mocno rozwinely sie style owocowe i deserowe, a wspolczesnie kategoria obejmuje szerokie spektrum: kremowe, ziolowe, cytrusowe, korzenne i kawowe.",
      en: "Until the late 18th century, herbal and spice-driven liqueurs dominated, often associated with digestive use. In the 19th and 20th centuries, fruit and dessert styles expanded strongly, and today the category covers a broad spectrum: creamy, herbal, citrus, spiced, and coffee-based.",
    },
    process: [
      {
        title: { pl: "Baza alkoholowa", en: "Alcohol base" },
        description: {
          pl: "Punktem wyjscia moze byc neutralny destylat albo inny alkohol bazowy, np. brandy, rum, whisky czy wodka.",
          en: "The starting point can be a neutral distillate or another base spirit, such as brandy, rum, whisky, or vodka.",
        },
      },
      {
        title: { pl: "Maceracja lub infuzja", en: "Maceration or infusion" },
        description: {
          pl: "Do alkoholu dodaje sie ziola, owoce, przyprawy lub inne skladniki aromatyczne.",
          en: "Herbs, fruits, spices, or other aromatic ingredients are added to the alcohol.",
        },
      },
      {
        title: { pl: "Dosladzanie i balans", en: "Sweetening and balancing" },
        description: {
          pl: "Producent dopasowuje poziom cukru, mocy i aromatu do stylu likieru.",
          en: "The producer adjusts sugar level, strength, and aroma to the intended style.",
        },
      },
      {
        title: { pl: "Filtracja i butelkowanie", en: "Filtration and bottling" },
        description: {
          pl: "Finalny produkt jest stabilizowany i rozlewany do butelek.",
          en: "The final product is stabilized and bottled.",
        },
      },
    ],
    gallery: [
      {
        pl: "Prohibicja Stanów Zjednoczonych Ameryki: zniszczenie skonfiskowanego trunku około Bożego Narodzenia w 1923 roku. Lokalizacja nieznana.",
        en: "Prohibition United States of America: the destruction of confiscated liquor around Christmas time in 1923. Location unknown.",
      },
      {
        pl: "Agenci federalni niszczą butelki likieru podczas prohibicji, 20/11/1923.",
        en: "Federal agents destroying bottles of liquor during Prohibition, 11/20/1923.",
      },
      {
        pl: "Kartuzjani produkujący światowej sławy likier Chartreuse w Marsylii, Francja w 1930 roku.",
        en: "Carthusian Monks producing the world famous Chartreuse Liqueur at Marsielle, France in 1930.",
      },
      {
        pl: "Archiwalne zdjęcie linii rozlewniczej likierów - przejście do produkcji seryjnej.",
        en: "An archival photograph of a liqueur bottling line - shift to serial production.",
      },
    ],
    curiosities: [
      {
        pl: "Wiele likierow ma charakterystyczne, strzezone receptury producentow i zastrzezone proporcje mieszania skladnikow.",
        en: "Many liqueurs have distinctive producer-protected recipes and proprietary ingredient ratios.",
      },
      {
        pl: "Likiery czesto maja nizsza moc niz klasyczne wodki czy whisky, ale wieksza zawartosc cukru.",
        en: "Liqueurs often have lower ABV than vodka or whisky, but higher sugar content.",
      },
      {
        pl: "To jedna z najbardziej roznorodnych kategorii pod katem aromatow i zastosowan barowych.",
        en: "It is one of the most diverse categories in terms of aromas and bar applications.",
      },
      {
        pl: 'Historyczny termin "ratafia" bywal uzywany jako nazwa trunkow podawanych przy ratyfikacji umow i traktatow.',
        en: 'The historical term "ratafia" was used for drinks served during treaty and agreement ratifications.',
      },
    ],
    timeline: [
      {
        period: "średniowiecze-renesans",
        title: { pl: "Korzenie ziolowe", en: "Herbal roots" },
        description: {
          pl: "Nalewy i ekstrakty na ziolach funkcjonuja glownie jako preparaty lecznicze i domowe remedia. Smak i slodycz odgrywaja role drugoplanowa wobec praktycznego zastosowania.",
          en: "Herbal infusions and extracts function mainly as medicinal preparations and home remedies. Flavor and sweetness play a secondary role to practical use.",
        },
      },
      {
        period: "XVII-XIX w.",
        title: { pl: "Rozwoj receptur", en: "Recipe development" },
        description: {
          pl: 'Powstaja coraz bardziej dopracowane receptury, a producenci buduja style regionalne i markowe. W obiegu funkcjonuje tez okreslenie "ratafia", historycznie laczone z trunkami podawanymi przy ratyfikacji umow.',
          en: 'Recipes become more refined, and producers build regional and branded styles. The term "ratafia" is also used historically for drinks served during agreement ratifications.',
        },
      },
      {
        period: "XX w.",
        title: { pl: "Popularnosc barowa", en: "Bar popularity" },
        description: {
          pl: "Likiery trafiaja szeroko do koktajli i gastronomii, bo ulatwiaja budowanie zlozonych profili smakowych. Rosnie tez liczba baz alkoholowych uzywanych w produkcji: od brandy po rum, whisky czy wodke.",
          en: "Liqueurs become widely used in cocktails and gastronomy because they help build layered flavor profiles. The number of base spirits used in production also expands, from brandy to rum, whisky, and vodka.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Nowe smaki", en: "New flavors" },
        description: {
          pl: "Producenci eksperymentuja z nowymi smakami, nizsza zawartoscia cukru i wariantami premium. Rosnie rola autentycznosci skladnikow oraz historii marki w decyzjach zakupowych.",
          en: "Producers experiment with new flavors, lower sugar levels, and premium expressions. Ingredient authenticity and brand story play a growing role in purchase decisions.",
        },
      },
    ],
    sources: [
      {
        label: "Zeropol: Likier - historia i gatunki",
        url: "https://zeropol.pl/artykul/likier-historia-gatunki-i-slynne-koktajle",
      },
      {
        label: "Cortez World: Świat likierów",
        url: "https://cortezworld.com/gatunki-alkoholi-likiery-poznaj-fascynujacy-swiat-likierow/",
      },
      {
        label: "Liqueurs: A complete guide",
        url: "https://www.nicks.com.au/info/a-complete-guide-to-liqueurs",
      },
    ],
  },
  rum: {
    teaser: {
      pl: "Od trzciny cukrowej i karaibskich destylarni po nowoczesne style premium.",
      en: "From sugarcane and Caribbean distilleries to modern premium styles.",
    },
    origin: {
      pl: "Rum wywodzi sie z fermentacji surowcow z trzciny cukrowej (soku, koncentratu lub melasy). Historycznie jego rozwoj silnie zwiazal sie z regionem Karaibow i gospodarka morska.",
      en: "Rum comes from fermenting sugarcane materials (juice, concentrate, or molasses). Historically, its development became strongly tied to the Caribbean region and maritime economy.",
    },
    evolution: {
      pl: "Od napoju kojarzonego z zegluga i handlem rum stal sie pelnoprawna kategoria degustacyjna. Dzisiaj obejmuje style lekkie, ciezsze, dojrzewane oraz nowoczesne interpretacje koktajlowe.",
      en: "From a drink associated with sailing and trade, rum became a full tasting category. Today it includes light styles, heavier ones, aged expressions, and modern cocktail-focused interpretations.",
    },
    process: [
      {
        title: { pl: "Surowce z trzciny cukrowej", en: "Sugarcane raw materials" },
        description: {
          pl: "Rum produkuje sie ze sfermentowanego soku trzcinowego, koncentratu lub melasy.",
          en: "Rum is made from fermented sugarcane juice, concentrate, or molasses.",
        },
      },
      {
        title: { pl: "Fermentacja", en: "Fermentation" },
        description: {
          pl: "Drozdze tworza alkohol i zwiazki aromatyczne zalezne od stylu destylarni.",
          en: "Yeast creates alcohol and aromatic compounds depending on distillery style.",
        },
      },
      {
        title: { pl: "Destylacja", en: "Distillation" },
        description: {
          pl: "Wykorzystuje sie rozne aparaty, co wplywa na lekki lub ciezszy profil rumu.",
          en: "Different stills are used, shaping a lighter or heavier rum profile.",
        },
      },
      {
        title: { pl: "Dojrzewanie i blend", en: "Aging and blending" },
        description: {
          pl: "Część rumow dojrzewa w beczkach, a finalny charakter czesto buduje blend kilku partii.",
          en: "Some rums mature in casks, and the final character is often built by blending batches.",
        },
      },
    ],
    gallery: [
      {
        pl: "Historyczna ilustracja transportu beczek z rumem w handlu morskim.",
        en: "A historical illustration of rum cask transport in maritime trade.",
      },
      {
        pl: "Archiwalne butelki rumu pokazujace dawne style etykiet i butelkowania.",
        en: "Archival rum bottles showing historical labeling and bottling styles.",
      },
      {
        pl: "Beczki rumu na pokladzie statku - zwiazek trunku z zegluga i handlem.",
        en: "Rum casks on a ship deck, highlighting the spirit's link with seafaring and trade.",
      },
      {
        pl: "Zmagazynowany alkohol z czasow prohibicji - ukryte zapasy i improwizowane skladowanie.",
        en: "Stored alcohol from the Prohibition era, showing hidden stock and improvised storage.",
      },
    ],
    curiosities: [
      {
        pl: "Nazwa i styl rumu roznia sie regionalnie (np. ron, rhum, rum).",
        en: "Rum naming and style vary by region (for example ron, rhum, rum).",
      },
      {
        pl: "W historii brytyjskiej marynarki rum przez dlugi czas byl elementem dziennych racji.",
        en: "In Royal Navy history, rum was part of daily rations for a long time.",
      },
      {
        pl: "Do produkcji rumu wykorzystuje sie surowce z trzciny cukrowej, co odroznia go od wielu innych destylatow.",
        en: "Rum is made from sugarcane-based materials, which distinguishes it from many other spirits.",
      },
    ],
    timeline: [
      {
        period: "XVI-XVII w.",
        title: { pl: "Poczatki na Karaibach", en: "Caribbean beginnings" },
        description: {
          pl: "Rozwoj plantacji trzciny cukrowej tworzy warunki do masowej produkcji destylatow trzcinowych. Rum stopniowo przechodzi droge od lokalnego trunku do towaru handlowego.",
          en: "The expansion of sugarcane plantations creates conditions for mass production of cane distillates. Rum gradually moves from a local drink to a commercial commodity.",
        },
      },
      {
        period: "XVII-XVIII w.",
        title: { pl: "Handel morski", en: "Maritime trade" },
        description: {
          pl: "Rum staje sie istotnym towarem w handlu morskim i kolonialnym, laczac porty Atlantyku. Jego znaczenie ekonomiczne rośnie wraz z rozwojem szlakow transportowych.",
          en: "Rum becomes a major commodity in maritime and colonial trade, linking Atlantic ports. Its economic importance grows alongside expanding shipping routes.",
        },
      },
      {
        period: "XIX-XX w.",
        title: { pl: "Standaryzacja stylow", en: "Style standardization" },
        description: {
          pl: "Rozwoj technik destylacji, filtracji i dojrzewania porzadkuje style rumu na poszczegolnych rynkach. Producenci zaczynaja mocniej akcentowac roznice miedzy profilami lekkimi, ciezszymi i dojrzewanymi.",
          en: "Advances in distillation, filtration, and maturation help standardize rum styles across markets. Producers increasingly emphasize differences between light, heavier, and aged profiles.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Renesans premium", en: "Premium renaissance" },
        description: {
          pl: "Coraz wieksza role zyskuja rumy dojrzewane i degustacyjne, kierowane do bardziej swiadomego odbiorcy. Rynek rozwija sie rownoczesnie w segmencie koktajlowym i premium collectorskim.",
          en: "Aged and sipping rums gain a stronger position, targeting a more informed audience. The market grows in both cocktail-driven and premium collector segments.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Rum", url: "https://pl.wikipedia.org/wiki/Rum" },
      {
        label: "Dunder Store: Rum historia i współczesność",
        url: "https://dunder.store/blog/rum/rum-historia-i-wspolczesnosc/?srsltid=AfmBOoqOPDkt5LiF4GzEqOxT91XAeqS0GWBJlLobkK13tmAenjCVIpis",
      },
    ],
  },
};
