import Discord, { Collection, Guild } from "discord.js";
import dotEnv from "dotenv";
import { createCategoryAndChannels } from "./utils/index.js";
import dayjs from "dayjs";

dotEnv.config();

const token = process.env.TOKEN_BOT;
const bot = new Discord.Client();
const guildManager = bot.guilds;
let guild = new Guild();

const activeChannels = [];

const existCategory = (guild, categoryName) => {
  const category = guild.channels.cache.find(
    (channel) => channel.name === categoryName
  );

  return !!category;
};

bot.on("ready", async () => {
  console.log("The bot successfully joined the server");

  guild = await guildManager.fetch("781955737567232031");
  const channelName = "Комната команды DreamTeam";

  if (!existCategory(guild, channelName)) {
    const [inviteLink, channel] = await createCategoryAndChannels(
      guild,
      channelName
    );
    const lifeTimeChannel = dayjs().add(12, "h").valueOf();

    activeChannels.push([channel, lifeTimeChannel]);
  }
});

setInterval(() => {
  console.log("interval vizov");

  const filteredChannels = activeChannels.filter((item) => {
    const [channelId, lifeTimeChannel] = item;

    const channel = guild.channels.cache.find((ch) => ch.id === channelId);
    const lifeTimeEnded = dayjs(lifeTimeChannel).isBefore();

    if (!channel) {
      return false;
    }

    if (channel.deleted) {
      console.log("deleted");
      return false;
    }

    if (lifeTimeEnded) {
      console.log("lifeTImeEnded");
      return false;
    }

    return true;
  });

  filteredChannels.forEach((item) => {
    const [channelId, lifeTimeChannel] = item;

    const channel = guild.channels.cache.find((ch) => ch.id === channelId);

    console.log("Channel members = " + channel.members.size);
  });
}, 10000);

bot.login(token);
