export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/sunum.pdf"
        width="100%"
        height="100%"
        style={{ 
          border: 'none', 
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Yatırımlık Evler Sunumu"
      />
    </div>
  );
}
