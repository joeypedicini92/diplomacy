import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  session: service(),

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
  },

  actions: {
    submitOrders() {
      this.units.forEach((u) => {
        var order = this.get('store').createRecord('order', {
          territory: u.territory,
          country: 'england',
          moveTerritory: u.order.id === 'M' ? u.toTerritory.id : u.territory,
          type: u.order.id,
          unit: u.type,
          supportType: (u.fromTerritory && u.fromTerritory.id) ? 'A' : undefined,
          supportToTerritory: ['S', 'C'].includes(u.order.id) ? u.toTerritory.id : undefined,
          supportFromTerritory: ['S', 'C'].includes(u.order.id) ? u.fromTerritory.id : undefined,
          year: 1901,
          season: 'spring',
          phase: 'move',
          userId: this.get('session.currentUser.uid')
        });
        order.save();
      });
    }
  }
});
