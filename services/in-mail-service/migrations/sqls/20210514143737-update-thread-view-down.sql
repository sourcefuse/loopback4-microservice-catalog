DROP VIEW IF EXISTS main.v_thread
CASCADE;
CREATE OR REPLACE VIEW main.v_thread
AS
SELECT t.id,
t.subject,
t.created_on,
t.modified_on,
t.created_by,
t.ext_id,
t.deleted,
t.ext_metadata as thread_ext_metadata,
t.modified_by,
m.id as message_id,
m.sender,
m.body,
m.ext_metadata as message_ext_metadata,
( SELECT array_to_json(array_agg(row_to_json(d.*))) AS attachment
           FROM ( SELECT a.id,
				 a.path,
				 a.thumbnail,
				 a.mime,
				 a.ext_metadata as "extMetadata",
				 a.name
                   FROM main.attachment a
                  WHERE a.message_id = m.id) d) AS attachment,
( SELECT array_to_json(array_agg(row_to_json(d.*))) AS group
           FROM ( SELECT g.id,
				 g.party,
				 g.type,
				 g.is_important as "isImportant",
				 g.ext_metadata as "extMetadata"
                   FROM main.group g
                  WHERE g.message_id = m.id) d) AS group
from
main.thread t
JOIN main.message m on m.thread_id = t.id;
