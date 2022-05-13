const GET_TRANSPORTS = `
    select 
        auto_id,
        auto_model,
        auto_branch,
        auto_color,
        auto_img,
        auto_created_at
    from transports
    where 
        auto_model ilike concat('%', $3::varchar, '%')
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then auto_created_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then auto_created_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then auto_model
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then auto_model
    end asc
    offset $1 limit $2
`


const GET_TRANSPORT = `
    select 
        auto_id,
        auto_model,
        auto_branch,
        auto_color,
        auto_img,
        auto_created_at
    from transports 
    where transports.auto_id = $1
`

const ADD_BRANCH = `
    insert into branches (
        branch_name,
        branch_address
    ) values ($1, $2)
    returning *
`

const CHANGE_BRANCH = `
update branches b set
    branch_name = (
        case
            when length($2) > 0 then $2
            else b.branch_name
        end
    ),
    branch_address = (
        case
            when length($3) > 0 then $3
            else b.branch_address
        end
    )
where branch_id::varchar = $1
returning *
`


const DELETE_BRENCH = `
delete from branches
where
branch_id::varchar = $1
returning * 
`


const GET_PERMISSIONS_TRANSPORT = `
select
    permission_transport_id,
    staff_id,
    created,
    read,
    update,
    delete
from  permission_transport 
where staff_id = $1 
`

const UPDATE_PERMISSIONS_TRANSPORT = `
update permission_transport p set
    created = (
        case
            when length($2) > 0 then $2
            else p.created
        end
    ),
    read = (
        case
        when length($3) > 0 then $3
            else p.read
        end
    ),
    update = (
        case
        when length($4) > 0  then $4
            else p.update
        end
    ),
    delete = (
        case
        when length($5) > 0 then $5
            else p.delete
        end
    )
where staff_id::varchar = $1
returning *
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
    UPDATE_PERMISSIONS_TRANSPORT,
    GET_PERMISSIONS_TRANSPORT,
    GET_PERMISSIONS,
    GET_TRANSPORTS,
    DELETE_BRENCH,
    CHANGE_BRANCH,
    GET_TRANSPORT,
    ADD_BRANCH
}