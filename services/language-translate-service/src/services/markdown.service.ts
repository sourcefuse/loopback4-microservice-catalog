import {injectable, /* inject, */ BindingScope, inject} from '@loopback/core';
import {LanguageTranslateBindings} from '../keys';
import {JsdomService} from './jsdom.service';
import MarkdownIt from 'markdown-it';
import {NodeHtmlMarkdown} from 'node-html-markdown';

@injectable({scope: BindingScope.TRANSIENT})
export class MarkdownService {
  markdownItClient: MarkdownIt;
  nodeHtmlMarkdownClient: NodeHtmlMarkdown;
  constructor(
    @inject(LanguageTranslateBindings.jsDomService)
    private readonly jsDomSerivce: JsdomService,
  ) {
    this.markdownItClient = new MarkdownIt();
    this.nodeHtmlMarkdownClient = new NodeHtmlMarkdown();
  }
  async translateText(text: string, targetLanguage: string) {
    const htmlText = this.markdownItClient.render(text);
    const translatedText = await this.jsDomSerivce.translateTextUsingjsDom(
      htmlText,
      targetLanguage,
    );
    return this.nodeHtmlMarkdownClient.translate(translatedText);
  }
}
