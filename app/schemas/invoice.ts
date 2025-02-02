import { z } from 'zod'

const invoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z
        .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
        .positive('Quantity must be positive'),
    price: z
        .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
        .positive('Price must be positive'),
})

export const invoiceSchema = z.object({
    customerId: z.number({
        required_error: 'Customer is required',
    }),
    date: z.string().min(1, 'Invoice date is required'),
    status: z.enum(['DRAFT', 'PENDING', 'PAID'], {
        required_error: 'Status is required',
    }),
    due_date: z.string().min(1, 'Due date is required'),
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>
