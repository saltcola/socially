import { Component, NgZone } from '@angular/core';
import { ActivatedRoute,ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import {Parties} from '../../../collections/parties.ts';
import { Meteor } from 'meteor/meteor';
import { RequireUser } from 'angular2-meteor-accounts-ui';
 
import template from './party-details.html';
 
@Component({
  selector: 'party-details',
  template,
  directives: [ROUTER_DIRECTIVES]
})
@RequireUser()
export class PartyDetails {
  partyId: string;
  party: Party;
 
  constructor(private route: ActivatedRoute,  private ngZone: NgZone) {}
 
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.partyId = params['partyId'];
      
      Tracker.autorun(() => {
        this.ngZone.run(() => {
          this.party = Parties.findOne(this.partyId);
        });
      });
    });
  }

  saveParty(party) {
    if (Meteor.userId()) {
      Parties.update(party._id, {
        $set: {
          name: party.name,
          description: party.description,
          location: party.location
        }
      });
    } else {
      alert('Please log in to change this party');
    }
  }
}
