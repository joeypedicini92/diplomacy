import { OrderInterface, UnitInterface, OrderType, TerritoryInterface } from './types';

export class Order implements OrderInterface {
  unit: UnitInterface;
  type?: OrderType;
  secondaryUnit?: UnitInterface;
  fromTerritoryId?: string;
  toTerritoryId?: string;

  constructor(unit: UnitInterface) {
    this.unit = unit;
  }
}
