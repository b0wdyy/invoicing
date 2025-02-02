import { z } from 'zod'

export const customerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    vat_number: z.string().min(1, 'VAT number is required'),
    address: z.string().min(1, 'Address is required'),
})

export type CustomerFormData = z.infer<typeof customerSchema>
