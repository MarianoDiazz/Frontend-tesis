// la uso mientras no tenga hecha cada pantalla
export default function EnConstruccion({ titulo }: { titulo: string }) {
  return (
    <div>
      <h1>{titulo}</h1>
      <p style={{ color: '#6b7280', marginTop: 8 }}>Pantalla en construcción.</p>
    </div>
  );
}