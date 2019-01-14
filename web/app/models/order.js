import DS from 'ember-data';

export default DS.Model.extend({
  territory: DS.attr('string'),
  moveTerritory: DS.attr('string'),
  type: DS.attr('string'),
  unit: DS.attr('string'),
  supportType: DS.attr('string'),
  supportToTerritory: DS.attr('string'),
  supportFromTerritory: DS.attr('string'),
  userId: DS.attr('string')
});
