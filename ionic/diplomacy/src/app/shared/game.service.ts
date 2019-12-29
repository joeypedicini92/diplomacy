import { Injectable } from '@angular/core';
import { TerritoryInterface, UnitInterface, Nation, UnitType, OrderType } from '../models/types';
import territoryList from '../shared/territories.json';
import { Order } from '../models/order';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  territories: BehaviorSubject<TerritoryInterface[]>;
  orders: BehaviorSubject<Order[]>;
  units: BehaviorSubject<UnitInterface[]>;
  constructor() {
    this.territories = new BehaviorSubject<TerritoryInterface[]>(territoryList);
    this.units = new BehaviorSubject<UnitInterface[]>([
      {
        territoryId: 'mos',
        nation: Nation.Russia,
        type: UnitType.Army
      },
      {
        territoryId: 'lpl',
        nation: Nation.England,
        type: UnitType.Fleet
      },
      {
        territoryId: 'par',
        nation: Nation.France,
        type: UnitType.Army
      },
      {
        territoryId: 'ank',
        nation: Nation.Turkey,
        type: UnitType.Fleet
      },
      {
        territoryId: 'tri',
        nation: Nation.Austria,
        type: UnitType.Army
      },
      {
        territoryId: 'nap',
        nation: Nation.Italy,
        type: UnitType.Fleet
      },
      {
        territoryId: 'ber',
        nation: Nation.Germany,
        type: UnitType.Army
      }
    ]);
    this.orders = new BehaviorSubject<Order[]>([
      {
        unit: this.units.getValue()[0],
        type: OrderType.Hold
      }
    ]);
  }

  submitOrders(orders: Order[]) {
    this.orders.next(orders);
  }
}
