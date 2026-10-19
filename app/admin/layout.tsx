export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="admin-font flex min-h-svh flex-col">{children}</div>
}
