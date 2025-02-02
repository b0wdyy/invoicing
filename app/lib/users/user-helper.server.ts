import { prisma } from '~/lib/db.server'
import { getSession } from '~/lib/session.server'

export async function getUserUuidFromSession(request: Request) {
    const session = await getSession(request)
    const userId = session.get('userId')
    return userId
}

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    return user
}
