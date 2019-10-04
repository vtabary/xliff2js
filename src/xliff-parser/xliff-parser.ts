import * as sax from 'sax';
import { IXliffTag, IXliff, XliffTagName } from '../models/xliff';

export class XliffParser {
  private rootTag?: IXliffTag;
  private stack: IXliffTag[] = [];

  public parse(data: string | undefined): IXliff | undefined {
    if (!data) {
      return undefined;
    }

    this.rootTag = undefined;
    this.stack = [];

    const parser = this.getParser();
    parser.write(data).close();

    return this.rootTag;
  }

  private getParser(): any {
    const parser = sax.parser(true);
    parser.onerror = (e) => { throw(e) };
    parser.ontext = (t) => this.onText(t);
    parser.onopentag = (node) => this.onOpenTag(node);
    parser.onclosetag = () => this.onCloseTag();

    return parser;
  }

  private onOpenTag(node: sax.Tag | sax.QualifiedTag) {
    const current = this.newTag(node.name as XliffTagName);

    Object.keys(node.attributes).forEach(key => {
      current.$[key] = typeof node.attributes[key] === 'string' ?
        node.attributes[key] as string :
        (node.attributes[key] as sax.QualifiedAttribute).value;
    });

    if (this.stack[0]) {
      this.stack[0].children.push(current);
    } else {
      this.rootTag = current;
    }

    this.stack.unshift(current);
  }

  private onCloseTag() {
    this.stack.shift();
  }

  private onText(text: string) {
    if (!text.trim()) {
      return;
    }

    this.stack[0].children.push(text);
  }

  private newTag(name: XliffTagName): IXliffTag {
    return { name: name, $: {}, children: [] };
  }
}
