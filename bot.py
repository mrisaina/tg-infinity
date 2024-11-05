import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

DEFAULT_MESSAGE = "Перед тим як писати коментарі, ознайомтеся з правилами нашого каналу: https://telegra.ph/Pravila-chatu-ta-komentarіv-v-Іnfіnіtі-10-25"

# Handler for incoming messages
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # Extract the necessary data from the incoming message
    original_message_id = update.message.message_id
    chat_id = update.message.chat.id

    # Send a message
    await context.bot.send_message(chat_id, DEFAULT_MESSAGE, reply_to_message_id=original_message_id)

# async def handle_channel_post(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     # Check if the update is a channel post
#     if update.channel_post:
#         chat_id = update.channel_post.chat.id  # Get the ID of the channel
#         # Send the default message to the chat where the channel belongs
#         await context.bot.send_message(chat_id=chat_id, text=DEFAULT_MESSAGE)

# Main function
def main():
    # Initialize the application with your bot token
    application = ApplicationBuilder().token("7711964890:AAGcEpHwLCLX7pK2n3LuWmmB6QLc8bAtWTs").build()

    # Add a handler for all messages
    application.add_handler(MessageHandler(filters.IS_AUTOMATIC_FORWARD, handle_message))

    # Start polling for updates
    logging.info("Bot is starting...")
    application.run_polling()

if __name__ == "__main__":
    main()
