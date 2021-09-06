UPDATE main.roles SET permissions = permissions || '{ViewMessage, CreateMessage, UpdateMessage, DeleteMessage, ViewMessageRecipient, CreateMessageRecipient, UpdateMessageRecipient, DeleteMessageRecipient}'
where role_type in (0,2);
