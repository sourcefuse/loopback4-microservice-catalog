update main.roles set permissions=array_remove(permissions,'TodoCreator') where role_type IN (0,2);
update main.roles set permissions=array_remove(permissions,'TodoOwner') where role_type IN (0,2);
