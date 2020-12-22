UPDATE main.roles SET permissions = permissions || '{TodoCreator}'
where role_type in (0,2);
