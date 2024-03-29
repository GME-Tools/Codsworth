import dotenv from 'dotenv';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
//import inventoryManager from './notion/inventory.js';
import path from 'path';
import fs from 'fs';

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
const TOKEN = process.env.DISCORD_TOKEN;
const clientId = process.env.APP_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

client.once(Events.ClientReady, c => {
	console.log('Connecté en tant que ' + c.user.tag);
});

const cmdPath = path.join(__dirname,'/commands/');
const commandFiles = fs	.readdirSync(cmdPath)
	.filter(file => file.endsWith('.js'));

const commands = []
for (const file of commandFiles) {
	const { command } = await import(`file://${cmdPath}${file}`);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${cmdPath}${file} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async  interaction => {	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(TOKEN);
//inventoryManager();
//import './keep_alive.js';