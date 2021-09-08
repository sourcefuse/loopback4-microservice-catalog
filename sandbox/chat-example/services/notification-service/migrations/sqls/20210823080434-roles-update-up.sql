UPDATE main.roles SET permissions = permissions || '{ViewNotification, CreateNotification, UpdateNotification, DeleteNotification, CanGetNotificationAccess}'
where role_type in (0,2);
