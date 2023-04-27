export interface IXMLParserTextNode {
  '#text': string;
}

export interface IXMLParserAttributes {
  ':@'?: {
    [attributeName: string]: string;
  };
}

export type IXMLParserChild = IXMLParserAttributes & {
  [tagName: string]:
    | (IXMLParserChild | IXMLParserTextNode)[]
    | {
        [attributeName: string]: string;
      }
    | string;
};

export type IXMLParserResult = IXMLParserChild[];
