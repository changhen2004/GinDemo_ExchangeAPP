/* __placeholder__ */
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { listMyFavorites } from '../api/favorite';
import { checkIn } from '../api/checkin';
import { getMyPointsRecords } from '../api/points';
import { useAuthStore } from '../store/auth';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const authStore = useAuthStore();
const favoriteArticles = ref([]);
const pointRecords = ref([]);
const favoriteLoading = ref(false);
const recordLoading = ref(false);
const checkInLoading = ref(false);
const favoriteError = ref('');
const recordError = ref('');
const checkInDate = ref(localStorage.getItem('daily_check_in_date'));
const today = new Date().toISOString().slice(0, 10);
const checkInCompleted = computed(() => checkInDate.value === today);
const loadFavorites = async () => {
    if (!authStore.isAuthenticated) {
        favoriteArticles.value = [];
        return;
    }
    favoriteLoading.value = true;
    favoriteError.value = '';
    try {
        favoriteArticles.value = await listMyFavorites();
    }
    catch (error) {
        console.error('Failed to load favorites:', error);
        favoriteError.value = '请稍后重试。';
    }
    finally {
        favoriteLoading.value = false;
    }
};
const loadPointRecords = async () => {
    if (!authStore.isAuthenticated) {
        pointRecords.value = [];
        return;
    }
    recordLoading.value = true;
    recordError.value = '';
    try {
        pointRecords.value = await getMyPointsRecords();
    }
    catch (error) {
        console.error('Failed to load point records:', error);
        recordError.value = '请稍后重试。';
    }
    finally {
        recordLoading.value = false;
    }
};
const handleCheckIn = async () => {
    if (!authStore.isAuthenticated || checkInCompleted.value) {
        return;
    }
    checkInLoading.value = true;
    try {
        const response = await checkIn();
        checkInDate.value = today;
        localStorage.setItem('daily_check_in_date', today);
        await Promise.all([authStore.refreshSummary(), loadPointRecords()]);
        ElMessage.success(response.message || '签到成功');
    }
    catch (error) {
        console.error('Check-in failed:', error);
        ElMessage.error('签到失败，请稍后再试。');
    }
    finally {
        checkInLoading.value = false;
    }
};
const goToLogin = () => {
    router.push({ name: 'Login' });
};
const goToArticle = (id) => {
    router.push({ name: 'ResourceDetail', params: { id } });
};
const formatDate = (value) => {
    return new Date(value).toLocaleString('zh-CN', {
        hour12: false,
    });
};
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        return;
    }
    await Promise.all([loadFavorites(), loadPointRecords()]);
});
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("center-page") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("center-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("center-page") }, }));
    const __VLS_6 = {}.ElMain;
    ({}.ElMain);
    ({}.ElMain);
    __VLS_components.ElMain;
    __VLS_components.elMain;
    __VLS_components.ElMain;
    __VLS_components.elMain;
    // @ts-ignore
    [ElMain, ElMain,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ class: ("center-main") }, }));
    const __VLS_8 = __VLS_7({ ...{ class: ("center-main") }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ class: ("center-main") }, }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("center-hero") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("identity-card") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("identity-avatar") }, });
    (__VLS_ctx.authStore.currentUser?.username?.slice(0, 1) || 'U');
    // @ts-ignore
    [authStore,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("eyebrow") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    (__VLS_ctx.authStore.currentUser?.username || '未登录用户');
    // @ts-ignore
    [authStore,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("sub-copy") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hero-actions") }, });
    const __VLS_12 = {}.ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.checkInLoading)), disabled: ((__VLS_ctx.checkInCompleted || !__VLS_ctx.authStore.isAuthenticated)), }));
    const __VLS_14 = __VLS_13({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.checkInLoading)), disabled: ((__VLS_ctx.checkInCompleted || !__VLS_ctx.authStore.isAuthenticated)), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    ({}({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.checkInLoading)), disabled: ((__VLS_ctx.checkInCompleted || !__VLS_ctx.authStore.isAuthenticated)), }));
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.handleCheckIn)
    };
    (__VLS_ctx.checkInCompleted ? '今日已签到' : '立即签到');
    // @ts-ignore
    [authStore, checkInLoading, checkInCompleted, checkInCompleted, handleCheckIn,];
    (__VLS_17.slots).default;
    const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    let __VLS_15;
    let __VLS_16;
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("check-in-hint") }, });
    (__VLS_ctx.checkInCompleted ? '今日签到已完成，可明天再来。' : '每日签到可获得积分奖励。');
    // @ts-ignore
    [checkInCompleted,];
    if (!__VLS_ctx.authStore.isAuthenticated) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel") }, });
        const __VLS_20 = {}.ElEmpty;
        ({}.ElEmpty);
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty, ElEmpty,];
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ description: ("登录后可查看用户中心"), }));
        const __VLS_22 = __VLS_21({ description: ("登录后可查看用户中心"), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        ({}({ description: ("登录后可查看用户中心"), }));
        const __VLS_26 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {} }, type: ("primary"), }));
        const __VLS_28 = __VLS_27({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
        let __VLS_32;
        const __VLS_33 = {
            onClick: (__VLS_ctx.goToLogin)
        };
        // @ts-ignore
        [authStore, goToLogin,];
        (__VLS_31.slots).default;
        const __VLS_31 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
        let __VLS_29;
        let __VLS_30;
        (__VLS_25.slots).default;
        const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("summary-grid") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("summary-card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.authStore.pointsBalance);
        // @ts-ignore
        [authStore,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("summary-card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.favoriteArticles.length);
        // @ts-ignore
        [favoriteArticles,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("summary-card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.authStore.pointsSummary?.privileges?.length ?? 0);
        // @ts-ignore
        [authStore,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("content-grid") }, });
        const __VLS_34 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ ...{ class: ("panel-card") }, shadow: ("hover"), }));
        const __VLS_36 = __VLS_35({ ...{ class: ("panel-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        ({}({ ...{ class: ("panel-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_39.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("panel-head") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("panel-kicker") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
            const __VLS_40 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({ ...{ 'onClick': {} }, text: (true), }));
            const __VLS_42 = __VLS_41({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            ({}({ ...{ 'onClick': {} }, text: (true), }));
            let __VLS_46;
            const __VLS_47 = {
                onClick: (__VLS_ctx.loadFavorites)
            };
            // @ts-ignore
            [loadFavorites,];
            (__VLS_45.slots).default;
            const __VLS_45 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42);
            let __VLS_43;
            let __VLS_44;
        }
        if (__VLS_ctx.favoriteLoading) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("panel-loading") }, });
            const __VLS_48 = {}.ElSkeleton;
            ({}.ElSkeleton);
            __VLS_components.ElSkeleton;
            __VLS_components.elSkeleton;
            // @ts-ignore
            [ElSkeleton,];
            const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ rows: ((4)), animated: (true), }));
            const __VLS_50 = __VLS_49({ rows: ((4)), animated: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            ({}({ rows: ((4)), animated: (true), }));
            // @ts-ignore
            [favoriteLoading,];
            const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50);
        }
        else if (__VLS_ctx.favoriteError) {
            const __VLS_54 = {}.ElResult;
            ({}.ElResult);
            ({}.ElResult);
            __VLS_components.ElResult;
            __VLS_components.elResult;
            __VLS_components.ElResult;
            __VLS_components.elResult;
            // @ts-ignore
            [ElResult, ElResult,];
            const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ icon: ("warning"), title: ("收藏加载失败"), subTitle: ((__VLS_ctx.favoriteError)), }));
            const __VLS_56 = __VLS_55({ icon: ("warning"), title: ("收藏加载失败"), subTitle: ((__VLS_ctx.favoriteError)), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            ({}({ icon: ("warning"), title: ("收藏加载失败"), subTitle: ((__VLS_ctx.favoriteError)), }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
            {
                (__VLS_59.slots).extra;
                const __VLS_60 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ ...{ 'onClick': {} }, }));
                const __VLS_62 = __VLS_61({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                ({}({ ...{ 'onClick': {} }, }));
                let __VLS_66;
                const __VLS_67 = {
                    onClick: (__VLS_ctx.loadFavorites)
                };
                // @ts-ignore
                [loadFavorites, favoriteError, favoriteError,];
                (__VLS_65.slots).default;
                const __VLS_65 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62);
                let __VLS_63;
                let __VLS_64;
            }
            const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56);
        }
        else if (!__VLS_ctx.favoriteArticles.length) {
            const __VLS_68 = {}.ElEmpty;
            ({}.ElEmpty);
            __VLS_components.ElEmpty;
            __VLS_components.elEmpty;
            // @ts-ignore
            [ElEmpty,];
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({ description: ("你还没有收藏任何资源"), }));
            const __VLS_70 = __VLS_69({ description: ("你还没有收藏任何资源"), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            ({}({ description: ("你还没有收藏任何资源"), }));
            // @ts-ignore
            [favoriteArticles,];
            const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70);
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("favorite-list") }, });
            for (const [favorite] of __VLS_getVForSourceType((__VLS_ctx.favoriteArticles))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                            if (!(!((!__VLS_ctx.authStore.isAuthenticated))))
                                return;
                            if (!(!((__VLS_ctx.favoriteLoading))))
                                return;
                            if (!(!((__VLS_ctx.favoriteError))))
                                return;
                            if (!(!((!__VLS_ctx.favoriteArticles.length))))
                                return;
                            __VLS_ctx.goToArticle(favorite.id);
                            // @ts-ignore
                            [favoriteArticles, goToArticle,];
                        } }, key: ((favorite.id)), ...{ class: ("favorite-item") }, type: ("button"), });
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("favorite-cover") }, });
                if (favorite.coverUrl) {
                    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((favorite.coverUrl)), alt: ((favorite.title)), });
                }
                else {
                    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("favorite-cover--placeholder") }, });
                    (favorite.title.slice(0, 1));
                }
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("favorite-body") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("favorite-meta") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (favorite.isFree ? '免费' : `${favorite.requiredPoints} 积分`);
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (favorite.author.username);
                __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
                (favorite.title);
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
                (favorite.preview);
            }
        }
        const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
        const __VLS_74 = {}.ElCard;
        ({}.ElCard);
        ({}.ElCard);
        __VLS_components.ElCard;
        __VLS_components.elCard;
        __VLS_components.ElCard;
        __VLS_components.elCard;
        // @ts-ignore
        [ElCard, ElCard,];
        const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({ ...{ class: ("panel-card") }, shadow: ("hover"), }));
        const __VLS_76 = __VLS_75({ ...{ class: ("panel-card") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        ({}({ ...{ class: ("panel-card") }, shadow: ("hover"), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_79.slots).header;
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("panel-head") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("panel-kicker") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
            const __VLS_80 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({ ...{ 'onClick': {} }, text: (true), }));
            const __VLS_82 = __VLS_81({ ...{ 'onClick': {} }, text: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            ({}({ ...{ 'onClick': {} }, text: (true), }));
            let __VLS_86;
            const __VLS_87 = {
                onClick: (__VLS_ctx.loadPointRecords)
            };
            // @ts-ignore
            [loadPointRecords,];
            (__VLS_85.slots).default;
            const __VLS_85 = __VLS_pickFunctionalComponentCtx(__VLS_80, __VLS_82);
            let __VLS_83;
            let __VLS_84;
        }
        if (__VLS_ctx.authStore.pointsSummary) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("points-summary") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("points-balance") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            // @ts-ignore
            [authStore,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            (__VLS_ctx.authStore.pointsBalance);
            // @ts-ignore
            [authStore,];
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("privilege-list") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("privilege-label") }, });
            for (const [privilege] of __VLS_getVForSourceType((__VLS_ctx.authStore.pointsSummary.privileges))) {
                const __VLS_88 = {}.ElTag;
                ({}.ElTag);
                ({}.ElTag);
                __VLS_components.ElTag;
                __VLS_components.elTag;
                __VLS_components.ElTag;
                __VLS_components.elTag;
                // @ts-ignore
                [ElTag, ElTag,];
                const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({ key: ((privilege.privilegeKey)), effect: ("plain"), type: ("success"), }));
                const __VLS_90 = __VLS_89({ key: ((privilege.privilegeKey)), effect: ("plain"), type: ("success"), }, ...__VLS_functionalComponentArgsRest(__VLS_89));
                ({}({ key: ((privilege.privilegeKey)), effect: ("plain"), type: ("success"), }));
                (privilege.privilegeKey);
                // @ts-ignore
                [authStore,];
                (__VLS_93.slots).default;
                const __VLS_93 = __VLS_pickFunctionalComponentCtx(__VLS_88, __VLS_90);
            }
            if (!__VLS_ctx.authStore.pointsSummary.privileges.length) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("empty-inline") }, });
                // @ts-ignore
                [authStore,];
            }
        }
        if (__VLS_ctx.recordLoading) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("panel-loading") }, });
            const __VLS_94 = {}.ElSkeleton;
            ({}.ElSkeleton);
            __VLS_components.ElSkeleton;
            __VLS_components.elSkeleton;
            // @ts-ignore
            [ElSkeleton,];
            const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({ rows: ((4)), animated: (true), }));
            const __VLS_96 = __VLS_95({ rows: ((4)), animated: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_95));
            ({}({ rows: ((4)), animated: (true), }));
            // @ts-ignore
            [recordLoading,];
            const __VLS_99 = __VLS_pickFunctionalComponentCtx(__VLS_94, __VLS_96);
        }
        else if (__VLS_ctx.recordError) {
            const __VLS_100 = {}.ElResult;
            ({}.ElResult);
            ({}.ElResult);
            __VLS_components.ElResult;
            __VLS_components.elResult;
            __VLS_components.ElResult;
            __VLS_components.elResult;
            // @ts-ignore
            [ElResult, ElResult,];
            const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({ icon: ("warning"), title: ("积分记录加载失败"), subTitle: ((__VLS_ctx.recordError)), }));
            const __VLS_102 = __VLS_101({ icon: ("warning"), title: ("积分记录加载失败"), subTitle: ((__VLS_ctx.recordError)), }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            ({}({ icon: ("warning"), title: ("积分记录加载失败"), subTitle: ((__VLS_ctx.recordError)), }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
            {
                (__VLS_105.slots).extra;
                const __VLS_106 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({ ...{ 'onClick': {} }, }));
                const __VLS_108 = __VLS_107({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                ({}({ ...{ 'onClick': {} }, }));
                let __VLS_112;
                const __VLS_113 = {
                    onClick: (__VLS_ctx.loadPointRecords)
                };
                // @ts-ignore
                [loadPointRecords, recordError, recordError,];
                (__VLS_111.slots).default;
                const __VLS_111 = __VLS_pickFunctionalComponentCtx(__VLS_106, __VLS_108);
                let __VLS_109;
                let __VLS_110;
            }
            const __VLS_105 = __VLS_pickFunctionalComponentCtx(__VLS_100, __VLS_102);
        }
        else if (!__VLS_ctx.pointRecords.length) {
            const __VLS_114 = {}.ElEmpty;
            ({}.ElEmpty);
            __VLS_components.ElEmpty;
            __VLS_components.elEmpty;
            // @ts-ignore
            [ElEmpty,];
            const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ description: ("暂无积分记录"), }));
            const __VLS_116 = __VLS_115({ description: ("暂无积分记录"), }, ...__VLS_functionalComponentArgsRest(__VLS_115));
            ({}({ description: ("暂无积分记录"), }));
            // @ts-ignore
            [pointRecords,];
            const __VLS_119 = __VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116);
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("record-list") }, });
            for (const [record] of __VLS_getVForSourceType((__VLS_ctx.pointRecords))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((record.id)), ...{ class: ("record-item") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
                (record.description || record.source);
                // @ts-ignore
                [pointRecords,];
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
                (__VLS_ctx.formatDate(record.createdAt));
                // @ts-ignore
                [formatDate,];
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("record-side") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({ ...{ class: ((record.change >= 0 ? 'record-positive' : 'record-negative')) }, });
                __VLS_styleScopedClasses = (record.change >= 0 ? 'record-positive' : 'record-negative');
                (record.change >= 0 ? `+${record.change}` : record.change);
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (record.balanceAfter);
            }
        }
        const __VLS_79 = __VLS_pickFunctionalComponentCtx(__VLS_74, __VLS_76);
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['center-page'];
        __VLS_styleScopedClasses['center-main'];
        __VLS_styleScopedClasses['center-hero'];
        __VLS_styleScopedClasses['identity-card'];
        __VLS_styleScopedClasses['identity-avatar'];
        __VLS_styleScopedClasses['eyebrow'];
        __VLS_styleScopedClasses['sub-copy'];
        __VLS_styleScopedClasses['hero-actions'];
        __VLS_styleScopedClasses['check-in-hint'];
        __VLS_styleScopedClasses['state-panel'];
        __VLS_styleScopedClasses['summary-grid'];
        __VLS_styleScopedClasses['summary-card'];
        __VLS_styleScopedClasses['summary-card'];
        __VLS_styleScopedClasses['summary-card'];
        __VLS_styleScopedClasses['content-grid'];
        __VLS_styleScopedClasses['panel-card'];
        __VLS_styleScopedClasses['panel-head'];
        __VLS_styleScopedClasses['panel-kicker'];
        __VLS_styleScopedClasses['panel-loading'];
        __VLS_styleScopedClasses['favorite-list'];
        __VLS_styleScopedClasses['favorite-item'];
        __VLS_styleScopedClasses['favorite-cover'];
        __VLS_styleScopedClasses['favorite-cover--placeholder'];
        __VLS_styleScopedClasses['favorite-body'];
        __VLS_styleScopedClasses['favorite-meta'];
        __VLS_styleScopedClasses['panel-card'];
        __VLS_styleScopedClasses['panel-head'];
        __VLS_styleScopedClasses['panel-kicker'];
        __VLS_styleScopedClasses['points-summary'];
        __VLS_styleScopedClasses['points-balance'];
        __VLS_styleScopedClasses['privilege-list'];
        __VLS_styleScopedClasses['privilege-label'];
        __VLS_styleScopedClasses['empty-inline'];
        __VLS_styleScopedClasses['panel-loading'];
        __VLS_styleScopedClasses['record-list'];
        __VLS_styleScopedClasses['record-item'];
        __VLS_styleScopedClasses['record-side'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                authStore: authStore,
                favoriteArticles: favoriteArticles,
                pointRecords: pointRecords,
                favoriteLoading: favoriteLoading,
                recordLoading: recordLoading,
                checkInLoading: checkInLoading,
                favoriteError: favoriteError,
                recordError: recordError,
                checkInCompleted: checkInCompleted,
                loadFavorites: loadFavorites,
                loadPointRecords: loadPointRecords,
                handleCheckIn: handleCheckIn,
                goToLogin: goToLogin,
                goToArticle: goToArticle,
                formatDate: formatDate,
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
