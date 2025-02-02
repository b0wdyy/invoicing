import { Form } from '@remix-run/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { customerSchema, type CustomerFormData } from '~/schemas/customer'

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
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
                {errors.address && (
                    <p className="text-sm text-red-500">
                        {errors.address.message}
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
