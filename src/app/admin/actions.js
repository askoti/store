"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function saveFiles(files) {
  const savedPaths = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {}

  for (const file of files) {
    if (!file || file.size === 0 || typeof file === "string") continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    savedPaths.push(`/uploads/${fileName}`);
  }
  return savedPaths;
}

export async function addProduct(formData) {
  try {
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price")) || 0;
    const salePrice = formData.get("salePrice") ? parseFloat(formData.get("salePrice")) : null;
    const quantity = parseInt(formData.get("quantity"), 10) || 0; 
    const category = formData.get("category");
    
    const files = formData.getAll("imageFiles");
    const images = await saveFiles(files);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        salePrice,
        quantity,
        category,
        images,
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(formData) {
  try {
    const id = formData.get("id");
    const newFiles = formData.getAll("newImages");
    let images = JSON.parse(formData.get("existingImages") || "[]");

    if (newFiles.length > 0 && newFiles[0].size > 0) {
      const newPaths = await saveFiles(newFiles);
      images = [...images, ...newPaths];
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        salePrice: formData.get("salePrice") ? parseFloat(formData.get("salePrice")) : null,
        quantity: parseInt(formData.get("quantity")) || 0,
        category: formData.get("category"),
        images: images,
      }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(formData) {
  await prisma.product.delete({ where: { id: formData.get("id") } });
  revalidatePath("/admin");
}

export async function togglePin(id, currentStatus) {
  await prisma.product.update({ where: { id }, data: { isPinned: !currentStatus } });
  revalidatePath("/admin");
}

export async function logout() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}

/** * NEW: Added simple server-side password check 
 * Change "admin123" to your preferred access key
 */
export async function verifyAdmin(inputPassword) {
  // It must be process.env.VAR_NAME
  const secret = process.env.ADMIN_PASSWORD; 
  console.log("DEBUG: Secret found is:", secret); // Check your terminal (not browser) for this!
  
  return { success: inputPassword === secret };
}