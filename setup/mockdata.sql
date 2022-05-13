insert into branches (branch_name, branch_address) values
('Drive Village', 'Farg''ona viloyati Qo''qon shahri'),
('Hamkor', 'Andijon viloyati Asaka shahri'),
('Megavat', 'Farg''ona viloyati Farg''ona shahri');



insert into transports (auto_model, auto_branch, auto_color, auto_img) values
('Cobalt', 1, 'blue', 'cobalt.jpg'),
('Malibu', 3, 'black', 'malibu.jpg'),
('Spark', 2, 'white', 'spark.jpg'),
('Damas', 4, 'mokriy', 'damas.jpg');



insert into staffs ( staff_name, staff_password, branch_id, birth_date, staff_gender) values 
('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 1, '1999-02-21', 'M'),
('Komiljon4717', '36a9f9bee92bc3cbb0852d202a42d65550a3422331ae712b341b136d0e3b1a0f', 1, '2000-07-21', 'M'),
('Umidjon007', 'b307ed8506bd430b8e679e3eb159d9475a7907b97a1d63d55027a7ba5ca8eca9', 3, '2002-10-14', 'M'),
('Ali001', '2d5d9237af61efa64fac324bcee0c35c9a3327fbf1d33a7b4cb7da5f7d91fbce', 2, '1999-02-14', 'M');





insert into permission_branches (staff_id, created, read, update, delete) values
(1, 'true', 'true', 'true', 'true');



insert into permission_permissions (staff_id, created, read, update, delete) values
(1, 'true', 'true', 'true', 'true');

insert into permission_transport (staff_id, created, read, update, delete) values
(1, 'true', 'false', 'true', 'true');