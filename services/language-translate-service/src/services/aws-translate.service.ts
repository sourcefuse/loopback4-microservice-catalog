import {
  injectable,
  /* inject, */ BindingScope,
  Provider,
  inject,
} from '@loopback/core';
import {Comprehend, Translate} from 'aws-sdk';
import {LanguageTranslateBindings} from '../keys';
import {AwsConfig, LanguageTranslateProvider} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class AwsTranslateProvider
  implements Provider<LanguageTranslateProvider> {
  comprehendClient: Comprehend;
  translateClient: Translate;
  constructor(
    @inject(LanguageTranslateBindings.awsConfig)
    private readonly awsConfig: AwsConfig,
  ) {}
  value() {
    return {
      translateClient: new Translate({
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
        region: this.awsConfig.region,
      }),
      languageDetectorClient: new Comprehend({
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
        region: this.awsConfig.region,
      }),
      async detectDominantLanguage(text: string): Promise<string> {
        const {Languages} = await this.languageDetectorClient
          .detectDominantLanguage({
            Text: text,
          })
          .promise();
        let dominantLanguage = '';
        let maxScore = 0;
        Languages?.forEach(language => {
          const {Score = 0, LanguageCode} = language;
          if (Score > maxScore) {
            maxScore = Score;
            dominantLanguage = String(LanguageCode);
          }
        });
        return dominantLanguage;
      },
      async translateText(
        text: string,
        sourceLanguageCode: string,
        targetLanguageCode: string,
      ): Promise<string> {
        const {TranslatedText} = await this.translateClient
          .translateText({
            Text: text,
            SourceLanguageCode: sourceLanguageCode,
            TargetLanguageCode: targetLanguageCode,
          })
          .promise();
        return TranslatedText;
      },
    };
  }
}
