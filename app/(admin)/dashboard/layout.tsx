export default function UserPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <Sidebar/> */}
      {children}
    </div>
  );
}
