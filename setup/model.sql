-- initialization (just copy and paste)

-- connect to another db
\c postgres;

-- drop database if exists
drop database if exists transport;

-- create database transport
create database transport;

-- connect to database transport
\c transport;

----------------------------------------------------------
-- model

-- extensions
create extension if not exists "uuid-ossp";

-- branchs table
drop table if exists branches;
create table branches (
    branch_id serial primary key ,
    branch_name character varying(255) not null,
    branch_address character varying(255) not null,
    branch_created_at timestamptz default current_timestamp
);


-- staffs table
drop table if exists staffs cascade;
create table staffs (
    staff_id serial primary key,
    staff_name character varying(255) unique not null,
    staff_password character varying(255) unique not null,
    branch_id int not null references branches(branch_id),
    birth_date date not null,
    staff_gender char(1) check(staff_gender in ('F','M')),
    staff_created_at timestamptz default current_timestamp
);

-- transports table
drop table if exists transports;
create table transports (
    auto_id uuid default uuid_generate_v4() primary key,
    auto_model character varying(255) not null,
    auto_branch int not null references branches(branch_id),
    auto_color character varying(255) not null,
    auto_img text not null,
    auto_created_at timestamptz default current_timestamp
);



-- permission transport table
drop table if exists permission_transport cascade;
create table permission_transport (
    permission_transport_id serial primary key ,
    staff_id int unique not null references staffs(staff_id),
    created character varying(5) not null default false,
    read character varying(5) not null default false,
    update character varying(5) not null default false,
    delete character varying(5) not null default false
);

-- permission branches table
drop table if exists permission_branches cascade;
create table permission_branches (
    permission_branches_id serial primary key,
    staff_id int unique not null references staffs(staff_id),
    created character varying(5) not null default false,
    read character varying(5) not null default false,
    update character varying(5) not null default false,
    delete character varying(5) not null default false
);


-- permission permission table
drop table if exists permission_permissions cascade;
create table permission_permissions (
    permission_permissions_id serial primary key ,
    staff_id int unique not null references staffs(staff_id),
    created character varying(5) not null default false,
    read character varying(5) not null default false,
    update character varying(5) not null default false,
    delete character varying(5) not null default false
);