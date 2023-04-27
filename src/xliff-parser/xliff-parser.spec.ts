import { readFileSync } from 'fs';
import { resolve } from 'path';
import { XLIFF_JSON } from '../test-data/data';
import { XliffParser } from './xliff-parser';

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
      expect(parser.parse('<xliff/>')).toEqual({
        name: 'xliff',
        children: [],
        $: {},
      });
    });

    it('should parse a regular xliff', () => {
      expect(
        parser.parse(`<xliff version="1.0">
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
</xliff>`)
      ).toEqual({
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
      });
    });

    it('should throw when the xml is malformed', () => {
      expect(() => parser.parse('<xliff><file>content</xliff>')).toThrow();
    });

    it('should parse a real XLIFF file', () => {
      expect(
        parser.parse(
          readFileSync(resolve(__dirname, '../test-data/data.xlf'), 'utf-8')
        )
      ).toEqual(XLIFF_JSON);
    });
  });
});
