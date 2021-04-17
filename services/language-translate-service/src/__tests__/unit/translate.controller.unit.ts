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
        text: `<table>
        <thead>
        <tr>
        <th>Option</th>
        <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>data</td>
        <td>path to data files to supply the data that will be passed into templates.</td>
        </tr>
        <tr>
        <td>engine</td>
        <td>engine to be used for processing templates. Handlebars is the default.</td>
        </tr>
        <tr>
        <td>ext</td>
        <td>extension to be used for dest files.</td>
        </tr>
        </tbody>
        </table>
        <p>Right aligned columns</p>
        <table>`,
        type: TextType.HTML,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.be.instanceOf(String);
    }).timeout(5000);
    it('translates markdown text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: `### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

          This is HTML abbreviation example.
          
          It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.
          
          *[HTML]: Hyper Text Markup Language
          
          ### [Custom containers](https://github.com/markdown-it/markdown-it-container)
          
          ::: warning
          *here be dragons*
          :::`,
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
      expect(translatedText).to.be.instanceOf(String);
    }).timeout(5000);
  });
});
