const { unindent } = require('./text');

module.exports = [
  {
    name: 'Supermarket',
    description:
      `You have arrived at an abandoned *SUPERMARKET*.\n` +
      `The *SUPERMARKET* is likely to have some food lying around,` +
      `and not many enemies.`
    ,
    difficulty: 1,
    events: [
      {
        description: `
          You find some chocolate bars near the queue for the checkout.
        `,
        actions: [
          {
            text: 'Take',
            type: 'item:get',
            items: [
              {
                minimum: 1,
                maximum: 4,
                name: 'Chocolate Bar',
                type: 'consumable',
                health: 10,
                stamina: 10,
              }
            ]
          },
          {
            text: 'Don\'t Take',
            type: 'skip',
          },
          {
            text: 'COOL IT!',
            type: 'coolit',
            response: unindent(`
              You tell the chocolate bars to *COOL IT!*
              To your dismay, the chocolate bars do not respond.
              You leave.
            `),
          }
        ]
      }
    ],
  }
];
