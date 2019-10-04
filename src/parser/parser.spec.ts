import { XliffParser } from './parser';

describe('XliffParser', () => {
  let parser: XliffParser;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new XliffParser()).not.toThrow();
    });
  });

  describe('#parse', () => {
    beforeEach(() => {
      parser = new XliffParser();
    });

    it('should support an undefined value', () => {
      expect(parser.parse(undefined)).toBeUndefined();
    });

    it('should support a null value', () => {
      expect(parser.parse('')).toBeUndefined();
    });

    it('should parse a simple xml', () => {
      expect(parser.parse('<root/>')).toEqual({
        name: 'root',
        children: [],
        $: {},
      });
    });

    it('should parse a regular xml', () => {
      expect(parser.parse(`<root version="1.0">
  <test id="abcd">test content</test>
  <test>
    <source>content</source>
  </test>
</root>`)).toEqual({
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
          version: '1.0'
        },
      });
    });

    it('should throw when the xml is malformed', () => {
      expect(() => parser.parse('<root><test>content</root>')).toThrow();
    });
  });
});
