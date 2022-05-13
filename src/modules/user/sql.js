const GET_STAFFS = `
    select 
        s.staff_id,
        s.staff_name,
        s.branch_id,
        s.birth_date,
        s.staff_gender,
        s.staff_created_at
    from staffs as s
    inner join branches as b on s.branch_id = b.branch_id
    where 
        staff_name ilike concat('%', $3::varchar, '%')
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then birth_date
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then birth_date
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then staff_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then staff_name
    end asc
    offset $1 limit $2
`

const GET_STAFF = `
    select 
        s.staff_id,
        s.staff_name,
        s.birth_date,
        b.branch_id,
        s.staff_gender,
        s.staff_created_at
    from staffs s
    inner join branches b on s.branch_id = b.branch_id
    where s.staff_id = $1
`

const ADD_STAFF = `
    insert into staffs (
        branch_id,
        staff_name,
        staff_password,
        birth_date,
        staff_gender
    ) values ($1, $2, $3, $4, $5)
    returning *
`

const FIND_STAFF = `
    select
        staff_id,
        branch_id,
        staff_name,
        staff_password,
        birth_date,
        staff_gender,
        staff_created_at
    from staffs
    where staff_name = $1 and staff_password = $2
`







const GET_PERMISSIONS = `
select
    permission_permissions_id,
    staff_id,
    created,
    read,
    update,
    delete
from  permission_permissions 
where staff_id = $1 
`

const ADD_PERMISSIONS = `
insert into permission_permissions (
    staff_id,
    created,
    read,
    update,
    delete
) values ($1, $2, $3, $4, $5)
returning *
`

const ADD_PERMISSIONS_TRANSPORT = `
insert into permission_transport (
    staff_id,
    created,
    read,
    update,
    delete
) values ($1, $2, $3, $4, $5)
returning *
`


const ADD_PERMISSIONS_BRANCH = `
insert into permission_branches (
    staff_id,
    created,
    read,
    update,
    delete
) values ($1, $2, $3, $4, $5)
returning *
`




const UPDATE_PERMISSIONS = `
update permission_permissions p set
    created = $2,
    read = $3,
    update = $4,
    delete = $5
where staff_id::varchar = $1
returning *
`

export default {
    ADD_PERMISSIONS_TRANSPORT,
    ADD_PERMISSIONS_BRANCH,
    UPDATE_PERMISSIONS,
    ADD_PERMISSIONS,
    GET_PERMISSIONS,
    FIND_STAFF,
    GET_STAFFS,
    GET_STAFF,
    ADD_STAFF
}