/* __placeholder__ */
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listArticles } from '../api/article';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const resources = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const draftKeyword = ref('');
const query = reactive({
    page: 1,
    pageSize: 6,
    sort: 'latest',
    keyword: '',
    tag: '',
});
const sortOptions = [
    { label: '最新发布', value: 'latest' },
    { label: '热度优先', value: 'hot' },
];
const pageSizeOptions = [6, 12, 18];
const availableTags = computed(() => {
    const tagSet = new Set();
    resources.value.forEach((resource) => {
        resource.tags?.forEach((tag) => {
            if (tag.trim()) {
                tagSet.add(tag);
            }
        });
    });
    return Array.from(tagSet);
});
const skeletonCount = computed(() => query.pageSize);
const fetchResources = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        resources.value = await listArticles({
            page: query.page,
            pageSize: query.pageSize,
            sort: query.sort,
            keyword: query.keyword || undefined,
            tag: query.tag || undefined,
        });
    }
    catch (error) {
        console.error('Failed to load resources:', error);
        errorMessage.value = '资源列表加载失败，请稍后重试。';
    }
    finally {
        loading.value = false;
    }
};
const applyFilters = async () => {
    query.page = 1;
    query.keyword = draftKeyword.value.trim();
    await fetchResources();
};
const resetFilters = async () => {
    draftKeyword.value = '';
    query.page = 1;
    query.pageSize = 6;
    query.sort = 'latest';
    query.keyword = '';
    query.tag = '';
    await fetchResources();
};
const selectTag = async (tag) => {
    query.tag = tag;
    query.page = 1;
    await fetchResources();
};
const onSortChange = async () => {
    query.page = 1;
    await fetchResources();
};
const onPageSizeChange = async () => {
    query.page = 1;
    await fetchResources();
};
const changePage = async (page) => {
    if (page < 1 || loading.value) {
        return;
    }
    query.page = page;
    await fetchResources();
};
const viewDetail = (id) => {
    router.push({ name: 'ResourceDetail', params: { id } });
};
onMounted(fetchResources);
const __VLS_fnComponent = (await import('vue')).defineComponent({});
let __VLS_functionalComponentProps;
let __VLS_modelEmitsType;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    const __VLS_0 = {}.ElContainer;
    ({}.ElContainer);
    ({}.ElContainer);
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    __VLS_components.ElContainer;
    __VLS_components.elContainer;
    // @ts-ignore
    [ElContainer, ElContainer,];
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("resource-page") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("resource-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("resource-page") }, }));
    const __VLS_6 = {}.ElMain;
    ({}.ElMain);
    ({}.ElMain);
    __VLS_components.ElMain;
    __VLS_components.elMain;
    __VLS_components.ElMain;
    __VLS_components.elMain;
    // @ts-ignore
    [ElMain, ElMain,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ class: ("resource-main") }, }));
    const __VLS_8 = __VLS_7({ ...{ class: ("resource-main") }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ class: ("resource-main") }, }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("resource-hero") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("eyebrow") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("hero-copy") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hero-stats") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-card") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.query.page);
    // @ts-ignore
    [query,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-card") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.resources.length);
    // @ts-ignore
    [resources,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("toolbar-card") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("toolbar-top") }, });
    const __VLS_12 = {}.ElInput;
    ({}.ElInput);
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput, ElInput,];
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.draftKeyword)), ...{ class: ("search-box") }, clearable: (true), placeholder: ("搜索标题关键词"), }));
    const __VLS_14 = __VLS_13({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.draftKeyword)), ...{ class: ("search-box") }, clearable: (true), placeholder: ("搜索标题关键词"), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    ({}({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.draftKeyword)), ...{ class: ("search-box") }, clearable: (true), placeholder: ("搜索标题关键词"), }));
    let __VLS_18;
    const __VLS_19 = {
        onKeyup: (__VLS_ctx.applyFilters)
    };
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        (__VLS_17.slots).append;
        const __VLS_20 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{ 'onClick': {} }, }));
        const __VLS_22 = __VLS_21({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_26;
        const __VLS_27 = {
            onClick: (__VLS_ctx.applyFilters)
        };
        // @ts-ignore
        [draftKeyword, applyFilters, applyFilters,];
        (__VLS_25.slots).default;
        const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
        let __VLS_23;
        let __VLS_24;
    }
    const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    let __VLS_15;
    let __VLS_16;
    const __VLS_28 = {}.ElSegmented;
    ({}.ElSegmented);
    __VLS_components.ElSegmented;
    __VLS_components.elSegmented;
    // @ts-ignore
    [ElSegmented,];
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.sort)), options: ((__VLS_ctx.sortOptions)), }));
    const __VLS_30 = __VLS_29({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.sort)), options: ((__VLS_ctx.sortOptions)), }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    ({}({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.sort)), options: ((__VLS_ctx.sortOptions)), }));
    let __VLS_34;
    const __VLS_35 = {
        onChange: (__VLS_ctx.onSortChange)
    };
    // @ts-ignore
    [query, sortOptions, onSortChange,];
    const __VLS_33 = __VLS_pickFunctionalComponentCtx(__VLS_28, __VLS_30);
    let __VLS_31;
    let __VLS_32;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("toolbar-bottom") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("filter-group") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("filter-label") }, });
    const __VLS_36 = {}.ElTag;
    ({}.ElTag);
    ({}.ElTag);
    __VLS_components.ElTag;
    __VLS_components.elTag;
    __VLS_components.ElTag;
    __VLS_components.elTag;
    // @ts-ignore
    [ElTag, ElTag,];
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{ 'onClick': {} }, type: ((__VLS_ctx.query.tag === '' ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }));
    const __VLS_38 = __VLS_37({ ...{ 'onClick': {} }, type: ((__VLS_ctx.query.tag === '' ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    ({}({ ...{ 'onClick': {} }, type: ((__VLS_ctx.query.tag === '' ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }));
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            __VLS_ctx.selectTag('');
            // @ts-ignore
            [query, selectTag,];
        }
    };
    (__VLS_41.slots).default;
    const __VLS_41 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
    let __VLS_39;
    let __VLS_40;
    for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.availableTags))) {
        const __VLS_44 = {}.ElTag;
        ({}.ElTag);
        ({}.ElTag);
        __VLS_components.ElTag;
        __VLS_components.elTag;
        __VLS_components.ElTag;
        __VLS_components.elTag;
        // @ts-ignore
        [ElTag, ElTag,];
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ ...{ 'onClick': {} }, key: ((tag)), type: ((__VLS_ctx.query.tag === tag ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }));
        const __VLS_46 = __VLS_45({ ...{ 'onClick': {} }, key: ((tag)), type: ((__VLS_ctx.query.tag === tag ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        ({}({ ...{ 'onClick': {} }, key: ((tag)), type: ((__VLS_ctx.query.tag === tag ? 'primary' : 'info')), ...{ class: ("filter-tag") }, effect: ("light"), }));
        let __VLS_50;
        const __VLS_51 = {
            onClick: (...[$event]) => {
                __VLS_ctx.selectTag(tag);
                // @ts-ignore
                [query, selectTag, availableTags,];
            }
        };
        (tag);
        (__VLS_49.slots).default;
        const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
        let __VLS_47;
        let __VLS_48;
    }
    const __VLS_52 = {}.ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.pageSize)), ...{ class: ("page-size-select") }, placeholder: ("每页数量"), }));
    const __VLS_54 = __VLS_53({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.pageSize)), ...{ class: ("page-size-select") }, placeholder: ("每页数量"), }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    ({}({ ...{ 'onChange': {} }, modelValue: ((__VLS_ctx.query.pageSize)), ...{ class: ("page-size-select") }, placeholder: ("每页数量"), }));
    let __VLS_58;
    const __VLS_59 = {
        onChange: (__VLS_ctx.onPageSizeChange)
    };
    for (const [size] of __VLS_getVForSourceType((__VLS_ctx.pageSizeOptions))) {
        const __VLS_60 = {}.ElOption;
        ({}.ElOption);
        __VLS_components.ElOption;
        __VLS_components.elOption;
        // @ts-ignore
        [ElOption,];
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ key: ((size)), label: ((`${size} 条 / 页`)), value: ((size)), }));
        const __VLS_62 = __VLS_61({ key: ((size)), label: ((`${size} 条 / 页`)), value: ((size)), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        ({}({ key: ((size)), label: ((`${size} 条 / 页`)), value: ((size)), }));
        // @ts-ignore
        [query, onPageSizeChange, pageSizeOptions,];
        const __VLS_65 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62);
    }
    (__VLS_57.slots).default;
    const __VLS_57 = __VLS_pickFunctionalComponentCtx(__VLS_52, __VLS_54);
    let __VLS_55;
    let __VLS_56;
    if (__VLS_ctx.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel skeleton-grid") }, });
        for (const [index] of __VLS_getVForSourceType((__VLS_ctx.skeletonCount))) {
            const __VLS_66 = {}.ElSkeleton;
            ({}.ElSkeleton);
            ({}.ElSkeleton);
            __VLS_components.ElSkeleton;
            __VLS_components.elSkeleton;
            __VLS_components.ElSkeleton;
            __VLS_components.elSkeleton;
            // @ts-ignore
            [ElSkeleton, ElSkeleton,];
            const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({ key: ((index)), animated: (true), ...{ class: ("resource-card") }, }));
            const __VLS_68 = __VLS_67({ key: ((index)), animated: (true), ...{ class: ("resource-card") }, }, ...__VLS_functionalComponentArgsRest(__VLS_67));
            ({}({ key: ((index)), animated: (true), ...{ class: ("resource-card") }, }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
            {
                (__VLS_71.slots).template;
                const __VLS_72 = {}.ElSkeletonItem;
                ({}.ElSkeletonItem);
                __VLS_components.ElSkeletonItem;
                __VLS_components.elSkeletonItem;
                // @ts-ignore
                [ElSkeletonItem,];
                const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({ variant: ("h3"), ...{ style: ({}) }, }));
                const __VLS_74 = __VLS_73({ variant: ("h3"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_73));
                ({}({ variant: ("h3"), ...{ style: ({}) }, }));
                // @ts-ignore
                [loading, skeletonCount,];
                const __VLS_77 = __VLS_pickFunctionalComponentCtx(__VLS_72, __VLS_74);
                const __VLS_78 = {}.ElSkeletonItem;
                ({}.ElSkeletonItem);
                __VLS_components.ElSkeletonItem;
                __VLS_components.elSkeletonItem;
                // @ts-ignore
                [ElSkeletonItem,];
                const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_80 = __VLS_79({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_79));
                ({}({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_83 = __VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80);
                const __VLS_84 = {}.ElSkeletonItem;
                ({}.ElSkeletonItem);
                __VLS_components.ElSkeletonItem;
                __VLS_components.elSkeletonItem;
                // @ts-ignore
                [ElSkeletonItem,];
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_86 = __VLS_85({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                ({}({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86);
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("skeleton-footer") }, });
                const __VLS_90 = {}.ElSkeletonItem;
                ({}.ElSkeletonItem);
                __VLS_components.ElSkeletonItem;
                __VLS_components.elSkeletonItem;
                // @ts-ignore
                [ElSkeletonItem,];
                const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ variant: ("button"), ...{ style: ({}) }, }));
                const __VLS_92 = __VLS_91({ variant: ("button"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_91));
                ({}({ variant: ("button"), ...{ style: ({}) }, }));
                const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
                const __VLS_96 = {}.ElSkeletonItem;
                ({}.ElSkeletonItem);
                __VLS_components.ElSkeletonItem;
                __VLS_components.elSkeletonItem;
                // @ts-ignore
                [ElSkeletonItem,];
                const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_98 = __VLS_97({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                ({}({ variant: ("text"), ...{ style: ({}) }, }));
                const __VLS_101 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
            }
            const __VLS_71 = __VLS_pickFunctionalComponentCtx(__VLS_66, __VLS_68);
        }
    }
    else if (__VLS_ctx.errorMessage) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel") }, });
        const __VLS_102 = {}.ElResult;
        ({}.ElResult);
        ({}.ElResult);
        __VLS_components.ElResult;
        __VLS_components.elResult;
        __VLS_components.ElResult;
        __VLS_components.elResult;
        // @ts-ignore
        [ElResult, ElResult,];
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ icon: ("warning"), title: ("加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }));
        const __VLS_104 = __VLS_103({ icon: ("warning"), title: ("加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        ({}({ icon: ("warning"), title: ("加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_107.slots).extra;
            const __VLS_108 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({ ...{ 'onClick': {} }, type: ("primary"), }));
            const __VLS_110 = __VLS_109({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
            let __VLS_114;
            const __VLS_115 = {
                onClick: (__VLS_ctx.fetchResources)
            };
            // @ts-ignore
            [errorMessage, errorMessage, fetchResources,];
            (__VLS_113.slots).default;
            const __VLS_113 = __VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110);
            let __VLS_111;
            let __VLS_112;
        }
        const __VLS_107 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
    }
    else if (!__VLS_ctx.resources.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel") }, });
        const __VLS_116 = {}.ElEmpty;
        ({}.ElEmpty);
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty, ElEmpty,];
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({ description: ("当前筛选条件下暂无内容"), }));
        const __VLS_118 = __VLS_117({ description: ("当前筛选条件下暂无内容"), }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        ({}({ description: ("当前筛选条件下暂无内容"), }));
        const __VLS_122 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({ ...{ 'onClick': {} }, }));
        const __VLS_124 = __VLS_123({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_128;
        const __VLS_129 = {
            onClick: (__VLS_ctx.resetFilters)
        };
        // @ts-ignore
        [resources, resetFilters,];
        (__VLS_127.slots).default;
        const __VLS_127 = __VLS_pickFunctionalComponentCtx(__VLS_122, __VLS_124);
        let __VLS_125;
        let __VLS_126;
        (__VLS_121.slots).default;
        const __VLS_121 = __VLS_pickFunctionalComponentCtx(__VLS_116, __VLS_118);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("resource-grid") }, });
        for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.resources))) {
            const __VLS_130 = {}.ElCard;
            ({}.ElCard);
            ({}.ElCard);
            __VLS_components.ElCard;
            __VLS_components.elCard;
            __VLS_components.ElCard;
            __VLS_components.elCard;
            // @ts-ignore
            [ElCard, ElCard,];
            const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({ key: ((resource.id)), ...{ class: ("resource-card") }, shadow: ("hover"), }));
            const __VLS_132 = __VLS_131({ key: ((resource.id)), ...{ class: ("resource-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_131));
            ({}({ key: ((resource.id)), ...{ class: ("resource-card") }, shadow: ("hover"), }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("resource-card__meta") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("resource-status") }, });
            (resource.status || 'published');
            // @ts-ignore
            [resources,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("resource-points") }, });
            (resource.isFree ? '免费' : `${resource.requiredPoints || 0} 积分`);
            __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
            (resource.title);
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("resource-preview") }, });
            (resource.preview);
            if (resource.tags?.length) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("resource-tags") }, });
                for (const [tag] of __VLS_getVForSourceType((resource.tags))) {
                    const __VLS_136 = {}.ElTag;
                    ({}.ElTag);
                    ({}.ElTag);
                    __VLS_components.ElTag;
                    __VLS_components.elTag;
                    __VLS_components.ElTag;
                    __VLS_components.elTag;
                    // @ts-ignore
                    [ElTag, ElTag,];
                    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({ ...{ 'onClick': {} }, key: ((tag)), size: ("small"), effect: ("plain"), }));
                    const __VLS_138 = __VLS_137({ ...{ 'onClick': {} }, key: ((tag)), size: ("small"), effect: ("plain"), }, ...__VLS_functionalComponentArgsRest(__VLS_137));
                    ({}({ ...{ 'onClick': {} }, key: ((tag)), size: ("small"), effect: ("plain"), }));
                    let __VLS_142;
                    const __VLS_143 = {
                        onClick: (...[$event]) => {
                            if (!(!((__VLS_ctx.loading))))
                                return;
                            if (!(!((__VLS_ctx.errorMessage))))
                                return;
                            if (!(!((!__VLS_ctx.resources.length))))
                                return;
                            if (!((resource.tags?.length)))
                                return;
                            __VLS_ctx.selectTag(tag);
                            // @ts-ignore
                            [selectTag,];
                        }
                    };
                    (tag);
                    (__VLS_141.slots).default;
                    const __VLS_141 = __VLS_pickFunctionalComponentCtx(__VLS_136, __VLS_138);
                    let __VLS_139;
                    let __VLS_140;
                }
            }
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("resource-footer") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("resource-stats") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (resource.likeCount ?? 0);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (resource.viewCount ?? 0);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (resource.commentCount ?? 0);
            const __VLS_144 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({ ...{ 'onClick': {} }, text: (true), type: ("primary"), }));
            const __VLS_146 = __VLS_145({ ...{ 'onClick': {} }, text: (true), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            ({}({ ...{ 'onClick': {} }, text: (true), type: ("primary"), }));
            let __VLS_150;
            const __VLS_151 = {
                onClick: (...[$event]) => {
                    if (!(!((__VLS_ctx.loading))))
                        return;
                    if (!(!((__VLS_ctx.errorMessage))))
                        return;
                    if (!(!((!__VLS_ctx.resources.length))))
                        return;
                    __VLS_ctx.viewDetail(resource.id);
                    // @ts-ignore
                    [viewDetail,];
                }
            };
            (__VLS_149.slots).default;
            const __VLS_149 = __VLS_pickFunctionalComponentCtx(__VLS_144, __VLS_146);
            let __VLS_147;
            let __VLS_148;
            (__VLS_135.slots).default;
            const __VLS_135 = __VLS_pickFunctionalComponentCtx(__VLS_130, __VLS_132);
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("pagination-bar") }, });
    const __VLS_152 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.query.page === 1 || __VLS_ctx.loading)), }));
    const __VLS_154 = __VLS_153({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.query.page === 1 || __VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    ({}({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.query.page === 1 || __VLS_ctx.loading)), }));
    let __VLS_158;
    const __VLS_159 = {
        onClick: (...[$event]) => {
            __VLS_ctx.changePage(__VLS_ctx.query.page - 1);
            // @ts-ignore
            [query, query, loading, changePage,];
        }
    };
    (__VLS_157.slots).default;
    const __VLS_157 = __VLS_pickFunctionalComponentCtx(__VLS_152, __VLS_154);
    let __VLS_155;
    let __VLS_156;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("page-indicator") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.query.page);
    // @ts-ignore
    [query,];
    if (__VLS_ctx.resources.length < __VLS_ctx.query.pageSize) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
        // @ts-ignore
        [query, resources,];
    }
    const __VLS_160 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.loading || __VLS_ctx.resources.length < __VLS_ctx.query.pageSize)), }));
    const __VLS_162 = __VLS_161({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.loading || __VLS_ctx.resources.length < __VLS_ctx.query.pageSize)), }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    ({}({ ...{ 'onClick': {} }, disabled: ((__VLS_ctx.loading || __VLS_ctx.resources.length < __VLS_ctx.query.pageSize)), }));
    let __VLS_166;
    const __VLS_167 = {
        onClick: (...[$event]) => {
            __VLS_ctx.changePage(__VLS_ctx.query.page + 1);
            // @ts-ignore
            [query, query, resources, loading, changePage,];
        }
    };
    (__VLS_165.slots).default;
    const __VLS_165 = __VLS_pickFunctionalComponentCtx(__VLS_160, __VLS_162);
    let __VLS_163;
    let __VLS_164;
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['resource-page'];
        __VLS_styleScopedClasses['resource-main'];
        __VLS_styleScopedClasses['resource-hero'];
        __VLS_styleScopedClasses['eyebrow'];
        __VLS_styleScopedClasses['hero-copy'];
        __VLS_styleScopedClasses['hero-stats'];
        __VLS_styleScopedClasses['stat-card'];
        __VLS_styleScopedClasses['stat-card'];
        __VLS_styleScopedClasses['toolbar-card'];
        __VLS_styleScopedClasses['toolbar-top'];
        __VLS_styleScopedClasses['search-box'];
        __VLS_styleScopedClasses['toolbar-bottom'];
        __VLS_styleScopedClasses['filter-group'];
        __VLS_styleScopedClasses['filter-label'];
        __VLS_styleScopedClasses['filter-tag'];
        __VLS_styleScopedClasses['filter-tag'];
        __VLS_styleScopedClasses['page-size-select'];
        __VLS_styleScopedClasses['state-panel'];
        __VLS_styleScopedClasses['skeleton-grid'];
        __VLS_styleScopedClasses['resource-card'];
        __VLS_styleScopedClasses['skeleton-footer'];
        __VLS_styleScopedClasses['state-panel'];
        __VLS_styleScopedClasses['state-panel'];
        __VLS_styleScopedClasses['resource-grid'];
        __VLS_styleScopedClasses['resource-card'];
        __VLS_styleScopedClasses['resource-card__meta'];
        __VLS_styleScopedClasses['resource-status'];
        __VLS_styleScopedClasses['resource-points'];
        __VLS_styleScopedClasses['resource-preview'];
        __VLS_styleScopedClasses['resource-tags'];
        __VLS_styleScopedClasses['resource-footer'];
        __VLS_styleScopedClasses['resource-stats'];
        __VLS_styleScopedClasses['pagination-bar'];
        __VLS_styleScopedClasses['page-indicator'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                resources: resources,
                loading: loading,
                errorMessage: errorMessage,
                draftKeyword: draftKeyword,
                query: query,
                sortOptions: sortOptions,
                pageSizeOptions: pageSizeOptions,
                availableTags: availableTags,
                skeletonCount: skeletonCount,
                fetchResources: fetchResources,
                applyFilters: applyFilters,
                resetFilters: resetFilters,
                selectTag: selectTag,
                onSortChange: onSortChange,
                onPageSizeChange: onPageSizeChange,
                changePage: changePage,
                viewDetail: viewDetail,
            };
        },
    });
}
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
