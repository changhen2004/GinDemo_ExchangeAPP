/* __placeholder__ */
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getArticleDetail, getArticleLikes, likeArticle } from '../api/article';
import { createComment, deleteComment, listComments } from '../api/comment';
import { unlockArticle } from '../api/points';
import { useAuthStore } from '../store/auth';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const resource = ref(null);
const likes = ref(0);
const loading = ref(false);
const unlocking = ref(false);
const errorMessage = ref('');
const comments = ref([]);
const commentForm = ref('');
const commentLoading = ref(false);
const commentSubmitting = ref(false);
const deletingCommentId = ref(null);
const commentErrorMessage = ref('');
const resourceID = String(route.params.id);
const shouldShowUnlockButton = computed(() => {
    if (!resource.value) {
        return false;
    }
    return !!authStore.isAuthenticated && !resource.value.isFree && !resource.value.isUnlocked;
});
const gateState = computed(() => {
    if (!resource.value) {
        return {
            label: '资源状态未知',
            description: '请稍后重试。',
            className: 'gate-status--muted',
        };
    }
    if (resource.value.isFree) {
        return {
            label: '免费阅读',
            description: '这是公开资源，所有用户都可以直接浏览。',
            className: 'gate-status--free',
        };
    }
    if (resource.value.isUnlocked) {
        return {
            label: '已解锁',
            description: '你已获得访问权限，可继续查看全部资源内容。',
            className: 'gate-status--unlocked',
        };
    }
    if (!authStore.isAuthenticated) {
        return {
            label: '登录后解锁',
            description: `该资源需要 ${resource.value.requiredPoints || 0} 积分，登录后可查看是否满足条件。`,
            className: 'gate-status--locked',
        };
    }
    return {
        label: '需要积分解锁',
        description: `当前资源访问门槛为 ${resource.value.requiredPoints || 0} 积分，解锁后不会重复扣分。`,
        className: 'gate-status--locked',
    };
});
const fetchResource = async () => {
    resource.value = await getArticleDetail(resourceID);
};
const fetchLikes = async () => {
    const response = await getArticleLikes(resourceID);
    likes.value = response.likes;
};
const fetchComments = async () => {
    commentLoading.value = true;
    commentErrorMessage.value = '';
    try {
        comments.value = await listComments(resourceID);
    }
    catch (error) {
        console.error('Failed to load comments:', error);
        commentErrorMessage.value = '评论列表加载失败，请稍后重试。';
    }
    finally {
        commentLoading.value = false;
    }
};
const fetchPageData = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        await Promise.all([fetchResource(), fetchLikes(), fetchComments()]);
    }
    catch (error) {
        console.error('Failed to load resource detail:', error);
        errorMessage.value = '详情内容加载失败，请稍后重试。';
    }
    finally {
        loading.value = false;
    }
};
const handleCreateComment = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再评论');
        return;
    }
    const content = commentForm.value.trim();
    if (!content) {
        ElMessage.error('评论内容不能为空');
        return;
    }
    commentSubmitting.value = true;
    try {
        await createComment(resourceID, { content });
        commentForm.value = '';
        await Promise.all([fetchComments(), fetchResource()]);
        ElMessage.success('评论发布成功');
    }
    catch (error) {
        console.error('Failed to create comment:', error);
        ElMessage.error('评论发布失败，请稍后再试。');
    }
    finally {
        commentSubmitting.value = false;
    }
};
const canDeleteComment = (userId) => authStore.currentUser?.userID === userId;
const handleDeleteComment = async (commentId) => {
    deletingCommentId.value = commentId;
    try {
        await deleteComment(commentId);
        await Promise.all([fetchComments(), fetchResource()]);
        ElMessage.success('评论已删除');
    }
    catch (error) {
        console.error('Failed to delete comment:', error);
        ElMessage.error('删除评论失败，请稍后再试。');
    }
    finally {
        deletingCommentId.value = null;
    }
};
const handleLikeResource = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录后再点赞');
        return;
    }
    try {
        const response = await likeArticle(resourceID);
        likes.value = response.likes;
    }
    catch (error) {
        console.error('Error liking resource:', error);
        ElMessage.error('点赞失败，请稍后再试。');
    }
};
const handleUnlock = async () => {
    if (!resource.value || !authStore.isAuthenticated) {
        return;
    }
    unlocking.value = true;
    try {
        const response = await unlockArticle(resourceID);
        await authStore.refreshSummary();
        await fetchResource();
        ElMessage.success(response.message || '资源解锁成功');
    }
    catch (error) {
        console.error('Error unlocking resource:', error);
        ElMessage.error('解锁失败，请确认积分是否充足。');
    }
    finally {
        unlocking.value = false;
    }
};
const redirectToLogin = () => {
    router.push({ name: 'Login' });
};
const formatDate = (value) => new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});
onMounted(fetchPageData);
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("detail-page") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("detail-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("detail-page") }, }));
    const __VLS_6 = {}.ElMain;
    ({}.ElMain);
    ({}.ElMain);
    __VLS_components.ElMain;
    __VLS_components.elMain;
    __VLS_components.ElMain;
    __VLS_components.elMain;
    // @ts-ignore
    [ElMain, ElMain,];
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ class: ("detail-main") }, }));
    const __VLS_8 = __VLS_7({ ...{ class: ("detail-main") }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ ...{ class: ("detail-main") }, }));
    if (__VLS_ctx.loading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("detail-skeleton") }, });
        const __VLS_12 = {}.ElSkeleton;
        ({}.ElSkeleton);
        ({}.ElSkeleton);
        __VLS_components.ElSkeleton;
        __VLS_components.elSkeleton;
        __VLS_components.ElSkeleton;
        __VLS_components.elSkeleton;
        // @ts-ignore
        [ElSkeleton, ElSkeleton,];
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ animated: (true), }));
        const __VLS_14 = __VLS_13({ animated: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({ animated: (true), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_17.slots).template;
            const __VLS_18 = {}.ElSkeletonItem;
            ({}.ElSkeletonItem);
            __VLS_components.ElSkeletonItem;
            __VLS_components.elSkeletonItem;
            // @ts-ignore
            [ElSkeletonItem,];
            const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ variant: ("image"), ...{ style: ({}) }, }));
            const __VLS_20 = __VLS_19({ variant: ("image"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            ({}({ variant: ("image"), ...{ style: ({}) }, }));
            // @ts-ignore
            [loading,];
            const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("skeleton-stack") }, });
            const __VLS_24 = {}.ElSkeletonItem;
            ({}.ElSkeletonItem);
            __VLS_components.ElSkeletonItem;
            __VLS_components.elSkeletonItem;
            // @ts-ignore
            [ElSkeletonItem,];
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ variant: ("h1"), ...{ style: ({}) }, }));
            const __VLS_26 = __VLS_25({ variant: ("h1"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            ({}({ variant: ("h1"), ...{ style: ({}) }, }));
            const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
            const __VLS_30 = {}.ElSkeletonItem;
            ({}.ElSkeletonItem);
            __VLS_components.ElSkeletonItem;
            __VLS_components.elSkeletonItem;
            // @ts-ignore
            [ElSkeletonItem,];
            const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_32 = __VLS_31({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            ({}({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
            const __VLS_36 = {}.ElSkeletonItem;
            ({}.ElSkeletonItem);
            __VLS_components.ElSkeletonItem;
            __VLS_components.elSkeletonItem;
            // @ts-ignore
            [ElSkeletonItem,];
            const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_38 = __VLS_37({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            ({}({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_41 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
            const __VLS_42 = {}.ElSkeletonItem;
            ({}.ElSkeletonItem);
            __VLS_components.ElSkeletonItem;
            __VLS_components.elSkeletonItem;
            // @ts-ignore
            [ElSkeletonItem,];
            const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_44 = __VLS_43({ variant: ("text"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_43));
            ({}({ variant: ("text"), ...{ style: ({}) }, }));
            const __VLS_47 = __VLS_pickFunctionalComponentCtx(__VLS_42, __VLS_44);
        }
        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
    }
    else if (__VLS_ctx.errorMessage) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel") }, });
        const __VLS_48 = {}.ElResult;
        ({}.ElResult);
        ({}.ElResult);
        __VLS_components.ElResult;
        __VLS_components.elResult;
        __VLS_components.ElResult;
        __VLS_components.elResult;
        // @ts-ignore
        [ElResult, ElResult,];
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ icon: ("warning"), title: ("资源加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }));
        const __VLS_50 = __VLS_49({ icon: ("warning"), title: ("资源加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        ({}({ icon: ("warning"), title: ("资源加载失败"), subTitle: ((__VLS_ctx.errorMessage)), }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
        {
            (__VLS_53.slots).extra;
            const __VLS_54 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ ...{ 'onClick': {} }, type: ("primary"), }));
            const __VLS_56 = __VLS_55({ ...{ 'onClick': {} }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), }));
            let __VLS_60;
            const __VLS_61 = {
                onClick: (__VLS_ctx.fetchPageData)
            };
            // @ts-ignore
            [errorMessage, errorMessage, fetchPageData,];
            (__VLS_59.slots).default;
            const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56);
            let __VLS_57;
            let __VLS_58;
        }
        const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50);
    }
    else if (__VLS_ctx.resource) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("detail-layout") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({ ...{ class: ("detail-content") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("detail-hero") }, });
        if (__VLS_ctx.resource.coverUrl) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.resource.coverUrl)), alt: ((__VLS_ctx.resource.title)), ...{ class: ("detail-cover") }, });
            // @ts-ignore
            [resource, resource, resource, resource,];
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("detail-cover detail-cover--placeholder") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.resource.title.slice(0, 1));
            // @ts-ignore
            [resource,];
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hero-overlay") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hero-meta") }, });
        const __VLS_62 = {}.ElTag;
        ({}.ElTag);
        ({}.ElTag);
        __VLS_components.ElTag;
        __VLS_components.elTag;
        __VLS_components.ElTag;
        __VLS_components.elTag;
        // @ts-ignore
        [ElTag, ElTag,];
        const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ effect: ("dark"), type: ("warning"), }));
        const __VLS_64 = __VLS_63({ effect: ("dark"), type: ("warning"), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        ({}({ effect: ("dark"), type: ("warning"), }));
        (__VLS_ctx.resource.status || 'published');
        // @ts-ignore
        [resource,];
        (__VLS_67.slots).default;
        const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64);
        const __VLS_68 = {}.ElTag;
        ({}.ElTag);
        ({}.ElTag);
        __VLS_components.ElTag;
        __VLS_components.elTag;
        __VLS_components.ElTag;
        __VLS_components.elTag;
        // @ts-ignore
        [ElTag, ElTag,];
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({ effect: ("dark"), type: ((__VLS_ctx.resource.isFree ? 'success' : 'danger')), }));
        const __VLS_70 = __VLS_69({ effect: ("dark"), type: ((__VLS_ctx.resource.isFree ? 'success' : 'danger')), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        ({}({ effect: ("dark"), type: ((__VLS_ctx.resource.isFree ? 'success' : 'danger')), }));
        (__VLS_ctx.resource.isFree ? '免费资源' : `${__VLS_ctx.resource.requiredPoints || 0} 积分解锁`);
        // @ts-ignore
        [resource, resource, resource,];
        (__VLS_73.slots).default;
        const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70);
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
        (__VLS_ctx.resource.title);
        // @ts-ignore
        [resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("hero-preview") }, });
        (__VLS_ctx.resource.preview);
        // @ts-ignore
        [resource,];
        if (__VLS_ctx.resource.tags?.length) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("hero-tags") }, });
            for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.resource.tags))) {
                const __VLS_74 = {}.ElTag;
                ({}.ElTag);
                ({}.ElTag);
                __VLS_components.ElTag;
                __VLS_components.elTag;
                __VLS_components.ElTag;
                __VLS_components.elTag;
                // @ts-ignore
                [ElTag, ElTag,];
                const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({ key: ((tag)), effect: ("plain"), type: ("info"), ...{ class: ("hero-tag") }, }));
                const __VLS_76 = __VLS_75({ key: ((tag)), effect: ("plain"), type: ("info"), ...{ class: ("hero-tag") }, }, ...__VLS_functionalComponentArgsRest(__VLS_75));
                ({}({ key: ((tag)), effect: ("plain"), type: ("info"), ...{ class: ("hero-tag") }, }));
                (tag);
                // @ts-ignore
                [resource, resource,];
                (__VLS_79.slots).default;
                const __VLS_79 = __VLS_pickFunctionalComponentCtx(__VLS_74, __VLS_76);
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("author-strip") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("author-card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("author-avatar") }, });
        (__VLS_ctx.resource.author?.username?.slice(0, 1) || 'U');
        // @ts-ignore
        [resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("author-label") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.resource.author?.username || '匿名作者');
        // @ts-ignore
        [resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("author-extra") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.resource.author?.id || __VLS_ctx.resource.authorId);
        // @ts-ignore
        [resource, resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.resource.isFree ? '公开可读' : '积分门槛');
        // @ts-ignore
        [resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("content-body") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("body-copy") }, });
        (__VLS_ctx.resource.content);
        // @ts-ignore
        [resource,];
        if (__VLS_ctx.resource.contentImages?.length) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("content-gallery") }, });
            for (const [image, index] of __VLS_getVForSourceType((__VLS_ctx.resource.contentImages))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ key: ((`${image}-${index}`)), src: ((image)), alt: ((`${__VLS_ctx.resource.title} 配图 ${index + 1}`)), });
                // @ts-ignore
                [resource, resource, resource,];
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("comment-panel") }, });
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
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({ ...{ 'onClick': {} }, text: (true), loading: ((__VLS_ctx.commentLoading)), }));
        const __VLS_82 = __VLS_81({ ...{ 'onClick': {} }, text: (true), loading: ((__VLS_ctx.commentLoading)), }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        ({}({ ...{ 'onClick': {} }, text: (true), loading: ((__VLS_ctx.commentLoading)), }));
        let __VLS_86;
        const __VLS_87 = {
            onClick: (__VLS_ctx.fetchComments)
        };
        // @ts-ignore
        [commentLoading, fetchComments,];
        (__VLS_85.slots).default;
        const __VLS_85 = __VLS_pickFunctionalComponentCtx(__VLS_80, __VLS_82);
        let __VLS_83;
        let __VLS_84;
        if (__VLS_ctx.authStore.isAuthenticated) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-editor") }, });
            const __VLS_88 = {}.ElInput;
            ({}.ElInput);
            __VLS_components.ElInput;
            __VLS_components.elInput;
            // @ts-ignore
            [ElInput,];
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({ modelValue: ((__VLS_ctx.commentForm)), type: ("textarea"), rows: ((4)), maxlength: ("1000"), showWordLimit: (true), placeholder: ("写下你的评论，分享你对这个资源的看法。"), }));
            const __VLS_90 = __VLS_89({ modelValue: ((__VLS_ctx.commentForm)), type: ("textarea"), rows: ((4)), maxlength: ("1000"), showWordLimit: (true), placeholder: ("写下你的评论，分享你对这个资源的看法。"), }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            ({}({ modelValue: ((__VLS_ctx.commentForm)), type: ("textarea"), rows: ((4)), maxlength: ("1000"), showWordLimit: (true), placeholder: ("写下你的评论，分享你对这个资源的看法。"), }));
            // @ts-ignore
            [authStore, commentForm,];
            const __VLS_93 = __VLS_pickFunctionalComponentCtx(__VLS_88, __VLS_90);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-editor__actions") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("comment-editor__hint") }, });
            const __VLS_94 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.commentSubmitting)), disabled: ((!__VLS_ctx.commentForm.trim())), }));
            const __VLS_96 = __VLS_95({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.commentSubmitting)), disabled: ((!__VLS_ctx.commentForm.trim())), }, ...__VLS_functionalComponentArgsRest(__VLS_95));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), loading: ((__VLS_ctx.commentSubmitting)), disabled: ((!__VLS_ctx.commentForm.trim())), }));
            let __VLS_100;
            const __VLS_101 = {
                onClick: (__VLS_ctx.handleCreateComment)
            };
            // @ts-ignore
            [commentForm, commentSubmitting, handleCreateComment,];
            (__VLS_99.slots).default;
            const __VLS_99 = __VLS_pickFunctionalComponentCtx(__VLS_94, __VLS_96);
            let __VLS_97;
            let __VLS_98;
        }
        else {
            const __VLS_102 = {}.ElAlert;
            ({}.ElAlert);
            __VLS_components.ElAlert;
            __VLS_components.elAlert;
            // @ts-ignore
            [ElAlert,];
            const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ type: ("info"), closable: ((false)), showIcon: (true), title: ("登录后可以发表评论并参与互动"), }));
            const __VLS_104 = __VLS_103({ type: ("info"), closable: ((false)), showIcon: (true), title: ("登录后可以发表评论并参与互动"), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
            ({}({ type: ("info"), closable: ((false)), showIcon: (true), title: ("登录后可以发表评论并参与互动"), }));
            const __VLS_107 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
        }
        if (__VLS_ctx.commentLoading) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-loading") }, });
            const __VLS_108 = {}.ElSkeleton;
            ({}.ElSkeleton);
            __VLS_components.ElSkeleton;
            __VLS_components.elSkeleton;
            // @ts-ignore
            [ElSkeleton,];
            const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({ rows: ((3)), animated: (true), }));
            const __VLS_110 = __VLS_109({ rows: ((3)), animated: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
            ({}({ rows: ((3)), animated: (true), }));
            // @ts-ignore
            [commentLoading,];
            const __VLS_113 = __VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110);
        }
        else if (__VLS_ctx.commentErrorMessage) {
            const __VLS_114 = {}.ElResult;
            ({}.ElResult);
            ({}.ElResult);
            __VLS_components.ElResult;
            __VLS_components.elResult;
            __VLS_components.ElResult;
            __VLS_components.elResult;
            // @ts-ignore
            [ElResult, ElResult,];
            const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ icon: ("warning"), title: ("评论加载失败"), subTitle: ((__VLS_ctx.commentErrorMessage)), }));
            const __VLS_116 = __VLS_115({ icon: ("warning"), title: ("评论加载失败"), subTitle: ((__VLS_ctx.commentErrorMessage)), }, ...__VLS_functionalComponentArgsRest(__VLS_115));
            ({}({ icon: ("warning"), title: ("评论加载失败"), subTitle: ((__VLS_ctx.commentErrorMessage)), }));
            __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
            {
                (__VLS_119.slots).extra;
                const __VLS_120 = {}.ElButton;
                ({}.ElButton);
                ({}.ElButton);
                __VLS_components.ElButton;
                __VLS_components.elButton;
                __VLS_components.ElButton;
                __VLS_components.elButton;
                // @ts-ignore
                [ElButton, ElButton,];
                const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({ ...{ 'onClick': {} }, }));
                const __VLS_122 = __VLS_121({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_121));
                ({}({ ...{ 'onClick': {} }, }));
                let __VLS_126;
                const __VLS_127 = {
                    onClick: (__VLS_ctx.fetchComments)
                };
                // @ts-ignore
                [fetchComments, commentErrorMessage, commentErrorMessage,];
                (__VLS_125.slots).default;
                const __VLS_125 = __VLS_pickFunctionalComponentCtx(__VLS_120, __VLS_122);
                let __VLS_123;
                let __VLS_124;
            }
            const __VLS_119 = __VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116);
        }
        else if (!__VLS_ctx.comments.length) {
            const __VLS_128 = {}.ElEmpty;
            ({}.ElEmpty);
            __VLS_components.ElEmpty;
            __VLS_components.elEmpty;
            // @ts-ignore
            [ElEmpty,];
            const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({ description: ("还没有评论，来发表第一条观点"), }));
            const __VLS_130 = __VLS_129({ description: ("还没有评论，来发表第一条观点"), }, ...__VLS_functionalComponentArgsRest(__VLS_129));
            ({}({ description: ("还没有评论，来发表第一条观点"), }));
            // @ts-ignore
            [comments,];
            const __VLS_133 = __VLS_pickFunctionalComponentCtx(__VLS_128, __VLS_130);
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-list") }, });
            for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({ key: ((comment.id)), ...{ class: ("comment-item") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("comment-item__head") }, });
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                (comment.author.username);
                // @ts-ignore
                [comments,];
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("comment-item__time") }, });
                (__VLS_ctx.formatDate(comment.createdAt));
                // @ts-ignore
                [formatDate,];
                if (__VLS_ctx.canDeleteComment(comment.userId)) {
                    const __VLS_134 = {}.ElButton;
                    ({}.ElButton);
                    ({}.ElButton);
                    __VLS_components.ElButton;
                    __VLS_components.elButton;
                    __VLS_components.ElButton;
                    __VLS_components.elButton;
                    // @ts-ignore
                    [ElButton, ElButton,];
                    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({ ...{ 'onClick': {} }, text: (true), type: ("danger"), loading: ((__VLS_ctx.deletingCommentId === comment.id)), }));
                    const __VLS_136 = __VLS_135({ ...{ 'onClick': {} }, text: (true), type: ("danger"), loading: ((__VLS_ctx.deletingCommentId === comment.id)), }, ...__VLS_functionalComponentArgsRest(__VLS_135));
                    ({}({ ...{ 'onClick': {} }, text: (true), type: ("danger"), loading: ((__VLS_ctx.deletingCommentId === comment.id)), }));
                    let __VLS_140;
                    const __VLS_141 = {
                        onClick: (...[$event]) => {
                            if (!(!((__VLS_ctx.loading))))
                                return;
                            if (!(!((__VLS_ctx.errorMessage))))
                                return;
                            if (!((__VLS_ctx.resource)))
                                return;
                            if (!(!((__VLS_ctx.commentLoading))))
                                return;
                            if (!(!((__VLS_ctx.commentErrorMessage))))
                                return;
                            if (!(!((!__VLS_ctx.comments.length))))
                                return;
                            if (!((__VLS_ctx.canDeleteComment(comment.userId))))
                                return;
                            __VLS_ctx.handleDeleteComment(comment.id);
                            // @ts-ignore
                            [canDeleteComment, deletingCommentId, handleDeleteComment,];
                        }
                    };
                    (__VLS_139.slots).default;
                    const __VLS_139 = __VLS_pickFunctionalComponentCtx(__VLS_134, __VLS_136);
                    let __VLS_137;
                    let __VLS_138;
                }
                __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("comment-item__content") }, });
                (comment.content);
            }
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({ ...{ class: ("detail-sidebar") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("panel panel--sticky") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("gate-status") }, ...{ class: ((__VLS_ctx.gateState.className)) }, });
        __VLS_styleScopedClasses = (gateState.className);
        (__VLS_ctx.gateState.label);
        // @ts-ignore
        [gateState, gateState,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("gate-copy") }, });
        (__VLS_ctx.gateState.description);
        // @ts-ignore
        [gateState,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("points-card") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.authStore.pointsBalance);
        // @ts-ignore
        [authStore,];
        if (__VLS_ctx.shouldShowUnlockButton) {
            const __VLS_142 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("unlock-button") }, loading: ((__VLS_ctx.unlocking)), }));
            const __VLS_144 = __VLS_143({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("unlock-button") }, loading: ((__VLS_ctx.unlocking)), }, ...__VLS_functionalComponentArgsRest(__VLS_143));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("unlock-button") }, loading: ((__VLS_ctx.unlocking)), }));
            let __VLS_148;
            const __VLS_149 = {
                onClick: (__VLS_ctx.handleUnlock)
            };
            (__VLS_ctx.resource.requiredPoints || 0);
            // @ts-ignore
            [resource, shouldShowUnlockButton, unlocking, handleUnlock,];
            (__VLS_147.slots).default;
            const __VLS_147 = __VLS_pickFunctionalComponentCtx(__VLS_142, __VLS_144);
            let __VLS_145;
            let __VLS_146;
        }
        else if (!__VLS_ctx.authStore.isAuthenticated) {
            const __VLS_150 = {}.ElButton;
            ({}.ElButton);
            ({}.ElButton);
            __VLS_components.ElButton;
            __VLS_components.elButton;
            __VLS_components.ElButton;
            __VLS_components.elButton;
            // @ts-ignore
            [ElButton, ElButton,];
            const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({ ...{ 'onClick': {} }, ...{ class: ("unlock-button") }, }));
            const __VLS_152 = __VLS_151({ ...{ 'onClick': {} }, ...{ class: ("unlock-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            ({}({ ...{ 'onClick': {} }, ...{ class: ("unlock-button") }, }));
            let __VLS_156;
            const __VLS_157 = {
                onClick: (__VLS_ctx.redirectToLogin)
            };
            // @ts-ignore
            [authStore, redirectToLogin,];
            (__VLS_155.slots).default;
            const __VLS_155 = __VLS_pickFunctionalComponentCtx(__VLS_150, __VLS_152);
            let __VLS_153;
            let __VLS_154;
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("panel") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stats-grid") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.likes);
        // @ts-ignore
        [likes,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.resource.stats?.viewCount ?? __VLS_ctx.resource.viewCount ?? 0);
        // @ts-ignore
        [resource, resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.resource.stats?.commentCount ?? __VLS_ctx.resource.commentCount ?? 0);
        // @ts-ignore
        [resource, resource,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stat-item") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.resource.stats?.favoriteCount ?? __VLS_ctx.resource.favoriteCount ?? 0);
        // @ts-ignore
        [resource, resource,];
        const __VLS_158 = {}.ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("action-button") }, }));
        const __VLS_160 = __VLS_159({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("action-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("action-button") }, }));
        let __VLS_164;
        const __VLS_165 = {
            onClick: (__VLS_ctx.handleLikeResource)
        };
        // @ts-ignore
        [handleLikeResource,];
        (__VLS_163.slots).default;
        const __VLS_163 = __VLS_pickFunctionalComponentCtx(__VLS_158, __VLS_160);
        let __VLS_161;
        let __VLS_162;
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({ ...{ class: ("state-panel") }, });
        const __VLS_166 = {}.ElEmpty;
        ({}.ElEmpty);
        __VLS_components.ElEmpty;
        __VLS_components.elEmpty;
        // @ts-ignore
        [ElEmpty,];
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({ description: ("资源不存在或暂时不可用"), }));
        const __VLS_168 = __VLS_167({ description: ("资源不存在或暂时不可用"), }, ...__VLS_functionalComponentArgsRest(__VLS_167));
        ({}({ description: ("资源不存在或暂时不可用"), }));
        const __VLS_171 = __VLS_pickFunctionalComponentCtx(__VLS_166, __VLS_168);
    }
    (__VLS_11.slots).default;
    const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
    (__VLS_5.slots).default;
    const __VLS_5 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['detail-page'];
        __VLS_styleScopedClasses['detail-main'];
        __VLS_styleScopedClasses['detail-skeleton'];
        __VLS_styleScopedClasses['skeleton-stack'];
        __VLS_styleScopedClasses['state-panel'];
        __VLS_styleScopedClasses['detail-layout'];
        __VLS_styleScopedClasses['detail-content'];
        __VLS_styleScopedClasses['detail-hero'];
        __VLS_styleScopedClasses['detail-cover'];
        __VLS_styleScopedClasses['detail-cover'];
        __VLS_styleScopedClasses['detail-cover--placeholder'];
        __VLS_styleScopedClasses['hero-overlay'];
        __VLS_styleScopedClasses['hero-meta'];
        __VLS_styleScopedClasses['hero-preview'];
        __VLS_styleScopedClasses['hero-tags'];
        __VLS_styleScopedClasses['hero-tag'];
        __VLS_styleScopedClasses['author-strip'];
        __VLS_styleScopedClasses['author-card'];
        __VLS_styleScopedClasses['author-avatar'];
        __VLS_styleScopedClasses['author-label'];
        __VLS_styleScopedClasses['author-extra'];
        __VLS_styleScopedClasses['content-body'];
        __VLS_styleScopedClasses['body-copy'];
        __VLS_styleScopedClasses['content-gallery'];
        __VLS_styleScopedClasses['comment-panel'];
        __VLS_styleScopedClasses['panel-head'];
        __VLS_styleScopedClasses['panel-kicker'];
        __VLS_styleScopedClasses['comment-editor'];
        __VLS_styleScopedClasses['comment-editor__actions'];
        __VLS_styleScopedClasses['comment-editor__hint'];
        __VLS_styleScopedClasses['comment-loading'];
        __VLS_styleScopedClasses['comment-list'];
        __VLS_styleScopedClasses['comment-item'];
        __VLS_styleScopedClasses['comment-item__head'];
        __VLS_styleScopedClasses['comment-item__time'];
        __VLS_styleScopedClasses['comment-item__content'];
        __VLS_styleScopedClasses['detail-sidebar'];
        __VLS_styleScopedClasses['panel'];
        __VLS_styleScopedClasses['panel--sticky'];
        __VLS_styleScopedClasses['gate-status'];
        __VLS_styleScopedClasses['gate-copy'];
        __VLS_styleScopedClasses['points-card'];
        __VLS_styleScopedClasses['unlock-button'];
        __VLS_styleScopedClasses['unlock-button'];
        __VLS_styleScopedClasses['panel'];
        __VLS_styleScopedClasses['stats-grid'];
        __VLS_styleScopedClasses['stat-item'];
        __VLS_styleScopedClasses['stat-item'];
        __VLS_styleScopedClasses['stat-item'];
        __VLS_styleScopedClasses['stat-item'];
        __VLS_styleScopedClasses['action-button'];
        __VLS_styleScopedClasses['state-panel'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                authStore: authStore,
                resource: resource,
                likes: likes,
                loading: loading,
                unlocking: unlocking,
                errorMessage: errorMessage,
                comments: comments,
                commentForm: commentForm,
                commentLoading: commentLoading,
                commentSubmitting: commentSubmitting,
                deletingCommentId: deletingCommentId,
                commentErrorMessage: commentErrorMessage,
                shouldShowUnlockButton: shouldShowUnlockButton,
                gateState: gateState,
                fetchComments: fetchComments,
                fetchPageData: fetchPageData,
                handleCreateComment: handleCreateComment,
                canDeleteComment: canDeleteComment,
                handleDeleteComment: handleDeleteComment,
                handleLikeResource: handleLikeResource,
                handleUnlock: handleUnlock,
                redirectToLogin: redirectToLogin,
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
