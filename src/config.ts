import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, BAN_CHANNEL, NOTIFICATION_CHANNEL } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !BAN_CHANNEL ||  !NOTIFICATION_CHANNEL) {
    throw new Error("Missing environment variables");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    BAN_CHANNEL,
    NOTIFICATION_CHANNEL
};
