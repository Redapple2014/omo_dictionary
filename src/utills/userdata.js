export const userMenu1 = [
    {
        id: 1,
        label: "DisplaylanguageText"
    },
    {
        id: 2,
        label: "DictionaryText"
    },
    {
        id: 3,
        label: "FlashcardsText"
    }
];

export const userMenu2 = [
    {
        id: 1,
        label: "SendFeedbackText"
    },
    {
        id: 2,
        label: "RateOnTheAppStoreText",
        alter: "RateOnThePlayStoreText"
    },
    {
        id: 3,
        label: "ShareWithFriendsText"
    },
    {
        id: 4,
        label: "AboutOmoKoreanText"
    }
]

export const languageList = [
    {
        id: 1,
        label: "English",
        value: "en"
    },
    {
        id: 2,
        label: "Chinese(중국인)",
        value: "zh"
    },
    {
        id: 3,
        label: "Vietnamese(Tiếng Việt)",
        value: "vi"
    },
    {
        id: 4,
        label: "Mongolin(Монгол)",
        value: "mn"
    },
    {
        id: 5,
        label: "Japanese(日本)",
        value: "ja"
    }
]

export const defaultSettings = {
    DisplayLanguage: {
        id: 1,
        label: "English",
        value: "en"
    },
    Dictionary: {
        language: {
            id: 1,
            label: "English",
            value: "en"
        },
        showKoreanDefinition: false,
        showExamples: false,
        displayRomaja: false,
        displayTranslatorExample: false
    },
    Flashcard: {
        defaultFlashcard: '',
        defaultCategoryTapHoldSection: false,
        promptForCategory: false,
        dailyPracticeReminder: true,
        reminderTime: '17:00'
    }
}

export const lexicalUnit = {
    "구": "phrase",
    "단어": "word",
    "문법‧표현": "grammar / expression",
    "관용구": "idiom",
    "속담": "proverb"
}

export const partofspeech = {
    "감탄사": "interjection",
    "관형사": "determiner",
    "대명사": "pronoun",
    "동사": "verb",
    "명사": "noun",
    "보조 동사": "auxiliary verb",
    "보조 형용사": "auxiliary adjective",
    "부사": "adverb",
    "수사": "numeral",
    "어미": "word ending",
    "의존 명사": "dependent noun",
    "접사": "affix",
    "조사": "preposition",
    "품사 없음": "none",
    "형용사": "adjective"
}

export const listOfpartofSpeechArr = [
    '감탄사',
    '관형사',
    '대명사',
    '동사',
    '명사',
    '보조 동사',
    '보조 형용사',
    '부사',
    '수사',
    '어미',
    '의존 명사',
    '접사',
    '조사',
    '품사 없음',
    '형용사',
  ];

export const vocabularyLevel = {
    "고급": 1,
    "없음": 0,
    "중급": 2,
    "초급": 3
}

export const wordForm = {
    "발음": "pronunciation",
    "활용": "application"
}

export const formRepresentation = {
    "준말": "abbreviation"
}

export const relatedForm = {
    "파생어": "derivative",
    "가봐라": "go on"
}

export const senseRelation = {
    "유의어": "synonym",
    "반대말": "antonym",
    "참고어": "reference",
    "큰말": "heavy",
    "본말": "original",
    "작은말": "light",
    "낮춤말": "familiar",
    "준말": "abbreviation",
    "높임말": "honorific",
    "센말": "emphatic",
    "여린말": "soft"
}

export const senseExample = {
    "구": "word",
    "문장": "sentence",
    "대화": "conversation",
    "1": "none"
}

export const language = {
    "몽골어": "Mongolian",
    "베트남어": "Vietnamese",
    "타이어": "Thai",
    "인도네시아어": "Indonesian",
    "러시아어": "Russian",
    "영어": "English",
    "일본어": "Japanese",
    "프랑스어": "French",
    "스페인어": "Spanish",
    "아랍어": "Arabic",
    "중국어": "Chinese",
}

export const forntDisplay = [
    {
        id: 1,
        name: 'Korean Hangul Handword',
        value: true
    },
    {
        id: 2,
        name: 'Hanja Handword',
        value: false
    },
    {
        id: 3,
        name: 'Part of Speech',
        value: false
    },
    {
        id: 4,
        name: 'Audio',
        value: false
    },
    {
        id: 5,
        name: 'Definition',
        value: false
    }
]

export const defaultFlashcardTestSettings = {
    limtMaxTestLength: true,
    maxLength: 20,
    limitNewCards:false,
    reviewIncurrectAtTestEnd:true
}