export default {
    SortOptions: {
        toOld: 2,
        toYoung: 1
    },

    GlobalType: {
        __resolveType: object => {
            if (object.staff_name) return 'Staff'
            if (object.staff_name) return 'Branch'
            return null
        }
    }
}