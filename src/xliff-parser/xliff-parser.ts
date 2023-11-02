import { ValidationError, XMLParser, XMLValidator } from 'fast-xml-parser';
import {
  parse as parseICU,
  TYPE,
  MessageFormatElement,
  PluralElement,
  LiteralElement,
} from '@formatjs/icu-messageformat-parser';
import { IXMLParserChild, IXMLParserResult } from '../models/fast-xml-parser';
import {
  IXliffTag,
  IXliff,
  XliffTagName,
  TAG_NAMES,
  IXliffInterpolation,
  IXliffPlural,
} from '../models/xliff';

export class XliffParser {
  private parser: XMLParser;

  constructor() {
    this.parser = this.getParser();
  }

  public parse<T = IXliff>(data: string | undefined): T | undefined {
    if (!data) {
      return undefined;
    }

    const validation = this.isValidXML(data);
    if (validation !== true) {
      throw validation.err;
    }

    const parsedXML: IXMLParserResult = this.parser.parse(data);

    return this.convertNodes(parsedXML)[0] as T;
  }

  private getParser(): XMLParser {
    return new XMLParser({
      alwaysCreateTextNode: true,
      preserveOrder: true,
      ignoreAttributes: false,
      attributeNamePrefix: '',
      allowBooleanAttributes: true,
      trimValues: false,
      stopNodes: [
        'xliff.file.body.trans-unit.source',
        'xliff.file.body.trans-unit.target',
      ],
      tagValueProcessor(tagName, tagValue) {
        // Remove spaces only for text node without any other char
        if (tagValue.trim().length === 0) {
          return '';
        }

        return tagValue;
      },
    });
  }

  private isValidXML(data: string): true | ValidationError {
    return XMLValidator.validate(data, {
      allowBooleanAttributes: true,
    });
  }

  private convertNodes(nodes: IXMLParserResult): IXliffTag[] {
    return nodes
      .map((node) => {
        return this.convertNode(node);
      })
      .filter((node): node is IXliffTag => !!node);
  }

  private convertNode(node: IXMLParserChild): IXliffTag | string | undefined {
    const keys = Object.keys(node).filter((key) => key !== ':@');
    const tagName = keys[0]?.toLowerCase();

    if (tagName === '#text') {
      return node['#text'] as string;
    }

    if (tagName === 'source' || tagName === 'target') {
      return {
        $: node[':@'] ?? {},
        children: this.convertSourceOrTarget(
          (node[tagName] as any[])[0]?.['#text']
        ),
        name: tagName,
      };
    }

    if (!this.isValidTagName(tagName)) {
      return undefined;
    }

    return {
      $: node[':@'] ?? {},
      children: this.convertNodes(node[tagName] as IXMLParserChild[]),
      name: tagName,
    };
  }

  private convertSourceOrTarget(
    text: string | undefined
  ): (string | IXliffInterpolation | IXliffPlural)[] {
    if (!text) {
      return [];
    }

    return this.parseICU(text);
  }

  private parseICU(
    text: string
  ): (string | IXliffInterpolation | IXliffPlural)[] {
    const protectInterpolations = this.protectInterpolations(text);
    const parsedText = parseICU(protectInterpolations.replaced);

    return this.convertICUItems(
      parsedText,
      protectInterpolations.interpolations
    );
  }

  private convertICUItems(
    items: MessageFormatElement[],
    interpolations: string[]
  ): (string | IXliffInterpolation | IXliffPlural)[] {
    return items.reduce((acc, item) => {
      switch (item.type) {
        case TYPE.plural:
          return [...acc, this.convertICUPluralItem(item, interpolations)];
        case TYPE.literal:
          return [...acc, ...this.convertICULiteralItem(item, interpolations)];
        default:
          return acc;
      }
    }, [] as (string | IXliffInterpolation | IXliffPlural)[]);
  }

  private convertICUPluralItem(
    item: PluralElement,
    interpolations: string[]
  ): IXliffPlural {
    // Get all the options
    return {
      key: item.value,
      counters: Object.fromEntries(
        Object.entries(item.options).map(([key, value]) => [
          key,
          this.convertICUItems(value.value, interpolations),
        ])
      ),
      name: 'plural',
    };
  }

  private convertICULiteralItem(
    item: LiteralElement,
    interpolations: string[]
  ): (string | IXliffInterpolation)[] {
    return this.parseInterpolation(
      this.restoreInterpolations(item.value, interpolations)
    );
  }

  private parseInterpolation(text: string): (string | IXliffInterpolation)[] {
    const parsedInterpolation = this.parser.parse(`<plural>${text}</plural>`)[0]
      .plural;

    return this.convertNodes(parsedInterpolation) as any;
  }

  /**
   * Interpolation entity can be the XML tag `<x id="INTERPOLATION" />`
   * or the `#` character if it is not escaped with single quotes e.g `'#'`
   * @see https://unicode-org.github.io/icu/userguide/format_parse/messages/#quotingescaping
   */
  private protectInterpolations(text: string): {
    source: string;
    replaced: string;
    interpolations: string[];
  } {
    const interpolations: string[] = [];

    return {
      source: text,
      replaced: text.replace(/(<x[^>]+>)|((?<!')#)/g, (value) => {
        const index = interpolations.length;
        interpolations.push(value);
        return `__${index}__`;
      }),
      interpolations,
    };
  }

  private restoreInterpolations(
    text: string,
    interpolations: string[]
  ): string {
    return interpolations.reduce((acc, current, index) => {
      return acc.replace(`__${index}__`, current);
    }, text);
  }

  private isValidTagName(tagName: string): tagName is XliffTagName {
    return TAG_NAMES.includes(tagName.replace('#', '') as any);
  }
}
