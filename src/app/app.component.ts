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
        model: graph,
        background: {
            color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes
    });

    const scroller = this.scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab'
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
    const { scroller, paper, canvas } = this;
    canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    paper.unfreeze();
  }
}
