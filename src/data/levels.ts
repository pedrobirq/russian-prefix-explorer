export interface ExerciseData {
  id: number;
  sentence: string;
  correctAnswer: string;
  options: string[];
}

export interface PrefixData {
  id?: number;
  prefix: string;
  meaning: string;
  resultWord: string;
  resultMeaning: string;
  example: string;
  exercises?: ExerciseData[];
}

export interface LevelData {
  id: number;
  baseVerb: string;
  baseMeaning: string;
  prefixes: PrefixData[];
  levelExercises?: ExerciseData[];
}

export const levels: LevelData[] = [
  {
    id: 1,
    baseVerb: "ходить",
    baseMeaning: "to walk / to go",
    prefixes: [
      {
        prefix: "в",
        meaning: "in / into",
        resultWord: "входить",
        resultMeaning: "to enter",
        example: "Он входит в комнату. (He enters the room.)",
      },
      {
        prefix: "вы",
        meaning: "out",
        resultWord: "выходить",
        resultMeaning: "to exit / to go out",
        example: "Она выходит из дома. (She goes out of the house.)",
      },
      {
        prefix: "пере",
        meaning: "across",
        resultWord: "переходить",
        resultMeaning: "to cross",
        example: "Мы переходим улицу. (We are crossing the street.)",
      },
      {
        prefix: "про",
        meaning: "through / past",
        resultWord: "проходить",
        resultMeaning: "to pass / to go through",
        example: "Проходите мимо! (Pass by!)",
      },
      {
        prefix: "у",
        meaning: "away",
        resultWord: "уходить",
        resultMeaning: "to leave / to go away",
        example: "Пора уходить. (It's time to leave.)",
      },
      {
        prefix: "под",
        meaning: "approach",
        resultWord: "подходить",
        resultMeaning: "to approach / to come up to",
        example: "Поезд подходит к станции. (The train is approaching the station.)",
      },
      {
        prefix: "от",
        meaning: "move away",
        resultWord: "отходить",
        resultMeaning: "to step back / to depart",
        example: "Отойдите от края! (Step back from the edge!)",
      },
    ],
  },
  {
    id: 2,
    baseVerb: "писать",
    baseMeaning: "to write",
    prefixes: [
      {
        prefix: "на",
        meaning: "on / finish",
        resultWord: "написать",
        resultMeaning: "to write down / to finish writing",
        example: "Я хочу написать письмо. (I want to write a letter.)",
      },
      {
        prefix: "пере",
        meaning: "re-",
        resultWord: "переписать",
        resultMeaning: "to rewrite",
        example: "Тебе нужно переписать этот текст. (You need to rewrite this text.)",
      },
      {
        prefix: "до",
        meaning: "add to / finish",
        resultWord: "дописать",
        resultMeaning: "to finish writing",
        example: "Мне осталось дописать одну страницу. (I have one page left to finish writing.)",
      },
      {
        prefix: "вы",
        meaning: "extract",
        resultWord: "выписать",
        resultMeaning: "to write out / to prescribe",
        example: "Врач выписал рецепт. (The doctor wrote out a prescription.)",
      },
      {
        prefix: "под",
        meaning: "under",
        resultWord: "подписать",
        resultMeaning: "to sign",
        example: "Пожалуйста, подпишите документ. (Please sign the document.)",
      },
      {
        prefix: "за",
        meaning: "record",
        resultWord: "записать",
        resultMeaning: "to record / to write down",
        example: "Запиши мой номер телефона. (Write down my phone number.)",
      },
    ],
  },
  {
    id: 3,
    baseVerb: "смотреть",
    baseMeaning: "to look / to watch",
    prefixes: [
      {
        prefix: "по",
        meaning: "a bit / perfective",
        resultWord: "посмотреть",
        resultMeaning: "to take a look / to watch",
        example: "Давай посмотрим фильм. (Let's watch a movie.)",
      },
      {
        prefix: "рас",
        meaning: "examine",
        resultWord: "рассмотреть",
        resultMeaning: "to examine / to scrutinize",
        example: "Мы должны рассмотреть все варианты. (We must examine all options.)",
      },
      {
        prefix: "пере",
        meaning: "re-examine",
        resultWord: "пересмотреть",
        resultMeaning: "to review / to reconsider",
        example: "Они решили пересмотреть план. (They decided to reconsider the plan.)",
      },
      {
        prefix: "вы",
        meaning: "look out",
        resultWord: "высмотреть",
        resultMeaning: "to spot / to look out for",
        example: "Он пытался высмотреть её в толпе. (He tried to spot her in the crowd.)",
      },
      {
        prefix: "о",
        meaning: "around",
        resultWord: "осмотреть",
        resultMeaning: "to inspect / to look around",
        example: "Врач должен осмотреть пациента. (The doctor must inspect the patient.)",
      },
    ],
  }
];