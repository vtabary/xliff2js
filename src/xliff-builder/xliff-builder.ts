import xmlBuilder from 'xmlbuilder';
import { IXliffTag, IXliff } from '../models/xliff';

export class XliffBuilder {
  constructor(private options: xmlBuilder.XMLToStringOptions = {}) {}

  public build(rootTag: IXliff | undefined): string {
    if (!rootTag) {
      return '';
    }

    const element = xmlBuilder.create(rootTag.name);
    Object.keys(rootTag.$).forEach((key) =>
      element.attribute(key, (rootTag.$ as any)[key])
    );

    rootTag.children.forEach((child) =>
      this.buildChild(element, child as IXliffTag)
    );

    return element.end({
      // fallback values are the default values
      allowEmpty: this.options.allowEmpty ?? false,
      dontPrettyTextNodes: this.options.dontPrettyTextNodes ?? false,
      indent: this.options.indent ?? '  ',
      newline: this.options.newline ?? '\n',
      offset: this.options.offset ?? 0,
      pretty: this.options.pretty ?? false,
      spaceBeforeSlash: this.options.spaceBeforeSlash ?? '',
      width: this.options.width ?? 0,
      writer: this.options.writer,
    });
  }

  private buildChild(
    parent: xmlBuilder.XMLElement,
    tag: IXliffTag
  ): xmlBuilder.XMLElement {
    const element = parent.ele(tag.name, tag.$);

    tag.children.forEach((child) => {
      if (typeof child === 'string') {
        return element.text(child);
      }

      this.buildChild(element, child);
    });

    return element;
  }
}
