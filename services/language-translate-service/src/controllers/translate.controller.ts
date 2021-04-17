import {post, requestBody, getModelSchemaRef, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/context';
import {JsdomService, MarkdownService} from '../services';
import {LanguageTranslateBindings} from '../keys';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {TranslateModelDto} from '../models';
import {TextType} from '../types';
export class TranslateController {
  constructor(
    @inject(LanguageTranslateBindings.jsDomService)
    private readonly jsDomService: JsdomService,
    @inject(LanguageTranslateBindings.markdownService)
    private readonly markdownService: MarkdownService,
  ) {}
  @post('/translations', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'translate success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(TranslateModelDto),
          },
        },
      },
      [STATUS_CODE.INTERNAL_SERVER_ERROR]: {
        description: 'api/code level error in getting translation',
      },
    },
  })
  async makeTranslation(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TranslateModelDto),
        },
      },
    })
    body: TranslateModelDto,
  ): Promise<string> {
    if (!body) {
      throw new HttpErrors.BadRequest(
        'Request body with targetLanguage, text and type is required',
      );
    }
    const {targetLanguage = '', text = '', type = ''} = body;
    if (!targetLanguage) {
      throw new HttpErrors.BadRequest('TargetLanguage is required');
    }
    if (!text) {
      throw new HttpErrors.BadRequest('Text is required');
    }
    if (!type) {
      throw new HttpErrors.BadRequest('Type is required');
    }
    if ([TextType.HTML, TextType.TEXT].includes(type)) {
      return this.jsDomService.translateTextUsingjsDom(
        String(text),
        targetLanguage,
      );
    } else if ([TextType.MARKDOWN].includes(type)) {
      return this.markdownService.translateText(String(text), targetLanguage);
    } else {
      throw new HttpErrors.BadRequest(
        `Text type should be one of ${TextType.MARKDOWN}, ${TextType.HTML} or ${TextType.TEXT}`,
      );
    }
  }
}
