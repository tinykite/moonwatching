export async function onRequest({ request, env, params }) {
    return env.ASSETS.fetch(request);
}