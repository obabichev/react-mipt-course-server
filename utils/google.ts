import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

export async function getGoogleAccountFromCode(idToken: string) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {name: payload.name, email: payload.email};
}
