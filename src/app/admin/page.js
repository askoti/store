import prisma from "@/lib/prisma";
import AdminDashboard from "./AdminContent";

export default async function Page() {
  const products = await prisma.product.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' }
    ],
  });

  return <AdminDashboard initialProducts={products || []} />;
}