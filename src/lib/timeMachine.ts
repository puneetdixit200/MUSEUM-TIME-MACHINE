import {
  MAX_YEAR,
  MIN_YEAR,
  getCenturyRange,
  normalizeAuthorName,
} from "@/data/eraConfig";

export type ArtworkData = {
  id: string;
  title: string;
  artist: string;
  date: string;
  year: number;
  medium: string;
  department: string;
  imageUrl: string;
  previewImageUrl?: string;
  fallbackImageUrl?: string;
  source: string;
  sourceUrl?: string;
  dimensions?: string;
  culture?: string;
  repository?: string;
};

export type PoemData = {
  title: string;
  author: string;
  lines: string[];
  lineCount: number;
  source: string;
};

export type AudioStation = {
  name: string;
  streamUrl: string;
  homepage?: string;
};

export type YearRange = {
  start: number;
  end: number;
};

const FALLBACK_ARTWORKS: ArtworkData[] = [
  {
    id: "fallback-early-renaissance",
    title: "The Arnolfini Portrait",
    artist: "Jan van Eyck",
    date: "1434",
    year: 1434,
    medium: "Oil on oak panel",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Van_Eyck_-_Arnolfini_Portrait.jpg",
    source: "Curated fallback",
    repository: "National Gallery, London",
  },
  {
    id: "fallback-renaissance",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    date: "c. 1503-1519",
    year: 1503,
    medium: "Oil on poplar panel",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
    source: "Curated fallback",
    repository: "Musee du Louvre",
  },
  {
    id: "fallback-baroque",
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    date: "1642",
    year: 1642,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/The_Nightwatch_by_Rembrandt.jpg",
    source: "Curated fallback",
    repository: "Rijksmuseum",
  },
  {
    id: "fallback-romantic",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    date: "1889",
    year: 1889,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    source: "Curated fallback",
    repository: "Museum of Modern Art",
  },
  {
    id: "fallback-modern",
    title: "Composition with Red, Blue and Yellow",
    artist: "Piet Mondrian",
    date: "1930",
    year: 1930,
    medium: "Oil on canvas",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
    source: "Curated fallback",
    repository: "Kunsthaus Zurich",
  },
  {
    id: "fallback-medieval",
    title: "The Wilton Diptych",
    artist: "Unknown English or French artist",
    date: "c. 1395-1399",
    year: 1395,
    medium: "Tempera on oak",
    department: "Painting",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Wilton_diptych.jpg",
    source: "Curated fallback",
    repository: "National Gallery, London",
  },
];

