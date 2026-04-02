export interface ExerciseData {
  id: number;
  sentence: string;
  correctAnswer: string;
  options: string[];
}

export interface PrefixData {
  id?: number;
  prefix: string;
  baseForm: string;
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
        baseForm: "ходить",
        meaning: "in / into",
        resultWord: "входить",
        resultMeaning: "to enter",
        example: "Он входит в комнату. (He enters the room.)",
      },
      {
        prefix: "вы",
        baseForm: "ходить",
        meaning: "out",
        resultWord: "выходить",
        resultMeaning: "to exit / to go out",
        example: "Она выходит из дома. (She goes out of the house.)",
      },
      {
        prefix: "пере",
        baseForm: "ходить",
        meaning: "across",
        resultWord: "переходить",
        resultMeaning: "to cross",
        example: "Мы переходим улицу. (We are crossing the street.)",
      },
      {
        prefix: "про",
        baseForm: "ходить",
        meaning: "through / past",
        resultWord: "проходить",
        resultMeaning: "to pass / to go through",
        example: "Проходите мимо! (Pass by!)",
      },
      {
        prefix: "у",
        baseForm: "ходить",
        meaning: "away",
        resultWord: "уходить",
        resultMeaning: "to leave / to go away",
        example: "Пора уходить. (It's time to leave.)",
      },
      {
        prefix: "под",
        baseForm: "ходить",
        meaning: "approach",
        resultWord: "подходить",
        resultMeaning: "to approach / to come up to",
        example: "Поезд подходит к станции. (The train is approaching the station.)",
      },
      {
        prefix: "от",
        baseForm: "ходить",
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
        baseForm: "писать",
        meaning: "on / finish",
        resultWord: "написать",
        resultMeaning: "to write down / to finish writing",
        example: "Я хочу написать письмо. (I want to write a letter.)",
      },
      {
        prefix: "пере",
        baseForm: "писать",
        meaning: "re-",
        resultWord: "переписать",
        resultMeaning: "to rewrite",
        example: "Тебе нужно переписать этот текст. (You need to rewrite this text.)",
      },
      {
        prefix: "до",
        baseForm: "писать",
        meaning: "add to / finish",
        resultWord: "дописать",
        resultMeaning: "to finish writing",
        example: "Мне осталось дописать одну страницу. (I have one page left to finish writing.)",
      },
      {
        prefix: "вы",
        baseForm: "писать",
        meaning: "extract",
        resultWord: "выписать",
        resultMeaning: "to write out / to prescribe",
        example: "Врач выписал рецепт. (The doctor wrote out a prescription.)",
      },
      {
        prefix: "под",
        baseForm: "писать",
        meaning: "under",
        resultWord: "подписать",
        resultMeaning: "to sign",
        example: "Пожалуйста, подпишите документ. (Please sign the document.)",
      },
      {
        prefix: "за",
        baseForm: "писать",
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
        baseForm: "смотреть",
        meaning: "a bit / perfective",
        resultWord: "посмотреть",
        resultMeaning: "to take a look / to watch",
        example: "Давай посмотрим фильм. (Let's watch a movie.)",
      },
      {
        prefix: "рас",
        baseForm: "смотреть",
        meaning: "examine",
        resultWord: "рассмотреть",
        resultMeaning: "to examine / to scrutinize",
        example: "Мы должны рассмотреть все варианты. (We must examine all options.)",
      },
      {
        prefix: "пере",
        baseForm: "смотреть",
        meaning: "re-examine",
        resultWord: "пересмотреть",
        resultMeaning: "to review / to reconsider",
        example: "Они решили пересмотреть план. (They decided to reconsider the plan.)",
      },
      {
        prefix: "вы",
        baseForm: "смотреть",
        meaning: "look out",
        resultWord: "высмотреть",
        resultMeaning: "to spot / to look out for",
        example: "Он пытался высмотреть её в толпе. (He tried to spot her in the crowd.)",
      },
      {
        prefix: "о",
        baseForm: "смотреть",
        meaning: "around",
        resultWord: "осмотреть",
        resultMeaning: "to inspect / to look around",
        example: "Врач должен осмотреть пациента. (The doctor must inspect the patient.)",
      },
    ],
  },
  {
    id: 4,
    baseVerb: "делать",
    baseMeaning: "to do / to make",
    prefixes: [
      {
        prefix: "с",
        baseForm: "делать",
        meaning: "perfective (to finish doing)",
        resultWord: "сделать",
        resultMeaning: "to do / to make (completed)",
        example: "Я должен сделать домашнее задание. (I must do my homework.)",
      },
      {
        prefix: "пере",
        baseForm: "делывать",
        meaning: "re-do / alter",
        resultWord: "переделывать",
        resultMeaning: "to redo / to alter",
        example: "Ему пришлось переделывать всю работу. (He had to redo all the work.)",
      },
      {
        prefix: "под",
        baseForm: "делывать",
        meaning: "forge / fake",
        resultWord: "подделывать",
        resultMeaning: "to forge / to counterfeit",
        example: "Преступники пытались подделывать документы. (The criminals tried to forge documents.)",
      },
      {
        prefix: "до",
        baseForm: "делать",
        meaning: "finish doing",
        resultWord: "доделать",
        resultMeaning: "to finish off / to complete",
        example: "Мне нужно доделать этот проект завтра. (I need to finish this project tomorrow.)",
      },
      {
        prefix: "за",
        baseForm: "делывать",
        meaning: "close up / patch",
        resultWord: "заделывать",
        resultMeaning: "to patch up / to close",
        example: "Рабочие начали заделывать дыру в стене. (The workers started patching the hole in the wall.)",
      },
      {
        prefix: "от",
        baseForm: "делывать",
        meaning: "finish off / decorate",
        resultWord: "отделывать",
        resultMeaning: "to finish / to decorate (a room)",
        example: "Они будут отделывать новую квартиру деревом. (They will decorate the new apartment with wood.)",
      }
    ],
  }
];
