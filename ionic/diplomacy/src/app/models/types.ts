export interface TerritoryInterface {
  id: string;
  display: string;
  type: TerritoryType;
  supply_center: boolean;
  neighbors: string[];
  fleet_restrictions: string[];
}

export interface UnitInterface {
  territoryId: string;
  type: UnitType;
  nation: Nation;
}

export interface OrderInterface {
  unit: UnitInterface;
  type?: OrderType;
  secondaryUnit?: UnitInterface;
  fromTerritoryId?: string;
  toTerritoryId?: string;
}

export enum TerritoryType {
  Land = 'l',
  Water = 'w',
  Coast = 'c'
}

export enum OrderType {
  Move = 'M',
  Support = 'S',
  Convoy = 'C',
  Hold = 'H'
}

export enum UnitType {
  Army = 'A',
  Fleet = 'F'
}

export enum Nation {
  Austria = 'Austria',
  England = 'England',
  France = 'France',
  Germany = 'Germany',
  Italy = 'Italy',
  Russia = 'Russia',
  Turkey = 'Turkey'
}