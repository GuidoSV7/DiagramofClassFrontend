import { AfterViewInit, OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { dia, ui, shapes } from '@joint/plus';
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

    // Create halo
    this.paper.on('cell:pointerup', (cellView) => {
      new ui.Halo({ cellView: cellView }).render();
    });
  }

}
