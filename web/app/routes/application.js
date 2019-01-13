import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';

export default Route.extend({
  session: service(),
  beforeModel: function () {
    return this.get('session').fetch().catch(function () { });
  },
  actions: {
    signIn: function (provider) {
      this.get('session').open('firebase', { provider: provider }).then(function (data) {
        Ember.Logger.debug(data.currentUser);
      });
    },
    signOut: function () {
      this.get('session').close();
    }
  }
});