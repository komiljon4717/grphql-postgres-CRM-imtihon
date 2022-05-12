insert into branches (branch_name, branch_address) values
('Drive Village', 'Farg''ona viloyati Qo''qon shahri'),
('Hamkor', 'Andijon viloyati Asaka shahri'),
('Megavat', 'Farg''ona viloyati Farg''ona shahri');


insert into staffs ( staff_name, staff_password, branch_id, birth_date, staff_gender) values 
('admin', 'admin', 1, '1999-02-21', 'M'),
('Komiljon4717', 'Komiljon4717', 1, '2000-07-21', 'M'),
('Umidjon007', 'Umidjon007', 3, '2002-10-14', 'M'),
('Ali001', 'Ali001', 2, '1999-02-14', 'M');





insert into permission_branches (staff_id, created, read, update, delete) values
(1, 'true', 'true', 'true', 'true');



insert into permission_permissions (staff_id, created, read, update, delete) values
(1, 'true', 'true', 'true', 'true');

insert into permission_transport (staff_id, created, read, update, delete) values
(1, 'false', 'false', 'false', 'false');