export const FALLBACK_POEMS: PoemData[] = [
  {
    title: "Sumer Is Icumen In",
    author: "Anonymous",
    source: "Curated c. 1260",
    lineCount: 12,
    lines: [
      "Sumer is icumen in,",
      "Lhude sing cuccu!",
      "Groweth sed and bloweth med,",
      "And springth the wde nu;",
      "Sing cuccu!",
      "Awe bleteth after lomb,",
      "Lhouth after calve cu;",
      "Bulluc sterteth, bucke verteth,",
      "Murie sing cuccu!",
      "Cuccu, cuccu,",
      "Wel singes thu, cuccu;",
      "Ne swik thu naver nu.",
    ],
  },
  {
    title: "The Canterbury Tales: General Prologue",
    author: "Geoffrey Chaucer",
    source: "Curated c. 1387-1400",
    lineCount: 12,
    lines: [
      "Whan that Aprill with his shoures soote,",
      "The droghte of March hath perced to the roote,",
      "And bathed every veyne in swich licour,",
      "Of which vertu engendred is the flour;",
      "Whan Zephirus eek with his sweete breeth",
      "Inspired hath in every holt and heeth",
      "The tendre croppes, and the yonge sonne",
      "Hath in the Ram his half cours yronne,",
      "And smale foweles maken melodye,",
      "That slepen al the nyght with open ye,",
      "So priketh hem Nature in hir corages,",
      "Thanne longen folk to goon on pilgrimages.",
    ],
  },
  {
    title: "I Find No Peace",
    author: "Sir Thomas Wyatt",
    source: "Curated c. 1530s",
    lineCount: 14,
    lines: [
      "I find no peace, and all my war is done.",
      "I fear and hope. I burn and freeze like ice.",
      "I fly above the wind, yet can I not arise;",
      "And nought I have, and all the world I season.",
      "That loseth nor locketh holdeth me in prison",
      "And holdeth me not, yet can I scape no wise,",
      "Nor letteth me live nor die at my device,",
      "And yet of death it giveth me occasion.",
      "Without eyen I see, and without tongue I plain.",
      "I desire to perish, and yet I ask health.",
      "I love another, and thus I hate myself.",
      "I feed me in sorrow and laugh in all my pain;",
      "Likewise displeaseth me both life and death,",
      "And my delight is causer of this strife.",
    ],
  },
  {
    title: "Sonnet 18",
    author: "William Shakespeare",
    source: "Curated fallback",
    lineCount: 14,
    lines: [
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate:",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date;",
      "Sometime too hot the eye of heaven shines,",
      "And often is his gold complexion dimm'd;",
      "And every fair from fair sometime declines,",
      "By chance or nature's changing course untrimm'd;",
      "But thy eternal summer shall not fade,",
      "Nor lose possession of that fair thou owest;",
      "Nor shall death brag thou wanderest in his shade,",
      "When in eternal lines to time thou growest:",
      "So long as men can breathe or eyes can see,",
      "So long lives this, and this gives life to thee.",
    ],
  },
  {
    title: "On His Blindness",
    author: "John Milton",
    source: "Curated fallback",
    lineCount: 14,
    lines: [
      "When I consider how my light is spent,",
      "Ere half my days, in this dark world and wide,",
      "And that one Talent which is death to hide",
      "Lodged with me useless, though my Soul more bent",
      "To serve therewith my Maker, and present",
      "My true account, lest he returning chide;",
      "Doth God exact day-labour, light denied?",
      "I fondly ask. But patience, to prevent",
      "That murmur, soon replies, God doth not need",
      "Either man's work or his own gifts; who best",
      "Bear his mild yoke, they serve him best.",
      "They also serve who only stand and wait.",
    ],
  },
  {
    title: "Ode on Solitude",
    author: "Alexander Pope",
    source: "Curated fallback",
    lineCount: 20,
    lines: [
      "Happy the man, whose wish and care",
      "A few paternal acres bound,",
      "Content to breathe his native air,",
      "In his own ground.",
      "Whose herds with milk, whose fields with bread,",
      "Whose flocks supply him with attire,",
      "Whose trees in summer yield him shade,",
      "In winter fire.",
      "Blest, who can unconcernedly find",
      "Hours, days, and years slide soft away,",
      "In health of body, peace of mind,",
      "Quiet by day.",
    ],
  },
  {
    title: "The Tyger",
    author: "William Blake",
    source: "Curated 1794",
    lineCount: 12,
    lines: [
      "Tyger Tyger, burning bright,",
      "In the forests of the night;",
      "What immortal hand or eye,",
      "Could frame thy fearful symmetry?",
      "In what distant deeps or skies",
      "Burnt the fire of thine eyes?",
      "On what wings dare he aspire?",
      "What the hand, dare seize the fire?",
      "And what shoulder, and what art,",
      "Could twist the sinews of thy heart?",
      "And when thy heart began to beat,",
      "What dread hand? and what dread feet?",
    ],
  },
  {
    title: "Bright Star",
    author: "John Keats",
    source: "Curated c. 1819",
    lineCount: 14,
    lines: [
      "Bright star, would I were stedfast as thou art--",
      "Not in lone splendour hung aloft the night,",
      "And watching, with eternal lids apart,",
      "Like nature's patient, sleepless Eremite,",
      "The moving waters at their priestlike task",
      "Of pure ablution round earth's human shores,",
      "Or gazing on the new soft-fallen mask",
      "Of snow upon the mountains and the moors--",
      "No--yet still stedfast, still unchangeable,",
      "Pillow'd upon my fair love's ripening breast,",
      "To feel for ever its soft fall and swell,",
      "Awake for ever in a sweet unrest,",
      "Still, still to hear her tender-taken breath,",
      "And so live ever--or else swoon to death.",
    ],
  },
  {
    title: "Aedh Wishes for the Cloths of Heaven",
    author: "W. B. Yeats",
    source: "Curated fallback",
    lineCount: 8,
    lines: [
      "Had I the heavens' embroidered cloths,",
      "Enwrought with golden and silver light,",
      "The blue and the dim and the dark cloths",
      "Of night and light and the half-light,",
      "I would spread the cloths under your feet:",
      "But I, being poor, have only my dreams;",
      "I have spread my dreams under your feet;",
      "Tread softly because you tread on my dreams.",
    ],
  },
  {
    title: "The Road Not Taken",
    author: "Robert Frost",
    source: "Curated fallback",
    lineCount: 20,
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "Then took the other, as just as fair,",
      "And having perhaps the better claim,",
      "Because it was grassy and wanted wear;",
      "Though as for that the passing there",
      "Had worn them really about the same,",
      "And both that morning equally lay",
      "In leaves no step had trodden black.",
    ],
  },
];

