import { createCookieSessionStorage, Session } from '@remix-run/node'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not set')
}

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'vndl-invoicing-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
})

export async function createSession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )
    return session
}

export async function getSession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )
    return session
}

export async function commitSession(session: Session) {
    return sessionStorage.commitSession(session)
}

export async function destroySession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )
    return sessionStorage.destroySession(session)
}
