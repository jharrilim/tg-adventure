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
            ],
            response: unindent(`
              You choose to take the chocolate bars.
              They do seem pretty delicious\\!
            `)
          },
          {
            text: 'Don\'t Take',
            type: 'skip',
            response: unindent(`
              You choose to not take any chocolate bars.
              They don't seem to have your favourite flavour.
            `)
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
