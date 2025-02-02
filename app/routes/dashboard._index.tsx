import { Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <Button asChild>
                <Link to="/dashboard/invoices/create">Create invoice</Link>
            </Button>
        </div>
    )
}
