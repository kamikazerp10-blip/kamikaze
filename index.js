const { 
  Client, GatewayIntentBits, 
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  Events
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 🔥 CONFIGURAÇÕES
const CANAL_REGISTRO_ID = '1491298576561606847';
const CARGO_ID = '1489680137996734515';

// Quando o bot ligar
client.once('ready', async () => {
    console.log(`🚀 Kamikaze Register online como ${client.user.tag}`);

    try {
        const canal = await client.channels.fetch(CANAL_REGISTRO_ID);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('registrar')
                .setLabel('📋 Fazer Registro')
                .setStyle(ButtonStyle.Primary)
        );

        await canal.send({
            content: "📌 **Sistema de Registro Kamikaze**\n\nClique no botão abaixo para se registrar e liberar o acesso ao servidor.",
            components: [row]
        });

    } catch (err) {
        console.log("Erro ao enviar mensagem de registro:", err);
    }
});

// Interações
client.on(Events.InteractionCreate, async interaction => {

    // BOTÃO
    if (interaction.isButton() && interaction.customId === 'registrar') {

        const modal = new ModalBuilder()
            .setCustomId('formRegistro')
            .setTitle('Registro Kamikaze');

        const idInput = new TextInputBuilder()
            .setCustomId('id')
            .setLabel('Seu ID / Passaporte')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const nomeInput = new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome do personagem')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(idInput);
        const row2 = new ActionRowBuilder().addComponents(nomeInput);

        modal.addComponents(row1, row2);

        await interaction.showModal(modal);
    }

    // FORMULÁRIO
    if (interaction.isModalSubmit() && interaction.customId === 'formRegistro') {

        const id = interaction.fields.getTextInputValue('id');
        const nome = interaction.fields.getTextInputValue('nome');

        // 🔥 PEGA CARGO PELO ID (100% confiável)
        const cargo = interaction.guild.roles.cache.get(CARGO_ID);

        // Adiciona cargo
        if (!cargo) {
            console.log("❌ Cargo não encontrado!");
        } else {
            try {
                await interaction.member.roles.add(cargo);
                console.log("✅ Cargo adicionado!");
            } catch (err) {
                console.log("❌ Erro ao adicionar cargo:", err);
            }
        }

        // Muda nickname
        try {
            await interaction.member.setNickname(`${id} | ${nome}`);
        } catch (err) {
            console.log("Erro ao mudar nickname:", err);
        }

        await interaction.reply({
            content: `✅ **Registro concluído!**\n\n🆔 ID: ${id}\n👤 Nome: ${nome}\n\nBem-vindo à Kamikaze! 🔥`,
            ephemeral: true
        });
    }
});

// LOGIN
client.login(process.env.TOKEN);