export const CURATED_EARLY_POEMS_BY_CENTURY: Record<number, PoemData[]> = {
  1000: [
    {
      title: "The Wanderer",
      author: "Anonymous Old English poet",
      source: "Curated c. 10th-11th century",
      lineCount: 10,
      lines: [
        "Oft must the lonely one await his favor,",
        "The Maker's mercy, though heavy at heart",
        "Over the waterways long he must stir",
        "With hands grown cold upon the sea-road.",
        "Fate is fully fixed.",
        "So spoke the wanderer, mindful of hardships,",
        "Of cruel slaughters and the fall of kin.",
        "All this earth's kingdom becomes empty.",
        "Here wealth is fleeting; here friends are fleeting;",
        "Here man is fleeting; all this hall stands waste.",
      ],
    },
    {
      title: "Rubaiyat",
      author: "Omar Khayyam",
      source: "Curated c. 11th century",
      lineCount: 8,
      lines: [
        "Awake! for morning in the bowl of night",
        "Has flung the stone that puts the stars to flight.",
        "Dreaming when dawn's left hand was in the sky,",
        "I heard a voice within the tavern cry:",
        "Come, fill the cup, and in the fire of spring",
        "Your winter garment of repentance fling.",
        "The bird of time has but a little way",
        "To flutter, and the bird is on the wing.",
      ],
    },
    {
      title: "The Kingly Crown",
      author: "Solomon ibn Gabirol",
      source: "Curated c. 11th century",
      lineCount: 8,
      lines: [
        "Thine are the heavens and the earth is thine;",
        "Thou hast founded the world and its fullness.",
        "Wisdom is a fountain hidden in thy light,",
        "And understanding stands before thy throne.",
        "The soul that seeks thee crosses inward seas,",
        "Leaving the dust of narrow days behind.",
        "In silence it remembers its first home,",
        "And trembles at the gate of praise.",
      ],
    },
  ],
  1100: [
    {
      title: "O Strength of Eternity",
      author: "Hildegard of Bingen",
      source: "Curated c. 12th century",
      lineCount: 8,
      lines: [
        "O strength of eternity, ordering all things,",
        "In your heart all creatures are held.",
        "By your word they are clothed in beauty,",
        "By your breath the fields grow green.",
        "You gather the scattered into harmony,",
        "You bind the wounds of time with light.",
        "Let the living song rise upward,",
        "A flame returning to its source.",
      ],
    },
    {
      title: "Can vei la lauzeta mover",
      author: "Bernart de Ventadorn",
      source: "Curated c. 12th century",
      lineCount: 8,
      lines: [
        "When I see the lark move",
        "For joy against the sunbeam,",
        "Then forget herself and fall",
        "For sweetness that enters the heart,",
        "Such envy takes me of all I see",
        "That I marvel my heart does not melt.",
        "Love has taken me beyond counsel,",
        "And left me only song.",
      ],
    },
    {
      title: "Under der linden",
      author: "Walther von der Vogelweide",
      source: "Curated c. 12th century",
      lineCount: 8,
      lines: [
        "Under the linden on the heath,",
        "Where our two beds were made,",
        "There you may find, gently broken,",
        "Flowers and grass together laid.",
        "Before the wood, in a valley,",
        "Tandaradei sang the nightingale.",
        "No one knows where he lay with me,",
        "Save the little bird in the dale.",
      ],
    },
    {
      title: "Lanval",
      author: "Marie de France",
      source: "Curated c. 12th century",
      lineCount: 8,
      lines: [
        "I shall tell you of another lay,",
        "As the Bretons shaped it long ago.",
        "A knight was far from praise at court,",
        "Forgotten where bright favors flow.",
        "Then through the meadow came a maid,",
        "More radiant than the summer noon;",
        "She led him where the silk tents shone,",
        "And changed his exile into boon.",
      ],
    },
  ],
  1200: [
    {
      title: "The Reed Song",
      author: "Rumi",
      source: "Curated c. 13th century",
      lineCount: 8,
      lines: [
        "Listen to the reed, how it tells a tale,",
        "Complaining of separations.",
        "Since they cut me from the reed-bed,",
        "My cry has made men and women weep.",
        "I seek a heart torn open by parting,",
        "That I may unfold the pain of longing.",
        "Whoever is far from the source",
        "Desires the time of union again.",
      ],
    },
    {
      title: "Inferno, Canto I",
      author: "Dante Alighieri",
      source: "Curated c. 1308-1321",
      lineCount: 9,
      lines: [
        "Midway upon the journey of our life",
        "I found myself within a forest dark,",
        "For the straight pathway had been lost.",
        "Ah me, how hard a thing it is to say",
        "What was this forest savage, rough, and stern,",
        "Which in the very thought renews the fear.",
        "So bitter is it, death is little more;",
        "But to retell the good discovered there,",
        "I speak of other things I saw.",
      ],
    },
    {
      title: "The Rose Garden",
      author: "Saadi Shirazi",
      source: "Curated c. 1258",
      lineCount: 8,
      lines: [
        "The children of Adam are limbs of one body,",
        "Created from one precious essence.",
        "When time brings pain to a single limb,",
        "The other limbs cannot remain at rest.",
        "If you feel no grief for another's trouble,",
        "You are not worthy to be called by that name.",
        "A garden is kept by tenderness,",
        "And speech is fragrant when mercy blooms.",
      ],
    },
    {
      title: "Stabat Mater",
      author: "Jacopone da Todi",
      source: "Curated c. 13th century",
      lineCount: 8,
      lines: [
        "At the cross her station keeping,",
        "Stood the mournful mother weeping,",
        "Close to Jesus to the last.",
        "Through her soul, of joy bereaved,",
        "Bowed with anguish, deeply grieved,",
        "Now at length the sword had passed.",
        "O how sad and sore distressed",
        "Was that mother highly blessed.",
      ],
    },
  ],
  1300: [
    {
      title: "Canzoniere I",
      author: "Francesco Petrarca",
      source: "Curated c. 14th century",
      lineCount: 8,
      lines: [
        "You who hear in scattered rhymes the sound",
        "Of sighs on which I fed my heart in youth,",
        "When I was partly other than I am,",
        "For all the varied style in which I weep,",
        "Between vain hope and vain sorrow,",
        "May I find pity, not only pardon.",
        "I see clearly now how I became",
        "A tale long spoken among the people.",
      ],
    },
    {
      title: "The Canterbury Tales: General Prologue",
      author: "Geoffrey Chaucer",
      source: "Curated c. 1387-1400",
      lineCount: 12,
      lines: [
        "Whan that Aprill with his shoures soote,",
        "The droghte of March hath perced to the roote,",
        "And bathed every veyne in swich licour,",
        "Of which vertu engendred is the flour;",
        "Whan Zephirus eek with his sweete breeth",
        "Inspired hath in every holt and heeth",
        "The tendre croppes, and the yonge sonne",
        "Hath in the Ram his half cours yronne,",
        "And smale foweles maken melodye,",
        "That slepen al the nyght with open ye,",
        "So priketh hem Nature in hir corages,",
        "Thanne longen folk to goon on pilgrimages.",
      ],
    },
    {
      title: "Piers Plowman",
      author: "William Langland",
      source: "Curated c. 1370-1390",
      lineCount: 8,
      lines: [
        "In a summer season, when soft was the sun,",
        "I clothed myself in rough cloth as I were a shepherd.",
        "In habit like a hermit, unholy of works,",
        "I went wide in this world, wonders to hear.",
        "On a May morning on Malvern hills",
        "A marvel befell me, of fairy it seemed;",
        "I was weary with wandering and went to rest",
        "Under a broad bank by a brook's side.",
      ],
    },
    {
      title: "I Have a Noble Cock",
      author: "Anonymous Middle English poet",
      source: "Curated c. 14th century",
      lineCount: 8,
      lines: [
        "I have a noble cock,",
        "Croweth before the day;",
        "He makes me rise early",
        "My prayers for to say.",
        "I have a gentle bird",
        "Sings in the greenwood tree;",
        "He calls the light from darkness",
        "And morning back to me.",
      ],
    },
  ],
  1400: [
    {
      title: "Le temps a laisse son manteau",
      author: "Charles d'Orleans",
      source: "Curated c. 15th century",
      lineCount: 8,
      lines: [
        "The season has cast off its cloak",
        "Of wind and cold and rain,",
        "And put on embroidery",
        "Of shining sunlight again.",
        "There is no bird or beast",
        "That does not sing or cry:",
        "The season has cast off its cloak,",
        "And blue is all the sky.",
      ],
    },
    {
      title: "The Book of the City of Ladies",
      author: "Christine de Pizan",
      source: "Curated c. 1405",
      lineCount: 8,
      lines: [
        "I sat one day in my study enclosed,",
        "Surrounded by books of many kinds.",
        "My mind was weary from long reading,",
        "And strange opinions troubled my heart.",
        "Then reason came to me like a clear light,",
        "Justice and rectitude standing beside her.",
        "They bade me raise a city in words,",
        "Where noble women might safely dwell.",
      ],
    },
    {
      title: "Ballade of the Hanged",
      author: "Francois Villon",
      source: "Curated c. 1462",
      lineCount: 8,
      lines: [
        "Human brothers who live after us,",
        "Do not harden your hearts against us.",
        "If you have pity on our poor bodies,",
        "God will sooner have mercy on you.",
        "Here we are five or six, all hanging;",
        "Our flesh, once fed too well, is eaten.",
        "Bones and ashes, we become dust:",
        "Pray God that all may be absolved.",
      ],
    },
    {
      title: "Veles e vents",
      author: "Ausias March",
      source: "Curated c. 15th century",
      lineCount: 8,
      lines: [
        "Winds and seas shall carry out my will,",
        "Making doubtful paths across the water.",
        "The mistral and west wind will resist them,",
        "And their allies will rise against the storm.",
        "My heart goes where no harbor is promised,",
        "Driven by love through contrary weather.",
        "If I reach land, I shall still remember",
        "The sea that tested every sail.",
      ],
    },
    {
      title: "The King's Quair",
      author: "James I of Scotland",
      source: "Curated c. 1424",
      lineCount: 8,
      lines: [
        "Bewailing in my chamber thus alone,",
        "Despaired of all joy and remedy,",
        "I heard the bell ring toward the morn,",
        "And rose to look upon the world outside.",
        "The garden shone below the prison wall,",
        "Fresh with leaves and songs of birds;",
        "There first my heart beheld its star,",
        "And captivity became a court of love.",
      ],
    },
  ],
};

