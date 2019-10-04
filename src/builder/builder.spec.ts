import { XliffBuilder } from './builder';

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
        name: 'root',
        children: [],
        $: {},
      })).toEqual('<?xml version="1.0"?><root/>');
    });

    it('should build a regular xml', () => {
      expect(builder.build({
        name: 'root',
        children: [
          {
            name: 'test',
            $: {
              id: 'abcd'
            },
            children: [
              'test content'
            ],
          },
          {
            name: 'test',
            $: {},
            children: [
              {
                name: 'source',
                $: {},
                children: [
                  'content',
                ],
              },
            ],
          },
        ],
        $: {
          version: '2.0'
        },
      })).toEqual('<?xml version="1.0"?><root version="2.0"><test id="abcd">test content</test><test><source>content</source></test></root>');
    });

    it('should build a regular xml', () => {
      expect(new XliffBuilder({ pretty: true }).build({
        name: 'root',
        children: [
          {
            name: 'test',
            $: {
              id: 'abcd'
            },
            children: [
              'test content'
            ],
          },
          {
            name: 'test',
            $: {},
            children: [
              {
                name: 'source',
                $: {},
                children: [
                  'content',
                ],
              },
            ],
          },
        ],
        $: {
          version: '2.0'
        },
      })).toEqual(`<?xml version="1.0"?>
<root version="2.0">
  <test id="abcd">test content</test>
  <test>
    <source>content</source>
  </test>
</root>`);
    });
  });
});
