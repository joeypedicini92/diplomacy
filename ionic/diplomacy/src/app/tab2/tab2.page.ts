import { Component, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { TerritoryInterface, UnitInterface, Nation, UnitType, OrderInterface, OrderType, TerritoryType } from '../models/types';
import { IonFab, IonFabList, IonFabButton } from '@ionic/angular';
import { Order } from '../models/order';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit {
  units: UnitInterface[];
  territories: TerritoryInterface[];

  get orders(): Order[] {
    return this.os;
  }

  set orders(o: Order[]) {
    this.os = o;
    this.cdr.detectChanges();
  }

  pendingOrder: Order = new Order();
  ordersFinalized = false;

  @ViewChild('orderMenu', { static: true }) orderMenu: IonFab;
  @ViewChild('move', { static: false }) orderMove: IonFabButton;
  @ViewChild('hold', { static: false }) orderHold: IonFabButton;
  @ViewChild('support', { static: false }) orderSupport: IonFabButton;
  @ViewChild('convoy', { static: false }) orderConvoy: IonFabButton;

  private os: Order[];

  constructor(
    private cdr: ChangeDetectorRef,
    private gameService: GameService
  ) {
  }

  ngAfterViewInit(): void {
    this.gameService.orders.subscribe(o => this.orders = o);
    this.gameService.units.subscribe(u => this.units = u);
    this.gameService.territories.subscribe(t => this.territories = t);
  }

  onSubmitClicked() {
    this.gameService.submitOrders(this.orders);
  }

  onTerritoryClick(territoryId: string) {
    const unit = this.getUnitByTerritoryId(territoryId);
    this.pendingOrder.updateBasedOnClickedTerritory(territoryId, unit);
    if (this.pendingOrder.isComplete) {
      this.addPendingOrderToFinalOrdersList();
    }
    this.toggleOrderMenuOpenClose();
    this.updateOrderMenuColors();
    this.cdr.detectChanges();
  }

  onActionClick(orderType: OrderType, event: Event) {
    this.pendingOrder.type = orderType;
    if (this.pendingOrder.isComplete) {
      this.addPendingOrderToFinalOrdersList();
    }
    this.toggleOrderMenuOpenClose();
    this.updateOrderMenuColors();
    event.stopPropagation();
  }

  getValidSupportToTerritories(t: string) {
    return this.territories.filter((terr) => {
      return terr.neighbors.includes(t);
    }).map((terr) => terr.id).sort();
  }

  getValidSupportFromTerritories(t: string) {
    return this.units.map((u) => u.territoryId).sort();
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
    const o = this.pendingOrder.type;
    this.orderConvoy.color = o === OrderType.Convoy ? 'primary' : null;
    this.orderSupport.color = o === OrderType.Support ? 'primary' : null;
    this.orderHold.color = o === OrderType.Hold ? 'primary' : null;
    this.orderMove.color = o === OrderType.Move ? 'primary' : null;
  }

  private toggleOrderMenuOpenClose() {
    if (this.pendingOrder.isStarted) {
      this.orderMenu.activated = true;
    } else {
      this.orderMenu.close();
    }
  }

  private addPendingOrderToFinalOrdersList() {
    const i = this.orders.findIndex(o => o.unit.territoryId === this.pendingOrder.unit.territoryId);
    const newOrders = Object.assign([], this.orders);
    if (i > -1) {
      newOrders[i] = Object.assign({}, this.pendingOrder);
    } else {
      newOrders.push(Object.assign({}, this.pendingOrder));
    }
    this.pendingOrder = new Order();
    this.orders = newOrders;
  }
}
