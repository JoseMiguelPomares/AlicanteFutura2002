import React from 'react';

type Category = {
  name: string;
};

type Section = {
  title: string;
  categories: Category[];
};

export const Sidebar: React.FC = () => {
  const sections: Section[] = [
    {
      title: 'Productos',
      categories: [
        { name: 'Tecnología y Electrónica' },
        { name: 'Hogar y Jardín' },
        { name: 'Cine, Libros y Música' },
        { name: 'Moda y Accesorios' },
        // Añade más categorías aquí
      ],
    },
    {
      title: 'Servicios',
      categories: [
        { name: 'Reformas y Construcción' },
        { name: 'Limpieza' },
        { name: 'Transporte y Mudanzas' },
        { name: 'Clases Particulares' },
        // Añade más categorías aquí
      ],
    },
  ];

  return (
    <div className='sidebar' style={{ width: '250px', borderRight: '1px solid #ddd', padding: '10px' }}>
      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: '#333' }}>{section.title}</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {section.categories.map((category, catIndex) => (
              <li key={catIndex} style={{ margin: '5px 0', cursor: 'pointer' }}>
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
