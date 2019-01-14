import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('order', {
      orderBy: 'year',
      equalTo: '1901' 
    });
  }
});
