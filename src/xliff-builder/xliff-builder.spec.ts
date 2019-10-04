import { XliffBuilder } from './xliff-builder';

describe('XliffBuilder', () => {
  let builder: XliffBuilder;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new XliffBuilder()).not.toThrow();
    });
  });

  describe('#parse', () => {
    beforeEach(() => {
      builder = new XliffBuilder();
    });

    it('should support an undefined value', () => {
      expect(builder.build(undefined)).toEqual('');
    });

    it('should build a simple xml', () => {
      expect(builder.build({
        name: 'xliff',
        children: [],
        $: {},
      })).toEqual('<?xml version="1.0"?><xliff/>');
    });

    it('should build a regular xml', () => {
      expect(builder.build({
        name: 'xliff',
        children: [
          {
            name: 'file',
            $: {
              "source-language": "en",
            },
            children: [
              {
                name: 'body',
                $: {},
                children: [],
              }
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
                        children: [
                          'test-content',
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        $: {
          version: '1.0'
        },
      })).toEqual('<?xml version="1.0"?><xliff version="1.0"><file source-language="en"><body/></file><file><body><trans-unit id="abcd"><source>test-content</source></trans-unit></body></file></xliff>');
    });

    it('should build a regular xml', () => {
      expect(new XliffBuilder({ pretty: true }).build({
        name: 'xliff',
        children: [
          {
            name: 'file',
            $: {
              "source-language": "en",
            },
            children: [
              {
                name: 'body',
                $: {},
                children: [],
              }
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
                        children: [
                          'test-content',
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        $: {
          version: '1.0'
        },
      })).toEqual(`<?xml version="1.0"?>
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
  });
});
