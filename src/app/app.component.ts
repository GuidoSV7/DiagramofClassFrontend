import { AfterViewInit, OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { dia, ui, shapes, util } from '@joint/plus';
import { Asociacion } from './Shapes/Asociacion';
import { UMLClass } from './Shapes/UmlClass';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;



  public ngOnInit(): void {
    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
        el: document.getElementById('paper'),
        model: graph,
        background: {
            color: '#F8F9FA',
        },
        width: 600,
        height: 600,
        async: true,

        cellViewNamespace: shapes
    });


  // create stencil
  const stencil = new ui.Stencil({
    paper: paper,
    width: 170,
    height: 500,
    layout: true,
    dropAnimation: true
  });
  stencil.render();
  document.getElementById('stencil')?.appendChild(stencil.el);

  const elements = [
    {
        type: 'standard.Rectangle',
        size: { width: 70, height: 50 },
        attrs: {
          body: {
            fill: 'lightgray',
            stroke: 'black',
            strokeWidth: 2,
            className: 'className',
            attributes: 'attributes'
          },
        }
    }


  ];
  stencil.load(elements);

  // create toolbar
const toolbar = new ui.Toolbar({
  tools: [
      {
          type: 'button',
          name: 'json',
          text: 'Export JSON'
      },

      {
        type: 'button',
        name: 'springboot',
        text: 'Export SpringBoot'
      }


  ]
});

  toolbar.render();
  document.getElementById('toolbar')?.appendChild(toolbar.el);

  toolbar.on('json:pointerclick', () => {
    const str = JSON.stringify(graph.toJSON());
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
    util.downloadBlob(blob, 'joint-plus.json');
  });



    const scroller = this.scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,

    });

    scroller.render();

    const rect1 = new UMLClass(100, 100,'Person', ['name: string', 'age: number']).getRectangle();
    const rect2 = new UMLClass(400, 100,'Job', ['title: string']).getRectangle();

    this.graph.addCell(rect1);
    this.graph.addCell(rect2);


    const customLink = new Asociacion(rect1.id, rect2.id);
    customLink.addLabel('1..1', 0.25);
    customLink.addLabel('1..*', 0.75);


    graph.addCell(customLink.getLink());


    console.log(this.graph.toJSON());


    // Event listeners for inspector
    this.paper.on('cell:pointerdown', (cellView) => {
      this.openInspector(cellView.model);
    });

    stencil.on('element:drop', (elementView) => {
      this.openInspector(elementView.model);
    });
    // Create halo
    this.paper.on('cell:pointerup', (cellView) => {
      new ui.Halo({ cellView: cellView }).render();
    });
  }




  public ngAfterViewInit(): void {
    const { canvas } = this;
    this.scroller = new ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true,
      cursor: 'grab'
    });
    this.scroller.render();
    canvas.nativeElement.appendChild(this.scroller.el);
    this.scroller.center();






  }

    // Inspector related methods
    private openInspector(cell: dia.Cell): void {
      this.closeInspector(); // close inspector if currently open
      ui.Inspector.create('#inspector', {
        cell: cell,
        inputs: this.getInspectorConfig(cell),
      });
    }

    private closeInspector(): void {
      ui.Inspector.close();
    }

    private getInspectorConfig(cell: dia.Cell) {
      if (cell.isElement()) {
        return {
          attrs: {
            label: {
              text: {
                type: 'content-editable',
                label: 'Label'
              }
            }
          }
        };
      } else { // cell.isLink()
        return {
          labels: {
            type: 'list',
            label: 'Labels',
            item: {
              type: 'object',
              properties: {
                attrs: {
                  text: {
                    text: {
                      type: 'content-editable',
                      label: 'Text',
                      defaultValue: 'label'
                    }
                  },
                },
                position: {
                  type: 'select-box',
                  options: [
                    { value: 30, content: 'Source' },
                    { value: 0.5, content: 'Middle' },
                    { value: -30, content: 'Target' }
                  ],
                  defaultValue: 0.5,
                  label: 'Position'
                }
              }
            }
          }
        };
      }
    }
}



