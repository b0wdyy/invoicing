import { Form } from '@remix-run/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const customerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    vat_number: z.string().min(1, 'VAT number is required'),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export function CreateCustomerForm() {
    const {
        register,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    })

    return (
        <Form method="post" className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="vat_number">VAT Number</Label>
                <Input id="vat_number" {...register('vat_number')} />
                {errors.vat_number && (
                    <p className="text-sm text-red-500">
                        {errors.vat_number.message}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full">
                Create Customer
            </Button>
        </Form>
    )
}
