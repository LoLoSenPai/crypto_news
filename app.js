const { Client, WebhookClient, MessageFlags } = require('discord.js-selfbot-v13');

const config = require('./config.json');
const client = new Client({ checkUpdate: false });

// List of webhooks where to send the message to replicate.
const webhooks = [];

for (const webhook of config["webhooks"]) {
  webhooks.push(new WebhookClient({
    token: webhook["token"],
    id: webhook["id"]
  }));
}

client.on('ready', async () => {
  console.log(`${client.user.username} is now mirroring >:)!`);
});

client.on('messageCreate', async (message) => {
  if (message.content.length == 0 && message.embeds.length == 0) {
    return;
  }

  // Skip "Only you can see this" messages.
  if (message.flags && MessageFlags.Ephemeral) {
    return;
  }

  if (!config["channel_ids"].includes(message.channelId)) {
    return;
  }

  // Prevent: "Message content must be a non-empty string."
  const content = message.content.length ? message.content : " ";

  for (const webhook of webhooks) {
    webhook.send({
      content: content,
      username: message.author.username,
      avatarURL: message.author.avatarURL(),
      embeds: message.embeds
    });
  }
});

client.login(config["token"]);