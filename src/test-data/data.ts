export const XLIFF_JSON = {
  $: {
    version: '1.2',
    xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
  },
  children: [
    {
      $: {
        datatype: 'plaintext',
        original: 'ng2.template',
        'source-language': 'en',
      },
      children: [
        {
          $: {},
          children: [
            {
              $: {
                datatype: 'html',
                id: 'history.recent-files',
              },
              children: [
                {
                  $: {},
                  children: [
                    'Recent files (',
                    {
                      $: {
                        'equiv-text': '{{ filePaths.length }}',
                        id: 'INTERPOLATION',
                      },
                      children: [],
                      name: 'x',
                    },
                    'items)',
                  ],
                  name: 'source',
                },
                {
                  $: {
                    purpose: 'location',
                  },
                  children: [
                    {
                      $: {
                        'context-type': 'sourcefile',
                      },
                      children: [
                        'src/app/components/history/history.component.html',
                      ],
                      name: 'context',
                    },
                    {
                      $: {
                        'context-type': 'linenumber',
                      },
                      children: [1],
                      name: 'context',
                    },
                  ],
                  name: 'context-group',
                },
                {
                  $: {
                    from: 'description',
                    priority: '1',
                  },
                  children: ['Recent files title'],
                  name: 'note',
                },
              ],
              name: 'trans-unit',
            },
            {
              $: {
                datatype: 'html',
                id: 'history.empty-list',
              },
              children: [
                {
                  $: {},
                  children: ['No opened file yet'],
                  name: 'source',
                },
                {
                  $: {
                    purpose: 'location',
                  },
                  children: [
                    {
                      $: {
                        'context-type': 'sourcefile',
                      },
                      children: [
                        'src/app/components/history/history.component.html',
                      ],
                      name: 'context',
                    },
                    {
                      $: {
                        'context-type': 'linenumber',
                      },
                      children: [12],
                      name: 'context',
                    },
                  ],
                  name: 'context-group',
                },
                {
                  $: {
                    from: 'description',
                    priority: '1',
                  },
                  children: ['Default label when no file is in the history'],
                  name: 'note',
                },
              ],
              name: 'trans-unit',
            },
          ],
          name: 'body',
        },
      ],
      name: 'file',
    },
  ],
  name: 'xliff',
};
