import { ValidationError, XMLParser, XMLValidator } from 'fast-xml-parser';
import { IXliffTag, IXliff, XliffTagName } from '../models/xliff';

interface IXMLParserTextNode {
  '#text': string;
}

interface IXMLParserAttributes {
  ':@'?: {
    [attributeName: string]: string;
  };
}

type IXMLParserChild = IXMLParserAttributes & {
  [tagName: string]:
    | (IXMLParserChild | IXMLParserTextNode)[]
    | {
        [attributeName: string]: string;
      }
    | string;
};

type IXMLParserResult = IXMLParserChild[];

export class XliffParser {
  private tagNames = [
    'x',
    'text',
    'target',
    'source',
    'note',
    'trans-unit',
    'body',
    'context',
    'context-group',
    'file',
    'xliff',
  ];

  public parse(data: string | undefined): IXliff | undefined {
    if (!data) {
      return undefined;
    }

    const validation = this.isValidXML(data);
    if (validation !== true) {
      throw validation.err;
    }

    const parser = this.getParser();
    const parsedXML: IXMLParserResult = parser.parse(data);

    return this.convertNodes(parsedXML)[0] as any;
  }

  private getParser(): XMLParser {
    return new XMLParser({
      alwaysCreateTextNode: true,
      preserveOrder: true,
      ignoreAttributes: false,
      attributeNamePrefix: '',
      allowBooleanAttributes: true,
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

    if (!this.isValidTagName(tagName)) {
      return undefined;
    }

    return {
      $: node[':@'] ?? {},
      children: this.convertNodes(node[tagName] as IXMLParserChild[]),
      name: tagName,
    };
  }

  private isValidTagName(tagName: string): tagName is XliffTagName {
    return this.tagNames.includes(tagName.replace('#', ''));
  }
}
