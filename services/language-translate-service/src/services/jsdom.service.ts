import {injectable, BindingScope, inject} from '@loopback/core';
import {LanguageTranslateBindings} from '../keys';
import {JSDOM} from 'jsdom';
import {LanguageTranslateProvider} from '../types';
const {Node} = new JSDOM('').window;
@injectable({scope: BindingScope.TRANSIENT})
export class JsdomService {
  constructor(
    @inject(LanguageTranslateBindings.languageTranslateProvider)
    private readonly languageTranslateProvider: LanguageTranslateProvider,
  ) {}
  private async detectAndTranslateText(
    element: ChildNode,
    targetLanguage: string,
  ): Promise<void> {
    const {textContent} = element;
    const dominantLanguage = await this.languageTranslateProvider.detectDominantLanguage(
      String(textContent),
    );
    if (dominantLanguage !== targetLanguage) {
      const translatedText = await this.languageTranslateProvider.translateText(
        String(textContent),
        dominantLanguage,
        targetLanguage,
      );
      element.textContent = translatedText;
    }
  }
  private async iterateTextNodes(
    elements: NodeListOf<ChildNode>,
    targetLanguage: string,
    translationJobs: Promise<void>[],
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    elements.forEach(async element => {
      if (element.childNodes) {
        await this.iterateTextNodes(
          element.childNodes,
          targetLanguage,
          translationJobs,
        );
      }
      if (element.textContent && element.nodeType === Node.TEXT_NODE) {
        translationJobs.push(
          this.detectAndTranslateText(element, targetLanguage),
        );
      }
    });
  }
  async translateTextUsingjsDom(
    text: string,
    targetLanguage: string,
  ): Promise<string> {
    const {document} = new JSDOM(text).window;
    const translationJobs: Promise<void>[] = [];
    await this.iterateTextNodes(
      document.body.childNodes,
      targetLanguage,
      translationJobs,
    );
    await Promise.all(translationJobs);
    return document.body.innerHTML;
  }
}
