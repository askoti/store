import prisma from "@/lib/prisma";
import Storefront from "@/components/Storefront";

// METADATA DEFINITION
export async function generateMetadata() {
  const count = await prisma.product.count();
  
  return {
    title: `ASKSTORE ARCHIVE [${count}]`,
    description: "High-performance tech accessories and desk setup essentials. Curated inventory for the modern workspace.",
    openGraph: {
      title: 'ASKSTORE // SYSTEM_INDEX',
      description: 'Acquire premium hardware. Secured global shipping.',
      images: ['/og-image.jpg'], // Make sure to add this to your public folder
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ASKSTORE / INVENTORY',
    }
  };
}

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen text-white">
      <Storefront initialProducts={products} />
    </main>
  );
}