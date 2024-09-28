import { AfterViewInit, OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { dia, ui, shapes, util } from '@joint/plus';
import { Asociacion } from './Shapes/Asociacion';
import { UMLClass } from './Shapes/UmlClass';
import { Table } from './Shapes/UmlClassdos';

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
        drawGrid: true,
        interactive: { linkMove: true }, // Permitir mover y conectar enlaces
        cellViewNamespace: shapes,
        snapLinks: true,
        linkPinning: false,

    });


  // create stencil
  const stencil = new ui.Stencil({
    paper: paper,
    width: 200,
    layout: true,
    dropAnimation: true,
    groups: {
      one: { label: 'Tables', index: 1 },
      two: { label: 'Lines', index: 2, closed: true }
    }

  });
  stencil.render();
  document.getElementById('stencil')?.appendChild(stencil.el);

  // Crear una instancia de Table
  const table = new Table();
  table.position(100, 100); // Posicionar la tabla en el diagrama
  table.setName('MiTabla'); // Establecer el nombre de la tabla
  table.setColumns([
    { name: 'id', type: 'int'},
    { name: 'name', type: 'string' }
  ]);





  const elements = [
      table





  ];
  stencil.load({one: [table]});

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
      },



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

    // const rect1 = new UMLClass(100, 100,'Person', ['name: string', 'age: number']).getRectangle();
    // const rect2 = new UMLClass(400, 100,'Job', ['title: string']).getRectangle();

    const orders = new Table()
    .setName('orders')
    .position(570, 140)
    .setColumns([
        { name: 'id', type: 'int'},
        { name: 'name', type: 'varchar' },

    ])
    .addTo(graph);

    const groups = new Table()
    .setName('groups')
    .position(900, 140)
    .setColumns([
        { name: 'id', type: 'int'},
        { name: 'status', type: 'varchar' },

    ])
    .addTo(graph);



    // this.graph.addCell(rect1);
    // this.graph.addCell(rect2);


    const customLink = new Asociacion(orders.id, groups.id);
    customLink.addLabel('1..1', 0.25);
    customLink.addLabel('1..*', 0.75);


    graph.addCell(customLink.getLink());


    console.log(this.graph.toJSON());


    //   // Crear un elemento de ejemplo
    //   const rect = new shapes.standard.Rectangle();
    //   rect.position(100, 100);
    //   rect.resize(100, 40);
    //   rect.attr({
    //     body: {
    //       fill: 'blue'
    //     },
    //     label: {
    //       text: 'Hello',
    //       fill: 'white'
    //     }
    //   });
    //   this.graph.addCell(rect);

    //         // Crear un elemento de ejemplo
    //         const rect2 = new shapes.standard.Rectangle();

    //         rect2.position(80, 200);
    //         rect2.resize(100, 40);
    //         rect2.attr({
    //           body: {
    //             fill: 'red',
    //             magnet: true // Habilitar el magnetismo para permitir conexiones
    //           },
    //           label: {
    //             text: 'Hello',
    //             fill: 'white',

    //           },


    //         }

    //       );
    //         this.graph.addCell(rect2);

    //   // Crear un enlace de ejemplo
    // const link = new shapes.standard.Link({
    //   attrs: {
    //     line: {
    //       stroke: '#000',
    //       strokeWidth: 2,
    //       targetMarker: {
    //         type: 'path',
    //         d: 'M 10 -5 0 0 10 5 Z',
    //         fill: '#000'
    //       }
    //     }
    //   },
    //   // Hacer que el enlace sea conectable a otros elementos

    //   router: { name: 'manhattan' }, // Evita la superposición de elementos
    //   z: -1 // Asegurarse de que el enlace esté en el fondo
    // });
    //   link.source({ id: rect.id });
    //   this.graph.addCell(link);


    // Escuchar el evento de conexión para definir el target
    this.paper.on('link:connect', (linkView, evt, connectedElementView) => {
      if (connectedElementView) {
        const targetCell = connectedElementView.model;
        console.log('Elemento conectado:', targetCell);
        // Aquí puedes trabajar con el modelo del elemento conectado
      }
    });

    // Definir el comportamiento al crear enlaces
    this.paper.on('link:pointerdown', (linkView) => {
      console.log('Iniciando la creación de un enlace.');
    });

    // Permitir arrastrar el enlace para cambiar el target
    this.paper.on('link:move', (linkView, evt, x, y) => {
      console.log('Moviendo el enlace a:', x, y);
    });

    // Permitir soltar el enlace para cambiar el target
    this.paper.on('link:pointerup', (linkView, evt, x, y) => {
      console.log('Soltando el enlace en:', x, y);
      const targetElement = this.paper.findViewsFromPoint({ x, y })[0];
      if (targetElement) {
        linkView.model.target({ id: targetElement.model.id });
        console.log('Enlace conectado al nuevo nodo:', targetElement.model.id);
      } else {
        console.log('No se encontró un nodo en la posición:', x, y);
      }
    });

    // Escuchar el evento de conexión para definir el target
    this.paper.on('link:connect', (linkView, evt, connectedElementView) => {
      if (connectedElementView) {
        const targetCell = connectedElementView.model;
        console.log('Elemento conectado:', targetCell);
        // Aquí puedes trabajar con el modelo del elemento conectado
      }
    });



    // Event listeners for inspector
    this.paper.on('cell:pointerdown', (cellView) => {
      this.openInspector(cellView.model);
    });

    paper.on('blank:pointerdown',  () => {
      this.closeInspector(); // close inspector if currently open
    });

    stencil.on('element:drop', (elementView) => {
      this.openInspector(elementView.model);
    });

    paper.on('cell:pointerdown', (cellView, evt) => {
      const sourceCell = cellView.model;
      // Aquí puedes trabajar con el modelo del elemento seleccionado
      console.log('Elemento seleccionado:', sourceCell);
  });



