import React from 'react';
import { Offcanvas } from 'react-bootstrap';

type Categoria = {
  nombre: string;
  subcategorias?: Categoria[];
};

type Seccion = {
  titulo: string;
  categorias: Categoria[];
};

type BarraLateralProps = {
  mostrar: boolean;
  alCerrar: () => void;
};

export const BarraLateral: React.FC<BarraLateralProps> = ({ mostrar, alCerrar }) => {
  const secciones: Seccion[] = [
    {
      titulo: 'Productos',
      categorias: [
        { nombre: 'Electrónica' },
        { nombre: 'Hogar' },
        { nombre: 'Libros' },
        {
          nombre: 'Moda',
          subcategorias: [
            { nombre: 'Ropa' },
            { nombre: 'Calzado' },
            { nombre: 'Accesorios' }
          ]
        },
      ],
    },
    {
      titulo: 'Servicios',
      categorias: [
        { nombre: 'Reparaciones' },
        { nombre: 'Clases' },
        { nombre: 'Transporte' },
      ],
    },
  ];

  const RenderizarCategoria = ({ categoria }: { categoria: Categoria }) => (
    <li className="mb-1">
      <div
        className="d-flex justify-content-between align-items-center py-2 px-3 hover-bg-light rounded"
        onClick={alCerrar}
        role="button"
        aria-label={`Abrir subcategorías de ${categoria.nombre}`}
      >
        <span>{categoria.nombre}</span>
        {categoria.subcategorias && <span className="fs-5">›</span>}
      </div>

      {categoria.subcategorias && (
        <ul className="list-unstyled ps-3">
          {categoria.subcategorias.map((subcategoria, i) => (
            <RenderizarCategoria key={`sub-${i}`} categoria={subcategoria} />
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <Offcanvas show={mostrar} onHide={alCerrar} placement="start" className="border-end" style={{ width: '300px' }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fs-4 fw-bold text-primary">Categorías</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="pt-3">
        {secciones.map((seccion, i) => (
          <section key={`sec-${i}`} className="mb-4">
            <h3 className="h5 fw-bold mb-3 text-secondary">{seccion.titulo}</h3>
            <ul className="list-unstyled">
              {seccion.categorias.map((categoria, j) => (
                <RenderizarCategoria key={`cat-${j}`} categoria={categoria} />
              ))}
            </ul>
          </section>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
};