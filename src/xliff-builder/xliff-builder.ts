import { XMLBuilder } from 'fast-xml-parser';
import {
  IXliffTag,
  IXliff,
  IXliffPlural,
  IXliffSource,
  IXliffTarget,
  IXliffInterpolation,
} from '../models/xliff';
import { IXMLParserChild } from '../models/fast-xml-parser';

export class XliffBuilder {
  private builder: XMLBuilder;

  constructor(
    private options: Partial<{
      indent: string;
      pretty: boolean;
      allowEmpty: boolean;
    }> = {}
  ) {
    this.builder = new XMLBuilder({
      preserveOrder: true,
      suppressEmptyNode: !this.options.allowEmpty,
      format: this.options.pretty ?? false,
      indentBy: this.options.indent ?? '  ',
      suppressUnpairedNode: false,
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
  }

  public build(rootTag: IXliff | undefined): string {
    if (!rootTag) {
      return '';
    }

    const built = this.serializeNode(rootTag);

    return `<?xml version="1.0" encoding="UTF-8"?>
${this.restoreInterpolations(built)}`;
  }

  private convertNode(node: string | IXliffTag): IXMLParserChild {
    if (typeof node === 'string' || typeof node === 'number') {
      return { '#text': `${node}` };
    }

    if (this.isSourceOrTarget(node)) {
      return {
        [node.name]: [{ '#text': this.convertSourceOrTargetNode(node) }],
        ':@': node.$,
      };
    }

    return {
      // IXliffPlural can only occurs on Source or Target nodes
      [node.name]: this.convertNodes(node.children as any),
      ':@': node.$,
    };
  }

  private isSourceOrTarget(
    node: string | IXliffTag | IXliffPlural
  ): node is IXliffSource | IXliffTarget {
    return (
      typeof node === 'object' &&
      (node.name === 'source' || node.name === 'target')
    );
  }

  private convertNodes(nodes: (string | IXliffTag)[] = []): IXMLParserChild[] {
    return nodes.map((node) => this.convertNode(node));
  }

  private convertSourceOrTargetNode(node: IXliffSource | IXliffTarget): string {
    return node.children
      .map((child) => {
        if (typeof child === 'string') {
          return child;
        }

        if (this.isPlural(child)) {
          return this.convertPlural(child as IXliffPlural);
        }

        return this.serializeNode(child);
      })
      .join('');
  }

  private convertPlural(node: IXliffPlural): string {
    const options = Object.entries(node.counters)
      .map(([key, values]) => {
        return `${key} {${this.convertCounter(
          values as (string | IXliffInterpolation)[]
        )}}`;
      })
      .join(' ');

    return `{${node.key ?? 'VAR_PLURAL'}, plural, ${options}}`;
  }

  private isPlural(
    node: string | IXliffTag | IXliffPlural
  ): node is IXliffPlural {
    return typeof node === 'object' && node.name === 'plural';
  }

  private convertCounter(nodes: (string | IXliffInterpolation)[]): string {
    return nodes
      .map((node) => {
        if (typeof node === 'string') {
          return node;
        }

        return this.serializeNode(node);
      })
      .join('');
  }

  private restoreInterpolations(xml: string): string {
    return xml.replace(
      /&lt;x(.*?)\/&gt;/gm,
      (_, group1) => `<x${group1.replace(/&quot;/g, '"')} />`
    );
  }

  private serializeNode(node: string | IXliffTag): string {
    return this.builder.build([this.convertNode(node)]).trim();
  }
}
