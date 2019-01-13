import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    this.set('units', [
      {
        territory: 'mos',
        type: 'A'
      }
    ]);

    this.set('orders', [
      { id: 'M', display: 'move'},
      { id: 'H', display: 'hold' },
      { id: 'S', display: 'support' },
      { id: 'C', display: 'convoy' }
    ])

    this.set('territories', [
      {
        id: 'mos',
        country: 'Russia',
        unit: 'A'
      },
      {
        id: 'lpl',
        country: 'England',
        unit: 'F'
      },
      {
        id: 'par',
        country: 'France',
        unit: 'A'
      },
      {
        id: 'ank',
        country: 'Turkey',
        unit: 'F'
      },
      {
        id: 'tri',
        country: 'Austria',
        unit: 'A'
      },
      {
        id: 'nap',
        country: 'Italy',
        unit: 'F'
      },
      {
        id: 'ber',
        country: 'Germany',
        unit: 'A'
      }
    ]);
  },
  

  shouldDisplayFromTerritory(unit) {
    if (unit.order === 'C' || unit.order === 'S') {
      return true;
    } else {
      return false;
    }
  },

  shouldDisplayToTerritory(unit) {
    if(unit.order === 'H') {
      return false;
    } else {
      return true;
    }
  }
});
