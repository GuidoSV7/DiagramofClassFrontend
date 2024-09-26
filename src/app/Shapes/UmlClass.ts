import { dia, shapes } from '@joint/plus';

export class UMLClass {
  private rect: joint.shapes.standard.Rectangle;

  constructor(x: number, y: number, className: string, attributes: string[]) {
    this.rect = new shapes.standard.Rectangle();
    this.rect.position(x, y);
    this.rect.resize(180, 50 + attributes.length * 20); // Ajustar el tamaño según el número de atributos
    this.rect.attr({
      body: {
        fill: 'lightgray',
        stroke: 'black',
        strokeWidth: 2
      },
      label: {
        text: this.formatLabel(className, attributes),
        fill: '#353535',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAnchor: 'middle'
      }
    });
  }

  private formatLabel(className: string, attributes: string[]): string {
    const attributesText = attributes.map(attr => `+ ${attr}`).join('\n');
    return `${className}\n\n${attributesText}`;
}

  getRectangle() {
    return this.rect;
  }
}

// Uso de la clase UMLClass
const graph = new dia.Graph();

const umlClass = new UMLClass(100, 30, 'MyClass', ['+ attribute1: Type1', '+ attribute2: Type2']);
graph.addCell(umlClass.getRectangle());
