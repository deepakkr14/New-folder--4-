const CronJob = require('cron').CronJob;
const {Op} = require('sequelize');

const {Messages, ArchivedChats } = require('../models/database');


// Schedule the cron job to run every night
exports.midNightWork = async()=>{
  console.log('function executed');
  new CronJob('0 0 * * *', async () => {
  console.log('cron executed');

  try {

   
    let today = new Date();
    today.setDate(today.getDate() - 1);
    console.log(today);



    const oneDayAgo =  today;

    // Fetch 1 day old chats
    const chatsToArchive = await Messages.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    console.trace(chatsToArchive);

    // Move chats to ArchivedChats table
    await Promise.all(
      chatsToArchive.map(async (chat) => {
        await ArchivedChats.create({
          message: chat.message,
          userId: chat.userId,
          groupId: chat.groupId,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        });
      })
    );

    // Delete the archived chats from Chat table
    await Messages.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    console.log('Cron job completed successfully');
  } catch (err) {
        res.send({error: err});
        console.trace(err);
  }

}
, null,
true,
'America/Los_Angeles'


)};
