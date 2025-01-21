export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'transparent' }}>
      {children}
    </div>
  );
} 