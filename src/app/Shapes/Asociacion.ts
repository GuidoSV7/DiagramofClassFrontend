import { dia, shapes } from '@joint/plus';

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
            'd': 'M 10 -5 0 0 10 5 Z' // Definición original
          },
          type: 'none'
        }
      }
    });
    this.addDefaultLabels();
  }

  addDefaultLabels() {
    this.link.label(0, {
      position: 0.25,
      attrs: {
        text: {
          text: '1..1',
          fill: 'black', // Color del texto
          fontSize: 12, // Tamaño de la fuente
          fontFamily: 'Arial', // Familia de la fuente
          fontWeight: 'bold', // Peso de la fuente
          textAnchor: 'middle', // Alineación del texto
          yAlignment: 'middle' // Alineación vertical del texto
        },
        rect: {
          fill: '#FFFFFF', // Color de fondo del rectángulo
          stroke: '#000000', // Color del borde del rectángulo
          strokeWidth: 1, // Ancho del borde del rectángulo
          rx: 5, // Radio de las esquinas del rectángulo
          ry: 5 // Radio de las esquinas del rectángulo
        }
      }
    });
    this.link.label(1, {
      position: 0.75,
      attrs: {
        text: {
          text: '1..*',
          fill: 'black', // Color del texto
          fontSize: 12, // Tamaño de la fuente
          fontFamily: 'Arial', // Familia de la fuente
          fontWeight: 'bold', // Peso de la fuente
          textAnchor: 'middle', // Alineación del texto
          yAlignment: 'middle' // Alineación vertical del texto
        },
        rect: {
          fill: '#FFFFFF', // Color de fondo del rectángulo
          stroke: '#000000', // Color del borde del rectángulo
          strokeWidth: 1, // Ancho del borde del rectángulo
          rx: 5, // Radio de las esquinas del rectángulo
          ry: 5 // Radio de las esquinas del rectángulo
        }
      }
    });
  }

  addLabel(text: string, distance: number) {
    this.link.appendLabel({
      attrs: {
        text: {
          text: text,
          fill: 'black', // Color del texto
          fontSize: 14, // Tamaño de la fuente
          fontWeight: 'bold', // Peso de la fuente
          fontFamily: 'Arial', // Familia de la fuente
          textAnchor: 'middle', // Alineación del texto
          yAlignment: 'middle' // Alineación vertical del texto
        },
        rect: {
          fill: '#FFFFFF', // Color de fondo del rectángulo
          stroke: '#000000', // Color del borde del rectángulo
          strokeWidth: 1, // Ancho del borde del rectángulo
          rx: 5, // Radio de las esquinas del rectángulo
          ry: 5 // Radio de las esquinas del rectángulo
        }
      },
      position: {
        distance: distance // Posición relativa en el enlace (0.0 - 1.0)
      }
    });
  }

  setSource(sourceId: any) {
    this.link.set('source', { id: sourceId });
  }

  setTarget(targetId: any) {
    this.link.set('target', { id: targetId });
  }

  getLink() {
    return this.link;
  }
}
