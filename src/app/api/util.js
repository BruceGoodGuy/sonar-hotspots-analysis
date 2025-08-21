export function genAuthHeader() {
    return "Basic " + Buffer.from(process.env.TOKEN + ":").toString("base64");
}