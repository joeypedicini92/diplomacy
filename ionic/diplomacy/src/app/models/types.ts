export interface TerritoryInterface {
  poop: string;
}

export interface UnitInterface {
  territoryId: string;
  type: UnitType;
  nation: Nation;
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