export default function Home() {
  return (
    <iframe
      src="/sunum.pdf"
      width="100%"
      height="100%"
      style={{ 
        border: 'none', 
        position: 'fixed', 
        inset: 0,
        width: '100vw',
        height: '100vh'
      }}
      title="Yatırımlık Evler Sunumu"
    />
  );
}
