export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center font-[#ffffff] mt-10">
      {children}
    </div>
  );
}
