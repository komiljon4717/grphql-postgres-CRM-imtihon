const GET_BRANCHES = `
    select 
        branch_id,
        branch_name,
        branch_address,
        branch_created_at
    from branches
    where 
        branch_name ilike concat('%', $3::varchar, '%')
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then branch_created_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then branch_created_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then branch_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then branch_name
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

const ADD_USER = `
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

export default {
    GET_PERMISSIONS,
    GET_BRANCHES,
    FIND_STAFF,
    GET_STAFF,
    ADD_USER
}