# discord-spammer-banner

A tiny Discord bot that auto-bans spambots.

The idea: set up a channel that regular members have no reason to post in (a "trap" channel). If anything gets posted there, it's almost certainly a spambot, so the bot logs the message and immediately bans whoever sent it.

## How it works

- Watches one channel (`BAN_CHANNEL`)
- Any message posted there gets forwarded to a log channel (`NOTIFICATION_CHANNEL`)
- The author gets banned on the spot, and their messages from the last hour get deleted
- If the bot can't ban someone (e.g. they outrank it), it just logs that instead of failing silently

## Setup

1. Create a bot in the [Discord Developer Portal](https://discord.com/developers/applications), enable the **Message Content Intent**, and invite it to your server with ban permissions.
2. Copy `.env.example` to `.env` (or just create `.env`) with:

   ```
   DISCORD_TOKEN=your-bot-token
   DISCORD_CLIENT_ID=your-client-id
   BAN_CHANNEL=channel-id-to-watch
   NOTIFICATION_CHANNEL=channel-id-for-logs
   ```

3. Install dependencies:

   ```
   npm install
   ```

## Running it

- `npm run dev` — run locally with auto-restart on changes
- `npm run build` — bundle for production
- `npm start` — run the built version

## Running with Docker

```
docker build -f DockerFile -t discord-spammer-banner .
docker run --env-file .env discord-spammer-banner
```

## Notes

Make sure the bot's role sits above whoever you expect it to ban, otherwise it'll just log that it can't.
