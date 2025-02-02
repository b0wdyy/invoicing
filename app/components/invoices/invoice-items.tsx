import { FieldErrors, useFieldArray, type Control } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { PlusIcon, TrashIcon } from 'lucide-react'
import type { InvoiceFormData } from '~/schemas/invoice'

interface InvoiceItemsProps {
    control: Control<InvoiceFormData>
    errors: FieldErrors<InvoiceFormData>
}

export function InvoiceItems({ control, errors }: InvoiceItemsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label>Invoice Items</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        append({ description: '', quantity: 1, price: 0 })
                    }
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between">
                        <Label>Item {index + 1}</Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                            {...control.register(`items.${index}.description`)}
                        />
                        {errors.items?.[index]?.description && (
                            <p className="text-sm text-red-500">
                                {errors.items[index].description.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                min="1"
                                {...control.register(
                                    `items.${index}.quantity`,
                                    {
                                        valueAsNumber: true,
                                    }
                                )}
                            />
                            {errors.items?.[index]?.quantity && (
                                <p className="text-sm text-red-500">
                                    {errors.items[index].quantity.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Price (excl. VAT)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...control.register(`items.${index}.price`, {
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.items?.[index]?.price && (
                                <p className="text-sm text-red-500">
                                    {errors.items[index].price.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
