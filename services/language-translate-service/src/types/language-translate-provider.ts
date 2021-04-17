import {Comprehend, Translate} from 'aws-sdk';

export interface LanguageTranslateProvider {
  //tells which language has been detected
  languageDetectorClient?: Comprehend;
  translateClient?: Translate;
  detectDominantLanguage(text: string): Promise<string>;
  translateText(
    Text: string,
    SourceLanguageCode: string,
    TargetLanguageCode: string,
  ): Promise<string>;
}
