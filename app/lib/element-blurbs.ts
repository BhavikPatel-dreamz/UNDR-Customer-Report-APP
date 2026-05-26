export type ElementBlurbSection = {
  title: string;
  body: string;
};

export type ElementBlurb = {
  name: string;
  symbol: string;
  atomicNumber: number;
  sections: ElementBlurbSection[];
};

export const ELEMENT_BLURBS_BY_SYMBOL: Record<string, ElementBlurb> = {
  "O": {
    "name": "Oxygen",
    "symbol": "O",
    "atomicNumber": 8,
    "sections": [
      {
        "title": "Fun fact",
        "body": "You probably think of oxygen as the stuff you breathe, but it actually makes up nearly half the weight of Earth's solid crust. Most of it isn't floating around as gas—it's locked inside rocks, minerals, and water. So the ground beneath your feet? More oxygen than a hospital ward."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Oxygen is extremely abundant in nearly every soil—it's part of common minerals like quartz, clay, and iron oxides. In rare geologic settings, elevated oxygen-bearing compounds have been associated with other mineral deposits, but oxygen itself isn't the resource."
      },
      {
        "title": "Is it toxic?",
        "body": "Not a concern. Oxygen in soil isn't harmful to people, pets, or wildlife at any natural level—it actually helps microbes and plant roots function normally. The only issue is when soil has too little oxygen (often below about 2–5% in soil air), which can stress soil organisms, but that's a deficiency problem, not a toxicity one."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally no direct impact. Oxygen itself doesn't cause water quality problems. What matters is how much oxygen is present in underground water—when levels are low (below 0.5 mg/L), metals like iron, manganese, or arsenic can dissolve into groundwater more easily, which can affect the taste or quality of well water."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential. Plant roots and soil microbes need oxygen to function—well-aerated soils support strong root growth, while compacted or waterlogged soils can become oxygen-poor, which stresses plants and encourages weeds, disease, and pests."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally low concern. Oxygen levels in soil help drive nutrient cycling and the breakdown of organic matter. When soils are poorly aerated, they can release gases like methane or nitrous oxide—both of which factor into broader climate and ecosystem health."
      },
      {
        "title": "Uses",
        "body": "Oxygen is the reason you're alive—and the reason things burn. Beyond the obvious, it's used in steelmaking, medical oxygen tanks, rocket fuel, and wastewater treatment. Not bad for something you can't even see."
      },
      {
        "title": "Prevalence",
        "body": "Oxygen is abundant, averaging about 461,000 ppm (46.1%) in Earth's crust—the most common element by weight, mostly bound up in common rock and mineral formations all around us."
      },
      {
        "title": "Discovery",
        "body": "Oxygen was independently discovered in the 1770s by Carl Wilhelm Scheele and Joseph Priestley, and later named by Antoine Lavoisier, who showed it plays a central role in both combustion and respiration."
      }
    ]
  },
  "F": {
    "name": "Fluorine",
    "symbol": "F",
    "atomicNumber": 9,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Fluorine is so reactive that chemists once called it \"the element from hell\"—for decades, scientists were injured trying to isolate it. It wasn't safely produced until 1886, and even then, the chemist who finally pulled it off won a Nobel Prize essentially for not dying in the process."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Usually not. Fluorine is common in most soils at modest levels. Very high concentrations (above about 500–1,000 ppm) have sometimes been associated with mineral-rich rock formations that naturally contain fluorine or phosphorus. In rare cases, those minerals are mined for industrial fluorine compounds, but typical soil levels don't signal anything commercially interesting. Further testing [hyperlink] is an option when levels are well above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Low-risk at typical levels, but worth noting at high ones. Fluorine in soil below about 200 ppm isn't a concern for people, pets, or wildlife. Above 1,000–2,000 ppm, prolonged exposure could contribute to issues with bones or teeth—but that level of concentration is uncommon in typical backyard settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Moderate concern at elevated levels. Fluorine can dissolve into groundwater as fluoride. Drinking water with more than about 2–4 ppm fluoride has been associated with dental fluorosis (staining or weakening of teeth), and higher concentrations over time may contribute to bone and joint stiffness. Soils with elevated fluorine can slowly release fluoride into nearby wells or streams."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not needed by most plants, and not well tolerated in large amounts. Crops generally handle only small concentrations of fluorine. When soil levels rise above about 300–500 ppm, some plants may show leaf damage or reduced growth, especially sensitive crops."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable at typical levels, but elevated concentrations get attention. Fluorine above about 1,000 ppm has been associated with volcanic geology, phosphorus-rich rock formations, or industrial sources like aluminum smelting. At those levels, fluoride can accumulate in vegetation and potentially affect grazing animals or wildlife."
      },
      {
        "title": "Uses",
        "body": "Fluorine compounds are behind some surprisingly everyday things—non-stick coatings like Teflon, refrigerants, aluminum production, and certain pharmaceuticals. Fluoride also shows up in drinking water systems and toothpaste, where it helps prevent tooth decay."
      },
      {
        "title": "Prevalence",
        "body": "Fluorine is common, averaging about 585 ppm (0.0585%) in Earth's crust, found mainly in fluorine-bearing minerals and phosphorus-rich rocks."
      },
      {
        "title": "Discovery",
        "body": "Fluorine compounds had been known for centuries, but the element itself wasn't isolated until 1886 by the French chemist Henri Moissan."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's fluorine is above 500 ppm, your soil sample is in the neighborhood of Iceland's volcanic highlands—steam rising from hot springs across black lava fields, the air sharp with sulfur, geothermal earth so hot that locals bake traditional rye bread by burying the dough underground and letting the ground do the work. Below 200 ppm, your sample's levels carry only faint traces of fluorine—similar to the deep tropical earth of the Amazon Basin, where warm rain falls through a dense green canopy, and most of the fluorine has been gently washed away over centuries of rainfall, leaving behind the rich, dark soil that grows wild açaí palms and some of the most biodiverse plant life on the planet."
      }
    ]
  },
  "NA": {
    "name": "Sodium",
    "symbol": "Na",
    "atomicNumber": 11,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Sodium metal is so soft you can cut it with a butter knife—which is a strange look for a metal. Drop it in water, though, and it bursts into flames. It's also what makes table salt salty, which means one of the most reactive metals on Earth is sitting in your kitchen right now—don't worry—your table salt isn't going to explode."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Usually not. Sodium is extremely common in most soils. Very high levels (above about 20,000–30,000 ppm) have historically been associated with salty sediments, evaporite deposits, or ancient lakebeds. In some regions, those deposits are mined for salt, soda ash, or other industrial minerals—but typical backyard sodium levels don't signal anything commercially interesting. Further testing [hyperlink] is an option when levels are far above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Not a concern at typical levels. Sodium in soil below about 10,000 ppm isn't harmful to people, pets, or wildlife. Extremely salty soils—above 30,000–50,000 ppm—can kick up salty dust or leach into water, which may cause irritation or digestive issues with prolonged exposure."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at high levels. Sodium dissolves easily into groundwater, and drinking water above about 200 ppm can taste noticeably salty. Soils with large amounts of sodium salts can gradually raise salinity in nearby groundwater or streams."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential, and problematic at high levels. Most crops don't need sodium, though some research suggests small amounts may help with resistance to insects, bacteria, and fungus. When sodium gets too abundant—above about 10,000–20,000 ppm—soils can become \"sodic,\" leading to crusting, poor drainage, reduced mineral absorption, and stunted plant growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Common in certain landscapes but worth watching. High-sodium soils show up frequently in arid regions, coastal areas, and places with heavy irrigation. Excess sodium runoff can increase salinity in streams and wetlands, which may stress freshwater plants and animals."
      },
      {
        "title": "Uses",
        "body": "Sodium compounds are all over daily life—table salt, baking soda, soap, glass, and food preservation all depend on them. Sodium salts also show up in water softening systems and road de-icing, which means sodium is quietly working for you every winter."
      },
      {
        "title": "Prevalence",
        "body": "Sodium is abundant, averaging about 23,600 ppm (2.36%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Sodium compounds have been part of human life for thousands of years, but the pure metal wasn't isolated until 1807 by Sir Humphry Davy using electrolysis."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's sodium is above 40,000 ppm, your soil sample is in the territory of the Dead Sea in Israel and Jordan—blinding white salt crusts stretching to the horizon, mineral-heavy earth where almost nothing can take root, one of the most extreme soil environments on the planet. Below 5,000 ppm, your sample's sodium levels are modest like the tropical lowlands of Malaysia—lush green stretches everywhere, the soil washed clean by decades of heavy downpours, the same rain-rinsed earth that grows towering coconut palms and the oil palms that produce much of the world's palm oil."
      }
    ]
  },
  "MG": {
    "name": "Magnesium",
    "symbol": "Mg",
    "atomicNumber": 12,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Magnesium burns so brightly it can temporarily blind you—producing a white light intense enough to mimic daylight. A subtle element, it is not."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Usually not. Magnesium is extremely common in most soils, especially those derived from limestone or volcanic material. Very high concentrations (above about 50,000–100,000 ppm) have historically been associated with magnesium-rich rocks that are sometimes mined for industrial minerals—but that's far above what most backyard soil contains. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Not a concern. Magnesium in soil isn't harmful to people, pets, or wildlife at typical levels (often between about 5,000 and 30,000 ppm). Even at higher concentrations, magnesium in soil is rarely considered toxic—it's one of the more benign elements you'll find in a sample."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low impact. Magnesium dissolves naturally into groundwater, and when combined with calcium, it's one of the main contributors to \"hard water.\" Hard water is usually safe to drink, but above about 100–150 ppm magnesium, it can affect taste and lead to mineral buildup in pipes and appliances."
      },
      {
        "title": "Agricultural relevance",
        "body": "An essential nutrient. Magnesium sits at the center of the chlorophyll molecule, so plants literally can't photosynthesize without it. Most healthy soils have plenty, but when magnesium levels get extremely high relative to calcium, it can throw off nutrient balance and affect soil structure."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Magnesium is a natural part of most soils and rocks, and at typical levels it doesn't pose environmental issues. Large inputs from mining or industrial activity could shift soil chemistry locally, but for naturally occurring magnesium, this is rarely a factor."
      },
      {
        "title": "Uses",
        "body": "Magnesium is both strong and surprisingly light—which is why it shows up in aircraft and car parts. It's also the reason camping fire starters work, and it plays a role in fireworks, flares, and medicines like antacids and laxatives."
      },
      {
        "title": "Prevalence",
        "body": "Magnesium is abundant, averaging about 23,000 ppm (2.3%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Magnesium compounds were found in mineral springs for centuries before the metal itself was first isolated in 1808 by Sir Humphry Davy through electrolysis."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's magnesium is above 50,000 ppm, your soil sample is in the range of the magnesium levels of the Dolomite Mountains in northern Italy—pale limestone cliffs towering above green valleys, rock built from magnesium-rich dolomite stone, mineral-dense ground where the region's Lagrein wine grapes root deep into magnesium-heavy soil. Below 10,000 ppm, your sample's magnesium levels are in the range of southern Spain—sandy soil stretching between rows of silver-leafed olive trees, the same chalky earth that grows marcona almonds and the grapes behind the region's famous fino sherry."
      }
    ]
  },
  "AL": {
    "name": "Aluminum",
    "symbol": "Al",
    "atomicNumber": 13,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Aluminum is the most abundant metal in Earth's crust, yet it was once considered more valuable than gold. In the mid-1800s, small bars of aluminum were displayed like precious treasures—all because nobody could figure out how to refine it cheaply. Napoleon III reportedly served his most honored guests with aluminum cutlery while everyone else got gold."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Usually not. Aluminum is extremely common in clay minerals and most rocks, so nearly every soil already contains large amounts. Very high concentrations (above about 150,000–200,000 ppm) have historically been associated with aluminum-rich ore formations—but typical backyard levels are well below that. Further testing [hyperlink] is an option when levels are far above the normal range."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. Aluminum isn't a concern at typical soil levels (often between 20,000 and 100,000 ppm) because it's locked inside stable minerals. The exception is very acidic soils—when aluminum dissolves into more reactive forms, prolonged exposure has been linked to neurological issues and bone disorders, though that's more of an industrial or occupational concern than a backyard one."
      },
      {
        "title": "Impact on water quality",
        "body": "Low impact under normal conditions. Aluminum tends to stay locked in soil minerals and doesn't easily enter groundwater. In acidic conditions (when soil pH drops below about 5.5), aluminum can dissolve and move into nearby water, which may affect taste and occasionally cause discoloration."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not needed by plants, and potentially harmful in acidic soils. Aluminum isn't a nutrient—and in strongly acidic soils (below about pH 5–5.5), dissolved aluminum can stunt roots and reduce crop yields. That's one reason lime is commonly applied to acidic agricultural soils."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern under natural conditions. Aluminum is a natural part of most soils and rocks, and in its solid mineral form, it doesn't pose environmental issues. Mining activity or industrial waste can increase aluminum levels locally and affect soil or water chemistry, but for naturally occurring aluminum, this is rarely a factor."
      },
      {
        "title": "Uses",
        "body": "Aluminum is lightweight, corrosion-resistant, and easy to shape—which is why it's in everything from airplanes and cars to beverage cans and building materials. It also carries electricity well, making it a staple in power transmission lines."
      },
      {
        "title": "Prevalence",
        "body": "Aluminum is abundant, averaging about 82,000 ppm (8.2%) in Earth's crust—the most common metal on the planet."
      },
      {
        "title": "Discovery",
        "body": "Aluminum compounds had been known for centuries, but the pure metal wasn't isolated until 1825 by the Danish chemist Hans Christian Ørsted, with further refinement by Friedrich Wöhler shortly after."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's aluminum is above 120,000 ppm, your soil sample is in the range of Guinea in West Africa—deep red earth so vivid it stains everything it touches, carved by tropical rains into rolling hills, some of the richest bauxite deposits on the planet, the same iron-and-aluminum-heavy soil that grows the region's coffee and oil palms. Below 60,000 ppm, your sample's aluminum levels are on the lighter side, like the English countryside, where green fields stretch, and clay-rich soil clings to everything—the same heavy earth that produces English barley and the hops behind the country's famous cask ales."
      }
    ]
  },
  "SI": {
    "name": "Silicon",
    "symbol": "Si",
    "atomicNumber": 14,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Silicon crystals can be grown so flawlessly that a single one can stretch several feet without a break—basically a man-made gemstone."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Usually not. Silicon is extremely abundant—it's the backbone of most sand, quartz, and common minerals in rocks and soil. Only very pure silica deposits (above about 900,000 ppm silicon dioxide) are mined for things like glassmaking, electronics, or solar panels, and those deposits are a far cry from typical backyard soil. Further testing [hyperlink] is an option for the rare case where levels suggest unusual purity."
      },
      {
        "title": "Is it toxic?",
        "body": "Not at typical soil levels. Silicon in soil isn't a health concern for people, pets, or wildlife—it's locked up in stable minerals like quartz and clay. The one exception is very fine crystalline silica dust, which can be harmful if inhaled over long periods—but that's primarily an industrial or occupational concern, not something associated with normal contact with backyard soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally no impact. Small amounts of dissolved silica show up naturally in groundwater—usually below 30–50 ppm—and it's considered harmless at those levels. Silicon isn't one that tends to cause water quality issues for homeowners."
      },
      {
        "title": "Agricultural relevance",
        "body": "Helpful but not essential. Silicon isn't classified as a required nutrient for most plants, but many crops benefit from it anyway. Rice, wheat, and grasses use silicon to strengthen their cell walls, which helps them resist pests, disease, and drought."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Silicon stays bound in solid minerals and doesn't move easily through soil or water, so environmental issues tied to silicon in soil are essentially nonexistent under normal conditions."
      },
      {
        "title": "Uses",
        "body": "Silicon is everywhere—glass, concrete, ceramics, and the chips inside every phone and computer. It's the foundation of the semiconductor industry and shows up in solar panels and industrial alloys. And yes, silicone (the sealant in your bathroom) comes from silicon too—same element, very different personality."
      },
      {
        "title": "Prevalence",
        "body": "Silicon is abundant, averaging about 282,000 ppm (28.2%) in Earth's crust—the second most abundant element after oxygen."
      },
      {
        "title": "Discovery",
        "body": "Silicon compounds like sand and quartz have been known since ancient times, but the element itself wasn't isolated until 1824 by the Swedish chemist Jöns Jacob Berzelius."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's silicon is above 300,000 ppm, your soil sample is in the territory of the Sahara Desert—golden dunes, quartz-rich sand stretching in every direction, a landscape so mineral-dominant that almost nothing grows. Below 200,000 ppm, your sample's silicon levels are in the range of the hillsides of Sicily—dark, mineral-rich volcanic soil tucked between ancient stone ruins and dramatic coastal cliffs, a mix of elements sharing the stage rather than any one mineral dominating, the same fertile earth that grows the island's famous blood oranges and the grapes behind its bold Nero d'Avola wines."
      }
    ]
  },
  "P": {
    "name": "Phosphorus",
    "symbol": "P",
    "atomicNumber": 15,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Phosphorus glows faintly greenish-blue in the dark when exposed to oxygen—which is how it got its name, from the Greek for \"light-bearer.\" It was discovered by a guy boiling down buckets of urine looking for the philosopher's stone. He didn't find gold, but he did find something that glows in the dark—so, partial credit."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Generally, no. Phosphorus is present in most soils at moderate levels because it comes from natural minerals and decaying organic matter. However, unusually high concentrations—above about 3,000 ppm—can sometimes indicate phosphate-rich rock formations, which are mined in some regions to produce agricultural fertilizers. Other times, high levels simply indicate overuse of fertilizer. Further testing [hyperlink] is an option when levels are that far above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. At typical soil levels (often between about 200 and 1,000 ppm), phosphorus isn't harmful to people, pets, or wildlife. Most phosphorus in soil is locked up in stable mineral or organic forms that don't pose direct health risks."
      },
      {
        "title": "Impact on water quality",
        "body": "Moderate concern, mainly through runoff. Phosphorus itself doesn't dissolve easily into groundwater, but it can wash into nearby lakes, rivers, or ponds during rainstorms. When runoff carries more than about 0.1 ppm phosphorus into surface water, it can feed algal blooms—thick mats of algae that cloud the water and starve fish of oxygen."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential nutrient. Phosphorus is one of the key building blocks plants need to grow strong roots and healthy tissue. Many agricultural soils are managed to keep phosphorus at moderate levels, since too little can stunt plant growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable at natural levels—the main concern is accumulation from human activity. Excess phosphorus in soil is often linked to fertilizer use, animal manure, or phosphate-rich sediments. When soils become overloaded—above about 2,000–3,000 ppm—the risk of phosphorus washing into nearby waterways during rainstorms increases, which can disrupt aquatic life."
      },
      {
        "title": "Uses",
        "body": "Phosphorus is best known as the key ingredient in fertilizers that help feed much of the world's population. It also shows up in safety matches, food additives, and detergents."
      },
      {
        "title": "Prevalence",
        "body": "Phosphorus is very common, averaging about 1,000 ppm (0.1%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Phosphorus was discovered in 1669 by German alchemist Hennig Brand, making it one of the first elements to be isolated by a known individual."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's phosphorus is above 1,500 ppm, your soil sample is in the company of Japan's volcanic foothills near Mt. Fuji—mineral-rich slopes where steam drifts through cedar forests, hot springs dot the mountainside, and the volcanic earth below produces prized wasabi and some of Japan's most celebrated green tea. If your sample's phosphorus is below 300 ppm, your soil sample resembles the vast natural grasslands of the Eurasian steppe in Kazakhstan—golden plains, sparse grazing land where the tough native grasses sustain livestock but yield little else."
      }
    ]
  },
  "S": {
    "name": "Sulfur",
    "symbol": "S",
    "atomicNumber": 16,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Sulfur is the reason rotten eggs smell the way they do. Bacteria in swamps, hot springs, and volcanic vents release sulfur gases that produce that unmistakable stink. Ancient civilizations burned it to ward off wild animals—which, given the smell, probably worked."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Generally, no. Sulfur is fairly common in rocks and sediments, especially in areas shaped by ancient seas or volcanic activity. However, very high concentrations—above about 10,000–20,000 ppm—can sometimes indicate sulfur-rich mineral deposits or mineral layers left behind by evaporated water, which may be associated with mining regions. Further testing [hyperlink] is an option when levels are that far above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. At typical soil levels (often between about 100 and 1,000 ppm), sulfur isn't harmful to people, pets, or wildlife. Most sulfur sits in stable minerals or organic matter. However, in waterlogged or poorly ventilated areas, certain sulfur compounds can produce gases that are irritating or harmful at higher concentrations."
      },
      {
        "title": "Impact on water quality",
        "body": "Can be noticeable at elevated levels. Sulfur in soil can dissolve into groundwater as sulfate. Above about 250–500 ppm, sulfate can make well water taste bitter and may cause digestive discomfort. In some wells, sulfur bacteria can also produce hydrogen sulfide gas, which gives water a strong \"rotten egg\" smell."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential nutrient. Sulfur is one of the building blocks plants need to make proteins and grow healthy tissue. Most crops require moderate amounts, and soils containing several hundred ppm sulfur typically provide an adequate supply."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable at natural levels. In soils rich in sulfur-bearing minerals, exposure to air and water can produce sulfuric acid—a natural process that's more common around mining areas. If sulfur levels are extremely high, this acid can leach into nearby water, but that's unusual outside of mining or industrial sites."
      },
      {
        "title": "Uses",
        "body": "Sulfur is used to make sulfuric acid, one of the most important industrial chemicals in the world. It also shows up in fertilizers, rubber, batteries, and agricultural fungicides."
      },
      {
        "title": "Prevalence",
        "body": "Sulfur is common, averaging about 350 ppm (0.035%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Sulfur has been known since ancient times, occurring naturally in bright yellow deposits near volcanoes and used by early civilizations in medicines and fumigation."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's sulfur is above 2,000 ppm, your soil sample is in the company of Kawah Ijen in Indonesia—a volcanic crater where bright yellow sulfur crusts form around steaming vents, turquoise acid lakes glow against black rock, and the surrounding volcanic soil produces some of the world's smoothest coffee on nearby Java. If your sample's sulfur is below 300 ppm, your soil sample resembles the rolling agricultural plains of Poland—patchwork fields, dark soil, the same steady earth that grows Poland's famous rye and the potatoes that end up in its crisp vodka."
      }
    ]
  },
  "CL": {
    "name": "Chlorine",
    "symbol": "Cl",
    "atomicNumber": 17,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Chlorine is a greenish-yellow gas that was first used in World War I as a chemical weapon—and yet today, most of us are grateful for it whenever we go swimming. From the trenches to backyard barbecues in about a century. Not a bad redemption arc."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Probably not, but high chloride levels (above 10,000 ppm) can indicate old salt flats or mineral layers left behind by evaporated water. In rare cases—especially in desert regions or dried lakebeds—those formations can be commercially significant. If levels are unusually high, it could point to an interesting geologic story, and further testing [hyperlink] is an option some landowners consider."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. At normal soil levels (under 200 ppm), chlorine isn't harmful to people, pets, or wildlife. Above about 500 ppm, direct soil contact can cause skin irritation in sensitive individuals, but that's uncommon at naturally occurring levels."
      },
      {
        "title": "Impact on water quality",
        "body": "Usually minor. Chloride above 250 ppm in well water can make it taste salty, cause digestive discomfort, and corrode plumbing or appliances over time. At soil levels above 1,000 ppm, runoff can push enough chloride into water to make it a poor fit for drinking or irrigation."
      },
      {
        "title": "Agricultural relevance",
        "body": "Can affect certain plants at elevated levels. Most plants need only a few ppm of chlorine, and above about 100–200 ppm, sensitive crops can start to struggle. At levels above 500 ppm, some farmers and gardeners manage salt buildup through improved drainage or soil treatments."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. Runoff with elevated chloride (above 200 ppm) can affect freshwater life and helpful organisms in soil, especially near roads treated with salt or in heavily irrigated farmland. At naturally occurring levels, chlorine doesn't pose meaningful environmental risk."
      },
      {
        "title": "Uses",
        "body": "Chlorine is famous for keeping swimming pools clean—though that \"pool smell\" actually comes from chlorine reacting with sweat, not the chlorine itself. It's also used to disinfect drinking water, make plastics and PVC, produce household bleach, and manufacture medicines."
      },
      {
        "title": "Prevalence",
        "body": "Chlorine is uncommon in Earth's crust, averaging about 170 ppm (0.017%)—though it's far more abundant in seawater, where it's one of the main ingredients in table salt."
      },
      {
        "title": "Discovery",
        "body": "Chlorine was first isolated by Carl Wilhelm Scheele in 1774, though it wasn't confirmed as its own element until Sir Humphry Davy settled the matter in 1810."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's chlorine is between 200 and 500 ppm, your soil sample is in the company of Lisbon, Portugal—coastal hillsides, the same mineral-laced soil that nourishes the country's famous olive groves and cork oak forests. If your sample's chlorine is above 500 ppm, your soil sample is in the neighborhood of the Dead Sea in Israel and Jordan—blindingly white salt crusts stretching to the horizon, mineral-heavy earth where almost nothing grows, one of the most extreme soil environments on the planet. At 150 to 200 ppm, your sample's chlorine levels sit right about where you'd find the farmland of Northern France—green fields rolling toward the coast, the same lightly mineral soil that produces Normandy's famous Camembert and golden cidre. Below 150 ppm, your sample's chlorine levels are modest and well-balanced—like Ukraine's famous black earth (chernozem), dark and rich, some of the most naturally fertile soil on the planet, the kind of earth that grows wheat and sunflowers with almost no help."
      }
    ]
  },
  "K": {
    "name": "Potassium",
    "symbol": "K",
    "atomicNumber": 19,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Potassium is so reactive that if you drop a small chunk of pure potassium in water, it can fizz, spark, and even explode with a violet flame. We don't recommend trying this at home."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "It's possible, though rare. Soils above 50,000 ppm have historically been associated with potassium-bearing rock or old lakebeds. Most soils fall between 5,000 and 35,000 ppm, and further testing [hyperlink] is something some homeowners could consider when levels fall outside that range."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. Potassium in soil isn't a health concern for people or pets at typical concentrations. At very high levels, prolonged exposure has been linked to elevated potassium in the blood, which can contribute to muscle weakness and heart rhythm issues—but that's associated with extreme concentrations, not typical backyard soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low impact. Potassium doesn't tend to cause major water quality problems at typical soil levels. At very high concentrations—above 1,000 ppm in runoff—water can take on a salty taste, and some people notice mild stomach discomfort, but those levels are uncommon."
      },
      {
        "title": "Agricultural relevance",
        "body": "A key player in plant health. Potassium helps crops use water efficiently and resist disease. Soils with less than 5,000 ppm may show signs of stunted growth, while levels above 40,000 ppm can lead to nutrient imbalance or salt buildup."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally low concern. Potassium compounds are largely safe in soil, but runoff containing more than 300 ppm can increase salinity in nearby rivers, lakes, and waterways—putting stress on freshwater plants and animals."
      },
      {
        "title": "Uses",
        "body": "Your body depends on potassium—bananas, potatoes, avocados, and spinach are loaded with it, and it helps your nerves and muscles (including your heart) work properly. Potassium compounds show up in fertilizers, soaps, fireworks (it's what makes that purple color), glass, ceramics, and even food preservation."
      },
      {
        "title": "Prevalence",
        "body": "Potassium is abundant, averaging about 20,900 ppm (2.09%) in Earth's crust—one of the most common elements in rocks and soils."
      },
      {
        "title": "Discovery",
        "body": "Potassium was first isolated in 1807 by Sir Humphry Davy through electrolysis of potash (a type of wood ash used for soap-making), making it the first metal ever isolated using electricity."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's potassium is above 30,000 ppm, your soil sample is in the range of the potassium levels of the Nile Delta in Egypt—lush green farmland stretching along a wide, slow-moving river, the soil dark and heavy with centuries of rich sediment. Between 20,000 and 30,000 ppm, your soil sample's potassium level is in the range of the volcanic farmlands of Java, Indonesia—terraced hillsides thick with tropical growth, the soil dark and steaming after a rain, mineral-rich from centuries of eruptions, the same volcanic earth that produces some of the smoothest, strongest coffee on the planet. Between 12,000 and 20,000 ppm, your sample's levels land in the same sweet spot as the potassium levels of Tuscany, Italy—golden hillsides dotted with cypress trees and stone farmhouses, the mineral-balanced earth that produces Sangiovese grapes and the bold Chianti wine they become. Below 12,000 ppm, your sample's potassium levels are on the modest side—similar to the levels of the Scottish Highlands, where wide-open moorland stretches to the horizon and heather and hardy grasses hold their own in lean, peaty soil, the same deep peat that gives Highland single malt Scotch its famous smoky character."
      }
    ]
  },
  "CA": {
    "name": "Calcium",
    "symbol": "Ca",
    "atomicNumber": 20,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Calcium makes up a big part of the dust that drifts across the Sahara Desert and fertilizes the Amazon rainforest thousands of miles away—proof that even minerals like to travel."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "In some cases. Most soils range from about 500 to 40,000 ppm calcium. Levels far above that—above 100,000 ppm (10%)—can indicate limestone or chalk formations nearby, which are sometimes commercially mined. Further testing [hyperlink] is an option when levels fall that far outside the typical range."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no—calcium is one of the friendliest elements out there. Even at high soil levels (above 40,000 ppm), it isn't harmful to people, pets, or wildlife."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting, but not a health concern. When calcium dissolves into groundwater above about 100–200 ppm, it creates what's called \"hard water\"—which can clog pipes, leave white scale on fixtures, and make soap less effective. It's more of a nuisance than a hazard."
      },
      {
        "title": "Agricultural relevance",
        "body": "Important nutrient. Calcium helps balance soil acidity and makes other nutrients more available to plants. Deficiency—below about 500–1,500 ppm—can cause blossom-end rot in tomatoes and peppers and poor root development in crops."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally benign. Calcium compounds like limestone are considered environmentally safe and are even used to neutralize acidic lakes and soils. Runoff with calcium levels above 400 ppm may slightly increase water hardness, but that typically benefits aquatic life rather than harming it. The main environmental concern is habitat disruption from quarrying limestone or gypsum—not the calcium itself."
      },
      {
        "title": "Uses",
        "body": "About 99% of the calcium in your body is stored in your bones and teeth—it's the element that keeps them strong. Beyond biology, calcium shows up in limestone buildings, drywall, road de-icers, and even cheese-making, where it helps form the curds."
      },
      {
        "title": "Prevalence",
        "body": "Calcium is abundant, averaging about 41,500 ppm (4.15%) in Earth's crust—especially common in sedimentary rocks like limestone and chalk."
      },
      {
        "title": "Discovery",
        "body": "Calcium was isolated in 1808 by Sir Humphry Davy using electrolysis, though people had been using calcium compounds like lime and plaster since ancient Egypt."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's calcium is above 40,000 ppm, your soil sample is in the company of the lime-rich farmlands of Southern France—sun-drenched Provençal fields stretching between ancient stone villages, pale chalky soil that produces some of the world's most fragrant lavender and the grapes behind the region's famous rosé. If your sample's calcium is between 20,000 and 40,000 ppm, your soil sample resembles the gleaming White Cliffs near Dover, England—towering chalk faces rising above the English Channel, green pastureland rolling away from the edge, the same calcium-rich earth that sustains Kent's famous hop fields and apple orchards. At 5,000 to 20,000 ppm, your sample's levels sit right about where you'd find the fertile valleys of northern Italy—neat rows of vineyards climbing terraced hillsides, morning fog settling over the Po River plain, the mineral-balanced soil that produces Barolo wine and Arborio rice. Below 5,000 ppm, your sample's levels are light—like the sandy coastal soils of northern Germany, windswept dunes giving way to flat farmland, salt air blowing in from the North Sea, lean earth where hardy rye and sea buckthorn are among the few crops that thrive."
      }
    ]
  },
  "SC": {
    "name": "Scandium",
    "symbol": "Sc",
    "atomicNumber": 21,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Scandium is so rare that all the scandium mined in an entire year would fit in the trunk of a car—and there'd still be room for the groceries. Despite being scattered across nearly every rock on Earth, it almost never concentrates enough to be worth extracting. It's the element equivalent of being everywhere and nowhere at the same time."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though only at unusually high levels. Typical soils contain around 10–30 ppm scandium. Concentrations above 200 ppm could indicate rare-earth mineralization that has historically been associated with extraction activity. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Scandium is considered low-toxicity and poses little health risk to people, pets, or wildlife at natural levels. Even soils reaching several hundred ppm aren't known to cause harm."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Scandium binds tightly to minerals and doesn't dissolve easily. Groundwater contamination is unlikely unless very high levels (above 500 ppm) occur in disturbed or mined areas."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Scandium doesn't affect soil fertility or crop quality, though some studies suggest it may play a minor role in seed germination."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Scandium is stable and environmentally benign at naturally occurring levels. The main environmental issues associated with scandium relate to rare-earth mining processes rather than the element itself in soil."
      },
      {
        "title": "Uses",
        "body": "Scandium makes aluminum stronger and lighter, which is why it shows up in baseball bats, bicycles, and even fighter jets. It's the \"secret ingredient\" behind some of the most advanced alloys in the world."
      },
      {
        "title": "Prevalence",
        "body": "Scandium is uncommon, averaging about 22 ppm (0.0022%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Scandium was predicted by Mendeleev and later discovered in 1879 by Lars Nilson, who named it after Scandinavia."
      }
    ]
  },
  "TI": {
    "name": "Titanium",
    "symbol": "Ti",
    "atomicNumber": 22,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Titanium is named after the Titans of Greek mythology—and it lives up to the billing. It doesn't rust, doesn't corrode in seawater, and is completely ignored by the human immune system, which is why surgeons use it to rebuild hips, knees, and jawbones. Your body literally can't tell it's there."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Most soils contain 1,000–9,000 ppm titanium. Readings above 30,000 ppm—roughly triple the typical range—can indicate heavy mineral sands that carry titanium-rich deposits. Further testing [hyperlink] is an option when levels are that far above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Titanium is harmless at typical soil levels (under 10,000 ppm). It doesn't dissolve easily, so it tends to just sit in the soil without affecting people, pets, or wildlife. Even at elevated levels, it's considered safe."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Titanium doesn't dissolve easily in water, so it rarely affects water quality. Even in mining regions, titanium concentrations in groundwater are typically below 1 ppm and don't pose a meaningful risk."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Titanium isn't considered essential for plants, though trace amounts may encourage growth in some cases. At typical soil levels, it's harmless to crops, livestock, and soil organisms."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable. Titanium itself is inert and doesn't pose environmental concern at natural levels. The main risk comes from industrial mining of titanium-rich sands, which can disturb local ecosystems. Runoff carrying suspended titanium particles above 50 ppm may temporarily cloud water, but toxicity is minimal."
      },
      {
        "title": "Uses",
        "body": "Titanium is as strong as steel but about half the weight, making it a favorite for airplanes, rockets, and high-performance sports gear. Titanium dioxide is one of the world's most common pigments—it's the bright white in paint, sunscreen, and even some food coloring."
      },
      {
        "title": "Prevalence",
        "body": "Titanium is very common, averaging about 5,650 ppm (0.565%) in Earth's crust—more abundant than copper, chromium, or nickel."
      },
      {
        "title": "Discovery",
        "body": "Titanium was discovered in Cornwall, England, in 1791 by William Gregor, and later confirmed and named by Martin Heinrich Klaproth."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's titanium is above 30,000 ppm, your soil sample is in the company of Iceland's volcanic southern coast—jet-black sand dunes stretching toward glaciers, the ground shimmering with mineral-rich basalt, earth so young and raw that almost nothing grows on it yet. If your sample's titanium is between 10,000 and 30,000 ppm, your soil sample resembles the lush tropical soils of Brazil—red-orange earth rich with trace minerals, the same volcanic-origin soil that produces some of the world's finest coffee and sugarcane. Below 10,000 ppm, your sample's titanium levels are quiet and balanced—like the fertile loess plains of eastern Poland, soft golden soil deposited by ancient winds, flat farmland stretching to the horizon, the kind of steady earth that's been growing wheat and rye for generations. If your sample's iron is above 30,000 ppm and titanium is above 5,000 ppm, that iron-titanium combination puts your soil sample in the neighborhood of Mount Etna in Sicily—vivid volcanic earth striped red and black with iron and titanium oxides, terraced vineyards climbing the slopes, the same fierce mineral soil that gives Etna's wines their distinctive smoky character. If your sample's iron is below 20,000 ppm and titanium is below 5,000 ppm, those levels are mild—like the rolling foothills of the Carpathian Mountains in Romania, forested ridges fading into pastoral valleys, wildflower meadows, gentle soil where plum orchards produce the fruit behind the region's famous homemade brandy."
      }
    ]
  },
  "V": {
    "name": "Vanadium",
    "symbol": "V",
    "atomicNumber": 23,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Vanadium compounds change colors depending on their chemical state—yellow, blue, green, even purple—almost like a chemical mood ring. It was named after Vanadís, the Norse goddess of beauty, because early chemists couldn't get over how pretty its compounds were. Fair enough."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Sometimes. Most soils have vanadium levels below 100 ppm, but readings above 500 ppm can indicate volcanic or mineral-rich formations that have historically been associated with mining activity. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Worth noting at elevated levels. Low vanadium (under 100 ppm) isn't normally a concern, but above about 200 ppm, prolonged exposure and especially ingestion can irritate the lungs and kidneys and affect nervous system function. Pets or wildlife that dig in or eat soil could be affected at the same levels. The main sources of vanadium contamination are industrial emissions and mining—not typical backyard soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. Groundwater near mining or fossil fuel sites can sometimes pick up vanadium—levels above about 15–50 µg/L may exceed drinking water guidelines in some regions and could cause stomach irritation with prolonged exposure. In typical soils, this isn't a common issue."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants. Trace amounts of vanadium are generally harmless, and some soil microorganisms may even benefit from small quantities. Above about 150–200 ppm, vanadium can start to interfere with crop growth, and contamination above 500 ppm can significantly reduce yields."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at typical levels. Above about 300 ppm, vanadium can stress soil organisms and leach into streams, especially in acidic conditions. In surface water, concentrations above 1 ppm can affect aquatic life—though levels that high are uncommon outside industrial or mining areas."
      },
      {
        "title": "Uses",
        "body": "Vanadium makes steel tougher—it shows up in tools, car parts, and jet turbines that need to handle extreme stress without breaking. It's also a key ingredient in vanadium redox flow batteries, a technology being developed to store energy on a massive scale."
      },
      {
        "title": "Prevalence",
        "body": "Vanadium is uncommon, averaging about 120 ppm (0.012%) in Earth's crust—though still more abundant than silver or mercury."
      },
      {
        "title": "Discovery",
        "body": "Vanadium was first discovered in 1801 by Andrés Manuel del Río in Mexico, but his claim was dismissed—it was rediscovered in 1830 by Nils Sefström in Sweden."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's vanadium is above 500 ppm, your soil sample is in the company of South Africa's Bushveld Complex—one of the richest mineral regions on Earth, vast scrubland, red-brown ore-packed earth, the same iron-rich soil that sustains the tough native grasses grazed by the region's livestock. If your sample's vanadium is below 200 ppm, your soil sample's levels are modest—like the Scottish Highlands, hills rolling toward cold lochs, peat bogs famous for producing rich, smoky single malt Scotch."
      }
    ]
  },
  "CR": {
    "name": "Chromium",
    "symbol": "Cr",
    "atomicNumber": 24,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Chromium is what makes emeralds green and rubies red—the exact same element, producing opposite colors depending on the crystal it's trapped in. It's responsible for some of the most beautiful gemstones on Earth, which is an impressive résumé for an element that's also a well-known toxin."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Unlikely at typical levels — chromium in soil is generally considered a contaminant concern rather than a recoverable resource, and the toxicity risks associated with Cr(VI) make elevated concentrations a liability in most cases. That said, at extremely high concentrations — above 100,000 ppm — chromium can be associated with chromite ore deposits, which do have industrial value. However, what that means for your land is beyond what this sample can tell you. See [hyperlink] for more information and resources."
      },
      {
        "title": "Is it toxic?",
        "body": "It depends on the form. Chromium comes in two main varieties: Cr(III), which is common in soils and actually an essential nutrient in small amounts, and Cr(VI)—hexavalent chromium—which is the form linked to serious health concerns including cancer and organ damage. Naturally, less than 1% of soil chromium exists as Cr(VI), and it's most commonly associated with industrial activity rather than natural deposits. At concentrations above 200–300 ppm, particularly near areas with industrial history, Cr(VI) is worth being aware of—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth monitoring near industrial areas. Groundwater near industrial sites or mine tailings can contain Cr(VI), while most natural wells have negligible levels. Elevated levels above 50 µg/L in water are the kind that sometimes prompt some homeowners to look further into filtration options."
      },
      {
        "title": "Agricultural relevance",
        "body": "No nutritional role. Plants don't need chromium and most tolerate moderate levels without issue. At concentrations above 300 ppm—particularly if Cr(VI) is present—it can affect root health and slow growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable in its natural form. Cr(VI) is the form of concern environmentally—it can leach into groundwater and affect rivers, lakes, and waterways."
      },
      {
        "title": "Uses",
        "body": "Chromium is the element behind the shine in chrome bumpers and the rust-resistance in stainless steel. It shows up in paint pigments, leather tanning, and even green fireworks. It's a good reminder that the same element can be essential or harmful depending entirely on its form."
      },
      {
        "title": "Prevalence",
        "body": "Chromium is common, averaging about 102 ppm (0.0102%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Chromium was isolated in 1797 by French chemist Louis Nicolas Vauquelin, who named it after chroma—the Greek word for color—because of its vividly colored compounds."
      }
    ]
  },
  "MN": {
    "name": "Manganese",
    "symbol": "Mn",
    "atomicNumber": 25,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Ever seen an old glass bottle with a faint pinkish-purple tint? That's manganese. Tiny amounts of it were added to glass for centuries to make it clearer—but over time, sunlight turns those traces purple. So if you spot a violet-tinted bottle at an antique shop, you're looking at a little chemistry experiment that took a hundred years to finish."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Unlikely, but not impossible. Most soils hold 500–3,000 ppm manganese. Readings above 10,000 ppm can indicate manganese-rich deposits or layers that have historically been mined in certain regions. Further testing [hyperlink] is an option when levels are that far above normal."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally safe at typical levels. Soils with less than 3,000 ppm manganese aren't normally a concern. At much higher levels, prolonged exposure can affect the nervous system and organs. Dogs and grazing animals are most at risk in high-manganese areas, since they're more likely to ingest soil directly."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at elevated levels. If soil has more than about 3,000–5,000 ppm manganese, heavy rain or irrigation can push it into groundwater—especially in acidic soils, where manganese dissolves more easily. Well water above 0.05–0.3 ppm can taste metallic or leave dark stains, and levels over 1 ppm are the kind that prompt some homeowners to consider filtration. Drinking water above 0.3 ppm (300 µg/L) may cause neurological effects over time."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential in small amounts. Plants need about 200–2,000 ppm total manganese for healthy growth. Deficiency below that range can stunt crops, while soils with available manganese above 5,000–10,000 ppm may cause leaf spotting and reduced growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. Manganese is naturally abundant and doesn't pose much environmental risk under normal conditions. Soils above about 5,000 ppm may indicate industrial or mining activity. In surface water, concentrations above 0.5 ppm can affect aquatic organisms—but that's uncommon outside of disturbed or industrial sites."
      },
      {
        "title": "Uses",
        "body": "Manganese is widely used in steel alloys to increase strength and reduce brittleness. It's also a key ingredient in batteries, and farmers use manganese fertilizers to boost crop yields when soils are running low."
      },
      {
        "title": "Prevalence",
        "body": "Manganese is common, averaging about 950 ppm (0.095%) in Earth's crust. In many soils, it appears as black or brown oxides that contribute to the soil's darker color."
      },
      {
        "title": "Discovery",
        "body": "Manganese was first recognized as an element in 1774 when Johan Gottlieb Gahn isolated it from the mineral pyrolusite."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's manganese is above 3,000 ppm, your soil sample is in the company of the deep mineral-rich plains of Madhya Pradesh, India—red-brown earth between forested hills, ancient mining country where ore deposits run close to the surface, the same nutrient-dense soil that produces the region's famous wheat and soybeans. If your sample's manganese is below 500 ppm, your soil sample resembles the pale desert sands of Western Australia—sun-bleached dunes, sparse scrubland, lean earth where only the hardiest native plants take root."
      }
    ]
  },
  "FE": {
    "name": "Iron",
    "symbol": "Fe",
    "atomicNumber": 26,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Iron is the main reason Earth has a magnetic field—the planet's molten iron core acts like a giant magnet, which is also what keeps your compass pointing north and solar radiation from frying us all. Not bad for a metal that also specializes in frying fajitas."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, in uncommon cases. Soils above 80,000 ppm (8%) total iron have historically been associated with iron-rich geologic formations. Most backyard soils range from 10,000–40,000 ppm, and further testing [hyperlink] is something some homeowners could consider when levels climb well above that range."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk. Iron in soil isn't a health concern for people or pets at levels below 40,000 ppm. At higher concentrations, pets or grazing animals that regularly ingest iron-rich soil could experience stomach issues—but that's uncommon in typical backyard settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Moderate impact at high levels. In soils above 30,000 ppm, groundwater can develop rusty discoloration or a metallic taste—especially in waterlogged conditions where iron dissolves more easily. Wells in those areas sometimes show reddish sediment or iron bacteria buildup, which can clog pipes and stain fixtures."
      },
      {
        "title": "Agricultural relevance",
        "body": "Important for plant health on both ends of the spectrum. Too little iron (below 10,000 ppm) and crops can turn yellow and struggle. Too much (above 30,000–40,000 ppm)—especially in wet, acidic soils where iron dissolves more readily—and plants can experience toxicity or reduced growth. Iron-rich clays tend to sit on the higher end of that range."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally low concern. Iron is one of the more benign elements at typical soil levels. At very high concentrations (above 50,000 ppm), iron-rich runoff can deplete oxygen in nearby streams and stress freshwater life. Levels above 60,000 ppm have sometimes been associated with mining activity or heavy sedimentation."
      },
      {
        "title": "Uses",
        "body": "Iron is the backbone of steel—used in everything from buildings to bridges to butter knives. It's also in your blood (hemoglobin uses it to carry oxygen) and your plants (it helps make chlorophyll). You'll even find it in cast iron skillets, magnets, and the rust-colored pigments in paints and ceramics."
      },
      {
        "title": "Prevalence",
        "body": "Iron is abundant, averaging about 56,300 ppm (5.63%) in Earth's crust—behind only oxygen, silicon, and aluminum in overall concentration."
      },
      {
        "title": "Discovery",
        "body": "Iron has been used by humans for thousands of years—ancient civilizations smelted it from ore, and even earlier, people fashioned tools and jewelry from meteoric iron that fell from space."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's iron is between 20,000 and 35,000 ppm, your soil sample is in the range of central Brazil's red clay country—vivid soil, dirt roads that stain everything rust-red, the same iron-rich earth that produces Brazil's famous coffee and sugarcane. Above 35,000 ppm, your soil sample's iron level is in the league of Australia's Pilbara region—sun-scorched plains blazing red-orange, ancient rock formations jutting from the earth, the ground so iron-rich it's been mined for decades, harsh land where only the toughest native spinifex grass takes root. Between 8,000 and 15,000 ppm, your sample's iron levels are right about where you'd find the agricultural heartland of northern France—soft green fields, centuries-old stone farmhouses, the same mineral soil that produces Normandy's famous Camembert and the apples behind its golden cidre. If your sample's iron is above 30,000 ppm and titanium is above 5,000 ppm, your soil sample's combination is in the vivid range of Mount Etna in Sicily—steep hillsides of black volcanic soil streaked with rust-red, citrus groves clinging to the slopes, the same fierce mineral earth that grows sweet blood oranges as well as the grapes behind bold Etna Rosso wines. If your sample's iron is below 20,000 ppm and titanium is below 5,000 ppm, your soil sample is on the gentler end, similar to the Carpathian foothills of Romania—the mineral variety beneath the surface showing up in subtle browns and grays rather than dramatic reds, pastoral soil where maize and orchard fruit have grown for generations."
      }
    ]
  },
  "CO": {
    "name": "Cobalt",
    "symbol": "Co",
    "atomicNumber": 27,
    "sections": [
      {
        "title": "Fun fact",
        "body": "For centuries, glassmakers and potters prized a mysterious deep blue pigment without knowing what actually caused it—most assumed it was bismuth or copper. Turns out, the color came from cobalt, an element nobody had identified yet. The blue was so iconic that the word \"cobalt\" eventually became a color name itself."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Unlikely, but not impossible. Normal soils range from about 1 to 40 ppm. If soil exceeds 500 ppm, it may reflect naturally concentrated cobalt—sometimes a sign of cobalt-rich rock below the surface. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally safe at typical levels, but worth noting at elevated ones. Cobalt is essential for human and animal health in tiny amounts, but overexposure can cause fatigue in people and heart or thyroid problems in animals over time. Below about 50 ppm, soil contact isn't considered a concern."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. In soils with cobalt above 300–500 ppm—especially acidic or sandy soils—rain can slowly leach cobalt into groundwater. If levels reach 0.05–0.1 ppm, they may exceed some drinking water guidelines, though that's uncommon."
      },
      {
        "title": "Agricultural relevance",
        "body": "Helpful in small amounts. Cobalt supports nitrogen fixation in legumes and is essential for grazing animals, which need trace amounts to produce vitamin B12. Above about 50 ppm, cobalt can become toxic to plants and soil organisms."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. The main risk comes from mining and smelting, which can release cobalt (and sometimes arsenic) into surrounding soil and water. Cobalt that dissolves into waterways can be toxic to aquatic life. Soils above 500 ppm may indicate contamination from mining, smelting, or industrial waste."
      },
      {
        "title": "Uses",
        "body": "Cobalt powers the rechargeable batteries in your phone and laptop, strengthens the alloys in jet engines, and makes some of the most powerful magnets around. It's also part of vitamin B12—the vitamin that keeps your blood and nerves healthy."
      },
      {
        "title": "Prevalence",
        "body": "Cobalt is uncommon, averaging about 25 ppm (0.0025%) in Earth's crust—often found alongside nickel, copper, and iron ores."
      },
      {
        "title": "Discovery",
        "body": "Cobalt was isolated in 1735 by Swedish chemist Georg Brandt, who proved that the mysterious blue color in glass came from a new element—not bismuth or copper, as most believed."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's cobalt is above 50 ppm, your soil sample is in the company of Zambia's Copperbelt—wide savanna stretching over ancient mineral veins, red-orange earth rich with copper and cobalt, open-pit mines carved into the plateau, the same mineral-heavy soil that grows maize and groundnuts across the surrounding farmland. If your sample's cobalt is below 25 ppm, your soil sample's levels are mild—like the coastal soils of Scotland, soft green hillsides meeting rocky shoreline, the peaty, acidic earth that shapes the region's famous single malt Scotch."
      }
    ]
  },
  "NI": {
    "name": "Nickel",
    "symbol": "Ni",
    "atomicNumber": 28,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Some of Earth's oldest meteorites are packed with nickel—so much that scientists use nickel content to tell the difference between a space rock and an ordinary one. Every time a nickel-iron meteorite crashes to Earth, it's delivering metal forged inside a dying star. Pretty cool origin story for something that ends up in your spare change."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Typical soil levels run 20–100 ppm, so readings above 1,000–2,000 ppm are well above normal and could indicate mineral-bearing rock or old volcanic deposits. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Worth noting at elevated levels. Below about 200 ppm, nickel isn't normally a concern. Above that, it can cause allergic skin reactions in people and liver or kidney stress in animals that ingest soil or contaminated plants. Dust with high nickel content is also considered harmful, though that's mainly an industrial concern."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. When soil nickel exceeds 300–500 ppm, especially in acidic soils, it can leach into groundwater. Well water containing more than 0.1 ppm nickel may have a metallic taste or exceed recommended limits for sensitive groups."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential, but only in tiny amounts. Soils below about 1–3 ppm of available nickel may cause mild plant deficiency, while concentrations above 500 ppm can cause stunted growth or leaf burn."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. Nickel mining can contaminate surrounding soil and water, and dissolved nickel above 0.2 ppm in runoff can harm aquatic life. Soils with over 500 ppm nickel may indicate industrial or mining activity rather than natural occurrence."
      },
      {
        "title": "Uses",
        "body": "Nickel is a key ingredient in stainless steel, rechargeable batteries, and rust-resistant plating. It's also used as a catalyst to make margarine—and if you've ever gotten a rash from cheap jewelry, you've already met nickel up close."
      },
      {
        "title": "Prevalence",
        "body": "Nickel is uncommon, averaging about 84 ppm (0.0084%) in Earth's crust—though it's far more abundant in meteorites and in Earth's core."
      },
      {
        "title": "Discovery",
        "body": "Nickel was discovered in 1751 by Axel Fredrik Cronstedt, who isolated it from a reddish ore that frustrated miners had nicknamed \"kupfernickel\"—literally \"copper demon\"—because it looked like copper but wasn't."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's nickel is above 250 ppm, your soil sample is in the company of Sulawesi, Indonesia—volcanic island earth enriched by deep mantle processes, dense tropical forest draped over mineral-rich ridgelines, the same volcanic soil that produces some of the world's most distinctive coffee and cacao. If your sample's nickel is below 25 ppm, your soil sample's levels are quiet—like the farmlands of Denmark, flat green fields, the steady earth that produces root vegetables and Danish barley (much of which ends up in the country's famous lager)."
      }
    ]
  },
  "CU": {
    "name": "Copper",
    "symbol": "Cu",
    "atomicNumber": 29,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Copper kills bacteria on contact—within hours, most germs that land on a copper surface are dead. That's why some hospitals have switched to copper doorknobs, railings, and bed rails. It's one of the few metals that's been fighting infections longer than modern medicine has."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Sometimes. Normal soils contain about 10–100 ppm copper. Readings above 1,000 ppm are well above typical and can indicate copper-rich rock formations—sometimes accompanied by blue or green mineral discoloration in the surrounding geology. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally safe at typical levels, but worth noting above about 200 ppm. Copper is essential to life in trace amounts, but at elevated concentrations it can affect the liver in pets and livestock and cause stomach irritation in people."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. If soil copper exceeds 300–500 ppm, it can slowly leach into groundwater—especially in acidic soils or near mining waste. Water above 1 ppm copper may develop a metallic taste or cause blue-green staining in plumbing."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential micronutrient. Copper helps with plant growth and seed production. Deficiency can occur when available copper drops below about 0.5 ppm, while toxicity can develop in soils above 100–200 ppm total copper."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. Soil copper above 200–400 ppm may indicate past contamination from fungicides, mining dust, or industrial activity. Runoff containing more than 0.02 ppm dissolved copper can harm fish and other aquatic life."
      },
      {
        "title": "Uses",
        "body": "Copper was one of the first metals humans ever worked with—the \"Copper Age\" started thousands of years before bronze or iron. Today it's everywhere: electrical wiring, plumbing, coins, and the green patina on the Statue of Liberty is copper reacting with air over time."
      },
      {
        "title": "Prevalence",
        "body": "Copper is uncommon, averaging about 60 ppm (0.006%) in Earth's crust—but common enough that copper mining has supported civilizations for millennia."
      },
      {
        "title": "Discovery",
        "body": "Copper has been known since antiquity—its name comes from the Latin cyprium, meaning \"metal from Cyprus,\" which was once a major copper source."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's copper is above 300 ppm, your soil sample is in the company of Chile's Atacama Desert—rust-colored mountains rising above salt flats, veins of copper running through ancient rock, arid land where the mineral-rich runoff feeds the vineyards of the nearby Elqui Valley. If your sample's copper is between 150 and 300 ppm, your soil sample resembles the highland soils of Greece—hillsides dotted with olive groves and wild thyme, rocky slopes where ancient miners once extracted copper for early tools, the same thin, mineral-rich earth that produces some of the world's oldest olive oil. Below 25 ppm, your sample's copper levels are sparse like the deep Sahara Desert—mineral-poor sand shaped by wind rather than water, earth too lean without minerals like copper to support much beyond the hardiest desert scrub. If your sample's copper is above 200 ppm and zinc is above 150 ppm, that copper-zinc combination puts your soil sample in the neighborhood of the elevated Andean soils of Peru—terraced mountainsides, lush green valleys, the same high-altitude earth that's been growing quinoa and potatoes for thousands of years."
      }
    ]
  },
  "ZN": {
    "name": "Zinc",
    "symbol": "Zn",
    "atomicNumber": 30,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Zinc is one of those elements that's quietly holding everything together. Without it, your immune system can't fight off a cold, your skin can't heal a cut, and—here's the fun part—you literally can't taste or smell anything. Lose enough zinc and food turns into cardboard. That's a powerful element for something most people have never thought about."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Most soils contain 30–300 ppm zinc. Readings above 5,000 ppm are unusually high and may indicate zinc-rich rock formations or a geologic history of mineral concentration. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally safe at typical levels. Zinc in soil below about 300 ppm isn't normally a concern. Above that, ingestion can cause nausea or vomiting in people, pets, and wildlife—though reaching harmful exposure from soil alone is uncommon."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. Zinc can leach into groundwater if soil levels exceed 1,000–2,000 ppm, especially in acidic conditions. Well water above about 2 ppm zinc may taste metallic or leave deposits in plumbing."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential nutrient. Soils with zinc below about 10 ppm may limit crop yields, while levels above 300 ppm can harm sensitive plants and reduce helpful microbial activity in the soil."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. Zinc concentrations above 1,000 ppm in soil may reflect industrial or mining activity. Runoff with more than 0.12 ppm dissolved zinc can harm fish and aquatic organisms."
      },
      {
        "title": "Uses",
        "body": "Zinc is the reason steel doesn't rust—galvanizing coats it in a layer of zinc that takes the hit instead. It's also used to make brass and batteries, and zinc oxide is a key ingredient in sunscreen, rubber, and cosmetics."
      },
      {
        "title": "Prevalence",
        "body": "Zinc is uncommon, averaging about 70 ppm (0.007%) in Earth's crust—though common enough that zinc mining is a global industry."
      },
      {
        "title": "Discovery",
        "body": "Brass (a copper-zinc alloy) was used in ancient times, but pure zinc wasn't isolated until 1746 by Andreas Marggraf in Germany."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into any of these famous ranges? If your sample's zinc is above 200 ppm, your soil sample is in the company of the fertile plains of northern India—golden fields between river deltas, alluvial soil darkened by monsoon rains, the same nutrient-dense earth that produces the region's famous basmati rice and wheat. If your sample's zinc is below 50 ppm, your soil sample resembles the sandy soils of Finland—birch forests rising above pale, glacially scraped earth, lean soil where hardy rye and wild berries are among the few things that flourish. If your sample's copper is above 200 ppm and zinc is above 150 ppm, that copper-zinc combination puts your soil sample in the neighborhood of the elevated Andean soils of Peru—terraced mountainsides, lush green valleys, the same high-altitude earth that's been growing quinoa and potatoes for thousands of years."
      }
    ]
  },
  "GA": {
    "name": "Gallium",
    "symbol": "Ga",
    "atomicNumber": 31,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Gallium is such a soft metal that it can melt in your hand—its melting point is only about 86°F (30°C). Scientists even like to use it for pranks, making gallium spoons that melt in hot tea. Chemistry pranks at their finest."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially. Typical soils contain just 5–20 ppm gallium, which is far too low for extraction. If levels exceed about 50–100 ppm, it could suggest aluminum- or zinc-rich deposits nearby, since gallium is often recovered as a byproduct from those materials. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally harmless at typical levels. Gallium in soil below 50 ppm isn't a concern. At higher levels, it's considered mildly toxic and could irritate the stomach or liver in animals or people that ingest soil directly—but that's uncommon outside industrial settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Gallium doesn't easily dissolve or move through soil, so it's very unlikely to affect groundwater. Even at elevated levels (above 50 ppm), leaching into well water is negligible—groundwater concentrations almost always stay below 0.001 ppm."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Gallium isn't considered essential for plants, though some crops like tomatoes may absorb trace amounts. At typical soil levels, it's harmless to crops, livestock, and soil organisms."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern at natural levels. Gallium itself isn't considered an environmental hazard in soil. The main risk comes from industrial extraction of aluminum or zinc ores, which can produce waste that affects surrounding soil and water."
      },
      {
        "title": "Uses",
        "body": "Gallium is a key ingredient in the semiconductors found in LEDs, lasers, smartphones, and military radar. It also shows up in high-temperature thermometers and certain medical imaging equipment."
      },
      {
        "title": "Prevalence",
        "body": "Gallium is uncommon, averaging about 19 ppm (0.0019%) in Earth's crust—typically scattered in small amounts within aluminum and zinc ores rather than found in concentrated deposits."
      },
      {
        "title": "Discovery",
        "body": "Gallium was discovered in 1875 by French chemist Paul-Émile Lecoq de Boisbaudran—one of the first elements predicted by Mendeleev's periodic table (he called it \"eka-aluminum\") before it was actually found."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's gallium is above 30 ppm, your soil sample is in the range of the red bauxite hills of Jamaica—deep rust-colored earth carved into rolling ridges by tropical rain, lush green vegetation, the same aluminum-rich soil that produces Jamaica's world-famous Blue Mountain coffee."
      }
    ]
  },
  "GE": {
    "name": "Germanium",
    "symbol": "Ge",
    "atomicNumber": 32,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Germanium looks like a dull, grayish metal—but it's transparent to infrared light, which means it can \"see\" heat. That's why night-vision goggles use germanium lenses to spot warm bodies in total darkness. A metal you can see through. That's not supposed to be a thing."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possible, but only under very specific circumstances. Most soils contain just 1–5 ppm germanium. If levels reach 50–100 ppm or more, it could indicate nearby zinc, copper, or coal deposits where germanium sometimes occurs as a byproduct. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Germanium at natural soil levels (1–5 ppm) isn't a concern for people, pets, or wildlife. At much higher concentrations—above about 100 ppm—prolonged exposure has been linked to kidney and nerve damage, but those levels are uncommon outside industrial or mining settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Germanium binds strongly to soil minerals and rarely dissolves into groundwater. Even in highly enriched soils (above 50 ppm), leaching is negligible—groundwater levels typically stay well below 0.001 ppm."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Germanium isn't considered essential for plants or animals, though plants do absorb small amounts. At elevated levels above about 100 ppm, it can interfere with soil fertility and crop growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern at natural levels. Germanium itself doesn't pose environmental risk in soil. The main concern comes from mining and refining germanium-rich ores, which can release metals and acids into surrounding water systems."
      },
      {
        "title": "Uses",
        "body": "Germanium is used in fiber optic cables for high-speed internet, night-vision goggles and infrared cameras, and specialized solar cells. It also shows up in high-quality lenses and semiconductors for electronics."
      },
      {
        "title": "Prevalence",
        "body": "Germanium is rare, averaging about 1.5 ppm (0.00015%) in Earth's crust—typically found in small amounts within zinc and copper ores or in coal beds rather than in concentrated deposits."
      },
      {
        "title": "Discovery",
        "body": "Germanium was discovered in 1886 by Clemens Winkler, who named it after his homeland of Germany—it was one of the first elements Mendeleev had predicted on his periodic table before anyone had found it."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's germanium is above 5 ppm, your soil sample is in the range of Japan's volcanic hot-spring country—steam rising from mineral-rich earth, terraced hillsides lush with green, geothermal waters depositing rare trace elements as they cool, the same soil that produces Japan's prized short-grain rice and delicate matcha tea."
      }
    ]
  },
  "AS": {
    "name": "Arsenic",
    "symbol": "As",
    "atomicNumber": 33,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Arsenic has a dark reputation as \"inheritance powder,\" history's favorite poison. And yet, it turns up naturally in rice—one of the world's most consumed foods."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No—arsenic in soil is generally considered a contaminant rather than a resource. It does have industrial uses (wood preservatives, semiconductors, and certain pesticides), but those rely on refined arsenic from mining operations, not soil concentrations. For context, most soils naturally contain 1–10 ppm arsenic. Commercially mined arsenic ores typically run 2,000–20,000+ ppm—and at anything approaching those levels, the health and environmental concerns would be overwhelming. Arsenic is one of those elements where the liability far outweighs any theoretical extraction value."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes—arsenic is one of the most well-known heavy metal concerns in soil. Natural background levels are typically below 15 ppm. Notably, the U.S. Environmental Protection Agency (EPA) sets its screening level at 0.14 ppm—below what's found in many natural soils. That doesn't mean most soil is dangerous; it means arsenic is an element regulators take seriously even at low levels—[hyperlink] has more on what that means. Long-term exposure through dust or groundwater to arsenic has been linked to health concerns."
      },
      {
        "title": "Impact on water quality",
        "body": "Possible. Arsenic can dissolve into groundwater under certain conditions—especially in soils with high iron or a history of pesticide use. The EPA's limit for drinking water is 0.01 mg/L. Levels above 10–20 ppm are the kind that may prompt some homeowners to test nearby well water."
      },
      {
        "title": "Agricultural relevance",
        "body": "At elevated levels, arsenic can affect crop health—plants often begin to show stress in the hundreds of ppm range. Plants grown in high-arsenic soils can absorb small amounts, particularly rice and leafy greens. Levels above 20 ppm may produce food unsafe to eat if left untreated for some time."
      },
      {
        "title": "Environmental considerations",
        "body": "Arsenic in soil often traces back to historical pesticide use, mining, or industrial activity—though it also occurs naturally in many regions. It binds to iron in soil but can be released when flooded or disturbed. Therefore, at concentrations above 20–40 ppm, it can threaten helpful soil organisms and local wildlife. Concentrations above 100 ppm tend to need cleanup for residential use."
      },
      {
        "title": "Uses",
        "body": "Arsenic has a complicated history of uses. It is infamous for its toxicity to people, plants, and animals. In the 1800s, it was used to make a vivid green pigment called Scheele's Green—which looked stunning but slowly poisoned anyone around it. It was also historically used in pesticides and wood preservatives, most of which are banned today. It still shows up in semiconductors and some metal alloys."
      },
      {
        "title": "Prevalence",
        "body": "Arsenic is rare, averaging about 1.8 ppm (0.00018%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Arsenic has been known since antiquity, but was first isolated as an element around 1250 by Albertus Magnus."
      }
    ]
  },
  "SE": {
    "name": "Selenium",
    "symbol": "Se",
    "atomicNumber": 34,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Selenium is named after the Greek word for \"moon\"—and like the moon, a little goes a long way. Your body needs trace amounts of selenium to function, but just a bit too much and it becomes toxic. In parts of the American West, selenium-rich soil has caused livestock to lose their hooves and hair—a condition ranchers grimly named \"alkali disease.\" It's one of the narrowest lines between essential and dangerous in all of chemistry."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Unlikely. Selenium is typically recovered as a byproduct of copper refining, not directly from soil. If levels exceed about 10 ppm, it could suggest selenium-rich mineral formations nearby, but most soils fall between 0.1–2 ppm—far too low for extraction."
      },
      {
        "title": "Is it toxic?",
        "body": "Essential in trace amounts, but toxic at elevated levels. Selenium in soil around 0.5–2 ppm is generally safe and even beneficial. Above about 5 ppm, prolonged exposure can cause many health issues in humans and livestock."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at elevated levels. When soils exceed 5–10 ppm selenium—especially in arid or alkaline conditions—it can leach into groundwater or irrigation channels. Groundwater above 0.05 ppm may pose health concerns, and levels that high sometimes prompt homeowners to look into filtration options."
      },
      {
        "title": "Agricultural relevance",
        "body": "Important for livestock nutrition, but a narrow window. Selenium isn't required by plants, but animals need it through the crops they eat. Soils below 0.1 ppm can cause dietary deficiencies in grazing livestock, while those above 5 ppm can make forage toxic."
      },
      {
        "title": "Environmental considerations",
        "body": "Worth watching at elevated levels. Selenium above 5 ppm in soil or 0.005 ppm in water can bioaccumulate in aquatic organisms, and in farming regions, runoff carrying selenium into wetlands has been linked to reproductive issues in birds and fish."
      },
      {
        "title": "Uses",
        "body": "Selenium is used in solar panels, photocopiers, and glassmaking—it's what gives some glass that deep red color. It also shows up as a dietary supplement in trace amounts and in specialized steels to improve machining."
      },
      {
        "title": "Prevalence",
        "body": "Selenium is very rare, averaging only about 0.05 ppm (0.000005%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Selenium was discovered in 1817 by Swedish chemist Jöns Jakob Berzelius while analyzing chemicals from a sulfuric acid plant."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's selenium is above 3 ppm, your soil sample is in the range of China's Enshi Basin—mountain valleys in central Hubei province, dark mineral-rich earth that's among the most selenium-concentrated in the world, the same soil that produces the region's prized selenium-rich tea and high-mineral rice."
      }
    ]
  },
  "BR": {
    "name": "Bromine",
    "symbol": "Br",
    "atomicNumber": 35,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Bromine is the only nonmetal element that's liquid at room temperature—a dark, reddish-brown liquid that gives off a smell so foul its name literally comes from the Greek word for \"stench.\" In ancient times, though, bromine compounds were prized for producing Tyrian purple, the legendary dye reserved for royalty. From stink to status symbol—not many elements can claim that range."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially, in certain geological settings. Typical soils contain just 1–5 ppm bromine—far too low for practical recovery. Bromine becomes economically interesting when concentrations exceed about 100 ppm in brines or mineral layers left behind by evaporated water. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally safe at typical levels. Bromine in soil below 100 ppm isn't a concern. Above about 200 ppm, frequent contact can irritate skin and eyes. At very high levels, prolonged bromide exposure has been linked to neurological symptoms including confusion and disorientation—a condition historically known as \"bromism\"—though that's associated with ingestion, not soil contact."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. In soils with high salt or brine content—above about 50 ppm bromide—heavy rainfall or irrigation can allow bromide to move into groundwater. Well water above 5–10 ppm bromide may affect water treatment safety and taste."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants. Small amounts of bromide in soil are harmless, but concentrations above 50–100 ppm can reduce crop growth by increasing salinity stress, especially in dry regions or irrigated farmland."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable at natural levels. Bromine itself doesn't pose much environmental risk in soil, but brominated industrial compounds (like old fumigants or flame retardants) can persist and bioaccumulate. Natural soils above 50 ppm may indicate marine influence, while concentrations above 100 ppm sometimes prompt a closer look at saltwater intrusion or legacy chemical use."
      },
      {
        "title": "Uses",
        "body": "Bromine compounds are used in flame retardants, water treatment, drilling fluids, and certain pharmaceuticals. It was also once a key additive in leaded gasoline to reduce engine deposits—a practice now banned worldwide."
      },
      {
        "title": "Prevalence",
        "body": "Bromine is rare in solid earth, averaging about 2.4 ppm (0.00024%) in Earth's crust—though it's much more common in seawater and salt deposits."
      },
      {
        "title": "Discovery",
        "body": "Bromine was discovered in 1826 by French chemist Antoine Balard while studying salt marsh brines."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's bromine is above 200 ppm, your soil sample is in the range of Bolivia's Salar de Uyuni—the world's largest salt flat, a blinding white expanse stretching to the horizon, mineral crusts cracking underfoot in geometric patterns, ancient lakebed earth so saturated with salts that nothing grows on its surface."
      }
    ]
  },
  "RB": {
    "name": "Rubidium",
    "symbol": "Rb",
    "atomicNumber": 37,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Rubidium is so precise that atomic clocks built around it won't lose a single second in millions of years. That's the kind of timekeeping that makes your phone's clock look like a sundial. It also explodes in purple flames if you drop it in water—so it's punctual and dramatic."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Rarely. Most soils contain 30–100 ppm rubidium, which isn't commercially interesting. Soils above 500–1,000 ppm could indicate nearby rubidium- or lithium-rich rock formations. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally harmless. Rubidium in soil below 500 ppm isn't a concern for people, pets, or wildlife. At extreme levels (above 1,000 ppm), it could disrupt potassium balance in people or grazing animals—but concentrations that high are uncommon."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Rubidium behaves much like potassium, meaning that in soils above 200 ppm, trace amounts could leach into groundwater during heavy rain. Even then, groundwater levels almost always stay below 0.01 ppm—far below any health or taste concern."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Rubidium doesn't have a biological function in plants, though it can sometimes substitute for potassium without causing harm. Soils above about 300 ppm might show minor nutrient imbalance, but that's rare and generally not a problem for crops."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Rubidium is generally stable and environmentally safe in soil. It doesn't bioaccumulate or pose known risks to aquatic life at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "Rubidium shows up in specialty glasses, photoelectric cells, and fireworks—it's responsible for that deep purple color. It's also being studied for medical imaging and ion engines for spacecraft."
      },
      {
        "title": "Prevalence",
        "body": "Rubidium is uncommon, averaging about 90 ppm (0.009%) in Earth's crust—it often substitutes for potassium in common rock-forming minerals."
      },
      {
        "title": "Discovery",
        "body": "Rubidium was discovered in 1861 by Robert Bunsen and Gustav Kirchhoff using spectroscopy, and named after the Latin word rubidus (\"deep red\") for its distinctive red spectral lines."
      }
    ]
  },
  "SR": {
    "name": "Strontium",
    "symbol": "Sr",
    "atomicNumber": 38,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Strontium is named after Strontian, a tiny village in the Scottish Highlands where the element was first found in local rocks. It's one of the few elements named after a place so small you could drive through it without noticing. The element, however, is hard to miss—it's what puts the brilliant red in fireworks."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though it's uncommon. Normal soils hold around 100–400 ppm strontium. If levels exceed 1,000 ppm, it could indicate ancient marine layers that have historically been associated with strontium-bearing mineral formations. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Strontium below 500 ppm isn't a concern for people, pets, or wildlife. Above about 1,000 ppm, strontium can begin to substitute for calcium in bones, which may mildly affect long-term bone health with prolonged exposure."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at elevated levels. Strontium can leach from carbonate or marine sediments into groundwater. If soil readings are above 1,000 ppm, some homeowners choose to test their well water—the U.S. Environmental Protection Agency (EPA) sets its advisory level for strontium at 4 ppm in drinking water."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants. Strontium doesn't play a role in plant nutrition, and at typical levels it's harmless. Above about 500 ppm, it can compete with calcium uptake in crops, especially in alkaline soils."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern for naturally occurring strontium. Stable strontium in soil is generally harmless. The notable exception is strontium-90, a radioactive isotope produced by nuclear fallout—it can enter the food chain and accumulate in bones and teeth. Natural soils are unlikely to contain it unless contaminated by nuclear testing or accidents."
      },
      {
        "title": "Uses",
        "body": "Strontium compounds show up in magnets, ceramics, and specialty glass. Radioactive strontium isotopes have been used as power sources for remote devices and in medical research."
      },
      {
        "title": "Prevalence",
        "body": "Strontium is common, averaging about 370 ppm (0.037%) in Earth's crust—especially concentrated in marine environments where shells and coral reefs form from strontium-rich minerals."
      },
      {
        "title": "Discovery",
        "body": "Strontium was discovered in 1790 by Adair Crawford and William Cruickshank in minerals from the Scottish Highlands."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's strontium is above 300 ppm, your soil sample is in the range of the coral shores of the Caribbean—white sand built from centuries of crushed shells and reef, limestone bluffs, mineral-rich coastal earth where coconut palms and sugarcane thrive in the calcium- and strontium-heavy ground."
      }
    ]
  },
  "Y": {
    "name": "Yttrium",
    "symbol": "Y",
    "atomicNumber": 39,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Yttrium is named after Ytterby, a tiny Swedish village with a single quarry that somehow managed to lend its name to four different elements. For a hamlet most people couldn't find on a map, that's an outsized contribution to the periodic table."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, if levels are exceptionally high. Normal soils contain about 20–50 ppm yttrium. Readings above 300 ppm could indicate rare-earth-rich clays or heavy mineral deposits. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Yttrium is considered low in toxicity. Natural concentrations under 100 ppm generally pose no known health risk to people, pets, or wildlife. At much higher levels, it may cause mild irritation if inhaled as dust, but that's primarily an industrial concern."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Yttrium stays locked in soil minerals and doesn't dissolve readily, so it's unlikely to affect groundwater even at elevated levels."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Yttrium has no biological function in plants or animals and doesn't affect soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Yttrium itself is stable and non-hazardous in soil. The main environmental issues associated with it relate to rare-earth mining processes rather than the element's behavior in the ground."
      },
      {
        "title": "Uses",
        "body": "Yttrium helps make your TV and phone screens glow red. Without it, LED lights and displays wouldn't look nearly as colorful. It's also used in lasers and tough alloys that can handle extreme heat."
      },
      {
        "title": "Prevalence",
        "body": "Yttrium is uncommon, averaging about 33 ppm (0.0033%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Yttrium was discovered in 1794 by Johan Gadolin in a mineral from Ytterby, Sweden."
      }
    ]
  },
  "ZR": {
    "name": "Zirconium",
    "symbol": "Zr",
    "atomicNumber": 40,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Zirconium might sound exotic, but if you've ever seen a fake diamond, you've probably already met it—cubic zirconia is made from zirconium oxide and sparkles convincingly enough to fool most people. It's also one of the few metals trusted inside nuclear reactors, which means zirconium's range runs from engagement rings to atomic energy. Versatile doesn't quite cover it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Most soils contain 100–300 ppm zirconium. Levels above 1,000 ppm can indicate heavy mineral sands rich in zircon, which is sometimes mined for industrial use. Zircon crystals are also occasionally valued as natural gemstones. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Zirconium is considered non-toxic to people, pets, and wildlife at natural soil levels (under 500 ppm). Even at much higher concentrations, it's generally chemically inert and poses no known health risk."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Zirconium doesn't dissolve easily, so it rarely affects groundwater. Only soils above 1,000 ppm near active mining or industrial sites would have any measurable impact on water quality."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Zirconium doesn't influence plant growth or soil health, even at elevated levels. It's essentially inert in agricultural settings."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Naturally occurring zirconium is stable and environmentally safe. The main consideration is that mining zircon-rich sands can sometimes release trace radioactive elements like thorium or uranium if they're present in the deposit."
      },
      {
        "title": "Uses",
        "body": "Zirconium metal shows up in surgical instruments, jet engines, and heat-resistant ceramics. Zircon sand is widely used in foundries and glazes—and zirconium carbonate has even been used to treat poison ivy."
      },
      {
        "title": "Prevalence",
        "body": "Zirconium is uncommon, averaging about 165 ppm (0.0165%) in Earth's crust—often found in heavy mineral sands and granitic rocks where zircon crystals are widespread."
      },
      {
        "title": "Discovery",
        "body": "Zirconium was first identified in 1789 by German chemist Martin Heinrich Klaproth while analyzing the gemstone zircon."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your sample's zirconium is above 300 ppm, your soil sample is in the range of the golden beaches of Western Australia—sun-bleached sand glittering with tiny zircon crystals, mineral-heavy coastal earth where hardy native scrub and salt-tolerant grasses hold the dunes together."
      }
    ]
  },
  "NB": {
    "name": "Niobium",
    "symbol": "Nb",
    "atomicNumber": 41,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Niobium is one of those elements that sounds like it belongs in a sci-fi movie—and it kind of does. It's a key ingredient in superconducting magnets, including the ones used in particle accelerators to smash atoms together at nearly the speed of light. It was originally called \"columbium,\" and the naming debate between American and European chemists lasted over a hundred years before niobium finally won."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially, but only at high concentrations. Typical soils contain less than 50 ppm niobium. If levels exceed 200–500 ppm, it may indicate the presence of niobium-tantalum minerals, which are sometimes mined when concentrated enough. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "No. Niobium is generally non-toxic at natural soil levels. Even at several hundred ppm, it poses no known health risk to people, pets, or wildlife because it's poorly absorbed by the body."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Niobium doesn't dissolve easily in water and rarely affects groundwater quality. Only soils with extremely high concentrations near mining operations would have any measurable impact."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Niobium doesn't influence plant growth or interfere with nutrient uptake, even at elevated soil concentrations. It's essentially inert in agricultural settings."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern at natural levels. Niobium itself is stable and environmentally safe. Soils above 500 ppm may indicate underlying mineral zones where mining activity could disturb ecosystems or expose companion elements like tantalum or uranium."
      },
      {
        "title": "Uses",
        "body": "Niobium is used in high-strength steels, jet turbines, and special welding rods. It's also prized by jewelry makers for its colorful anodized finish—niobium can be shocked with electricity to shift colors from blue to purple to gold."
      },
      {
        "title": "Prevalence",
        "body": "Niobium is uncommon, averaging about 20 ppm (0.002%) in Earth's crust—though concentrated deposits exist and are actively mined."
      },
      {
        "title": "Discovery",
        "body": "Niobium was first identified in 1801 by Charles Hatchett in a mineral sample sent from Connecticut to the British Museum."
      }
    ]
  },
  "MO": {
    "name": "Molybdenum",
    "symbol": "Mo",
    "atomicNumber": 42,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Without molybdenum, the bacteria in plant roots that pull nitrogen out of thin air and turn it into fertilizer would stop working—and a huge chunk of global agriculture would collapse. All that from an element most people have never heard of, forged inside exploding stars and delivered to Earth by ancient meteorites."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, if levels are unusually high. Most soils contain less than 2 ppm molybdenum. Readings above 10–20 ppm could indicate molybdenum-rich rock formations—the main source of industrial molybdenum used in steel and alloys. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally low-risk at natural levels. Molybdenum in soil isn't typically harmful to people, pets, or wildlife. However, prolonged exposure above about 40 ppm—through drinking water or dust—can interfere with copper absorption, leading to copper deficiency symptoms over time."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting in alkaline soils. Molybdenum can move through alkaline soil into groundwater. If soil measures above 10 ppm, some homeowners consider testing nearby well water—concentrations above 0.04 ppm (40 µg/L) can exceed safe drinking water guidelines."
      },
      {
        "title": "Agricultural relevance",
        "body": "Essential in tiny amounts, especially for legumes. Soils with less than 0.1 ppm can cause crop deficiency, while those above 5 ppm can lead to excess uptake by forage plants—which in turn can cause health issues in grazing livestock."
      },
      {
        "title": "Environmental considerations",
        "body": "Low concern at natural levels. When soils exceed 10–20 ppm, molybdenum can leach into waterways and affect grazing ecosystems, especially where runoff enters ponds or wetlands."
      },
      {
        "title": "Uses",
        "body": "Molybdenum is used in stainless steel, jet and missile alloys, industrial lubricants, and catalysts for the chemical and fuel industries. It also shows up in electronics and as a pigment."
      },
      {
        "title": "Prevalence",
        "body": "Molybdenum is rare, averaging about 1.2 ppm (0.00012%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Molybdenum was identified in 1778 and isolated in 1781 by Swedish chemist Peter Jacob Hjelm—its name comes from the Greek molybdos (\"lead-like\") because it was often confused with lead ores."
      }
    ]
  },
  "TC": {
    "name": "Technetium",
    "symbol": "Tc",
    "atomicNumber": 43,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Technetium is famous for being the first element humans made in a lab before ever finding it in nature. Its name comes from the Greek word technetos, meaning \"artificial.\" It doesn't stick around for long, though—all of its isotopes are radioactive, so any technetium that existed when Earth formed has long since decayed away."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Technetium doesn't occur naturally in measurable amounts. Any trace found in a soil sample would almost certainly come from man-made radioactive sources like nuclear waste or fallout."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes. Even tiny quantities can be hazardous if inhaled or ingested, due to beta radiation exposure. Natural soils, however, contain virtually zero technetium—so this is only a concern in contamination scenarios."
      },
      {
        "title": "Impact on water quality",
        "body": "Only relevant in contamination scenarios. If technetium were present at detectable levels, it could easily migrate through soil into groundwater because it's highly soluble. In natural soils, this isn't a concern."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Technetium has no known role in plant or animal biology and is unsafe for biological systems if contamination occurs."
      },
      {
        "title": "Environmental considerations",
        "body": "Detectable technetium in a soil sample is unusual and generally indicates a contamination event rather than natural occurrence. Even low radioactivity readings above background are the kind that typically prompt professional assessment and regulatory attention."
      },
      {
        "title": "Uses",
        "body": "Technetium-99m is widely used in nuclear medicine for imaging and diagnostics—it's one of the most commonly used radioactive tracers in hospitals worldwide. Other isotopes have been used in research and specialized industrial equipment."
      },
      {
        "title": "Prevalence",
        "body": "Technetium is essentially absent from Earth's crust because all of its isotopes decay too quickly to persist. The only naturally occurring technetium is produced in trace amounts by uranium decay."
      },
      {
        "title": "Discovery",
        "body": "Technetium was discovered in 1937 by Carlo Perrier and Emilio Segrè, filling a long-missing gap in the periodic table."
      }
    ]
  },
  "RU": {
    "name": "Ruthenium",
    "symbol": "Ru",
    "atomicNumber": 44,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Ruthenium is one of the sneakiest elements in the ground—it hides inside mineral grains so small they're invisible to the naked eye. An entire soil sample can contain it without showing any visible signs. Detecting ruthenium is less like finding a nugget and more like finding a fingerprint."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Ruthenium is normally undetectable in soils (typical levels are well below 0.01 ppm), so readings of 5–10 ppm or higher are unusual and have historically been associated with platinum-group mineralization—the same geological systems that produce platinum and palladium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Ruthenium in its metallic or mineral form isn't toxic to people, pets, or wildlife at natural levels. Soil below 10 ppm generally poses no health risk. It does have a rare oxide form that's highly toxic, but that compound doesn't form naturally in soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Ruthenium is extremely insoluble and doesn't dissolve into groundwater. Even at elevated soil levels, it poses no risk to water quality or wells."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Ruthenium doesn't benefit or harm plants or livestock. Soils with elevated ruthenium generally remain agriculturally normal."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Ruthenium is chemically stable and environmentally neutral at naturally occurring levels. It doesn't bioaccumulate or pose known risks to ecosystems."
      },
      {
        "title": "Uses",
        "body": "Ruthenium is used in catalysts for chemical reactions (such as ammonia production), in electronics (especially electrical contacts), in jewelry plating, and in some cancer drugs."
      },
      {
        "title": "Prevalence",
        "body": "Ruthenium is extremely rare, averaging about 0.001 ppm (0.0000001%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Ruthenium was discovered in 1844 by Karl Karlovich Klaus in Russia and named after Ruthenia, the Latin name for Russia."
      }
    ]
  },
  "RH": {
    "name": "Rhodium",
    "symbol": "Rh",
    "atomicNumber": 45,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Rhodium has at times been the most expensive metal on Earth—more valuable per ounce than gold, platinum, or palladium."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Rhodium is vanishingly rare in soils (typical levels are well below 0.01 ppm), so finding it at 5–10 ppm or higher is unusual and has historically been associated with platinum-group metal (PGM) mineralization, the same geological systems that yield platinum, palladium, and ruthenium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Rhodium in metallic or mineral form is inert and isn't considered toxic to people, pets, or wildlife at environmental levels. Even at elevated soil concentrations, it generally poses no known health risk."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Rhodium is extremely insoluble and generally won't affect groundwater or surface water. Even at high concentrations, it remains locked in mineral grains."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Rhodium has no recognized biological function in plants or animals and doesn't generally affect crop health or soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Rhodium is chemically stable and generally poses no environmental hazard at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "Rhodium is best known for its use in catalytic converters that reduce car emissions. It's also used in jewelry plating to create shiny finishes and in organic chemistry as a catalyst."
      },
      {
        "title": "Prevalence",
        "body": "Rhodium is extremely rare, averaging about 0.001 ppm (0.0000001%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Rhodium was discovered in 1803 by William Hyde Wollaston and named from the Greek rhodon (\"rose\") because its salts are a bright rose-red."
      }
    ]
  },
  "PD": {
    "name": "Palladium",
    "symbol": "Pd",
    "atomicNumber": 46,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Palladium can soak up hydrogen like a metal sponge—at room temperature, it can absorb up to 900 times its own volume of hydrogen gas, swelling visibly as it does. That's not a typo—nine hundred times. It's one of the strangest physical tricks in all of chemistry."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Palladium is essentially absent from soils under natural conditions (typical levels are below 0.01 ppm), so detecting it at 5–10 ppm or higher is rare and has historically been associated with platinum-group metal (PGM) mineralization. Palladium often occurs alongside platinum, rhodium, and ruthenium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Palladium metal is chemically inert and isn't toxic to people, pets, or wildlife at natural levels. Soil concentrations under 20 ppm generally pose no health concern, and palladium compounds are too rare in the environment to cause harm."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Palladium doesn't dissolve readily in water. Even in enriched soils, it remains bound to mineral grains and poses no risk to groundwater or wells."
      },
      {
        "title": "Agricultural relevance",
        "body": "Generally not a factor. Palladium may affect crop growth at levels above about 3 ppm, but concentrations that high in soil are rare under natural conditions."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Palladium is generally stable and environmentally neutral at naturally occurring levels. It doesn't bioaccumulate or pose known risks to ecosystems."
      },
      {
        "title": "Uses",
        "body": "Palladium is used in catalytic converters, jewelry, electronics, and dentistry. It's also essential for hydrogen purification—and has occasionally shown up in counterfeit Rolex watches."
      },
      {
        "title": "Prevalence",
        "body": "Palladium is very rare, averaging about 0.015 ppm (0.0000015%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Discovered in 1802 by William Hyde Wollaston, the year before he discovered rhodium."
      }
    ]
  },
  "AG": {
    "name": "Silver",
    "symbol": "Ag",
    "atomicNumber": 47,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Over 360 tons of silver find their way into U.S. rivers every year. Turns out, silver passes through our bodies and ends up in sewage—making it one of the more unexpected travelers in the water system. That's over $68 million worth—quite literally flushed down the drain."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Silver at 10–20 ppm is above typical background levels (normally under 1 ppm), and historically, elevated silver readings have been associated with proximity to precious-metal geology. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Silver is generally considered low-risk at the levels found in most soils. Typical background concentrations below 50 ppm pose no known concern for humans or pets. At very high concentrations—we're talking hundreds of ppm—there's a rare condition called argyria (a skin discoloration) that's mostly associated with industrial exposure, not backyard soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low impact. Silver tends to bind to soil and doesn't dissolve easily in water. At higher concentrations (above 100 ppm), erosion can carry trace amounts into runoff—but at levels typical of most soils, meaningful effects on groundwater or wells are uncommon."
      },
      {
        "title": "Agricultural relevance",
        "body": "Silver doesn't play a known nutritional role in plant or animal health. At typical soil levels, it's generally harmless to crops and livestock. At very high concentrations (hundreds of ppm), it can affect soil microbes and plant tissue—but those levels are uncommon outside industrial or mining areas."
      },
      {
        "title": "Environmental considerations",
        "body": "Silver is generally stable in soil. The main concern is industrial release—in those cases, silver can accumulate in aquatic ecosystems and affect helpful organisms. For naturally occurring soil silver, this is rarely a factor."
      },
      {
        "title": "Uses",
        "body": "Silver shows up just about everywhere: jewelry, silverware, electronics, and mirrors. It's even used in wound dressings—its natural antibacterial properties make it surprisingly useful in medicine."
      },
      {
        "title": "Prevalence",
        "body": "Silver is very rare, averaging about 0.075 ppm (0.0000075%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Known since prehistoric times and traded by ancient civilizations."
      }
    ]
  },
  "CD": {
    "name": "Cadmium",
    "symbol": "Cd",
    "atomicNumber": 48,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Cadmium gives off a brilliant yellow color—Van Gogh likely used cadmium-based pigments in some of his most famous paintings. It's also highly toxic and linked to \"itai-itai\" disease in Japan, where communities exposed to cadmium in rice paddies developed brittle, painful bones. Beautiful to look at, dangerous to live with."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No—cadmium in soil is generally considered a contaminant rather than a resource. It does have industrial uses (batteries, pigments, plastics), but those applications rely on refined cadmium from mining operations. For context, commercially mined cadmium ores typically contain 300–1,000+ ppm—well above the levels found in virtually any backyard soil, and at concentrations that high, the toxicity concerns would far outweigh any extraction interest."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, and worth taking seriously. Most soils naturally contain less than 1 ppm cadmium—above about 3 ppm, it's considered contaminated. Long-term exposure through dust or food grown in contaminated soil has been linked to kidney damage, bone weakening, and cancer. Cadmium is one of the heavy metals regulators pay close attention to—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "It should be taken seriously at elevated levels. Cadmium can leach into groundwater from contaminated soils, especially under acidic conditions. The U.S. Environmental Protection Agency (EPA) sets its drinking water limit at 0.005 ppm (5 µg/L). Soil cadmium above 3–5 ppm may gradually elevate groundwater concentrations, particularly near old industrial or mining sites—though at typical backyard levels, this isn't a common concern."
      },
      {
        "title": "Agricultural relevance",
        "body": "A real concern in contaminated soils. Cadmium isn't required by plants, but crops readily absorb it—leafy greens, grains, and root vegetables are particularly vulnerable. Soil cadmium above 3 ppm can raise concerns about what's being taken up into food crops, and levels above 10 ppm are the kind that agricultural agencies take seriously."
      },
      {
        "title": "Environmental considerations",
        "body": "A well-known pollutant. Cadmium contamination often originates from phosphate fertilizers, smelting, and battery or metal waste. It accumulates in sediments and plant tissues, where it can harm soil organisms and aquatic life. Levels above 3 ppm are considered elevated, and above 10 ppm is the range that typically gets environmental agencies' attention."
      },
      {
        "title": "Uses",
        "body": "Cadmium has been used in rechargeable batteries, pigments, and plastics, though many of those uses are now being phased out due to toxicity concerns."
      },
      {
        "title": "Prevalence",
        "body": "Cadmium is very rare, averaging about 0.15 ppm (0.000015%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Cadmium was discovered in 1817 by Friedrich Strohmeyer—its name comes from cadmia, an old term for zinc ores, because that's where it was first found hiding."
      }
    ]
  },
  "IN": {
    "name": "Indium",
    "symbol": "In",
    "atomicNumber": 49,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Indium is so soft you can bite into it, and it melts at a low enough temperature that an indium spoon would slowly dissolve in a bowl of hot soup. It also makes a high-pitched \"cry\" when bent—similar to tin—because its crystal structure cracks under pressure. A metal that screams, melts, and dents if you look at it wrong."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, but only in unusual circumstances. Typical soils contain less than 1 ppm indium. Readings above 10–20 ppm could signal zinc or tin ore nearby—indium often occurs in those deposits and is sometimes recovered as a byproduct. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally harmless at typical levels. Indium in soil below 1 ppm isn't a concern. Above about 10 ppm, it can irritate the lungs if disturbed as dust and may cause stomach or liver issues if ingested—but those concentrations are rare outside industrial or mining settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal under normal conditions. Indium doesn't dissolve easily in soil water, so it rarely affects groundwater. Near smelting or mine waste, it can enter runoff, but that's uncommon in typical backyard settings."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Indium is so scarce in most soils that it poses no risk to farming at typical levels. Above about 5 ppm, it has been shown to interfere with nitrogen fixation in plants."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern at natural levels. Indium is generally stable in soils but can accumulate in sediments near industrial areas. Soils above 20 ppm may suggest contamination or underlying mineralization."
      },
      {
        "title": "Uses",
        "body": "Every time you tap your phone screen, you're touching indium—indium tin oxide is the invisible, conductive coating that makes touchscreens work. Indium shows up in solar panels, specialized solders, and semiconductors. It's also used in some medical imaging equipment and mirror coatings."
      },
      {
        "title": "Prevalence",
        "body": "Indium is very rare, averaging about 0.25 ppm (0.000025%) in Earth's crust—it doesn't form large deposits on its own but shows up in tiny amounts alongside zinc and tin ores."
      },
      {
        "title": "Discovery",
        "body": "Indium was discovered in 1863 by German chemists Ferdinand Reich and Hieronymus Richter, who named it for the bright indigo-blue spectral lines that gave it away."
      }
    ]
  },
  "SN": {
    "name": "Tin",
    "symbol": "Sn",
    "atomicNumber": 50,
    "sections": [
      {
        "title": "Fun fact",
        "body": "When a bar of tin is bent, it makes a strange crackling sound called the \"tin cry\"—caused by the metal's crystal structure snapping and shifting under pressure. It's one of the only metals you can actually hear deforming. Bend it slowly in a quiet room and it sounds like tiny bones cracking. Unsettling, but fascinating."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, if levels are unusually high. Normal soils contain less than 5 ppm tin. Readings above 50–100 ppm could indicate nearby tin-bearing formations—regions like Cornwall, England and parts of Nevada have historically been associated with tin mining. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Tin metal and most natural tin compounds aren't toxic to people, pets, or wildlife at typical soil levels (below 10 ppm). The exception is certain industrial \"organotin\" chemicals—once used in paints and plastics—which are highly toxic, though these are rarely found in soils outside contaminated sites."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Tin doesn't easily dissolve or move through soil, so it's not typically a groundwater concern. Only soils near industrial discharge would have any measurable impact on water quality."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Tin has no biological function in plants or animals and doesn't generally affect crop growth at natural concentrations."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable and harmless. Tin in soil is usually inert, but levels exceeding 50 ppm may indicate industrial contamination rather than natural occurrence."
      },
      {
        "title": "Uses",
        "body": "Tin is best known for solder—the material that connects electronic parts in circuit boards. It's also used to coat food cans (to prevent rust), in bronze alloys, and in glassmaking."
      },
      {
        "title": "Prevalence",
        "body": "Tin is rare, averaging about 2.2 ppm (0.00022%) in Earth's crust—though humans have been mining and trading it for thousands of years."
      },
      {
        "title": "Discovery",
        "body": "Tin has been known since antiquity—ancient civilizations across Europe and the Middle East traded it to make bronze tools, weapons, and art."
      }
    ]
  },
  "SB": {
    "name": "Antimony",
    "symbol": "Sb",
    "atomicNumber": 51,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Antimony was used in ancient Egyptian eye makeup, giving their eyes that dramatic dark-lined look—though it was toxic even then. Its name is believed to come from a term meaning \"monk-killer,\" after monks in the Middle Ages who tried using it as a medicine and didn't survive the treatment."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Not typically. Antimony is used industrially in flame retardants and alloys, but it's rarely concentrated enough in soil for extraction. Natural levels are generally below 1 ppm, and commercial ores usually need to exceed several thousand ppm."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, at elevated levels. Most soils naturally contain less than 1 ppm antimony—above about 20 ppm, chronic exposure through ingestion or dust can affect the liver, lungs, and heart. Antimony is one of the elements environmental agencies keep an eye on—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at elevated levels. Antimony can leach into groundwater from mining waste, smelter residues, or industrial runoff, especially in acidic or sandy soils. The EPA's safe drinking water limit is 0.006 ppm (6 µg/L). Soils above 10–20 ppm may contribute to groundwater contamination over time."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not a plant nutrient, and generally not a concern at natural levels. Crops take up very little antimony. In contaminated soils above 20 ppm, trace amounts may enter food crops, and microbial activity that supports healthy soil can be reduced."
      },
      {
        "title": "Environmental considerations",
        "body": "A known pollutant at elevated levels. Antimony contamination is often linked to historical mining, metal refining, or ammunition and battery disposal. In soils above 20 ppm, runoff can contaminate nearby streams and sediments, and long-term accumulation can reduce soil fertility by harming beneficial microorganisms."
      },
      {
        "title": "Uses",
        "body": "Antimony is used in flame retardants, lead-acid batteries, and some semiconductors. It also shows up in certain types of ammunition and was historically used in medicines—with mixed results."
      },
      {
        "title": "Prevalence",
        "body": "Antimony is very rare, averaging about 0.2 ppm (0.00002%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Antimony has been known since ancient times."
      }
    ]
  },
  "TE": {
    "name": "Tellurium",
    "symbol": "Te",
    "atomicNumber": 52,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Tellurium has a strange side effect—people who are exposed to even tiny amounts of it start smelling like garlic. The odor comes from metabolic byproducts, and it can linger in the breath for weeks. No amount of mouthwash helps. It's one of the few elements that announces itself through your pores."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though rarely. Tellurium is a valuable metalloid used in solar panels and electronics, but normal soils contain less than 1 ppm. Concentrations above 10–20 ppm could indicate nearby ore-bearing formations or historical mining residues."
      },
      {
        "title": "Is it toxic?",
        "body": "Worth noting at elevated levels. Tellurium isn't highly toxic at natural soil levels (generally below 1 ppm), but prolonged exposure above about 10 ppm has been linked to fatigue, nausea, and the garlic-like breath odor the element is known for—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Low concern under normal conditions. Tellurium can dissolve slowly in groundwater under low-oxygen conditions, especially near sulfide-rich soils or mining sites. The EPA hasn't established a drinking water limit, but levels above 0.01 ppm (10 µg/L) are considered elevated."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants. Tellurium is usually taken up only in trace amounts. In heavily contaminated soils (above 20 ppm), it can slightly inhibit plant growth and alter soil microbial balance."
      },
      {
        "title": "Environmental considerations",
        "body": "Worth watching at elevated levels. Tellurium contamination typically comes from copper, lead, or gold refining and from electronic waste. Above about 20–30 ppm, it can accumulate in sediments and bioaccumulate in aquatic life."
      },
      {
        "title": "Uses",
        "body": "Tellurium is used in solar cells, thermoelectric devices, catalysts, and specialty alloys."
      },
      {
        "title": "Prevalence",
        "body": "Tellurium is extremely rare, averaging about 0.001 ppm (0.0000001%) in Earth's crust—one of the rarest stable elements on the planet."
      },
      {
        "title": "Discovery",
        "body": "Tellurium was discovered in 1782 by Franz-Joseph Müller von Reichenstein while analyzing gold ore."
      }
    ]
  },
  "I": {
    "name": "Iodine",
    "symbol": "I",
    "atomicNumber": 53,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Iodine crystals are shiny and purple, and when heated, they skip the liquid stage entirely—going straight from solid to a vivid violet gas. It's called sublimation, and it's rare enough in everyday elements that early chemists thought they were watching something supernatural. A disappearing act worthy of a magic show, performed by chemistry."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Unlikely, but not impossible. Normal soils contain less than 5 ppm iodine. Levels above 20–50 ppm could indicate brine-rich layers or ancient marine sediments, which have historically been associated with iodine extraction for industrial and pharmaceutical use. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally harmless at typical levels, and even beneficial. Iodine in soil below 10 ppm isn't a concern. Above about 20 ppm, chronic exposure could contribute to thyroid or metabolic issues in people and pets if ingested regularly—though concentrations that high are uncommon outside industrial contamination."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low concern. Iodine moves readily in water as iodide or iodate. Groundwater containing over 0.01 ppm (10 µg/L) is typical, while levels above 0.1 ppm (100 µg/L) may affect taste—making water salty or metallic."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants, but vital for animals and humans through diet. Soils below 1 ppm often produce low-iodine crops, while supplementation in livestock feed prevents deficiency-related issues."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Iodine is generally stable and has low soil toxicity. Readings above 20 ppm may suggest the influence of marine aerosols, mineral layers left behind by evaporated water, or past industrial sources."
      },
      {
        "title": "Uses",
        "body": "Iodine was one of the first antiseptics used to disinfect wounds, and it's still essential in medicine today—as an X-ray contrast agent and in pharmaceuticals. It's also the reason table salt is iodized: without enough iodine, the thyroid gland can swell into a condition called goiter."
      },
      {
        "title": "Prevalence",
        "body": "Iodine is rare in Earth's crust, averaging about 0.5 ppm (0.00005%)—though most of the world's iodine actually comes from seawater and brines rather than solid rock."
      },
      {
        "title": "Discovery",
        "body": "Iodine was discovered in 1811 by French chemist Bernard Courtois, who noticed purple vapors rising from seaweed ash he was processing to make gunpowder."
      }
    ]
  },
  "CS": {
    "name": "Cesium",
    "symbol": "Cs",
    "atomicNumber": 55,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Cesium is one of the few metals that's liquid near room temperature—melting at just 83°F (28.5°C). If you held a sealed ampule of cesium on a warm day, you'd watch it melt in your hand. Drop it in water, though, and it doesn't just fizz—it detonates with enough force to shatter the container. Gentle until it isn't."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Rarely. Normal soils have less than 10 ppm cesium. Levels above 100 ppm may indicate cesium-rich mineral formations that have historically been associated with industrial extraction. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no—stable cesium isn't a concern at natural soil levels (below 10 ppm). The exception is radioactive cesium-137, which is dangerous at any detectable level and can cause radiation exposure if ingested or inhaled. Radioactive cesium is extremely rare in soils that haven't been affected by nuclear contamination."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal for stable cesium. It binds strongly to clay minerals and rarely reaches groundwater. Radioactive cesium-137, however, can travel in water and may contaminate wells near fallout or nuclear sites—though that's only relevant in contamination scenarios."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known nutritional role. Cesium behaves similarly to potassium, so plants can take it up accidentally, but this has no known benefit and isn't a concern at typical soil levels."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable and benign. Stable cesium in soil poses no environmental risk, even at hundreds of ppm. Readings above 100 ppm could point to unique geological mineralization or, less commonly, contamination from past industrial or nuclear activity."
      },
      {
        "title": "Uses",
        "body": "Cesium atomic clocks are so precise they literally define what a second is—GPS satellites, internet timing, and financial systems all depend on them. Cesium also shows up in oil drilling fluids, specialty glasses, and photoelectric cells. Radioactive cesium isotopes are used in medical radiation therapy and industrial gauges."
      },
      {
        "title": "Prevalence",
        "body": "Cesium is rare, averaging about 3 ppm (0.0003%) in Earth's crust—it tends to concentrate in unusual minerals rather than being spread evenly."
      },
      {
        "title": "Discovery",
        "body": "Cesium was discovered in 1860 by Robert Bunsen and Gustav Kirchhoff using flame spectroscopy, and named from the Latin caesius (\"sky blue\") for the bright blue lines in its spectrum."
      }
    ]
  },
  "BA": {
    "name": "Barium",
    "symbol": "Ba",
    "atomicNumber": 56,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Like milkshakes? Barium is used in medical imaging—if you drink a \"barium shake,\" it makes your stomach glow on an X-ray."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Occasionally. Normal soils range from 200–1,500 ppm barium. Readings above 5,000 ppm could suggest barite deposits, which have historically been mined for industrial use. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no—stable barium locked in minerals is harmless at natural soil levels below 2,000 ppm. The concern is with soluble forms like barium chloride or nitrate, which can be toxic if ingested in high doses—causing muscle weakness or heart issues in people and animals. Those forms are typically only a risk when soils exceed several thousand ppm of soluble barium compounds."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting at elevated levels. Barium can dissolve slightly into groundwater. The U.S. Environmental Protection Agency (EPA) sets its limit at 2 ppm in drinking water—above that, it may contribute to increased blood pressure or muscle weakness. If soil exceeds 3,000 ppm total barium, some homeowners consider testing nearby well water."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for plants. In high-sulfate soils, barium can form barite crystals that slightly affect soil chemistry, but crops generally grow well at total barium levels below 2,000 ppm."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable. Natural barite is non-toxic, but industrial runoff or drilling waste can elevate soluble barium levels. Soil readings above 5,000 ppm could indicate contamination rather than natural occurrence."
      },
      {
        "title": "Uses",
        "body": "Barium sulfate is used in medical X-ray imaging of the digestive system because it blocks radiation while being safe to swallow. Barium compounds can make fireworks burn a dazzling green, which is why they're a staple in pyrotechnics. Barium compounds are also used in glassmaking, ceramics, and rubber, as well as in drilling mud for oil and gas wells."
      },
      {
        "title": "Prevalence",
        "body": "Barium is common, averaging about 425 ppm (0.0425%) in Earth's crust—usually found locked in minerals rather than as free barium."
      },
      {
        "title": "Discovery",
        "body": "Barium compounds were known for centuries, but the element itself was first isolated in 1808 by Sir Humphry Davy using electrolysis. The name comes from the Greek word barys, meaning \"heavy,\" because barium minerals are unusually dense."
      },
      {
        "title": "Famous Comparisons",
        "body": "Do your results fall into this famous range? If your soil sample's barium is above 500 ppm, it is in the range of the barium levels of Morocco's Atlas Mountains—rugged highland terrain, pale rocky slopes rich with barite deposits, dense mineral-heavy ground carved by ancient rivers."
      }
    ]
  },
  "LA": {
    "name": "Lanthanum",
    "symbol": "La",
    "atomicNumber": 57,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Lanthanum's name comes from the Greek word for \"to lie hidden\"—and it earned it. Scientists spent decades studying a mineral called cerite without realizing lanthanum was tucked inside it the whole time. It's the element that played the longest game of hide-and-seek in chemistry."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Average soils contain about 20–80 ppm lanthanum. Values above 500 ppm may indicate rare-earth-bearing minerals that have historically been associated with extraction activity. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Lanthanum is considered low in toxicity. At natural soil levels below 100 ppm, it poses no known health concern for people, pets, or wildlife. Above about 1,000 ppm, prolonged exposure may irritate the lungs or liver, but concentrations that high are uncommon outside mining settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Lanthanum binds tightly to soil minerals and is unlikely to leach into groundwater. Only at extreme concentrations (above 500 ppm) might trace movement occur through erosion or runoff."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not essential for crops or livestock. Some studies suggest lanthanum may affect seed germination and chlorophyll content, but at soil levels below 200 ppm, it doesn't generally influence crop health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Lanthanum is stable and poses no known ecological risk at natural soil levels (under 100 ppm). The environmental issues associated with lanthanum relate primarily to rare-earth mining and processing."
      },
      {
        "title": "Uses",
        "body": "Lanthanum helps camera lenses and telescopes capture super-sharp images, making your selfies and space photos look amazing. It's also used in hybrid car batteries and special optical glass."
      },
      {
        "title": "Prevalence",
        "body": "Lanthanum is uncommon, averaging about 39 ppm (0.0039%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Lanthanum was discovered in 1839 by Carl Mosander."
      }
    ]
  },
  "CE": {
    "name": "Cerium",
    "symbol": "Ce",
    "atomicNumber": 58,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Cerium was named after the asteroid Ceres, which had been discovered just two years earlier—making it one of the few elements named after something from space. When cerium metal is scratched or struck, it throws off hot sparks bright enough to light a fire. It's the most abundant rare earth element on the planet, and most people have never heard of it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Most soils contain 10–100 ppm cerium. Concentrations above 500 ppm may indicate rare-earth-rich minerals that have historically been associated with extraction activity. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Cerium is considered low in toxicity. Soil levels below 100 ppm generally pose no concern for people, pets, or wildlife. At much higher concentrations, prolonged exposure to cerium dust may cause mild irritation, but that's primarily an industrial or mining concern."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Cerium binds to soil particles and generally doesn't enter groundwater. Only when soil exceeds roughly 500 ppm, or in areas of disturbed mining waste, could trace amounts move with runoff."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Cerium isn't used by plants or animals, and soil levels below 200 ppm don't generally affect crop health or yield."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Cerium is stable and non-reactive at natural soil levels. The environmental issues associated with cerium relate primarily to rare-earth mining and refining."
      },
      {
        "title": "Uses",
        "body": "Cerium helps clean car exhaust through catalytic converters and is used to polish glass to a perfect shine. It's also the most widely used rare earth in industrial applications."
      },
      {
        "title": "Prevalence",
        "body": "Cerium is uncommon, averaging about 66.5 ppm (0.00665%) in Earth's crust—the most abundant of all the rare earth elements."
      },
      {
        "title": "Discovery",
        "body": "Cerium was first identified in 1803 and finally isolated from other rare earths by Carl Mosander in 1839."
      }
    ]
  },
  "PR": {
    "name": "Praseodymium",
    "symbol": "Pr",
    "atomicNumber": 59,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Praseodymium's name means \"green twin\" because it was once mistaken for its close sibling, neodymium—scientists thought they were the same element for years. Some of its compounds glow neon green under UV light, which looks less like a rare earth and more like alien slime."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though it's uncommon. Typical soils contain about 1–20 ppm praseodymium. Levels above 300 ppm could indicate rare-earth-bearing clays or mineral sands. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Praseodymium is considered very low in toxicity. Soil below 50 ppm generally poses no concern for people, pets, or wildlife, and even levels up to 500 ppm aren't known to cause harm. Only direct exposure to airborne dust in industrial settings could be a potential issue."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Praseodymium binds strongly to soil minerals and doesn't dissolve easily. Only soils exceeding 300 ppm might release trace amounts into groundwater, usually near mining or natural rare-earth deposits."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Praseodymium has no biological function in plants or animals. Soils within the normal range (below 100 ppm) don't generally affect crop growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Praseodymium is stable and environmentally benign at natural soil levels (below 50 ppm). The environmental concerns associated with it relate to rare-earth mining and processing."
      },
      {
        "title": "Uses",
        "body": "Praseodymium adds a green tint to glass and makes super-strong magnets for headphones and electric motors. It even helps create the special alloy used in jet engines."
      },
      {
        "title": "Prevalence",
        "body": "Praseodymium is rare, averaging about 9.2 ppm (0.00092%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Praseodymium was discovered in 1885 by Carl Auer von Welsbach when he separated it from neodymium."
      }
    ]
  },
  "ND": {
    "name": "Neodymium",
    "symbol": "Nd",
    "atomicNumber": 60,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Neodymium literally means \"new twin\"—it was discovered right alongside praseodymium when scientists finally realized they'd been looking at two elements instead of one. Despite being a dull metal gray in solid form, when dissolved, neodymium can turn solutions vivid shades of purple, pink, or blue depending on the lighting."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Normal soils contain 10–80 ppm neodymium. Concentrations above 400 ppm could indicate rare-earth-rich clays. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Neodymium is considered very low in toxicity. Soil levels below 100 ppm generally pose no risk to people, pets, or wildlife, and even air exposure up to several ppm is unlikely to cause harm outside industrial settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Neodymium doesn't dissolve easily and stays bound to minerals. Only soils exceeding 400 ppm, especially in disturbed or mining areas, could allow minor movement into runoff or groundwater."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Neodymium isn't essential to plants or animals, and soils below 200 ppm don't generally affect crops or soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Neodymium is generally stable and environmentally benign at typical concentrations (under 100 ppm). The environmental issues associated with it relate to rare-earth mining."
      },
      {
        "title": "Uses",
        "body": "Neodymium is the muscle behind the world's strongest permanent magnets—the ones inside earbuds, hard drives, and wind turbines. Tiny amounts power massive machines and everyday gadgets alike."
      },
      {
        "title": "Prevalence",
        "body": "Neodymium is uncommon, averaging about 41.5 ppm (0.00415%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Neodymium was discovered in 1885 by Carl Auer von Welsbach, alongside praseodymium."
      }
    ]
  },
  "PM": {
    "name": "Promethium",
    "symbol": "Pm",
    "atomicNumber": 61,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Promethium is the only rare earth element that's always radioactive—every single one of its isotopes decays. It was named after Prometheus, the figure from Greek mythology who stole fire from the gods, a fitting name for an element that glows faintly in the dark as it breaks down. There's probably less than a pound of it on the entire planet at any given time."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Promethium doesn't occur naturally in soils in extractable amounts. Any detected promethium would come from nuclear decay or contamination, not from a mineable source."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes. Promethium is radioactive and dangerous if inhaled or ingested, but natural soils contain effectively zero—it decays too quickly to accumulate."
      },
      {
        "title": "Impact on water quality",
        "body": "Not a concern under natural conditions. If promethium were present above trace levels, it would indicate radioactive waste or nuclear activity nearby."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Promethium offers no known benefit to plants or animals and would be harmful if exposure occurred."
      },
      {
        "title": "Environmental considerations",
        "body": "Promethium is not a natural soil constituent. Its detection would be extremely unusual and would suggest the presence of uranium fission byproducts rather than a concern about the soil itself."
      },
      {
        "title": "Uses",
        "body": "Small amounts of promethium have been used in atomic batteries to power pacemakers and space probes—devices where long-lasting energy is needed in a tiny package. Its radioactive glow was also once used in luminous paints."
      },
      {
        "title": "Prevalence",
        "body": "Promethium is essentially absent from Earth's crust—any produced by uranium decay disappears quickly due to its short half-life."
      },
      {
        "title": "Discovery",
        "body": "Promethium was first identified in 1945 by scientists working with uranium fission products, filling a missing spot in the periodic table."
      }
    ]
  },
  "SM": {
    "name": "Samarium",
    "symbol": "Sm",
    "atomicNumber": 62,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Samarium might be the first element named after a real person—a Russian mining engineer named Vasili Samarsky-Bykhovets—or it might be named after the mineral samarskite, which was itself named after him. Either way, the guy got an element (or at least a mineral that got an element)."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though only at unusually high levels. Normal soils contain around 2–10 ppm samarium. Concentrations above 300 ppm could indicate rare-earth-rich clays or mineral sands. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Samarium is considered very low in toxicity. Soil levels below 50 ppm generally pose no concern for people, pets, or wildlife, and even several hundred ppm isn't known to cause harm. Above about 1,000 ppm, it could cause mild irritation if inhaled or ingested as fine dust."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Samarium stays tightly bound to soil minerals and is insoluble in water. Even soils above 300 ppm are unlikely to release measurable amounts into groundwater."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Samarium plays no part in plant or animal nutrition. Soils below 100 ppm don't generally affect crop health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Samarium is chemically stable and environmentally benign at natural levels. The environmental issues associated with it relate to rare-earth mining and processing."
      },
      {
        "title": "Uses",
        "body": "Samarium magnets can survive extreme heat, making them ideal for electric guitars, missiles, and spacecraft. Samarium is also used in cancer treatment when turned into a radioactive isotope."
      },
      {
        "title": "Prevalence",
        "body": "Samarium is rare, averaging about 7.05 ppm (0.000705%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Samarium was discovered in 1879 by Paul Émile Lecoq de Boisbaudran in the mineral samarskite."
      }
    ]
  },
  "EU": {
    "name": "Europium",
    "symbol": "Eu",
    "atomicNumber": 63,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Europium is so reactive that it tarnishes just from the moisture in ordinary air—most samples have to be stored sealed or under oil. Despite being that temperamental, it's trusted with one of the most important anti-counterfeiting jobs in the world: europium compounds are embedded in euro banknotes and glow under UV light to prove the bill is real."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, but only if concentrations are unusually high. Most soils contain 1–3 ppm europium. Readings above 200 ppm could indicate rare-earth-enriched deposits. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Europium is considered low in toxicity. At soil levels below 50 ppm, it poses no known health risk to people, pets, or wildlife. Higher levels might cause liver or kidney stress with constant exposure, but that's primarily an industrial concern."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Europium binds tightly to minerals and rarely dissolves in water. Groundwater contamination would only be possible if soils above 200 ppm were disturbed by mining or erosion."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Europium has no biological function in plants or animals. Soils below 100 ppm don't generally affect crop growth."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Europium is generally stable and environmentally benign at typical levels (under 10 ppm). The environmental issues associated with it relate to rare-earth mining and processing."
      },
      {
        "title": "Uses",
        "body": "Europium gives TV and phone screens their bright red and blue colors—without it, displays would look noticeably duller. It's also used to help control nuclear reactions because it absorbs neutrons effectively."
      },
      {
        "title": "Prevalence",
        "body": "Europium is rare, averaging about 2 ppm (0.0002%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Europium was discovered in 1901 by Eugène-Anatole Demarçay and named after Europe."
      }
    ]
  },
  "GD": {
    "name": "Gadolinium",
    "symbol": "Gd",
    "atomicNumber": 64,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Gadolinium can switch its magnetism on and off based on temperature—cool it down and it becomes strongly magnetic, warm it up and the magnetism fades. Scientists are using this trick to build refrigerators that cool with magnets instead of chemical refrigerants. A fridge with no compressor, no gas, just physics. The future is weird."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, but only if concentrations are much higher than normal. Average soils contain about 1–10 ppm gadolinium. Readings above 300 ppm could indicate rare-earth-rich deposits. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Gadolinium is low in toxicity at natural soil levels. Below 50 ppm, it poses no known concern for people, pets, or wildlife. Exposure to water containing dissolved gadolinium (above about 1 ppm)—such as from medical or industrial waste—could affect the kidneys, but that's not a soil concern under normal conditions."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal under natural conditions. Gadolinium stays bound to soil and doesn't dissolve easily. The main water quality concern is gadolinium from medical waste (MRI contrast agents) entering water systems—but that's unrelated to natural soil levels."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Gadolinium isn't essential for plants or animals, and soil levels below 100 ppm don't generally affect crops."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally benign at natural levels. The more interesting story is gadolinium from MRI contrast agents—when patients excrete it, trace amounts can end up in wastewater and eventually in rivers and sediments. At natural soil concentrations (under 50 ppm), gadolinium itself poses no known environmental concern."
      },
      {
        "title": "Uses",
        "body": "Gadolinium is the MRI hero—it's injected as a contrast agent to help doctors see sharper images inside the body. It's also used in nuclear reactors to absorb stray neutrons."
      },
      {
        "title": "Prevalence",
        "body": "Gadolinium is rare, averaging about 6.2 ppm (0.00062%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Gadolinium was discovered in 1880 by Jean Charles Galissard de Marignac and named after Finnish chemist Johan Gadolin."
      }
    ]
  },
  "TB": {
    "name": "Terbium",
    "symbol": "Tb",
    "atomicNumber": 65,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Terbium can glow bright green or yellow depending on its chemical state—it's basically a built-in highlighter. It's also one of the four elements named after Ytterby, that tiny Swedish village with the most productive quarry in periodic table history."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, but only at unusually high concentrations. Normal soils contain around 1–2 ppm terbium. Values above 200 ppm could indicate rare-earth-rich clays or mineral sands. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Terbium is considered very low in toxicity. Soil below 50 ppm generally poses no health concern for people, pets, or wildlife, and there are no known adverse effects at typical environmental levels."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Terbium strongly attaches to soil particles and isn't soluble in water. Only highly enriched soils (above 200 ppm), if disturbed, could introduce trace amounts into nearby groundwater."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Terbium has no biological function in plants or animals. Soils below 100 ppm don't generally affect plant health."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable. Terbium contamination in soil would typically point to industrial activity, such as waste from electronics or fluorescent lighting production. At natural levels (under 100 ppm), it poses no known ecological concern."
      },
      {
        "title": "Uses",
        "body": "Terbium makes the green glow in energy-saving lights and TV screens. It's also used in high-tech speakers and fuel cells because it helps control how materials expand and vibrate."
      },
      {
        "title": "Prevalence",
        "body": "Terbium is rare, averaging about 1.2 ppm (0.00012%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Terbium was discovered in 1843 by Carl Gustaf Mosander in Sweden."
      }
    ]
  },
  "DY": {
    "name": "Dysprosium",
    "symbol": "Dy",
    "atomicNumber": 66,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Dysprosium's name means \"hard to get\" in Greek, and it earned that name—isolating it from other rare earths was so tedious that early chemists essentially gave up and named it after the frustration. Today it's one of the most in-demand rare earths on the planet. Hard to get, and now everybody wants it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Normal soils contain around 1–6 ppm dysprosium. Levels above 250 ppm could indicate rare-earth-rich mineral sands or clays. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Dysprosium is very low in toxicity. Soil below 50 ppm generally poses no risk to people, pets, or wildlife, and even up to 500 ppm isn't generally associated with adverse health effects. High dust concentrations can cause mild lung irritation, but that's extremely rare outside industrial settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Dysprosium strongly adheres to soil particles and rarely reaches groundwater, even at elevated levels."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Dysprosium has no biological function in plants or animals. Soils below 100 ppm don't generally affect crop or livestock health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Dysprosium is generally stable and harmless at natural concentrations (under 50 ppm). The environmental issues associated with it relate to rare-earth mining and extraction."
      },
      {
        "title": "Uses",
        "body": "Dysprosium keeps magnets stable even at extreme temperatures—it's the reason electric car motors and wind turbines can run safely for years without overheating. Think of it as the magnet's bodyguard."
      },
      {
        "title": "Prevalence",
        "body": "Dysprosium is rare, averaging about 5.2 ppm (0.00052%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Dysprosium was discovered in 1886 by Paul Émile Lecoq de Boisbaudran."
      }
    ]
  },
  "HO": {
    "name": "Holmium",
    "symbol": "Ho",
    "atomicNumber": 67,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Holmium has the strongest magnetic field of any element—but only when cooled to near absolute zero. At room temperature, it's magnetically unremarkable. It's the rare earth equivalent of a sprinter who only performs in sub-zero weather."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though it's rare. Normal soils contain around 1–3 ppm holmium. Concentrations above 200 ppm could indicate rare-earth-bearing minerals. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Holmium is considered very low in toxicity. Soil below 50 ppm generally poses no risk to people, pets, or wildlife, and even levels up to several hundred ppm aren't known to cause harm."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Holmium binds tightly to soil particles and isn't easily soluble, even at elevated concentrations."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Holmium has no biological function in plants or animals. Soils below 100 ppm don't generally affect crop or livestock health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Holmium is environmentally stable and inert at natural concentrations (under 50 ppm)."
      },
      {
        "title": "Uses",
        "body": "Holmium is used in lasers for delicate surgeries and in magnets that steer medical imaging machines. Its salts can turn glass a warm yellow or a bubblegum pink."
      },
      {
        "title": "Prevalence",
        "body": "Holmium is rare, averaging about 1.3 ppm (0.00013%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Holmium was discovered in 1878 by Marc Delafontaine, Jacques-Louis Soret, and Per Teodor Cleve, and named after Stockholm (Holmia in Latin)."
      }
    ]
  },
  "ER": {
    "name": "Erbium",
    "symbol": "Er",
    "atomicNumber": 68,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Erbium gives glass a beautiful pink hue—so those rose-tinted sunglasses might literally be \"erbium vision.\" It's also the third of the four elements named after Ytterby, that overachieving Swedish village."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though only at much higher than normal levels. Typical soils contain 1–4 ppm erbium. Readings above 250 ppm could indicate rare-earth-rich deposits. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Erbium is considered very low in toxicity. Soils below 50 ppm pose no health concern for people, pets, or wildlife, and even levels above 200 ppm aren't linked to adverse effects."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Erbium is highly insoluble and stays bound to soil minerals. Groundwater contamination is unlikely even at elevated levels unless significant soil disturbance occurs."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Erbium isn't essential for plants or animals, and soils below 100 ppm don't generally affect crop health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Erbium is generally environmentally stable at natural concentrations (under 50 ppm). The environmental issues associated with it relate to rare-earth mining."
      },
      {
        "title": "Uses",
        "body": "Erbium is what makes fiber-optic cables work over long distances—it amplifies the light signals that carry your internet. Without it, streaming and video calls would be a lot less reliable."
      },
      {
        "title": "Prevalence",
        "body": "Erbium is rare, averaging about 3.5 ppm (0.00035%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Erbium was discovered in 1843 by Carl Gustaf Mosander in Ytterby, Sweden."
      }
    ]
  },
  "TM": {
    "name": "Thulium",
    "symbol": "Tm",
    "atomicNumber": 69,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Thulium is named after \"Thule,\" an ancient term for Scandinavia—the mythical land at the edge of the known world. It's the rarest of all naturally occurring lanthanides, even rarer than gold. A fitting name for something most chemists have barely worked with."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though it's one of the rarest and most expensive rare earths. Normal soils contain about 0.3–0.5 ppm thulium. Concentrations above 150 ppm may indicate rare-earth-rich clays or mineral sands. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Thulium is considered very low in toxicity. Soil below 50 ppm generally poses no known health risk to people, pets, or wildlife."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Thulium doesn't dissolve easily and remains bound to soil minerals. Even at elevated levels, it's unlikely to affect groundwater."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Thulium has no biological function in plants or animals. Soils within the normal range don't generally affect crop health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Thulium is stable and non-reactive at typical soil levels. The environmental issues associated with it relate to rare-earth mining."
      },
      {
        "title": "Uses",
        "body": "Thulium powers portable X-ray machines and lasers for medical and scientific applications."
      },
      {
        "title": "Prevalence",
        "body": "Thulium is rare, averaging about 0.5 ppm (0.00005%) in Earth's crust—the rarest of all naturally occurring lanthanides."
      },
      {
        "title": "Discovery",
        "body": "Thulium was discovered in 1879 by Per Teodor Cleve."
      }
    ]
  },
  "YB": {
    "name": "Ytterbium",
    "symbol": "Yb",
    "atomicNumber": 70,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Ytterbium is the fourth and final element named after Ytterby, Sweden—completing the village's unlikely sweep of the periodic table. It's also sensitive enough to detect tiny changes in gravitational force, which is why scientists use it to improve earthquake monitoring systems. A village of a few hundred people, responsible for four elements. Ytterby punches above its weight."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Normal soils contain about 1–3 ppm ytterbium. Concentrations above 200 ppm could indicate rare-earth-rich mineral sands. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Ytterbium is considered very low in toxicity. Soil below 50 ppm generally poses no risk to people, pets, or wildlife. Extremely high levels (thousands of ppm) aren't natural but could mildly affect the liver."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Ytterbium binds tightly to soil particles and rarely dissolves in water. Only highly enriched soils (above 200 ppm) could release trace amounts into runoff."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Ytterbium has no biological function in plants or animals. Soils within normal ranges (under 100 ppm) don't generally affect crops."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Ytterbium is generally stable and environmentally benign at natural concentrations (under 50 ppm)."
      },
      {
        "title": "Uses",
        "body": "Ytterbium helps make some of the most precise atomic clocks ever built and is used in specialized lasers for medical and industrial applications."
      },
      {
        "title": "Prevalence",
        "body": "Ytterbium is rare, averaging about 3.2 ppm (0.00032%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Ytterbium was discovered in 1878 by Jean Charles Galissard de Marignac."
      }
    ]
  },
  "LU": {
    "name": "Lutetium",
    "symbol": "Lu",
    "atomicNumber": 71,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Lutetium was named after Lutetia, the ancient Roman name for Paris—making it the \"City of Light\" element. It's one of the densest and scarcest of all the rare earths, and has at times traded for more per ounce than gold. And to think, most Parisians have never heard of it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though only at unusually high concentrations. Normal soils contain around 0.5–1 ppm lutetium. Readings above 150 ppm could indicate rare-earth-rich mineralization. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Lutetium is considered very low in toxicity. Soil levels below 50 ppm generally pose no risk to people, pets, or wildlife, and even higher natural levels have no known health effects."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Lutetium stays tightly bound to soil particles and isn't soluble in water, even at elevated concentrations."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Lutetium has no biological function in plants or animals. Soils at typical levels don't generally affect crops or livestock."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Lutetium is chemically stable and non-reactive at natural soil levels (under 50 ppm)."
      },
      {
        "title": "Uses",
        "body": "Lutetium helps doctors perform PET scans to detect cancer and other diseases. Geologists also use it in specialized dating techniques to determine the age of rock formations."
      },
      {
        "title": "Prevalence",
        "body": "Lutetium is rare, averaging about 0.8 ppm (0.00008%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Lutetium was discovered in 1907 by Georges Urbain, Carl Auer von Welsbach, and Charles James."
      }
    ]
  },
  "HF": {
    "name": "Hafnium",
    "symbol": "Hf",
    "atomicNumber": 72,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Hafnium hid inside zirconium minerals for over a century before anyone realized it was a separate element—making it the last stable element to be identified, in 1923. Scientists had walked right past it thousands of times."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, if levels are high enough. Normal soils contain less than 5 ppm hafnium. Concentrations above 50–100 ppm may indicate zircon-rich sands, which are sometimes mined for both zirconium and hafnium. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Hafnium is considered non-toxic at typical soil levels (below 10 ppm). It's chemically stable and, even at higher concentrations, generally poses little risk to people, pets, or wildlife."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Hafnium doesn't dissolve easily in water and is extremely unlikely to affect groundwater, even in soils with elevated concentrations."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Hafnium has no biological function in plants or animals and doesn't generally affect soil fertility, even at elevated levels."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Hafnium is chemically inert and doesn't pose environmental risk at naturally occurring levels. Mining zircon-rich sands (where hafnium is found) can sometimes release trace radioactive elements, but that's an industrial concern rather than a soil one."
      },
      {
        "title": "Uses",
        "body": "Hafnium is famous for gobbling up neutrons, making it extremely important in nuclear reactors. Hafnium also shows up in jet engine alloys, plasma torches, and microchips—where hafnium-based compounds help improve performance. Some specialized ceramics and optical coatings also rely on it."
      },
      {
        "title": "Prevalence",
        "body": "Hafnium is rare, averaging about 3.3 ppm (0.00033%) in Earth's crust—it almost always occurs mixed in with zirconium minerals rather than on its own."
      },
      {
        "title": "Discovery",
        "body": "Hafnium was discovered in 1923 by Dirk Coster and George de Hevesy using X-ray spectroscopy. It's named after Hafnia, the Latin name for Copenhagen, where it was first identified."
      }
    ]
  },
  "TA": {
    "name": "Tantalum",
    "symbol": "Ta",
    "atomicNumber": 73,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Tantalum is so resistant to corrosion that even strong acids can't touch it. Its name comes from King Tantalus in Greek mythology, who stood in a pool of water he could never drink. Like its namesake, tantalum \"refuses to drink\"—acid, water, almost anything. Chemists love it for exactly that reason."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially. Normal soils contain less than 5 ppm tantalum. Readings above 50–100 ppm can indicate tantalum-bearing minerals, which have historically been associated with mining activity. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Tantalum is biologically inert and poses no known health risks to people, pets, or wildlife at typical soil levels (below 50 ppm), even in areas with higher concentrations."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Tantalum is highly insoluble and doesn't leach into groundwater, even under acidic or alkaline conditions."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Tantalum has no biological function in plants or animals and doesn't generally influence soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Tantalum itself is stable and environmentally safe in soil. The main environmental issues associated with tantalum relate to mining practices—particularly coltan extraction—rather than the element's behavior in soil."
      },
      {
        "title": "Uses",
        "body": "Tiny amounts of tantalum are in the capacitors inside your phone, laptop, and car—storing and releasing energy thousands of times a day. It's also used in jet engines, chemical processing equipment, and surgical implants that stay inside the body."
      },
      {
        "title": "Prevalence",
        "body": "Tantalum is rare, averaging about 2 ppm (0.0002%) in Earth's crust. Even though it's scarce, its unique properties make it extremely valuable."
      },
      {
        "title": "Discovery",
        "body": "Tantalum was discovered in 1802 by Anders Gustaf Ekeberg, who noted how it resisted absorbing acid."
      }
    ]
  },
  "W": {
    "name": "Tungsten",
    "symbol": "W",
    "atomicNumber": 74,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Tungsten has the highest melting point of any metal—a scorching 3,410°C (6,170°F). That means it won't melt in almost any fire on Earth. That's even hotter than the surface of some stars."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Typical soils contain less than 5 ppm tungsten. Concentrations above 50–100 ppm could indicate tungsten-bearing mineral formations that have historically been associated with mining activity. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Tungsten isn't considered a concern at natural soil levels (below 10 ppm). At very high concentrations—above about 500 ppm—it could stress the kidneys in people and animals, though levels that high are rare in typical soils."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low concern. Tungsten doesn't dissolve easily, but in highly alkaline or oxygen-rich conditions, small amounts can leach into groundwater. Water concentrations above 0.05 ppm (50 µg/L) have prompted localized studies into potential health effects."
      },
      {
        "title": "Agricultural relevance",
        "body": "No significant role. Tungsten doesn't play a meaningful part in plant or animal biology and generally doesn't affect soil fertility at typical levels. Some limited research has explored tungsten compounds as potential growth enhancers in certain crops, but this isn't common practice."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Tungsten is stable and mostly immobile in soil, so it doesn't tend to migrate into waterways or accumulate in ecosystems at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "If you've ever used an old-style lightbulb, you've seen tungsten in action inside the glowing filament. Tungsten shows up in X-ray tubes, armor-piercing ammunition, and industrial cutting tools. Tungsten carbide—one of its compounds—is almost as hard as diamond and is widely used in drill bits and saw blades."
      },
      {
        "title": "Prevalence",
        "body": "Tungsten is rare, averaging about 1.25 ppm (0.000125%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Tungsten was first isolated in 1783 by the Elhuyar brothers in Spain—its name comes from the Swedish tung sten, meaning \"heavy stone.\""
      }
    ]
  },
  "RE": {
    "name": "Rhenium",
    "symbol": "Re",
    "atomicNumber": 75,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Rhenium is one of the rarest elements on Earth—so rare that if you crushed a ton of average rock into powder, you'd find about a milligram of rhenium in it. It also has the second-highest melting point of any element, behind only tungsten. Rare and nearly indestructible—rhenium doesn't do anything halfway."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, though only at unusually high concentrations. Natural soils typically contain less than 1 ppb rhenium, so any detectable levels are noteworthy and could indicate copper or molybdenum mineralization nearby. Further testing [hyperlink] is an option when levels are detectable."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Rhenium isn't known to be toxic to people, pets, or wildlife at environmental levels. It's chemically stable and generally poses minimal health risk even at higher soil concentrations."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Rhenium compounds are generally insoluble, and leaching into groundwater is very limited. Water contamination is unlikely except near mining waste or industrial discharges."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Rhenium has no biological function in plants or animals and doesn't influence soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Rhenium is chemically inert in natural soils and doesn't pose environmental risk at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "Rhenium is used in high-temperature superalloys, catalysts for petroleum refining, and filaments for mass spectrometers. It also shows up in specialty thermocouples that measure extremely high temperatures. Without rhenium, planes would fly less efficiently, and fuel would be harder to process."
      },
      {
        "title": "Prevalence",
        "body": "Rhenium is exceptionally rare, averaging only about 0.0007 ppm (0.00000007%) in Earth's crust—usually recovered as a byproduct of copper and molybdenum mining."
      },
      {
        "title": "Discovery",
        "body": "Rhenium was discovered in 1925 by Ida Tacke-Noddack, Walter Noddack, and Otto Berg in Germany, and named after the Rhine River. It was also discovered in 1908 in Japan by Masataka Ogawa. However, he misidentified it as a different missing element on the periodic table."
      }
    ]
  },
  "OS": {
    "name": "Osmium",
    "symbol": "Os",
    "atomicNumber": 76,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Osmium is the densest naturally occurring element—a block the size of a baseball would weigh about 30 pounds."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Natural soils rarely show measurable osmium (typical levels are below 0.005 ppm). Detecting it at 5–10 ppm or higher is unusual and has historically been associated with platinum-group metal (PGM) mineralization—osmium often occurs alongside iridium, platinum, and ruthenium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Metallic osmium in soil isn't toxic to people, pets, or wildlife at natural levels (below about 20 ppm). It does have a highly toxic oxide form, but that compound doesn't form naturally in soil—it's only a concern in industrial settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Osmium is highly insoluble and doesn't leach into groundwater. Even enriched soils won't affect wells or surface water."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Osmium has no biological function in plants or animals and doesn't generally influence soil fertility or crop health."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Osmium is geochemically stable and doesn't pose environmental risk at naturally occurring levels. It doesn't bioaccumulate or migrate into ecosystems."
      },
      {
        "title": "Uses",
        "body": "Osmium is used in super-durable alloys that make items like pen tips and phonograph needles last longer. It looks shiny and platinum-colored, but one of its compounds, osmium tetroxide (OsO4), is highly toxic and smells like chlorine gas. OsO4 is also used in electron microscopes to stain tissue samples for research."
      },
      {
        "title": "Prevalence",
        "body": "Osmium is extremely rare, averaging about 0.0015 ppm (0.00000015%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Osmium was discovered in 1803 by Smithson Tennant in England."
      }
    ]
  },
  "IR": {
    "name": "Iridium",
    "symbol": "Ir",
    "atomicNumber": 77,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Iridium is the most corrosion-resistant metal on Earth and is often found in meteorites."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Natural soils rarely contain measurable iridium (typical levels are below 0.005 ppm). Detecting it at 5–10 ppm or higher is rare and has historically been associated with platinum-group metal (PGM) mineralization, often alongside osmium, platinum, and ruthenium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Iridium in metallic or mineral form is inert and isn't toxic to people, pets, or wildlife at natural soil levels (below about 20 ppm). Industrial iridium compounds can be harmful if inhaled or ingested, but those don't occur naturally in soil."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Iridium is extremely insoluble and won't enter groundwater. Even at high concentrations, it stays locked in mineral grains."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Iridium has no biological function in plants or animals and doesn't generally affect crop growth or soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Iridium is environmentally stable and doesn't pose pollution risk at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "Iridium is used in spark plugs, precision compass bearings, aerospace equipment, and crucibles built to hold chemicals so corrosive they'd eat through almost anything else."
      },
      {
        "title": "Prevalence",
        "body": "Iridium is extremely rare, averaging about 0.001 ppm (0.0000001%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Iridium was discovered in 1803 by Smithson Tennant, alongside osmium."
      }
    ]
  },
  "PT": {
    "name": "Platinum",
    "symbol": "Pt",
    "atomicNumber": 78,
    "sections": [
      {
        "title": "Fun fact",
        "body": "When Spanish conquistadors first encountered platinum in South America, they called it platina—\"little silver\"—because they thought it was just an inferior version of the real thing. They literally threw it away. Today, platinum is worth more than gold and is one of the most sought-after metals on Earth. Worst call in mining history."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly. Platinum is extremely rare in natural soils (typical levels are below 0.01 ppm). Detecting it at 5–10 ppm or higher is unusual and has historically been associated with platinum-group metal (PGM) mineralization. Platinum typically occurs alongside palladium, iridium, and osmium. However, what it means for your specific land is a question for a professional. See [hyperlink] for more information."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Platinum metal in soil is considered biologically inert and isn't toxic to people, pets, or wildlife at natural levels (below about 50 ppm). Hazardous platinum compounds don't form naturally in soil. Some sensitive individuals may experience mild skin irritation from dust exposure, but that's uncommon."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Platinum doesn't dissolve in water and won't affect groundwater or drinking wells. It remains bound to soil and sand particles, even in areas of high concentration."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Platinum isn't used by plants or animals, and its presence in soil doesn't generally affect crop growth or soil fertility."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Platinum is stable, nonreactive, and doesn't pose known environmental risk at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "Platinum is used in catalytic converters, jewelry, lab equipment, and fuel cells. It's also a key ingredient in cancer treatment drugs like cisplatin."
      },
      {
        "title": "Prevalence",
        "body": "Platinum is extremely rare, averaging about 0.005 ppm (0.0000005%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Platinum was used by Indigenous peoples in South America long before Europeans encountered it—it was formally recognized as a distinct metal by European chemists in the mid-18th century."
      }
    ]
  },
  "AU": {
    "name": "Gold",
    "symbol": "Au",
    "atomicNumber": 79,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Gold doesn't rust or tarnish—which is one reason humans have prized it for thousands of years. It's also the most malleable metal on Earth—36 pounds of it could be hammered into a sheet large enough to cover a football field."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially. The typical background level is under 0.01 ppm, and historically, readings over 5 ppm have been associated with natural mineral deposits from eroded gold veins or nearby bedrock. Most people only conduct targeted sampling, panning in nearby drainages, or small-scale exploration to determine whether recoverable gold is present if their soil detection levels are above 5 ppm. See [hyperlink] for more."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Gold is biologically inert—it doesn't react with the body or the environment in harmful ways. Even soils with several hundred ppm typically pose no known health concern for humans or pets."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal impact. Gold is one of the least soluble elements in nature—it doesn't dissolve into groundwater or drinking water. Even at elevated levels, it's unlikely to affect water quality in any meaningful way."
      },
      {
        "title": "Agricultural relevance",
        "body": "Minimal relevance. Gold doesn't have a known biological or nutritional role in plants or animals. At the levels found in most soils, it's unlikely to affect livestock, crop growth, or soil health."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable. Natural gold in soil is essentially inert and doesn't pose environmental concerns on its own. If issues arise, they're almost always tied to gold extraction methods—like mercury or cyanide leaching—not the element itself."
      },
      {
        "title": "Uses",
        "body": "Gold shows up in jewelry, coins, electronics, dentistry, and even spacecraft—its ability to reflect radiation and never tarnish makes it uniquely useful in the most demanding environments on Earth (and beyond). What you might not expect: there's a tiny amount of gold in every pregnancy test, where gold nanoparticles are what make the test line appear."
      },
      {
        "title": "Prevalence",
        "body": "Gold is extremely rare, averaging about 0.004 ppm (0.0000004%) in Earth's crust. That's only 4 parts per billion!"
      },
      {
        "title": "Discovery",
        "body": "Gold has been known and valued since before recorded history."
      }
    ]
  },
  "HG": {
    "name": "Mercury",
    "symbol": "Hg",
    "atomicNumber": 80,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "The phrase \"mad as a hatter\" isn't just an expression—it comes from a real occupational hazard. In the 18th and 19th centuries, hat makers used mercury to cure felt, and the chronic exposure left many of them with tremors, mood swings, and confusion. Mercury is one of the few elements that changed the English language on its way to being banned."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Mercury in soil is a serious contaminant, not a resource. Natural background levels are typically below 0.05 ppm. Mercury has been mined historically from cinnabar ore at concentrations of 1,000+ ppm, but at anything approaching those levels, the contamination and health concerns would be the dominant story—not the extraction potential."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, and one of the most well-known toxicity concerns in soil science. Most soils naturally contain less than 0.05 ppm mercury. Above about 0.3 ppm, soil is generally considered contaminated, and long-term exposure has been linked to neurological damage, memory loss, and developmental issues—especially from methylmercury, a form that builds up in the food chain. The U.S. Environmental Protection Agency (EPA) sets its residential soil screening level at 23 ppm. Mercury is an element regulators take seriously at almost any elevation—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Significant concern. Mercury can move from soil into groundwater or surface water, especially under flooded or organic-rich conditions where it transforms into methylmercury—a highly toxic form that builds up in aquatic food chains. The EPA drinking water limit is 0.002 ppm (2 µg/L). Even soils around 0.3 ppm can slowly raise local water mercury levels through erosion or runoff."
      },
      {
        "title": "Agricultural relevance",
        "body": "A concern in contaminated soils. Mercury isn't a nutrient and can harm plants and animals even at low concentrations. Crops grown in soils above 0.3 ppm may absorb trace mercury, especially root and leafy vegetables—the kind of reading that sometimes prompts further investigation into what's being grown."
      },
      {
        "title": "Environmental considerations",
        "body": "A well-known environmental pollutant. Mercury contamination is typically linked to old mining sites, industrial waste, or atmospheric deposition from burning coal. Soils above 0.3 ppm are generally considered contaminated, and levels above 1 ppm are the kind that tend to get environmental agencies' attention."
      },
      {
        "title": "Uses",
        "body": "Mercury was once common in thermometers, dental fillings, fluorescent lamps, and industrial catalysts. Today, most of those uses are restricted or being phased out because of toxicity concerns."
      },
      {
        "title": "Prevalence",
        "body": "Mercury is very rare, averaging about 0.085 ppm (0.0000085%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Mercury has been known since antiquity."
      }
    ]
  },
  "TL": {
    "name": "Thallium",
    "symbol": "Tl",
    "atomicNumber": 81,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Thallium was once widely used in rat poison and became so notorious as a murder weapon that it earned the nickname \"the poisoner's poison\"—colorless, odorless, and almost undetectable. It's shown up in so many real-world poisoning cases and spy novels that some countries banned its sale entirely."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Not realistically. Thallium is used in electronics and glass manufacturing, but it's rare and highly toxic. Natural soils contain less than 0.1 ppm, and commercially relevant thallium concentrations typically start around 100–500+ ppm in ore—levels that would represent severe contamination in a soil context long before they'd represent an extraction opportunity."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, and one of the more toxic metals in soil. Most soils naturally contain less than 0.1 ppm thallium—above about 1 ppm, it's considered contaminated. Chronic exposure has been linked to hair loss, nerve damage, and cardiovascular problems, with health risks increasing sharply above 5 ppm. Thallium is an element regulators take seriously—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Significant concern at elevated levels. Thallium dissolves relatively easily in groundwater under oxidizing conditions, especially near sulfide minerals or industrial waste. The U.S. Environmental Protection Agency (EPA) sets its drinking water limit at 0.002 ppm (2 µg/L). Soil concentrations above 1 ppm can leach into groundwater over time."
      },
      {
        "title": "Agricultural relevance",
        "body": "A concern in contaminated soils. Thallium isn't a nutrient but can be absorbed by plants, particularly leafy vegetables and grains. In soils above 1 ppm, plant uptake is the kind of reading that sometimes prompts closer attention to what's being grown."
      },
      {
        "title": "Environmental considerations",
        "body": "A known pollutant at elevated levels. Thallium contamination often comes from coal combustion, metal smelting, and cement production. Above about 1–2 ppm, it can bioaccumulate in ecosystems and harm birds and mammals—levels in that range are the kind that tend to get environmental agencies' attention."
      },
      {
        "title": "Uses",
        "body": "Thallium is used today in electronics and some optical materials."
      },
      {
        "title": "Prevalence",
        "body": "Thallium is rare, averaging about 0.85 ppm (0.000085%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Thallium was discovered in 1861 by William Crookes—its name comes from the Greek thallos (\"green shoot\") for the vivid green spectral line that gave it away."
      }
    ]
  },
  "PB": {
    "name": "Lead",
    "symbol": "Pb",
    "atomicNumber": 82,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Lead has been used for thousands of years—from Roman plumbing to gasoline and paint—with devastating health consequences. The word \"plumbing\" even comes from plumbum, Latin for lead."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Probably not—lead in soil is generally considered a liability, not an asset. While levels around 10,000-30,000 ppm might theoretically suggest recoverable material, these levels are also far past the levels that raise serious environmental and health concern."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes—lead is one of the most well-known heavy metal concerns for human health, particularly for children and pregnant women, where developing brains are especially sensitive to its effects. It can also affect the nervous system and kidneys. Natural background levels are usually under 20 ppm. The U.S. Environmental Protection Agency (EPA) flags soils above 80–100 ppm as unsafe for play areas or gardens, and soils above 400 ppm require mitigation before human exposure—[hyperlink] has more on what that means."
      },
      {
        "title": "Impact on water quality",
        "body": "Possible. Lead can leach into groundwater or well water from pipes or contaminated soil, particularly when water is acidic or low in minerals. The EPA's drinking water limit is 0.015 mg/L. Soil levels above 100 ppm near a water source are the kind that prompt some homeowners to treat or isolate the area to prevent leaching."
      },
      {
        "title": "Agricultural relevance",
        "body": "No nutritional role. Lead isn't taken up by plants the way nutrients are, but trace amounts can be absorbed through roots or deposited on leaves as dust. Levels above 100 ppm may produce food unsafe to eat, especially leafy greens and root vegetables. Urban garden soils in particular have a higher chance of having higher lead levels."
      },
      {
        "title": "Environmental considerations",
        "body": "Lead is one of the more persistent elements in soil—it doesn't break down over time. At higher concentrations (above 400 ppm), it can affect wildlife, particularly birds and aquatic species exposed through runoff. Levels in that range are the kind that tend to get environmental agencies' attention."
      },
      {
        "title": "Uses",
        "body": "Lead still shows up in car batteries, ammunition, and radiation shielding. It was once widely used in paint and gasoline additives—uses that have since been banned or heavily restricted in the U.S."
      },
      {
        "title": "Prevalence",
        "body": "Lead is uncommon, averaging about 14 ppm (0.0014%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Lead has been known and used since antiquity."
      }
    ]
  },
  "BI": {
    "name": "Bismuth",
    "symbol": "Bi",
    "atomicNumber": 83,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Bismuth crystals look like something out of a sci-fi movie—they grow into rainbow-colored stair-step shapes that shimmer with purple, green, and gold. It's one of the most visually striking elements on the periodic table, and you can actually grow them yourself at home on a stovetop. Not many elements double as art projects."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Potentially, though it's rare. Normal soils contain less than 1 ppm bismuth. Levels above 10–20 ppm may indicate mineralization associated with lead, copper, or tungsten ores. Further testing [hyperlink] is an option when levels are that elevated."
      },
      {
        "title": "Is it toxic?",
        "body": "Generally, no. Bismuth in soil below about 100 ppm isn't considered a concern. At very high levels (hundreds of ppm), it could irritate the stomach or kidneys in people, pets, or wildlife—but concentrations that high are uncommon outside mining or industrial settings."
      },
      {
        "title": "Impact on water quality",
        "body": "Minimal. Bismuth compounds are generally stable and insoluble, so they rarely move into groundwater."
      },
      {
        "title": "Agricultural relevance",
        "body": "No known role. Bismuth isn't biologically active in plants or animals and doesn't affect soil fertility at naturally occurring levels."
      },
      {
        "title": "Environmental considerations",
        "body": "Minimal concern. Bismuth is stable and environmentally benign in soil. It doesn't bioaccumulate or pose known risks to aquatic life at naturally occurring levels."
      },
      {
        "title": "Uses",
        "body": "You've probably swallowed bismuth before—it's the active ingredient in Pepto-Bismol. Bismuth also shows up in makeup, paints, sprinkler systems, and low-melting safety devices. It's also increasingly used as a safer replacement for lead in bullets and plumbing."
      },
      {
        "title": "Prevalence",
        "body": "Bismuth is extremely rare, averaging about 0.0085 ppm (0.00000085%) in Earth's crust—though it's actually about twice as common as gold."
      },
      {
        "title": "Discovery",
        "body": "Bismuth has been known since ancient times, though it took centuries before it was confirmed as its own element rather than a form of lead or tin."
      }
    ]
  },
  "PO": {
    "name": "Polonium",
    "symbol": "Po",
    "atomicNumber": 84,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Polonium is so radioactive that a speck smaller than a grain of sand can be lethal. It gained worldwide attention in 2006 when it was used to poison former Russian spy Alexander Litvinenko in London—an assassination so unusual that investigators had to trace a radioactive trail across an entire city. Thankfully, natural soils contain virtually none of it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Polonium is far too radioactive and unstable to be safely handled or commercially extracted. Any detection in a soil sample would almost certainly trace back to uranium-bearing minerals or contamination."
      },
      {
        "title": "Is it toxic?",
        "body": "Extremely. Even microscopic amounts of polonium are highly radioactive and can be lethal if ingested or inhaled. Natural soils rarely contain measurable amounts—background levels are typically far below 0.001 ppm."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally not a concern in natural soils. Polonium doesn't dissolve easily but can enter groundwater near uranium ore zones or mine waste. Water exceeding 0.015 pCi/L (the EPA's drinking water screening level for alpha radiation) may pose a radiation risk."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Polonium provides no known benefit to plants or animals and would be dangerous if present in meaningful amounts."
      },
      {
        "title": "Environmental considerations",
        "body": "Any measurable polonium in a soil sample suggests nearby uranium or thorium decay. It decays quickly, so persistent detection could indicate an active radiological source—[hyperlink] has more resources for situations like these."
      },
      {
        "title": "Uses",
        "body": "Polonium has been used in nuclear batteries for spacecraft and in specialized equipment that needs a compact heat or radiation source."
      },
      {
        "title": "Prevalence",
        "body": "Polonium is essentially absent from Earth's crust—it only exists briefly as a decay product of uranium before breaking down itself."
      },
      {
        "title": "Discovery",
        "body": "Polonium was discovered in 1898 by Marie and Pierre Curie, who named it after Marie's homeland of Poland."
      }
    ]
  },
  "AT": {
    "name": "Astatine",
    "symbol": "At",
    "atomicNumber": 85,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Astatine is basically the unicorn of the periodic table. There may only be a few grams of it on Earth at any given time, and the longest-lived version vanishes in just a few hours. It's so rare and so fleeting that most of what scientists know about it is based on predictions rather than experiments."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Astatine is too unstable to collect or sell. It exists only in trace, short-lived forms created by the decay of uranium and thorium, and disappears within hours."
      },
      {
        "title": "Is it toxic?",
        "body": "Potentially, but exposure is virtually impossible. Natural soil concentrations are far below 0.000001 ppm, and astatine decays so rapidly that it poses no realistic health risk under any normal conditions."
      },
      {
        "title": "Impact on water quality",
        "body": "Not a concern. Astatine hardly ever persists long enough to affect groundwater. Any trace production from natural radioactivity vanishes almost instantly."
      },
      {
        "title": "Agricultural relevance",
        "body": "None—plants and animals hardly ever encounter measurable amounts of astatine."
      },
      {
        "title": "Environmental considerations",
        "body": "Purely a scientific curiosity. Astatine decays within hours and doesn't accumulate in soils, water, or living systems."
      },
      {
        "title": "Uses",
        "body": "Scientists have experimented with astatine for targeted cancer treatments—its radiation can destroy tumor cells with minimal damage to surrounding tissue—but it's too unstable to be useful commercially."
      },
      {
        "title": "Prevalence",
        "body": "Astatine is essentially absent from Earth's crust—it only flickers into existence briefly as uranium and thorium decay, with just a few grams estimated to exist on Earth at any given time."
      },
      {
        "title": "Discovery",
        "body": "Astatine was discovered in 1940 by Dale Corson, Kenneth MacKenzie, and Emilio Segrè at the University of California, Berkeley."
      }
    ]
  },
  "RA": {
    "name": "Radium",
    "symbol": "Ra",
    "atomicNumber": 88,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Radium used to be painted on watch dials to make them glow in the dark. The workers who applied it—known as the \"Radium Girls\"—were told it was safe and even licked their brushes to get a fine point. Many were poisoned by radiation. Their story helped establish some of the first workplace safety laws around radioactive materials."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Radium is radioactive and tightly regulated—it can't be safely extracted or sold."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes. Radium emits alpha particles that can cause cancer if inhaled or ingested. Natural soil levels are usually less than 0.5 pCi/g (about 0.02 ppm). Levels above 5 pCi/g are the kind that regulatory agencies flag for residential settings—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Worth noting. Radium can leach into groundwater from uranium-rich rocks or mine waste. Drinking water exceeding 5 pCi/L (the EPA limit) poses a health concern—levels that high sometimes prompt homeowners to look into water treatment options."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Plants don't use or benefit from radium, though roots may absorb small amounts if soils are contaminated."
      },
      {
        "title": "Environmental considerations",
        "body": "Worth watching. Radium decays into radon gas, which can accumulate in basements or enclosed spaces. Elevated soil radium is the kind of reading that sometimes prompts homeowners to test for radon as well."
      },
      {
        "title": "Uses",
        "body": "Radium was once used in medicines, health tonics, and even toothpaste—all before people understood how dangerous it was. Today, it's mainly studied as a radioactive material with no commercial applications."
      },
      {
        "title": "Prevalence",
        "body": "Radium is essentially absent from Earth's crust on its own—it only exists as a decay product of uranium and is continuously produced and breaking down."
      },
      {
        "title": "Discovery",
        "body": "Radium was discovered in 1898 by Marie and Pierre Curie while studying pitchblende, a uranium-rich mineral ore."
      }
    ]
  },
  "AC": {
    "name": "Actinium",
    "symbol": "Ac",
    "atomicNumber": 89,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Actinium glows faint blue in the dark—not from reflected light, but from its own intense radiation exciting the air around it. Think of it as a natural nightlight, except one you should never, ever get near."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Actinium is extremely rare, radioactive, and short-lived. It only appears in trace amounts as uranium decays, so extraction isn't commercially viable."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes. Actinium is highly radioactive and can cause radiation poisoning if ingested or inhaled. Natural soil levels are vanishingly small, though—typically less than 0.00001 ppm, far below any realistic danger—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally not a concern. Actinium doesn't dissolve easily in water, though trace amounts can occur near uranium ore zones. Levels above 0.03 pCi/L would be unusual and could indicate nearby radioactive decay."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Plants don't use actinium, and its intense radioactivity would make it harmful if taken up in any meaningful amount."
      },
      {
        "title": "Environmental considerations",
        "body": "Detecting actinium in a soil sample indicates nearby uranium or thorium decay. Though actinium itself decays quickly, any measurable amount suggests other radioactive elements like uranium and radium may be present as well."
      },
      {
        "title": "Uses",
        "body": "Actinium is used in nuclear research and, in tiny amounts, in experimental cancer therapies—its radiation can be targeted to destroy specific cells."
      },
      {
        "title": "Prevalence",
        "body": "Actinium is essentially absent from Earth's crust—it only appears briefly as a product of uranium decay and doesn't accumulate in soil."
      },
      {
        "title": "Discovery",
        "body": "Actinium was discovered in 1899 by André-Louis Debierne while studying pitchblende, a uranium-rich mineral ore."
      }
    ]
  },
  "TH": {
    "name": "Thorium",
    "symbol": "Th",
    "atomicNumber": 90,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Thorium has one of the longest half-lives of any element—about 14 billion years. Every atom of thorium in the ground has been decaying since the element first formed, and it'll keep going for billions more. Patience isn't usually a word you'd use for a radioactive element, but thorium earns it."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly, but only at very high concentrations. Natural soils typically contain 5–10 ppm thorium. Levels above 100 ppm could indicate thorium-bearing mineral sands or granitic deposits—the kind historically associated with mining activity. Commercially relevant thorium ores usually run into the thousands of ppm, and at those concentrations, the radioactivity concerns would be significant."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, though less acutely than many radioactive elements. Thorium is a suspected carcinogen, and long-term exposure through inhalation or ingestion can increase cancer risk. Most soils naturally contain 5–10 ppm, and background levels below 10 ppm generally pose no known health concern. Above that range, thorium is an element worth paying attention to—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally low concern. Thorium doesn't dissolve easily, so it rarely affects groundwater under normal conditions. In soils above about 20 ppm, runoff from thorium-rich ground or mining waste can carry radioactive material into nearby water sources."
      },
      {
        "title": "Agricultural relevance",
        "body": "None. Plants and animals don't use thorium, and its presence doesn't generally affect soil fertility or crop quality."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally stable at natural levels. Thorium-rich areas (above about 30 ppm) don't typically pose risk unless soil is disturbed through construction or mining, which can release radioactive dust or carry thorium into nearby waterways. Undisturbed thorium-bearing soils tend to stay put."
      },
      {
        "title": "Uses",
        "body": "Thorium was once used in camping lantern mantles and welding rods—and today, scientists are exploring it as a potentially safer nuclear fuel alternative to uranium."
      },
      {
        "title": "Prevalence",
        "body": "Thorium is rare, averaging about 9.6 ppm (0.00096%) in Earth's crust—surprisingly abundant for a radioactive element, and more common than uranium."
      },
      {
        "title": "Discovery",
        "body": "Thorium was discovered in 1829 by Jöns Jakob Berzelius."
      }
    ]
  },
  "PA": {
    "name": "Protactinium",
    "symbol": "Pa",
    "atomicNumber": 91,
    "sections": [
      {
        "title": "Fun fact",
        "body": "Protactinium is so rare that scientists once spent over a decade processing tons of uranium ore just to collect a couple of ounces of it. Even then, what they had was dangerously radioactive and decaying the whole time. Not many elements make you work that hard and then try to disappear on you."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "No. Protactinium is one of the rarest elements on Earth and exists only as a fleeting product of uranium decay. Natural soil levels are far below 0.001 ppm, making extraction impossible."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes. Protactinium is highly radioactive and dangerous if inhaled or ingested, though environmental levels are far too low to pose a realistic threat under normal conditions."
      },
      {
        "title": "Impact on water quality",
        "body": "Generally not a concern. Protactinium doesn't dissolve easily and rarely affects groundwater. Trace amounts can appear near uranium-rich formations, but meaningful water contamination is extremely unlikely."
      },
      {
        "title": "Agricultural relevance",
        "body": "None—plants and animals do not use protactinium, and it offers no agricultural value."
      },
      {
        "title": "Environmental considerations",
        "body": "Generally not a concern. Protactinium doesn't dissolve easily and rarely affects groundwater. Trace amounts can appear near uranium-rich formations, but meaningful water contamination is extremely unlikely."
      },
      {
        "title": "Uses",
        "body": "Protactinium has no industrial applications—it's too rare and too radioactive for practical use. Its main value is in nuclear science research."
      },
      {
        "title": "Prevalence",
        "body": "Protactinium is essentially absent from Earth's crust—it exists only in fleeting trace amounts as uranium decays, making it one of the scarcest naturally occurring elements."
      },
      {
        "title": "Discovery",
        "body": "Protactinium was discovered in 1913 by Lise Meitner and Otto Hahn in uranium ore."
      }
    ]
  },
  "U": {
    "name": "Uranium",
    "symbol": "U",
    "atomicNumber": 92,
    "sections": [
      {
        "title": "Not-so-fun fact",
        "body": "Before uranium became synonymous with nuclear power, it was used as a coloring agent in ceramics and glassware. Vintage \"uranium glass\" glows an eerie bright green under UV light—and there's a good chance some of it is sitting in antique shops right now. Collectors love it. Health agencies are less enthusiastic."
      },
      {
        "title": "Is this element generally monetizable?",
        "body": "Possibly—but only at very high levels, and with major caveats. Typical soils contain around 1–3 ppm uranium. Values above 50 ppm suggest unusual geological enrichment. Commercially mined uranium ores typically run 1,000+ ppm, and at those concentrations, the radiation hazards and regulatory requirements would be the dominant concern—uranium mining is among the most tightly controlled industries on the planet."
      },
      {
        "title": "Is it toxic?",
        "body": "Yes, both chemically and radiologically. Most soils naturally contain 1–3 ppm uranium. Above about 30 ppm, levels are considered elevated, and long-term exposure through dust inhalation or ingestion has been linked to kidney damage and increased cancer risk. Above 100 ppm, uranium is the kind of reading that gets serious regulatory attention. Uranium is an element worth understanding thoroughly—[hyperlink] has more resources if you want to dig deeper."
      },
      {
        "title": "Impact on water quality",
        "body": "Significant concern. Uranium is mobile in groundwater, especially in oxygen-rich or carbonate-bearing water. The U.S. Environmental Protection Agency (EPA) sets its drinking water limit at 0.03 ppm (30 µg/L). Soils with concentrations above 10–20 ppm can leach uranium into nearby wells or aquifers over time."
      },
      {
        "title": "Agricultural relevance",
        "body": "Not a nutrient, and a concern in contaminated soils. Uranium can accumulate in plants at low levels if the soil is enriched. Concentrations above about 10 ppm may lead to measurable uranium in crops—though the health concern is primarily about long-term human exposure through diet rather than direct effects on the plants themselves."
      },
      {
        "title": "Environmental considerations",
        "body": "A well-known concern at elevated levels. Uranium contamination often originates from natural granitic formations, phosphate fertilizers, or legacy mining sites. When soil exceeds 30–50 ppm, radioactive decay products like radium and radon can accumulate—radon gas in particular can seep into basements and enclosed spaces. Levels above 100 ppm are the kind that typically get environmental agencies' attention."
      },
      {
        "title": "Uses",
        "body": "Uranium fuels nuclear reactors, is used in armor-piercing ammunition, and provides the basis for radiometric dating—the technique geologists use to determine the age of rocks and the Earth itself."
      },
      {
        "title": "Prevalence",
        "body": "Uranium is rare, averaging about 2.7 ppm (0.00027%) in Earth's crust."
      },
      {
        "title": "Discovery",
        "body": "Uranium was first identified in 1789 by Martin Heinrich Klaproth, who named it after the recently discovered planet Uranus."
      }
    ]
  }
};
