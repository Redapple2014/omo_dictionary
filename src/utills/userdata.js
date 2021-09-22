import { Value } from "react-native-reanimated";

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
        displayTranslatorExample:false
    },
    Flashcard:{
        defaultFlashcard:'',
        defaultCategoryTapHoldSection:false,
        promptForCategory:false,
        dailyPracticeReminder:true,
        reminderTime:'17:00'
    }
}
