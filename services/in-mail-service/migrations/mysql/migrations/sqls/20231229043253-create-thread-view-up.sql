-- creating view of message, `group` and attachment table
CREATE OR REPLACE VIEW v_thread AS
SELECT
  t.id,
  t.subject,
  t.created_on,
  t.modified_on,
  t.created_by,
  t.ext_id,
  t.deleted,
  t.deleted_on,
  t.deleted_by,
  t.ext_metadata AS thread_ext_metadata,
  t.modified_by,
  m.id AS message_id,
  m.sender,
  m.body,
  m.ext_metadata AS message_ext_metadata,
  ( SELECT JSON_ARRAYAGG(JSON_OBJECT(
      "id", a.id,
      "path", a.path,
      "thumbnail", a.thumbnail,
      "mime", a.mime,
      "extMetadata", a.ext_metadata,
      "name", a.name)
    )
    FROM attachment a
    WHERE a.message_id = m.id
  ) AS attachment,
  ( SELECT JSON_ARRAYAGG(JSON_OBJECT(
      "id", g.id,
      "party", g.party,
      "type", g.type,
      "isImportant", g.is_important,
      "extMetadata", g.ext_metadata)
    )
    FROM `group` g
    WHERE g.message_id = m.id
  ) AS `group`
FROM
thread t
JOIN message m ON m.thread_id = t.id;
