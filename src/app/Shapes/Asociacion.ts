import { dia, ui, shapes } from '@joint/plus';

export class Asociacion {
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
            'd': 'M 0 0' // Esto elimina la flecha en el extremo del enlace
          }
        }
      }
    });
  }

  addLabel(text: string, distance: number) {
    this.link.appendLabel({
      attrs: {
        text: {
          text: text,
          fill: 'black',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Arial'
        }
      },
      position: {
        distance: distance // Posición relativa en el enlace (0.0 - 1.0)
      }
    });
  }

  getLink() {
    return this.link;
  }
}
