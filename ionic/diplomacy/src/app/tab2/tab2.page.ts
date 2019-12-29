import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TerritoryInterface, UnitInterface, Nation, UnitType, OrderInterface, OrderType, TerritoryType } from '../models/types';
import { IonFab, IonFabList, IonFabButton } from '@ionic/angular';
import { Order } from '../models/order';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  units: UnitInterface[];
  territories: TerritoryInterface[];
  orders: Order[];

  pendingOrder: Order = null;
  ordersFinalized = false;

  @ViewChild('orderMenu', { static: true }) orderMenu: IonFab;
  @ViewChild('move', { static: false }) orderMove: IonFabButton;
  @ViewChild('hold', { static: false }) orderHold: IonFabButton;
  @ViewChild('support', { static: false }) orderSupport: IonFabButton;
  @ViewChild('convoy', { static: false }) orderConvoy: IonFabButton;

  constructor(
    private cdr: ChangeDetectorRef,
    private gameService: GameService
  ) {
    gameService.orders.subscribe(o => this.orders = o);
    gameService.units.subscribe(u => this.units = u);
    gameService.territories.subscribe(t => this.territories = t);
  }

  onSubmitClicked() {
    this.gameService.submitOrders(this.orders);
  }

  onTerritoryClicked(territoryId: string) {
    this.updateOrder(territoryId);
    this.updateOrderMenu();
    this.updateOrderMenuColors();
    this.cdr.detectChanges();
  }

  onActionClick(orderType: OrderType, event: Event) {
    this.pendingOrder.type = orderType;
    this.updateOrderMenuColors();
    event.stopPropagation();
  }

  getValidSupportToTerritories(t: string) {
    return this.territories.filter((terr) => {
      return terr.neighbors.includes(t.toUpperCase());
    }).map((terr) => terr.id).sort();
  }

  getValidSupportFromTerritories(t: string) {
    return this.units.map((u) => u.territoryId.toUpperCase()).sort();
  }

  getValidConvoyTerritories() {
    return this.territories.filter((terr) => {
      return terr.type === TerritoryType.Coast;
    }).map((terr) => terr.id).sort();
  }

  private getUnitByTerritoryId(id: string): UnitInterface {
    return this.units.find(u => u.territoryId === id);
  }

  private updateOrderMenuColors() {
    const o = this.pendingOrder ? this.pendingOrder.type : null;
    this.orderConvoy.color = o === OrderType.Convoy ? 'primary' : null;
    this.orderSupport.color = o === OrderType.Support ? 'primary' : null;
    this.orderHold.color = o === OrderType.Hold ? 'primary' : null;
    this.orderMove.color = o === OrderType.Move ? 'primary' : null;
  }

  private updateOrderMenu() {
    if (this.pendingOrder) {
      this.orderMenu.activated = true;
    } else {
      this.orderMenu.close();
    }
  }

  private updateOrder(territoryId: string): void {
    const unit = this.getUnitByTerritoryId(territoryId);
    if (!this.pendingOrder && unit) {
      // start a pending order if there wasn't an order already and the clicked territory has a unit
      this.pendingOrder = new Order(unit);
    } else if (!this.pendingOrder && !unit) {
      // do nothing if theres no pending order and no unit clicked
    } else if (!this.pendingOrder.type && !unit) {
      // if theres a pending order with no type and you click a non-unit, clear the order
      this.pendingOrder = null;
    } else if (this.pendingOrder.type === OrderType.Hold) {
      this.finalizePendingOrder();
      // if theres a pending order
    }
  }

  private finalizePendingOrder() {
    const i = this.orders.findIndex(o => o.unit.territoryId === this.pendingOrder.unit.territoryId);
    if (i > -1) {
      this.orders[i] = Object.assign({}, this.pendingOrder);
    } else {
      this.orders.push(Object.assign({}, this.pendingOrder));
    }
    this.pendingOrder = null;
  }

}
