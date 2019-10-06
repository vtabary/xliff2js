export type XliffTagName = 'x' | 'text' | 'target' | 'source' | 'note' | 'trans-unit' | 'body' | 'context' | 'context-group' | 'file' | 'xliff';

export interface IXliffTag {
  name: XliffTagName;
  $: { [key:string]: string | undefined };
  children: (string | IXliffTag)[];
}

export interface IXliffInterpolation extends IXliffTag {
  name: 'x';
  $: {
    'equiv-text'?: string;
    id?: 'INTERPOLATION';
  }
}

export interface IXliffTarget extends IXliffTag {
  name: 'target';
  children: (string | IXliffInterpolation)[];
  $: {
    state?: 'translated';
  }
}

export interface IXliffSource extends IXliffTag {
  name: 'source';
  children: (string | IXliffInterpolation)[];
}

export interface IXliffNote extends IXliffTag {
  name: 'note';
  children: string[];
  $: {
    from?: 'from';
    priority?: string;
  }
}

export interface IXliffContext extends IXliffTag {
  name: 'context';
  children: string[];
  $: {
    'context-type'?: 'sourcefile' | 'linenumber';
  }
}

export interface IXliffContextGroup extends IXliffTag {
  name: 'context-group';
  children: IXliffContext[];
  $: {
    purpose?: 'location';
  }
}

export interface IXliffTransUnit extends IXliffTag {
  name: 'trans-unit';
  children: (IXliffSource | IXliffTarget | IXliffContextGroup | IXliffNote)[];
  $: {
    id: string;
    datatype?: string;
  }
}

export interface IXliffBody extends IXliffTag {
  name: 'body';
  children: IXliffTransUnit[];
}


export interface IXliffFile extends IXliffTag {
  name: 'file',
  children: IXliffBody[];
  $: {
    'source-language'?: string;
    'target-language'?: string;
    datatype?: string;
    original?: string;
  };
}

export interface IXliff extends IXliffTag {
  name: 'xliff';
  children: IXliffFile[];
  $: {
    version?: string;
    xmlns?: string;
  };
}
