import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatMessage  # Import your ChatMessage model

class TextRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name.replace(" ", "_")}'  # Replace spaces with underscores
        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            content = text_data_json['content']
            sender = text_data_json['sender']

            # Save the received message to the database
            message = ChatMessage.objects.create(content=content, sender=sender, server=self.room_name)

            # Broadcast the message to all clients in the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat.message',
                    'message': {
                        'id': message.id,
                        'content': message.content,
                        'sender': message.sender.user_alias,
                        'timestamp': message.timestamp.isoformat(),
                        # Add other fields as needed
                    }
                }
            )
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")

    async def chat_message(self, event):
        text = event['message']
        await self.send(text_data=json.dumps({
            'text': text['content'],
            'sender': text['sender'],
            'timestamp': text['timestamp'],
            # Include other fields as needed
        }))