const RENAISSANCE_FALLBACK_POEMS = FALLBACK_POEMS.slice(1, 4);
const BAROQUE_FALLBACK_POEMS = FALLBACK_POEMS.slice(3, 6);
const ROMANTIC_FALLBACK_POEMS = FALLBACK_POEMS.slice(6, 8);
const MODERN_FALLBACK_POEMS = FALLBACK_POEMS.slice(8);

export function clampYear(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
}

export function timelinePercent(year: number): number {
  const clamped = clampYear(year);
  return Number(
    (((clamped - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100).toFixed(2),
  );
}

export function normalizeAicImageUrl(
  imageId: string | null,
  width = 1200,
): string | null {
  if (!imageId) {
    return null;
  }

  return `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;
}

export function createWikimediaThumbnailUrl(
  imageUrl: string,
  width = 720,
): string {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const isCommonsOriginal =
      url.hostname === "upload.wikimedia.org" &&
      parts[0] === "wikipedia" &&
      parts[1] === "commons" &&
      parts[2] !== "thumb";

    if (!isCommonsOriginal) {
      return imageUrl;
    }

    const fileName = parts[parts.length - 1];
    return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${fileName}?width=${width}`;
  } catch {
    return imageUrl;
  }
}

export function limitPoemLines(lines: string[], maxLines = 18): string[] {
  return lines.map((line) => line.trim()).filter(Boolean).slice(0, maxLines);
}

function addUniqueRange(ranges: YearRange[], start: number, end: number) {
  const range = {
    start: clampYear(Math.min(start, end)),
    end: clampYear(Math.max(start, end)),
  };

  if (
    ranges.some(
      (existing) => existing.start === range.start && existing.end === range.end,
    )
  ) {
    return;
  }

  ranges.push(range);
}

export function getArtworkSearchWindows(year: number): YearRange[] {
  const targetYear = clampYear(year);
  const ranges: YearRange[] = [];

  addUniqueRange(ranges, targetYear, targetYear);
  addUniqueRange(ranges, targetYear - 5, targetYear + 5);
  addUniqueRange(ranges, targetYear - 15, targetYear + 15);

  return ranges;
}

function expandShortRangeEnd(startYear: number, endText: string): number {
  if (endText.length >= String(startYear).length) {
    return Number(endText);
  }

  const scale = 10 ** endText.length;
  const prefix = Math.floor(startYear / scale) * scale;
  let endYear = prefix + Number(endText);

  if (endYear < startYear) {
    endYear += scale;
  }

  return endYear;
}

function parseArtworkDateRange(date: string): YearRange | null {
  const normalized = date.replace(/[–—]/g, "-");
  const ranges: YearRange[] = [];
  const rangePattern = /(\d{3,4})\s*-\s*(\d{1,4})/g;
  let rangeMatch: RegExpExecArray | null;

  while ((rangeMatch = rangePattern.exec(normalized))) {
    const startYear = Number(rangeMatch[1]);
    const endYear = expandShortRangeEnd(startYear, rangeMatch[2]);
    ranges.push({
      start: Math.min(startYear, endYear),
      end: Math.max(startYear, endYear),
    });
  }

  const yearPattern = /(?:^|[^\d])(\d{3,4})(?=$|[^\d])/g;
  let yearMatch: RegExpExecArray | null;

  while ((yearMatch = yearPattern.exec(normalized))) {
    const year = Number(yearMatch[1]);
    ranges.push({ start: year, end: year });
  }

  if (ranges.length === 0) {
    return null;
  }

  return {
    start: Math.min(...ranges.map((range) => range.start)),
    end: Math.max(...ranges.map((range) => range.end)),
  };
}

export function artworkDateOverlapsRange(
  date: string | undefined,
  fallbackYear: number | undefined,
  rangeStart: number,
  rangeEnd: number,
): boolean {
  const parsedRange = date ? parseArtworkDateRange(date) : null;
  const artworkRange =
    parsedRange ??
    (fallbackYear
      ? {
          start: fallbackYear,
          end: fallbackYear,
        }
      : null);

  if (!artworkRange) {
    return true;
  }

  return artworkRange.start <= rangeEnd && artworkRange.end >= rangeStart;
}

export function createFallbackArtwork(year: number): ArtworkData {
  const { start } = getCenturyRange(year);
  const sameCentury = FALLBACK_ARTWORKS.filter(
    (artwork) => artwork.year >= start && artwork.year <= start + 99,
  );
  const candidates = sameCentury.length > 0 ? sameCentury : FALLBACK_ARTWORKS;
  const match = candidates.reduce((closest, artwork) =>
    Math.abs(artwork.year - year) < Math.abs(closest.year - year)
      ? artwork
      : closest,
  );

  return {
    ...match,
    id: `${match.id}-${year}`,
    previewImageUrl: createWikimediaThumbnailUrl(match.imageUrl),
  };
}

export function getCuratedFallbackPoemsForYear(year: number): PoemData[] {
  const { start } = getCenturyRange(year);
  return CURATED_EARLY_POEMS_BY_CENTURY[start] ?? [];
}

export function getCuratedFallbackPoetNamesForYear(year: number): string[] {
  return getCuratedFallbackPoemsForYear(year).map((poem) => poem.author);
}

export function createFallbackPoem(
  year: number,
  excludedAuthors: string[] = [],
): PoemData {
  const choose = (poems: PoemData[]) => {
    const excluded = new Set(
      excludedAuthors.map(normalizeAuthorName).filter(Boolean),
    );
    const freshPoems = poems.filter(
      (poem) => !excluded.has(normalizeAuthorName(poem.author)),
    );
    const candidates = freshPoems.length > 0 ? freshPoems : poems;

    return candidates[(Math.abs(year) + 1) % candidates.length];
  };

  const earlyPoems = getCuratedFallbackPoemsForYear(year);
  if (earlyPoems.length > 0) {
    return choose(earlyPoems);
  }

  if (year < 1600) {
    return choose(RENAISSANCE_FALLBACK_POEMS);
  }

  if (year < 1750) {
    return choose(BAROQUE_FALLBACK_POEMS);
  }

  if (year < 1900) {
    return choose(ROMANTIC_FALLBACK_POEMS);
  }

  return choose(MODERN_FALLBACK_POEMS);
}
