import { UnitInterface, UnitType, OrderType } from '../models/types';
import { Order } from '../models/order';

const CANNON = `M474.549,334.223c-17.519,0-25.497-7.092-36.539-16.908c-9.09-8.081-19.813-17.598-36.409-22.139
			c2.023-7.54,3.484-15.309,4.319-23.262l11.266,0.203v15.172h31.289v-14.88C483.912,269.964,512,240.372,512,204.325
			c0-36.046-28.089-65.638-63.525-68.082v-15.828h-31.289v15.645h-69.663c-25.506-19.611-57.411-31.289-91.997-31.289
			c-38.074,0-72.902,14.149-99.518,37.457L0,146.955v113.793l104.502,3.165c4.131,79.723,70.29,143.316,151.024,143.316
			c34.482,0,66.297-11.609,91.765-31.112c24.884,1.096,37.977,7.136,52.909,14.027c17.351,8.009,37.016,17.085,74.349,17.085
			c20.128,0,36.504-16.376,36.504-36.504C511.053,350.597,494.677,334.223,474.549,334.223z M448.475,167.661
			c18.157,2.337,32.236,17.882,32.236,36.663c0,18.784-14.079,34.33-32.236,36.664V167.661z M417.186,167.348v73.474l-11.207-0.201
			c-2.758-27.183-12.753-52.256-28.011-73.272H417.186z M271.171,137.08c32.264,4.222,60.531,21.316,79.469,45.942l-59.434,34.315
			c-5.909-5.458-12.773-9.31-20.034-11.558V137.08z M239.882,137.081v68.699c-7.261,2.248-14.125,6.1-20.034,11.558l-59.435-34.314
			C179.351,158.397,207.617,141.301,239.882,137.081z M106.099,232.661l-74.81-2.268v-53.081l96.981-2.939
			C117.11,191.71,109.397,211.464,106.099,232.661z M144.726,301.909c-5.884-14.149-9.141-29.655-9.141-45.908
			c0-16.253,3.256-31.757,9.139-45.905l59.495,34.347c-1.701,7.605-1.701,15.512-0.001,23.116L144.726,301.909z M160.413,328.98
			l59.433-34.314c5.909,5.458,12.773,9.311,20.035,11.559l0.001,68.696C207.619,370.701,179.352,353.605,160.413,328.98z
			 M240.441,271.086c-8.318-8.318-8.318-21.851,0.001-30.17c8.318-8.318,21.851-8.318,30.17,0c8.318,8.318,8.318,21.851,0,30.169
			C262.293,279.405,248.76,279.405,240.441,271.086z M271.172,374.92l-0.001-68.697c7.262-2.249,14.125-6.101,20.035-11.559
			l59.434,34.314C331.702,353.603,303.435,370.7,271.172,374.92z M306.834,267.559c1.7-7.604,1.7-15.512,0-23.116l59.493-34.349
			c5.884,14.149,9.141,29.654,9.141,45.907c0,16.254-3.256,31.757-9.14,45.907L306.834,267.559z M474.549,375.942
			c-30.46,0-44.722-6.582-61.237-14.204c-10.616-4.9-22.107-10.196-37.973-13.573c5.659-7.338,10.665-15.204,14.92-23.518
			c11.291,2.151,18.162,8.23,26.964,16.054c12.436,11.054,27.913,24.811,57.328,24.811c2.875,0,5.215,2.339,5.215,5.215
      S477.425,375.942,474.549,375.942z`;

const SHIP = `M313.49,306H68.373v-62.997c0-4.97,4.029-9,9-9H271.93c3.409,0,6.525,1.926,8.05,4.975L313.49,306z M176.368,144.008
		v-35.999h-62.997v35.999H176.368z M113.371,162.007v62.997h62.997v-62.997H113.371z M609.979,329.663l-44.802,81.248
		c-31.663,57.421-92.047,93.08-157.618,93.08H91.95c-19.368,0-36.563-12.394-42.688-30.769L0.469,326.845
		C-1.474,321.017,2.864,315,9.006,315h593.977C610.554,315,614.742,323.778,609.979,329.663z M152.987,392.375
		c0-9.644-7.816-17.46-17.459-17.46c-9.643,0-17.459,7.816-17.459,17.46c0,9.643,7.817,17.459,17.459,17.459
		C145.17,409.834,152.987,402.018,152.987,392.375z M224.984,392.375c0-9.644-7.817-17.46-17.46-17.46
		c-9.643,0-17.459,7.816-17.459,17.46c0,9.643,7.817,17.459,17.459,17.459C217.167,409.834,224.984,402.018,224.984,392.375z
		 M296.98,392.375c0-9.644-7.816-17.46-17.459-17.46c-9.643,0-17.459,7.816-17.459,17.46c0,9.643,7.817,17.459,17.459,17.459
    C289.164,409.834,296.98,402.018,296.98,392.375z`;

const LINE = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg" viewBox="0 40 400 200">
    <marker id="triangle"
      viewBox="0 0 10 10" refX="0" refY="5"
      markerUnits="strokeWidth"
      markerWidth="4" markerHeight="3"
      orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
	<line x1="100" y1="50.5" x2="300" y2="50.5" marker-end="url(#triangle)" stroke="black" stroke-width="10"/>
</svg>`;

const CIRCLE = `<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" />`;

export class SvgHelper {

  static buildUnit(path: SVGAElement, t: UnitInterface) {
    const d = t.type === UnitType.Army ? CANNON : SHIP;
    const box = path.getBBox();
    const x = box.x + (box.width / 2) - 30;
    const y = box.y + (box.height / 2) - 18;
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    u.setAttribute('d', d);
    u.setAttribute('transform', `translate(${x}, ${y}) scale(0.1)`);
    u.setAttribute('class', `${t.nation.toLowerCase()} unit`);
    u.setAttribute('data-terr', `${t.territoryId.toLowerCase()}`);
    return u;
  }

  static buildCircle(path: SVGAElement) {
    const d = CIRCLE;
    const box = path.getBBox();
    const x = box.x + (box.width / 2);
    const y = box.y + (box.height / 2) + 10;
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    u.setAttribute('cx', `${x}`);
    u.setAttribute('cy', `${y}`);
    u.setAttribute('r', '40');
    u.setAttribute('stroke', 'black');
    u.setAttribute('stroke-width', '10');
    u.setAttribute('fill', 'none');
    return u;
  }

  static drawUnitOnMap(map: SVGAElement, unit: UnitInterface) {
    const svgEl = map.querySelector(`[data-name=${unit.territoryId}]`) as SVGAElement;
    const army = SvgHelper.buildUnit(svgEl, unit);
    map.getElementsByTagName('g')[0].appendChild(army);
    svgEl.classList.add(unit.nation.toLowerCase());
  }

  static drawOrderOnMap(map: SVGAElement, order: Order) {
    const svgEl = map.querySelector(`[data-name=${order.unit.territoryId}]`) as SVGAElement;
    if (order.type === OrderType.Hold) {
      const holdCircle = SvgHelper.buildCircle(svgEl);
      map.getElementsByTagName('g')[0].appendChild(holdCircle);
    }
  }
}
