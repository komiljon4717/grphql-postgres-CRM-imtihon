export default {
    SortOptions: {
        toLargest: 2,
        toSmallest: 1
    },

    GlobalType: {
        __resolveType: object => {
            if (object.staff_name) return 'Staff'
            if (object.branch_name) return 'Branch'
            if (object.auto_model) return 'Transport'
            return null
        }
    }
}