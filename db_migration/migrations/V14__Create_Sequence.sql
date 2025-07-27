create sequence if not exists member_seq
	as int
	increment by 1
	start with 1
	owned by none;

select setval('member_seq', (
  select count(*)
  from users u
  where extract(year from u.created_at) = 2025)
);

create sequence if not exists vehicle_seq
	as int
	increment by 1
	start with 1
	owned by none;

select setval('vehicle_seq', (
  select count(*)
  from product p
  where extract(year from p.created_at) = 2025)
);