// Crear halo
this.paper.on('cell:pointerup', (cellView) => {
  const halo = new ui.Halo({
    cellView: cellView,
    type: 'toolbar',
    handles: [
      {
        name: 'link',

      // Agrega un ícono personalizado si lo deseas
        events: {
          'pointerdown': (evt, x, y) => {
            const sourceCell = cellView.model;

  // Crear una nueva instancia de tu clase de asociación
  const associationLink = new Asociacion(sourceCell.id, null); // El target se establecerá después

  // Agregar el enlace a la gráfica
  this.graph.addCell(associationLink.getLink());

  // Escuchar el evento de conexión para definir el target
  this.paper.once('link:connect', (linkView, evt, connectedElementView) => {
    const targetCell = connectedElementView.model;

    // Si el target es válido, establece el target del enlace
    if (targetCell) {
      associationLink.setTarget(targetCell.id);

      // Configurar el enlace para evitar sobreposiciones
      associationLink.getLink().set('vertices', [
        { x: sourceCell.getBBox().center().x, y: sourceCell.getBBox().center().y - 20 }, // Punto intermedio para evitar superposición
        { x: targetCell.getBBox().center().x, y: targetCell.getBBox().center().y - 20 }
      ]);
    }
  });

  // Permitir arrastrar el enlace para cambiar el target
  this.paper.on('link:move', (linkView, evt, x, y) => {
    console.log('Moviendo el enlace a:', x, y);
  });

  // Permitir soltar el enlace para cambiar el target
  this.paper.on('link:pointerup', (linkView, evt, x, y) => {
    console.log('Soltando el enlace en:', x, y);
    const targetElement = this.paper.findViewsFromPoint({ x, y })[0];
    if (targetElement) {
      linkView.model.target({ id: targetElement.model.id });
      associationLink.setTarget(targetElement.model.id);
      console.log('Enlace conectado al nuevo nodo:', targetElement.model.id);

      // Configurar el enlace para evitar sobreposiciones
      associationLink.getLink().set('vertices', [
        { x: sourceCell.getBBox().center().x, y: sourceCell.getBBox().center().y - 20 }, // Punto intermedio para evitar superposición
        { x: targetElement.model.getBBox().center().x, y: targetElement.model.getBBox().center().y - 20 }
      ]);
    } else {
      console.log('No se encontró un nodo en la posición:', x, y);
    }
  });
}
        }
      }
    ]
  }).render();
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
            headerLabel: {
              text: {
                type: 'content-editable',
                label: 'Nombre de la Clase'
              }
            }},

        columns:{
          type: 'list',
          item: {
            type: 'object',
            properties:{
              name:{type:'text'},
              type:{type:'text'}
            }
        }
        },groups: {}
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



