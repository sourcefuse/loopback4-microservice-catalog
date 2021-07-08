import {TranslateController} from '../../controllers';
import {HttpErrors} from '@loopback/rest';
import {
  JsdomService,
  MarkdownService,
  AwsTranslateProvider,
} from '../../services';
import {TextType} from '../../types';
import {expect} from '@loopback/testlab';
import {TranslateModelDto} from '../../models';

describe('TranslateController', () => {
  const awsTranslateProvider = new AwsTranslateProvider({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
  }).value();
  const jsDomServiceClient = new JsdomService(awsTranslateProvider);
  const markDownServiceClient = new MarkdownService(jsDomServiceClient);
  const translateController = new TranslateController(
    jsDomServiceClient,
    markDownServiceClient,
  );
  describe('POST /translations', () => {
    it('throws Bad Request when text is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '',
          type: TextType.TEXT,
          targetLanguage: 'fr',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('throws Bad Request when type is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '<p>Sample Text</p>',
          type: '' as TextType,
          targetLanguage: 'fr',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('throws Bad Request when target language is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '<p>Sample Text</p>',
          type: TextType.HTML,
          targetLanguage: '',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('translates html text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: `<h1>Hello World</h1><h2>How are you</h2>`,
        type: TextType.HTML,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.eql(
        '<h1>Bonjour le monde</h1><h2>Comment allez-vous&nbsp;?</h2>',
      );
    }).timeout(5000);
    it('translates markdown text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: `I just love **bold text**.	`,
        type: TextType.MARKDOWN,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.be.instanceOf(String);
    }).timeout(5000);
    it('translates plain text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: `This is just a plain test`,
        type: TextType.TEXT,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.eql(`Ce n'est qu'un test simple.`);
    }).timeout(5000);
  });
});
