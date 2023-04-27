import { readFileSync } from 'fs';
import { XLIFF_JSON } from '../test-data/data';
import { XliffBuilder } from './xliff-builder';
import { resolve } from 'path';

describe('XliffBuilder', () => {
  let builder: XliffBuilder;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new XliffBuilder()).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new XliffBuilder();
    });

    it('should support an undefined value', () => {
      expect(builder.build(undefined)).toEqual('');
    });

    it('should build a simple xml', () => {
      expect(
        builder.build({
          name: 'xliff',
          children: [],
          $: {},
        })
      ).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<xliff/>`);
    });

    it('should build a regular xml', () => {
      expect(
        builder.build({
          name: 'xliff',
          children: [
            {
              name: 'file',
              $: {
                'source-language': 'en',
              },
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [],
                },
              ],
            },
            {
              name: 'file',
              $: {},
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [
                    {
                      name: 'trans-unit',
                      $: {
                        id: 'abcd',
                      },
                      children: [
                        {
                          name: 'source',
                          $: {},
                          children: ['test-content'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          $: {
            version: '1.0',
          },
        })
      ).toEqual(
        `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.0"><file source-language="en"><body/></file><file><body><trans-unit id="abcd"><source>test-content</source></trans-unit></body></file></xliff>`
      );
    });

    it('should build a regular xml', () => {
      expect(
        new XliffBuilder({ pretty: true }).build({
          name: 'xliff',
          children: [
            {
              name: 'file',
              $: {
                'source-language': 'en',
              },
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [],
                },
              ],
            },
            {
              name: 'file',
              $: {},
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [
                    {
                      name: 'trans-unit',
                      $: {
                        id: 'abcd',
                      },
                      children: [
                        {
                          name: 'source',
                          $: {},
                          children: ['test-content'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          $: {
            version: '1.0',
          },
        })
      ).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.0">
  <file source-language="en">
    <body/>
  </file>
  <file>
    <body>
      <trans-unit id="abcd">
        <source>test-content</source>
      </trans-unit>
    </body>
  </file>
</xliff>`);
    });

    it('should use default options when no option given', () => {
      expect(
        new XliffBuilder().build({
          name: 'xliff',
          children: [
            {
              name: 'file',
              $: {
                'source-language': 'en',
              },
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [],
                },
              ],
            },
            {
              name: 'file',
              $: {},
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [
                    {
                      name: 'trans-unit',
                      $: {
                        id: 'abcd',
                      },
                      children: [
                        {
                          name: 'source',
                          $: {},
                          children: ['test-content'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          $: {
            version: '1.0',
          },
        })
      ).toEqual(
        `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.0"><file source-language="en"><body/></file><file><body><trans-unit id="abcd"><source>test-content</source></trans-unit></body></file></xliff>`
      );
    });

    it('should use options given in input', () => {
      expect(
        new XliffBuilder({
          allowEmpty: true,
          dontPrettyTextNodes: true,
          indent: ' ',
          newline: '\n\n',
          offset: 1,
          pretty: true,
          spaceBeforeSlash: ' ',
        }).build({
          name: 'xliff',
          children: [
            {
              name: 'file',
              $: {
                'source-language': 'en',
              },
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [],
                },
              ],
            },
            {
              name: 'file',
              $: {},
              children: [
                {
                  name: 'body',
                  $: {},
                  children: [
                    {
                      name: 'trans-unit',
                      $: {
                        id: 'abcd',
                      },
                      children: [
                        {
                          name: 'source',
                          $: {},
                          children: ['test-content'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          $: {
            version: '1.0',
          },
        })
      ).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.0">
 <file source-language="en">
  <body></body>
 </file>
 <file>
  <body>
   <trans-unit id="abcd">
    <source>test-content</source>
   </trans-unit>
  </body>
 </file>
</xliff>`);
    });

    it('should rebuild the original file', () => {
      builder = new XliffBuilder({
        indent: '  ',
        pretty: true,
      });
      expect(builder.build(XLIFF_JSON as any)).toEqual(
        readFileSync(
          resolve(__dirname, '../test-data/data.xlf'),
          'utf-8'
        ).trimEnd()
      );
    });
  });
});
