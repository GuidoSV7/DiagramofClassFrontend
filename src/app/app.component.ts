import { AfterViewInit, OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { dia, ui, shapes, util } from '@joint/plus';
import { Asociacion } from './Shapes/Asociacion';
import { UMLClass } from './Shapes/UmlClass';
import { Table } from './Shapes/UmlClassdos';
import { Agregacion } from './Shapes/Agregacion';
import { Composicion } from './Shapes/Composicion';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient

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

  constructor(private http: HttpClient) {} // Inyecta HttpClient



  public ngOnInit(): void {
    const graph = this.graph =new dia.Graph({}, { cellNamespace: { ...shapes, app: { Table } } });

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
      one: { label: 'Tables', index: 1 }
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
          text: 'Export Architect'
      },

      {
        type: 'button',
        name: 'jsonimport',
        text: 'Import Architect'
    },

      {
        type: 'button',
        name: 'springboot',
        text: 'Export SpringBoot'
      },
      {
        type: 'button',
        name: 'json',
        text: 'Export JSON'
    },




  ]
});

  toolbar.render();
  document.getElementById('toolbar')?.appendChild(toolbar.el);

  toolbar.on('json:pointerclick', () => {
    this.exportGraphToServer();
  });

  toolbar.on('springboot:pointerclick', () => {
    this.exportSpringBoot();
  });

  toolbar.on('jsonimport:pointerclick',()=>{
    this.importGraphFromServer();
  });

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



    const customLink = new Asociacion(orders.id, groups.id);



    graph.addCell(customLink.getLink());


    console.log(this.graph.toJSON());



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


        events: {
          'pointerdown': (evt, x, y) => {
            const sourceCell = cellView.model;

          // Crear una nueva instancia de tu clase de asociación
          const associationLink = new Asociacion(sourceCell.id, null);

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


  // Permitir soltar el enlace para cambiar el target
  this.paper.on('link:pointerup', (linkView, evt, x, y) => {
    console.log('Soltando el enlace en:', x, y);
    const targetElement = this.paper.findViewsFromPoint({ x, y })[0];
    if (targetElement) {
      // Verificar si ya existe un enlace entre los mismos nodos
      const existingLinks = this.graph.getLinks().filter(link => {
        return link.get('source').id === linkView.model.get('source').id &&
               link.get('target').id === targetElement.model.id;
      });

      if (existingLinks.length === 0) {
        linkView.model.target({ id: targetElement.model.id });
        associationLink.setTarget(targetElement.model.id);


        console.log('Enlace conectado al nuevo nodo:', targetElement.model.id);
      } else {
        console.log('Ya existe un enlace entre estos nodos.');
      }
    } else {
      console.log('No se encontró un nodo en la posición:', x, y);
    }
  });
}
        }
      },

      {
        name: 'remove',

        events: {
          pointerdown: 'removeElement'
        }
      },

      {
        name:'agregacion',
        icon: 'assets/agregation.ico', // Usar una URL de imagen directamente
        events: {
          'pointerdown': (evt, x, y) => {
            const sourceCell = cellView.model;

          // Crear una nueva instancia de tu clase de asociación
          const agreagacionLink = new Agregacion(sourceCell.id, null); // El target se establecerá después

          // Agregar el enlace a la gráfica
          this.graph.addCell(agreagacionLink.getLink());

          // Escuchar el evento de conexión para definir el target
          this.paper.once('link:connect', (linkView, evt, connectedElementView) => {
            const targetCell = connectedElementView.model;

            // Si el target es válido, establece el target del enlace
            if (targetCell) {
              agreagacionLink.setTarget(targetCell.id);

      // Configurar el enlace para evitar sobreposiciones
      agreagacionLink.getLink().set('vertices', [
        { x: sourceCell.getBBox().center().x, y: sourceCell.getBBox().center().y - 20 }, // Punto intermedio para evitar superposición
        { x: targetCell.getBBox().center().x, y: targetCell.getBBox().center().y - 20 }
      ]);
    }
  });


  // Permitir soltar el enlace para cambiar el target
  this.paper.on('link:pointerup', (linkView, evt, x, y) => {
    console.log('Soltando el enlace en:', x, y);
    const targetElement = this.paper.findViewsFromPoint({ x, y })[0];
    if (targetElement) {
      // Verificar si ya existe un enlace entre los mismos nodos
      const existingLinks = this.graph.getLinks().filter(link => {
        return link.get('source').id === linkView.model.get('source').id &&
               link.get('target').id === targetElement.model.id;
      });

      if (existingLinks.length === 0) {
        linkView.model.target({ id: targetElement.model.id });
        agreagacionLink.setTarget(targetElement.model.id);


        console.log('Enlace conectado al nuevo nodo:', targetElement.model.id);
      } else {
        console.log('Ya existe un enlace entre estos nodos.');
      }
    } else {
      console.log('No se encontró un nodo en la posición:', x, y);
    }
  });
}
        }

      },
      {
        name:'composicion',
        icon: 'assets/composition.ico', // Usar una URL de imagen directamente
        events: {
          'pointerdown': (evt, x, y) => {
            const sourceCell = cellView.model;

          // Crear una nueva instancia de tu clase de asociación
          const composicionLink = new Composicion(sourceCell.id, null); // El target se establecerá después

          // Agregar el enlace a la gráfica
          this.graph.addCell(composicionLink.getLink());

          // Escuchar el evento de conexión para definir el target
          this.paper.once('link:connect', (linkView, evt, connectedElementView) => {
            const targetCell = connectedElementView.model;

            // Si el target es válido, establece el target del enlace
            if (targetCell) {
              composicionLink.setTarget(targetCell.id);

      // Configurar el enlace para evitar sobreposiciones
      composicionLink.getLink().set('vertices', [
        { x: sourceCell.getBBox().center().x, y: sourceCell.getBBox().center().y - 20 }, // Punto intermedio para evitar superposición
        { x: targetCell.getBBox().center().x, y: targetCell.getBBox().center().y - 20 }
      ]);
    }
  });


  // Permitir soltar el enlace para cambiar el target
  this.paper.on('link:pointerup', (linkView, evt, x, y) => {
    console.log('Soltando el enlace en:', x, y);
    const targetElement = this.paper.findViewsFromPoint({ x, y })[0];
    if (targetElement) {
      // Verificar si ya existe un enlace entre los mismos nodos
      const existingLinks = this.graph.getLinks().filter(link => {
        return link.get('source').id === linkView.model.get('source').id &&
               link.get('target').id === targetElement.model.id;
      });

      if (existingLinks.length === 0) {
        linkView.model.target({ id: targetElement.model.id });
        composicionLink.setTarget(targetElement.model.id);


        console.log('Enlace conectado al nuevo nodo:', targetElement.model.id);
      } else {
        console.log('Ya existe un enlace entre estos nodos.');
      }
    } else {
      console.log('No se encontró un nodo en la posición:', x, y);
    }
  });
}
        }

      },


    {
      name: 'clone',

      events: {
        pointerdown: 'cloneElement'
      },


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

    private async exportGraphToServer() {
      const graphJson = this.graph.toJSON();
      try {
        const response = await this.http.post('http://localhost:3000/api/architect/json-to-xml', graphJson, { responseType: 'arraybuffer' }).toPromise();
        if (response) {
          const responseText = new TextDecoder().decode(response);
          console.log('Graph exported successfully:', responseText);
          this.downloadFile(responseText, 'graph.xml', 'application/xml');
        } else {
          console.error('Error: Response is undefined');
        }
      } catch (error) {
        console.error('Error exporting graph:', error);
      }
    }

    private async exportSpringBoot() {
      const graphJson = this.graph.toJSON();
      try {
        const response = await this.http.post('http://localhost:3000/api/springboot-generator/download', graphJson, { responseType: 'arraybuffer' }).toPromise();
        if (response) {
          const responseText = new TextDecoder().decode(response);
          console.log('Graph exported successfully:', responseText);
          this.downloadFile(response, 'backend.rar', 'application/x-rar-compressed');
        } else {
          console.error('Error: Response is undefined');
        }
      } catch (error) {
        console.error('Error exporting graph:', error);
      }
    }

   private importGraphFromServer() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        console.log(content);
        const graphJson = JSON.parse(content); // Cambiado a JSON.parse
        this.graph.fromJSON(graphJson);
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

    private downloadFile(data: any, filename: string, type: string) {
      const blob = new Blob([data], { type: type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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



