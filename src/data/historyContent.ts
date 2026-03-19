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
  icon: string;
  teaser: LocalizedText;
  origin: LocalizedText;
  evolution: LocalizedText;
  process: HistoryProcessStep[];
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
    icon: "🧊",
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
          pl: "Destylowane alkohole funkcjonuja glownie jako preparaty lecznicze.",
          en: "Distilled alcohols are used mainly as medicinal preparations.",
        },
      },
      {
        period: "XVII-XVIII w.",
        title: { pl: "Rozwoj produkcji", en: "Production growth" },
        description: {
          pl: "Rozwoj gorzelnictwa i coraz wieksza dostepnosc trunku.",
          en: "Distillery development and wider beverage availability.",
        },
      },
      {
        period: "XIX-XX w.",
        title: { pl: "Standaryzacja", en: "Standardization" },
        description: {
          pl: "Rozwoj rektyfikacji i norm produkcyjnych.",
          en: "Advances in rectification and production standards.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Rynek globalny", en: "Global market" },
        description: {
          pl: "Silna obecność marek premium i wersji smakowych.",
          en: "Strong presence of premium brands and flavored versions.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Wodka", url: "https://pl.wikipedia.org/wiki/W%C3%B3dka" },
      {
        label: "TopAlko: Historia wodki",
        url: "https://topalko.pl/blog/news/historia-wodki-gdzie-i-kiedy-powstala",
      },
    ],
  },
  whisky: {
    icon: "🥃",
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
          pl: "Produkcja lokalna, czesto powiazana z klasztorami.",
          en: "Local production, often linked to monasteries.",
        },
      },
      {
        period: "XVIII w.",
        title: { pl: "Regulacje i podatki", en: "Regulation and taxation" },
        description: {
          pl: "Zmiany prawne porzadkuja i ograniczaja nielegalna produkcje.",
          en: "Legal changes organize and limit illicit production.",
        },
      },
      {
        period: "XIX w.",
        title: { pl: "Skala przemyslowa", en: "Industrial scale" },
        description: {
          pl: "Technologia i logistyka wspieraja eksport i rozwoj marek.",
          en: "Technology and logistics support exports and brand growth.",
        },
      },
      {
        period: "XX-XXI w.",
        title: { pl: "Globalna popularnosc", en: "Global popularity" },
        description: {
          pl: "Whisky staje sie jednym z filarow swiatowego rynku premium.",
          en: "Whisky becomes one of the pillars of the global premium market.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Whisky", url: "https://pl.wikipedia.org/wiki/Whisky" },
      { label: "LubimyWhisky: Historia", url: "https://lubimywhisky.pl/historia/" },
    ],
  },
  wine: {
    icon: "🍇",
    teaser: {
      pl: "Tysiace lat tradycji: od starozytnych upraw winorosli po nowoczesne regiony i style.",
      en: "Thousands of years of tradition: from ancient vines to modern regions and styles.",
    },
    origin: {
      pl: "Historia wina siega starozytnosci i cywilizacji basenu Morza Srodziemnego. Uprawa winorosli byla elementem kultury, handlu i codziennego zycia.",
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
    curiosities: [
      {
        pl: "Wino bylo jednym z najwazniejszych towarow handlowych starozytnosci.",
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
        period: "starozytnosc",
        title: { pl: "Narodziny winiarstwa", en: "Birth of winemaking" },
        description: {
          pl: "Pierwsze udokumentowane praktyki fermentacji winogron.",
          en: "First documented grape fermentation practices.",
        },
      },
      {
        period: "sredniowiecze",
        title: { pl: "Rozwoj klasztorny", en: "Monastic development" },
        description: {
          pl: "Klasztory utrzymuja i rozwijaja wiedze o uprawie i produkcji.",
          en: "Monasteries preserve and develop viticulture and production knowledge.",
        },
      },
      {
        period: "XVIII-XIX w.",
        title: { pl: "Ekspansja handlowa", en: "Commercial expansion" },
        description: {
          pl: "Wino umacnia pozycje na rynkach europejskich.",
          en: "Wine strengthens its position in European markets.",
        },
      },
      {
        period: "XX-XXI w.",
        title: { pl: "Nowe regiony", en: "New world regions" },
        description: {
          pl: "Do glownego nurtu wchodza regiony spoza klasycznej Europy.",
          en: "Regions outside classical Europe enter the mainstream.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Historia wina", url: "https://pl.wikipedia.org/wiki/Historia_wina" },
      {
        label: "o-winie.pl: Krotka historia wina",
        url: "https://o-winie.pl/jak-kupowac-i-jak-pic/krotka-historia-wina/",
      },
    ],
  },
  beer: {
    icon: "🍺",
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
        period: "starozytnosc",
        title: { pl: "Pierwsze warzenie", en: "First brewing" },
        description: {
          pl: "Poczatki fermentowanych napojow zbozowych.",
          en: "Beginnings of fermented grain beverages.",
        },
      },
      {
        period: "sredniowiecze",
        title: { pl: "Lokalne browary", en: "Local breweries" },
        description: {
          pl: "Rozwoj rzemiosla browarniczego w miastach i klasztorach.",
          en: "Development of brewing craft in towns and monasteries.",
        },
      },
      {
        period: "XIX w.",
        title: { pl: "Przemysl i standaryzacja", en: "Industry and standards" },
        description: {
          pl: "Skok technologiczny i wzrost skali produkcji.",
          en: "Technological leap and production scale growth.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Renesans kraftu", en: "Craft renaissance" },
        description: {
          pl: "Nowe style i mala produkcja o wyraznym charakterze.",
          en: "New styles and small-batch brewing with distinct character.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Historia piwa", url: "https://pl.wikipedia.org/wiki/Historia_piwa" },
      { label: "dietetycy.org.pl: Historia piwa", url: "https://dietetycy.org.pl/historia-piwa/" },
    ],
  },
  liqueur: {
    icon: "🍸",
    teaser: {
      pl: "Slodkie i aromatyczne trunki laczace destylaty z ziolami, owocami i przyprawami.",
      en: "Sweet and aromatic spirits combining distillates with herbs, fruits, and spices.",
    },
    origin: {
      pl: "Likiery wywodza sie z tradycji nalewow i preparatow ziolowych. Poczatkowo byly mocno zwiazane z zastosowaniem aptekarskim i klasztornym.",
      en: "Liqueurs originate from infused spirits and herbal preparations. At first, they were closely linked to pharmacy and monastic use.",
    },
    evolution: {
      pl: "Z czasem likiery staly sie popularne jako trunki deserowe i skladniki koktajli. Dzisiaj kategoria obejmuje szerokie spektrum stylow: kremowe, ziolowe, cytrusowe czy korzenne.",
      en: "Over time, liqueurs became popular as dessert drinks and cocktail ingredients. Today the category spans many styles: creamy, herbal, citrus, and spiced.",
    },
    process: [
      {
        title: { pl: "Baza alkoholowa", en: "Alcohol base" },
        description: {
          pl: "Punktem wyjscia jest neutralny destylat lub inny alkohol bazowy.",
          en: "The starting point is a neutral distillate or another alcohol base.",
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
    curiosities: [
      {
        pl: "Wiele likierow ma charakterystyczne, strzezone receptury producentow.",
        en: "Many liqueurs have distinctive producer-protected recipes.",
      },
      {
        pl: "Likiery czesto maja nizsza moc niz klasyczne wodki czy whisky, ale wieksza zawartosc cukru.",
        en: "Liqueurs often have lower ABV than vodka or whisky, but higher sugar content.",
      },
      {
        pl: "To jedna z najbardziej roznorodnych kategorii pod katem aromatow i zastosowan barowych.",
        en: "It is one of the most diverse categories in terms of aromas and bar applications.",
      },
    ],
    timeline: [
      {
        period: "sredniowiecze-renesans",
        title: { pl: "Korzenie ziolowe", en: "Herbal roots" },
        description: {
          pl: "Nalewy i ekstrakty funkcjonuja glownie jako preparaty.",
          en: "Infusions and extracts function mainly as preparations.",
        },
      },
      {
        period: "XVII-XIX w.",
        title: { pl: "Rozwoj receptur", en: "Recipe development" },
        description: {
          pl: "Powstaja rozpoznawalne style regionalne i markowe.",
          en: "Recognizable regional and branded styles emerge.",
        },
      },
      {
        period: "XX w.",
        title: { pl: "Popularnosc barowa", en: "Bar popularity" },
        description: {
          pl: "Likiery trafiaja szeroko do koktajli i gastronomii.",
          en: "Liqueurs become widely used in cocktails and gastronomy.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Nowe smaki", en: "New flavors" },
        description: {
          pl: "Producenci eksperymentuja z profilem smakowym i premiumizacją.",
          en: "Producers experiment with flavor profiles and premium positioning.",
        },
      },
    ],
    sources: [
      {
        label: "Zeropol: Likier - historia i gatunki",
        url: "https://zeropol.pl/artykul/likier-historia-gatunki-i-slynne-koktajle",
      },
      {
        label: "Cortez World: Swiat likierow",
        url: "https://cortezworld.com/gatunki-alkoholi-likiery-poznaj-fascynujacy-swiat-likierow/",
      },
    ],
  },
  rum: {
    icon: "🏴‍☠️",
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
          pl: "Czesc rumow dojrzewa w beczkach, a finalny charakter czesto buduje blend kilku partii.",
          en: "Some rums mature in casks, and the final character is often built by blending batches.",
        },
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
          pl: "Rozwoj masowej produkcji wraz z plantacjami trzciny cukrowej.",
          en: "Mass production grows alongside sugarcane plantations.",
        },
      },
      {
        period: "XVII-XVIII w.",
        title: { pl: "Handel morski", en: "Maritime trade" },
        description: {
          pl: "Rum staje sie istotnym towarem w handlu kolonialnym.",
          en: "Rum becomes a major commodity in colonial trade.",
        },
      },
      {
        period: "XIX-XX w.",
        title: { pl: "Standaryzacja stylow", en: "Style standardization" },
        description: {
          pl: "Rozwoj technik destylacji i dojrzewania.",
          en: "Distillation and maturation techniques advance.",
        },
      },
      {
        period: "XXI w.",
        title: { pl: "Renesans premium", en: "Premium renaissance" },
        description: {
          pl: "Coraz wieksza rola rumow dojrzewanych i degustacyjnych.",
          en: "Aged and sipping rums gain importance.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia: Rum", url: "https://pl.wikipedia.org/wiki/Rum" },
      {
        label: "Dunder Store: Rum historia i wspolczesnosc",
        url: "https://dunder.store/blog/rum/rum-historia-i-wspolczesnosc/?srsltid=AfmBOoqOPDkt5LiF4GzEqOxT91XAeqS0GWBJlLobkK13tmAenjCVIpis",
      },
    ],
  },
};
