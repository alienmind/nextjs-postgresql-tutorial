'use server';
 
import { z } from 'zod';
const connectionPool = require('../../db');
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  /*
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  */
  const rawFormData = Object.fromEntries(formData.entries())
  console.log(rawFormData);

  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    connectionPool.query(`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ('${customerId}', ${amountInCents}, '${status}', '${date}')
    `);
  } catch (error) {
    return {
        message : "Database Error: Failed to Create Invoice.',"
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    connectionPool.query(`
      UPDATE invoices
      SET customer_id = '${customerId}', amount = ${amountInCents}, status = '${status}'
      WHERE id = '${id}'
    `);
  } catch (error) {
    return { message : "Database Error: Failed to Update Invoice." };
  } 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  try {
    connectionPool.query(`DELETE FROM invoices WHERE id = '${id}'`);
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    return {
      message : "Database Error: Failed to Delete Invoice."
    };
  }
}
 