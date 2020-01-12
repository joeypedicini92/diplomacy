import { OrderInterface, UnitInterface, OrderType, TerritoryInterface } from './types';

export class Order implements OrderInterface {
  unit: UnitInterface | null;
  type?: OrderType;
  secondaryUnit?: UnitInterface;
  fromTerritoryId?: string;
  toTerritoryId?: string;

  get isStarted(): boolean {
    return this.unit !== null;
  }

  get isComplete(): boolean {
    // unit + Hold
    // unit + move + toTerritory
    // unit + support + fromTerritory + toTerritory
    // unit + convoy + fromTerritory + toTerritory

    if (this.unit) {
      if (this.type === OrderType.Hold) {
        return true;
      } else if (this.type === OrderType.Move && this.toTerritoryId) {
        return true;
      } else if (this.type === OrderType.Support && this.toTerritoryId && this.fromTerritoryId) {
        return true;
      } else if (this.type === OrderType.Convoy && this.toTerritoryId && this.fromTerritoryId) {
        return true;
      }
    }

    return false;
  }

  constructor(unit?: UnitInterface, type?: OrderType) {
    this.setUnit(unit);
    this.type = type || null;
  }

  updateBasedOnClickedTerritory(territoryId: string, unit: UnitInterface): void {
    if (!this.unit) {
      // start a pending order if there wasn't an order already and the clicked territory has a unit
      this.setUnit(unit);
    } else if (!this.type && !unit) {
      // if theres a pending order with no type and you click a non-unit, clear the order
      this.setUnit(null);
    } else if (this.type === OrderType.Move) {
      this.toTerritoryId = territoryId;
    } else if (this.type === OrderType.Support || this.type === OrderType.Convoy) {
      if (this.fromTerritoryId) {
        this.toTerritoryId = territoryId;
      } else {
        this.fromTerritoryId = territoryId;
      }
    }
  }

  updateBasedOnClickedOrder(orderType: OrderType) {
    // TODO
  }

  private setUnit(unit: UnitInterface | null) {
    this.unit = unit || null;
  }
}
