import ActCard from "./ActCard";

export default function Timeline({ acts }) {
  if (!acts || typeof acts !== 'object') {
    return null;
  }

  return (
    <div className="timeline">
      {Object.entries(acts).map(([actKey, actData]) => (
        <ActCard key={actKey} actKey={actKey} act={actData} />
      ))}
    </div>
  );
}
