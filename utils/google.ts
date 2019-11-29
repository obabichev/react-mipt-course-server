import {google} from 'googleapis';

export const googleConfig = {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    redirect: process.env.GOOGLE_AUTH_REDIRECT_URL
};

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

export async function getGoogleAccountFromCode(code: string) {
    const auth = createConnection();
    const data = await auth.getToken(code);

    const tokens = data.tokens;

    auth.setCredentials(tokens);

    const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
    const meData = await auth.request({url});

    const me = meData.data;

    const info = await auth.getTokenInfo(tokens.access_token);

    // @ts-ignore
    const email = info.email;

    // @ts-ignore
    const name = (me && me.names && me.names[0] && me.names[0].displayName)
        || (email && email.split('@')[0])
        || '';

    return {
        name,
        email,
        tokens: tokens,
    };
}
