import { MyNavbar } from "../components/Navbar";

export default function UserPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MyNavbar />
      {children}
    </div>
  );
}
