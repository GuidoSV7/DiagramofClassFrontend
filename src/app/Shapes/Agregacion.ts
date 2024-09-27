import { dia, shapes } from '@joint/plus';

export class Agregacion {
  private link: joint.shapes.standard.Link;

  constructor(sourceId: any, targetId: any) {
    this.link = new shapes.standard.Link({
      source: { id: sourceId },
      target: { id: targetId },
      attrs: {
        line: {
          stroke: 'black',
          strokeWidth: 2,
          targetMarker: {
            'type': 'path',
            'd': 'M 10 -5 L 0 0 L 10 5 Z', // Forma de diamante para agregación
            'fill': 'white', // Relleno blanco para diferenciar de la composición
            'stroke': 'black'
          },
          type: 'agregacion'
        }
      }
    });
  }

  getLink() {
    return this.link;
  }
}
