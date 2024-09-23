import { computed } from 'vue';
import { useStore } from "vuex";

// mapper: 映射的数据，传递进来的数据
// mapFn：映射类型，mapState, mapGetters
export function useMapper(mapper, mapFn) {
    // 获取整个store
    const store = useStore();

    // 根据映射类型，转化数据
    const fns = mapFn(mapper)

    // 导出的总数据对象
    const totalData = {};

    Object.keys(fns).forEach(fnsKey => {
        // 拿到映射数据的每一个key, 并且拿到每一个key对应的函数
        const fn = fns[fnsKey].bind({ $store: store })
        // 赋值总对象，并且生成computed计算属性函数
        totalData[fnsKey] = computed(fn);
    })

    return totalData
}