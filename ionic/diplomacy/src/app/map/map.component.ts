import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SvgHelper } from '../shared/svg-helper';
import { UnitInterface, Nation, UnitType } from '../models/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) map: ElementRef;
  svgMap: any;
  popup: any;
  units: UnitInterface[] = [
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
  ];

  constructor() { }

  ngOnInit() {
    this.map.nativeElement.addEventListener('load', () => {
      this.svgMap = this.map.nativeElement.contentDocument;
      this.popup = this.svgMap.getElementById('tooltip');
      this.initializeUnitsOnMap();
      this.applyHoverFunctionToTerritories();
    });
  }

  private initializeUnitsOnMap(): void {
    this.units.forEach((unit) => {
      SvgHelper.drawUnitOnMap(this.svgMap, unit);
    });
  }

  private applyHoverFunctionToTerritories() {
    const territories = this.svgMap.querySelectorAll('.territory');

    territories.forEach((elem) => {
      elem.addEventListener('mouseover', (event: MouseEvent) => {
        ( event.target as SVGPathElement).style.fill = 'orange';
        this.showPopup(elem);
      }, false);

      elem.addEventListener('mouseleave', (event) => {
        (event.target as SVGPathElement).style.fill = '';
        this.hidePopup();
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
