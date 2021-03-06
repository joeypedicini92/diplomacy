import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { SvgHelper } from '../shared/svg-helper';
import { UnitInterface, Nation, UnitType, TerritoryInterface } from '../models/types';
import { Order } from '../models/order';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) map: ElementRef;
  svgMap: any;
  popup: any;
  @Input()
  get units(): UnitInterface[] {
    return this.us;
  }
  set units(u: UnitInterface[]) {
    this.us = u;
  }

  @Input()
  get orders(): Order[] {
    return this.os;
  }
  set orders(o: Order[]) {
    this.os = o;
    if (this.isLoaded) {
      this.initializeOrdersOnMap();
    }
  }

  @Output() territoryClicked = new EventEmitter<string>();
  selectedTerritory: SVGPathElement;

  private us: UnitInterface[];
  private os: Order[];
  private isLoaded = false;

  constructor() { }

  ngOnInit() {
    this.map.nativeElement.addEventListener('load', () => {
      this.isLoaded = true;
      this.svgMap = this.map.nativeElement.contentDocument;
      this.popup = this.svgMap.getElementById('tooltip');
      this.initializeUnitsOnMap();
      this.initializeOrdersOnMap();
      this.applyHoverFunctionToTerritories();
    });
  }

  private initializeUnitsOnMap(): void {
    this.units.forEach((unit) => {
      SvgHelper.drawUnitOnMap(this.svgMap, unit);
    });
  }

  private initializeOrdersOnMap(): void {
    this.orders.forEach((order) => {
      SvgHelper.drawOrderOnMap(this.svgMap, order);
    });
  }

  private applyHoverFunctionToTerritories() {
    const territories = this.svgMap.querySelectorAll('.territory');

    territories.forEach((elem) => {
      elem.addEventListener('mouseover', () => {
        this.showPopup(elem);
      }, false);

      elem.addEventListener('mouseleave', () => {
        this.hidePopup();
      }, false);

      elem.addEventListener('click', (event) => {
        if (this.selectedTerritory) {
          this.selectedTerritory.style.fill = '';
        }
        this.selectedTerritory = (event.target as SVGPathElement);
        this.selectedTerritory.style.fill = 'orange';
        const id = this.selectedTerritory.getAttribute('data-name');
        this.territoryClicked.emit(id);
      }, false);
    });
  }

  private showPopup(elem) {
    const box = elem.getBBox();
    this.popup.style.x = box.x + (box.width / 2) - 30 + 'px';
    this.popup.style.y = box.y + (box.height / 2) - 18 + 'px';
    this.popup.style.display = 'block';
    this.popup.textContent = elem.dataset.name.toUpperCase();
    this.svgMap.getElementsByTagName('g')[0].appendChild(this.popup);
  }

  private hidePopup() {
    this.popup.style.display = 'none';
  }
}
