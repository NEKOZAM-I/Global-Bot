const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server.')
    .addUserOption(option => option.setName('member').setDescription('The member you want to ban.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning the selected member.').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('member');
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        if (!isMember) return interaction.reply({ content: 'The user is not a member of the server', ephemeral: true});
        const member = await interaction.guild.members.fetch(user.id);
        
        
        if (!member.moderatable) return await interaction.reply({ content: 'I can not ban this member', ephemeral: true});
        
        let reason =  interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.ban({reason: reason});
            
            await interaction.reply({content: `:eyes: oh boy`, ephemeral: true});
            await interaction.followUp({content: `${user} has been **Banned** by ${interaction.user}`});
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}