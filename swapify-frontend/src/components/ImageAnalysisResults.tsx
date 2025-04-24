import { Card, Accordion, Badge, Alert, Spinner } from "react-bootstrap";

interface AnalysisResult {
  previewUrl: string;
  matchResult: {
    matchPercentage: number;
    allTags: string[];
    matchingTags: string[];
    suggestions: string[];
  };
}

export function ImageAnalysisResults({ 
  results,
  isAnalyzing 
}: {
  results: AnalysisResult[];
  isAnalyzing: boolean;
}) {
  if (isAnalyzing) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Analizando imágenes...</span>
        </Spinner>
        <p>Analizando imágenes...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3">Resultados del Análisis</h4>
      <div className="row">
        {results.map((result, index) => (
          <div key={index} className="col-md-4 mb-3">
            <AnalysisCard result={result} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ result, index }: { result: AnalysisResult; index: number }) {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={result.previewUrl} 
        style={{ objectFit: 'cover', height: '200px' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>Coincidencia: {result.matchResult.matchPercentage.toFixed(0)}%</span>
          {result.matchResult.matchPercentage < 60 && (
            <Badge bg="warning" text="dark">
              Advertencia
            </Badge>
          )}
        </Card.Title>
        
        {result.matchResult.matchPercentage < 60 && (
          <Alert variant="warning" className="p-2 mt-auto">
            <small>
              <strong>Sugerencias:</strong> Considera añadir {result.matchResult.suggestions.slice(0, 3).join(', ')} a tu descripción
            </small>
          </Alert>
        )}
        
        <Accordion flush className="mt-2">
          <Accordion.Item eventKey={`details-${index}`}>
            <Accordion.Header>Detalles del análisis</Accordion.Header>
            <Accordion.Body className="small">
              <p><strong>Elementos detectados:</strong></p>
              <div className="d-flex flex-wrap gap-1">
                {result.matchResult.allTags.map((tag, i) => (
                  <Badge 
                    key={i} 
                    bg={result.matchResult.matchingTags.includes(tag) ? 'success' : 'secondary'}
                    className="mb-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
}