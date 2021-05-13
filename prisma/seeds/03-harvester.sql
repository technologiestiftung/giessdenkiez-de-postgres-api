-- insert Date range where the harvester should look. Will always be xesterday until 30 days ago
insert into "public"."radolan_harvester" (
    "id",
    "collection_date",
    "start_date",
    "end_date"
  )
VALUES(
    1,
    (
      select current_date - INTEGER '1' as yesterday_date
    ),
    (
      select CONCAT(
          (
            select current_date - INTEGER '30' as thirtydays_date
          )::text,
          ' ',
          '00:50:00'
        )
    )::timestamp,
    (
      select CONCAT(
          (
            select current_date - INTEGER '1' as yesterday_date
          )::text,
          ' ',
          '23:50:00'
        )
    )::timestamp
  );