interface SidebarContentLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const SidebarContentLayout = ({
  children,
  title,
  subtitle,
}: SidebarContentLayoutProps) => {
  return (
    <div className="bg-gray-50">
      <div className="relative p-8 h-full">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        {/* content */}
        {children}
      </div>
    </div>
  );
};
