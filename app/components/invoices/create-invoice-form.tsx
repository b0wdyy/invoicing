import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { InvoiceItems } from './invoice-items'
import { invoiceSchema, type InvoiceFormData } from '~/schemas/invoice'
import { useSubmit } from '@remix-run/react'

type Customer = {
    id: number
    name: string
    email: string
}

interface CreateInvoiceFormProps {
    customers: Customer[]
}

export function CreateInvoiceForm({ customers }: CreateInvoiceFormProps) {
    const submit = useSubmit()
    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            status: 'DRAFT',
            date: new Date().toISOString().split('T')[0],
        },
    })

    const onSubmit = (data: InvoiceFormData) => {
        submit(data, {
            method: 'post',
            encType: 'application/json',
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="number">Invoice Number</Label>
                <Input id="number" {...register('number')} />
                {errors.number && (
                    <p className="text-sm text-red-500">
                        {errors.number.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={(value) =>
                                field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a customer..." />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem
                                        key={customer.id}
                                        value={customer.id.toString()}
                                    >
                                        {customer.name} ({customer.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.customerId && (
                    <p className="text-sm text-red-500">
                        {errors.customerId.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Invoice Date</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && (
                    <p className="text-sm text-red-500">
                        {errors.date.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" type="date" {...register('due_date')} />
                {errors.due_date && (
                    <p className="text-sm text-red-500">
                        {errors.due_date.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && (
                    <p className="text-sm text-red-500">
                        {errors.status.message}
                    </p>
                )}
            </div>

            <InvoiceItems control={control} errors={errors} />

            <Button type="submit" className="w-full">
                Create Invoice
            </Button>
        </form>
    )
}
