export const createCategoryAndChannels = async (guild, categoryName) => {
  return new Promise(function (resolve, reject) {
    const guildChannelManager = guild.channels;
    let discordInvite = "";
    let voiceChannel = null;

    guildChannelManager.create(categoryName, {
      type: "category",
    });
    guildChannelManager
      .create("Текстовый канал", { type: "text" })
      .then((channel) => {
        let category = guild.channels.cache.find(
          (c) => c.name == categoryName && c.type == "category"
        );

        if (!category) throw new Error("Category channel does not exist");
        channel.setParent(category.id);
      });
    guildChannelManager
      .create("Голосовой канал", { type: "voice", userLimit: 5 })
      .then(async (channel) => {
        let category = guild.channels.cache.find(
          (c) => c.name == categoryName && c.type == "category"
        );

        const code = await channel.createInvite();
        discordInvite = `${code}`;

        voiceChannel = channel;

        if (!category) throw new Error("Category channel does not exist");
        channel.setParent(category.id);
        resolve([discordInvite, voiceChannel.id]);
      });
  });
};
