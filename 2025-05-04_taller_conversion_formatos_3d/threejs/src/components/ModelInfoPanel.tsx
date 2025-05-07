export default function ModelInfoPanel({
  format,
  verticesCount,
}: {
  format: string;
  verticesCount: number;
}) {
  return (
    <div className="ui-card info-panel">
      <h3 style={{ margin: '0 0 12px 0', fontWeight: '500' }}>
        Estadísticas del Modelo
      </h3>

      <div className="info-stat">
        <span>Formato:</span>
        <span className="value">{format}</span>
      </div>

      <div className="info-stat">
        <span>Vértices:</span>
        <span className="value">{verticesCount.toLocaleString()}</span>
      </div>
    </div>
  );
}
