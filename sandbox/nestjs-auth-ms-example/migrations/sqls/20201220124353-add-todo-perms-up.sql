UPDATE main.roles SET permissions = permissions || '{TodoCreator,TodoOwner}'
where role_type in (0,2);
