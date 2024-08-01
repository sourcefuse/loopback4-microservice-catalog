ALTER TABLE main.features
drop column metadata,
drop column created_by,
drop column modified_by ,
drop column created_on ,
drop column modified_on 
drop column deleted  ,
drop column deleted_on ,
drop column deleted_by;


ALTER TABLE main.strategies
drop column created_by,
drop column modified_by ,
drop column created_on ,
drop column modified_on 
drop column deleted  ,
drop column deleted_on ,
drop column deleted_by;

ALTER TABLE main.feature_values
drop column created_by,
drop column modified_by ,
drop column created_on ,
drop column modified_on 
drop column deleted  ,
drop column deleted_on ,
drop column deleted_by;
