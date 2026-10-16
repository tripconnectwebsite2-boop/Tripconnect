export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ margin: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {children}
    </div>
  );
}
