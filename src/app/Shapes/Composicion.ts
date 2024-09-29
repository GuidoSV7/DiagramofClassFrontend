import { dia, shapes } from '@joint/plus';

export class Composicion {
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
            'd': 'M 10 -5 0 0 10 5 Z',
            'fill': 'black'
          },
          type: 'composite'
        }
      }
    });
  }

  getLink() {
    return this.link;
  }

  setSource(sourceId: any) {
    this.link.set('source', { id: sourceId });
  }

  setTarget(targetId: any) {
    this.link.set('target', { id: targetId });
  }
}
