import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // privileged
    ],
});

client.once("clientReady", () => {
    console.log("Discord bot is ready! 🤖");

});

client.on(Events.MessageCreate, async (message) => {
    let logChannel: Awaited<ReturnType<typeof client.channels.fetch>> | undefined;
    try {
        if (message.author.bot) return;
        if (!message.guild) return; // ignore DMs
        if (message.channelId !== config.BAN_CHANNEL) return;
        if (!message.inGuild()) return;
        console.log(`${message.author.tag} in #${message.channel.name}: ${message.content}`);
        logChannel = await client.channels.fetch(config.NOTIFICATION_CHANNEL);
        if (!logChannel?.isSendable()) return;
        await logChannel.send(
            `**${message.author.tag}** in ${message.channel}: ${message.content}`,
        );
        const target = await message.guild.members.fetch(message.author.id);

        if (!target.bannable) {
            await logChannel.send(`Can't ban ${target.user.tag} — owner or role too high.`);
            return;
        }
        await target.ban({ reason: 'spam', deleteMessageSeconds: 3600 });
    } catch (e) {
        console.error("Failed to handle message / ban user:", e);
        try {
            if (!logChannel?.isSendable()) return;
            const reason = e instanceof Error ? e.message : String(e);
            await logChannel.send(`something went wrong trying to delete and ban a user: \`${reason}\``);
        } catch (e) {
            console.error("Also failed to notify the log channel:", e);
        }
    }
});

client.login(config.DISCORD_TOKEN);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
        client.destroy();
        process.exit(0);
    });
}