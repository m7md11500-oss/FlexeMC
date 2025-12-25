const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Events
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.run(client, ...args));
    else client.on(event.name, (...args) => event.run(client, ...args));
}

// Interaction Create
client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;
        try { await cmd.run(client, interaction); } 
        catch (err) { console.error(err); interaction.reply({ content: "❌ There was an error", ephemeral: true }); }
    } else {
        // Handle buttons and modals
        const mediaHandler = require("./commands/media");
        if (mediaHandler.handleInteraction) await mediaHandler.handleInteraction(client, interaction);

        const ticketHandler = require("./commands/ticket");
        if (ticketHandler.handleButton) await ticketHandler.handleButton(client, interaction);
    }
});

// Login
client.login(process.env.TOKEN);