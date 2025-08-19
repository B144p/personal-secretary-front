import AppLayout from "@/components/layouts/app";

export default function Layout({ children }: ILayout) {
  return <AppLayout>{children}</AppLayout>;
}

type ILayout = Readonly<{ children: React.ReactNode }>;
