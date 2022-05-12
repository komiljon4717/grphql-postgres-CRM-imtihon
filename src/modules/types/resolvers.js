export default {
    SortOptions: {
        toOld: 2,
        toYoung: 1
    },

    GlobalType: {
        __resolveType: object => {
            if (object.staff_name) return 'User'
            return null
        }
    }
}