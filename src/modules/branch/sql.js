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

const GET_BRANCH = `
    select 
        branch_id,
        branch_name,
        branch_address,
        branch_created_at
    from branches 
    where branches.branch_id = $1
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

export default {
    DELETE_BRENCH,
    GET_BRANCHES,
    CHANGE_BRANCH,
    GET_BRANCH,
    ADD_BRANCH
}