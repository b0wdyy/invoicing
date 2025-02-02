import type { MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

export const loader = async () => {
    return redirect('/dashboard')
}

export const meta: MetaFunction = () => {
    return [
        { title: 'VNDL Invoicing' },
        { name: 'description', content: 'VNDL Invoicing' },
    ]
}

export default function Index() {
    return null
}
