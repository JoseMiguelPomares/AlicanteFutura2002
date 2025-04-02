import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaginaVender = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    price: '',
  });

  const [categories, setCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    // Fetch categories from the backend
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/productos');
      } else {
        console.error('Error al añadir producto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Añadir Nuevo Producto</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCategory">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>{category.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formCondition">
          <Form.Label>Condición</Form.Label>
          <div>
            {['nuevo', 'como nuevo', 'bueno', 'aceptable', 'usado'].map((condition) => (
              <Form.Check
                inline
                key={condition}
                type="radio"
                label={condition}
                name="condition"
                value={condition}
                checked={formData.condition === condition}
                onChange={handleChange}
                required
              />
            ))}
          </div>
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formLocation">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3">
          Añadir Producto
        </Button>
      </Form>
    </Container>
  );
};

export default PaginaVender;