export default function ChineseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div lang="zh-CN">{children}</div>;
}
