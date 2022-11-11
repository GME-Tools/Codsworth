import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('d20')
    .setDescription('Roll d20 pool')
    .addIntegerOption(option =>
      option.setName("target")
        .setDescription("Target Number")
        .setRequired(true)),
  execute: async (interaction) => {
    const tn = interaction.options.getInteger("target");
    const pool = 2;
    const roll = Array.from({ length: pool }, () => Math.ceil(Math.random() * 20));

    const count = roll.filter(x => x<=tn).length;
    const embed = new EmbedBuilder()
      .setTitle("d20")
      .addFields(
        { name: "Rolls", value: roll.join(), inline: true },
        { name: "Successes", value: count.toString(), inline: true },
      )
    await interaction.reply({ embeds: [embed] })
  }
}