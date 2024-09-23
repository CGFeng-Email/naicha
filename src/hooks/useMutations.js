import { mapMutations } from "vuex";
import { useMapper } from "./useMapper";

export function useMutations(mapper) {
    return useMapper(mapper, mapMutations)
}