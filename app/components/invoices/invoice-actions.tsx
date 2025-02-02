import { useState } from 'react'
import { Link, useFetcher } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { ConfirmModal } from '~/components/ui/confirm-modal'
import { Pencil, Trash2, CheckCircle } from 'lucide-react'

interface InvoiceActionsProps {
    invoiceId: string
    status: string
}

export function InvoiceActions({ invoiceId, status }: InvoiceActionsProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const fetcher = useFetcher()

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link to={`/dashboard/invoices/${invoiceId}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Link>
            </Button>

            {status !== 'PAID' && (
                <fetcher.Form
                    method="post"
                    action={`/dashboard/invoices/${invoiceId}/mark-paid`}
                >
                    <Button variant="ghost" size="icon" type="submit">
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Mark as paid</span>
                    </Button>
                </fetcher.Form>
            )}

            <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteModal(true)}
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>

            <ConfirmModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                title="Delete Invoice"
                description="Are you sure you want to delete this invoice? This action cannot be undone."
                onConfirm={() => {
                    fetcher.submit(null, {
                        method: 'delete',
                        action: `/dashboard/invoices/${invoiceId}`,
                    })
                }}
            />
        </div>
    )
}
