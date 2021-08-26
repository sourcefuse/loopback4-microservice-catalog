import proxyquire from 'proxyquire';

export const SAMPLE_HTML = '<h1>Hello World</h1><h2>How are you</h2>';
export const SAMPLE_MARKDOWN = 'I just love **bold text**';
export const SAMPLE_TEXT = 'This is just a plain test';

export const translationsStubObj = {
  [SAMPLE_HTML]:
    '<h1>Bonjour le monde</h1><h2>Comment allez-vous&amp;nbsp;?</h2>',
  [SAMPLE_MARKDOWN]: "J'adore**texte gras**",
  [SAMPLE_TEXT]: "Ce n'est qu'un test simple.",
};

const TEXT1 = 'Hello World';
const TEXT2 = 'How are you';
const TEXT3 = 'I just love ';
const TEXT4 = 'bold text';

const translations = {
  [TEXT1]: 'Bonjour le monde',
  [TEXT2]: 'Comment allez-vous&nbsp;?',
  [TEXT3]: "J'adore",
  [TEXT4]: 'texte gras',
};

class AwsStub {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  constructor() {
    this.accessKeyId = '';
    this.secretAccessKey = '';
    this.region = '';
  }
}

class ComprehendStub extends AwsStub {
  constructor() {
    super();
  }
  detectDominantLanguage(text: string) {
    return {
      promise() {
        return Promise.resolve('fr');
      },
    };
  }
}

class TranslateStub extends AwsStub {
  constructor() {
    super();
  }
  translateText(
    data: {Text: string},
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ) {
    let translatedText = '';
    switch (data.Text) {
      case TEXT1:
        translatedText = translations[TEXT1];
        break;
      case TEXT2:
        translatedText = translations[TEXT2];
        break;
      case TEXT3:
        translatedText = translations[TEXT3];
        break;
      case TEXT4:
        translatedText = translations[TEXT4];
        break;
      case SAMPLE_TEXT:
        translatedText = translationsStubObj[SAMPLE_TEXT];
        break;
      default:
        break;
    }
    return {
      promise() {
        return Promise.resolve({
          TranslatedText: translatedText,
          sourceLanguageCode,
          targetLanguageCode,
        });
      },
    };
  }
}

export function setUpAwsTranslateProvider() {
  return proxyquire('../../../services/aws-translate.service', {
    'aws-sdk': {
      Comprehend: ComprehendStub,
      Translate: TranslateStub,
    },
  });
}
