<template>
  <section class="catalog-shell">
    <div class="catalog-layout">
      <aside class="catalog-side">
        <section class="side-panel">
          <p class="side-kicker">当前筛选</p>
          <div class="side-summary">
            <article>
              <span>页码</span>
              <strong>{{ state.page }}</strong>
            </article>
            <article>
              <span>结果数</span>
              <strong>{{ resources.length }}</strong>
            </article>
          </div>

          <div class="active-filters">
            <button
              v-if="state.feed"
              type="button"
              class="active-filter"
              @click="navigateWithQuery({ feed: 'latest', page: 1 })"
            >
              {{ feedLabel }}
            </button>
            <button
              v-if="state.keyword"
              type="button"
              class="active-filter"
              @click="navigateWithQuery({ keyword: '', page: 1 })"
            >
              关键词: {{ state.keyword }}
            </button>
            <button
              v-if="state.tag"
              type="button"
              class="active-filter"
              @click="navigateWithQuery({ tag: '', page: 1 })"
            >
              标签: {{ state.tag }}
            </button>
          </div>
        </section>

        <section class="side-panel">
          <p class="side-kicker">标签导航</p>
          <div v-if="availableTags.length" class="side-tags">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              :class="['side-tag', { 'side-tag--active': state.tag === tag }]"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
          <p v-else class="side-empty">当前页还没有足够的标签样本</p>
        </section>
      </aside>

      <div class="catalog-main">
        <section class="catalog-hero">
          <div>
            <p class="catalog-kicker">RESOURCE CATALOG</p>
            <h1>用更清晰的分层卡片浏览资源广场</h1>
            <p class="catalog-copy">
              支持关键词搜索、标签筛选、最新发布和热度优先排序，并把筛选条件同步到 URL，方便从首页分区直接进入。
            </p>
          </div>
          <div class="catalog-hero__stats">
            <article>
              <span>排序方式</span>
              <strong>{{ feedLabel }}</strong>
            </article>
            <article>
              <span>每页数量</span>
              <strong>{{ state.pageSize }}</strong>
            </article>
          </div>
        </section>

        <section class="toolbar-panel">
          <div class="toolbar-top">
            <el-input
              v-model="draftKeyword"
              class="search-box"
              clearable
              :disabled="state.feed === 'following'"
              placeholder="搜索标题关键词"
              @keyup.enter="applyFilters"
            >
              <template #append>
                <el-button :disabled="state.feed === 'following'" @click="applyFilters">搜索</el-button>
              </template>
            </el-input>

            <el-segmented
              v-model="state.feed"
              :options="feedOptions"
              @change="onFeedChange"
            />
          </div>

          <div class="toolbar-bottom">
            <div class="filter-group">
              <span class="filter-label">标签筛选</span>
              <button
                type="button"
                :class="['filter-chip', { 'filter-chip--active': state.tag === '' }]"
                :disabled="state.feed === 'following'"
                @click="selectTag('')"
              >
                全部
              </button>
              <button
                v-for="tag in availableTags"
                :key="tag"
                type="button"
                :class="['filter-chip', { 'filter-chip--active': state.tag === tag }]"
                :disabled="state.feed === 'following'"
                @click="selectTag(tag)"
              >
                {{ tag }}
              </button>
            </div>

            <el-select
              v-model="state.pageSize"
              class="page-size-select"
              placeholder="每页数量"
              @change="onPageSizeChange"
            >
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="`${size} 条 / 页`"
                :value="size"
              />
            </el-select>
          </div>
        </section>

        <section v-if="loading" class="state-panel loading-grid">
          <el-skeleton v-for="index in skeletonCount" :key="index" animated class="loading-card">
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 220px" />
              <div class="loading-copy">
                <el-skeleton-item variant="h3" style="width: 54%" />
                <el-skeleton-item variant="text" style="width: 92%" />
                <el-skeleton-item variant="text" style="width: 82%" />
              </div>
            </template>
          </el-skeleton>
        </section>

        <section v-else-if="errorMessage" class="state-panel">
          <el-result icon="warning" title="加载失败" :sub-title="errorMessage">
            <template #extra>
              <el-button v-if="state.feed === 'following' && !authStore.isAuthenticated" type="primary" @click="goToLogin">
                去登录
              </el-button>
              <el-button v-else type="primary" @click="fetchResources">重新加载</el-button>
            </template>
          </el-result>
        </section>

        <section v-else-if="!resources.length" class="state-panel">
          <el-empty description="当前筛选条件下暂无内容">
            <el-button @click="resetFilters">重置筛选</el-button>
          </el-empty>
        </section>

        <section v-else class="resource-grid">
          <ResourceStoryCard
            v-for="resource in resources"
            :key="resource.id"
            :resource="resource"
            @tag="selectTag"
          />
        </section>

        <section class="pagination-bar">
          <el-button :disabled="state.page === 1 || loading" @click="changePage(state.page - 1)">
            上一页
          </el-button>
          <div class="page-indicator">
            <span>第 {{ state.page }} 页</span>
            <small v-if="!canGoNext">已到达最后一页</small>
          </div>
          <el-button
            :disabled="!canGoNext"
            @click="changePage(state.page + 1)"
          >
            下一页
          </el-button>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listArticles, listFollowingArticles } from '../api/article';
import ResourceStoryCard from '../components/ResourceStoryCard.vue';
import { useAuthStore } from '../store/auth';
import type { FollowingFeedCursor, ResourceSummary } from '../types/resource';

type FeedMode = 'latest' | 'following' | 'hot';

interface CatalogState {
  page: number;
  pageSize: number;
  feed: FeedMode;
  keyword: string;
  tag: string;
}

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const resources = ref<ResourceSummary[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const draftKeyword = ref('');
const followingCursors = ref<Record<number, FollowingFeedCursor | undefined>>({ 1: undefined });
const state = reactive<CatalogState>({
  page: 1,
  pageSize: 6,
  feed: 'latest',
  keyword: '',
  tag: '',
});

const feedOptions = [
  { label: '最新资源流', value: 'latest' },
  { label: '关注流', value: 'following' },
  { label: '热门资源流', value: 'hot' },
];

const pageSizeOptions = [6, 12, 18];

const availableTags = computed(() => {
  const tagSet = new Set<string>();
  resources.value.forEach((resource) => {
    resource.tags?.forEach((tag) => {
      const normalized = tag.trim();
      if (normalized) {
        tagSet.add(normalized);
      }
    });
  });
  return Array.from(tagSet);
});

const skeletonCount = computed(() => state.pageSize);

const feedLabel = computed(() => {
  if (state.feed === 'following') {
    return '关注流';
  }
  return state.feed === 'hot' ? '热门' : '最新';
});

const canGoNext = computed(() => {
  if (loading.value) {
    return false;
  }
  if (state.feed === 'following') {
    return !!followingCursors.value[state.page + 1];
  }
  return resources.value.length >= state.pageSize;
});

const parsePositiveNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeQuery = (query: Record<string, unknown>): CatalogState => {
  let feed: FeedMode = 'latest';
  if (query.feed === 'following') {
    feed = 'following';
  } else if (query.feed === 'hot' || query.sort === 'hot') {
    feed = 'hot';
  }
  return {
    page: feed === 'following' ? 1 : parsePositiveNumber(query.page, 1),
    pageSize: [6, 12, 18].includes(Number(query.pageSize))
      ? Number(query.pageSize)
      : 6,
    feed,
    keyword: feed === 'following' ? '' : typeof query.keyword === 'string' ? query.keyword : '',
    tag: feed === 'following' ? '' : typeof query.tag === 'string' ? query.tag : '',
  };
};

const buildRouteQuery = (nextState: CatalogState) => {
  return {
    ...(nextState.page > 1 ? { page: String(nextState.page) } : {}),
    ...(nextState.pageSize !== 6 ? { pageSize: String(nextState.pageSize) } : {}),
    ...(nextState.feed !== 'latest' ? { feed: nextState.feed } : {}),
    ...(nextState.keyword ? { keyword: nextState.keyword } : {}),
    ...(nextState.tag ? { tag: nextState.tag } : {}),
  };
};

const fetchResources = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    if (state.feed === 'following') {
      if (!authStore.isAuthenticated) {
        resources.value = [];
        errorMessage.value = '请先登录后查看你关注作者发布的资源。';
        return;
      }

      const cursor = followingCursors.value[state.page];
      const response = await listFollowingArticles({
        pageSize: state.pageSize,
        beforeCreatedAt: cursor?.beforeCreatedAt,
        beforeId: cursor?.beforeId,
      });
      resources.value = response.items;
      followingCursors.value[state.page + 1] = response.nextCursor;
      return;
    }

    resources.value = await listArticles({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.feed === 'hot' ? 'hot' : 'latest',
      keyword: state.keyword || undefined,
      tag: state.tag || undefined,
    });
  } catch (error) {
    console.error('Failed to load resources:', error);
    errorMessage.value = '资源列表加载失败，请稍后重试。';
  } finally {
    loading.value = false;
  }
};

const navigateWithQuery = (patch: Partial<CatalogState>) => {
  const nextState: CatalogState = {
    ...state,
    ...patch,
  };

  router.replace({
    name: 'Resources',
    query: buildRouteQuery(nextState),
  });
};

const applyFilters = () => {
  if (state.feed === 'following') {
    return;
  }
  navigateWithQuery({
    page: 1,
    keyword: draftKeyword.value.trim(),
  });
};

const resetFilters = () => {
  draftKeyword.value = '';
  followingCursors.value = { 1: undefined };
  router.replace({ name: 'Resources', query: {} });
};

const selectTag = (tag: string) => {
  if (state.feed === 'following') {
    return;
  }
  navigateWithQuery({
    page: 1,
    tag,
  });
};

const onFeedChange = () => {
  followingCursors.value = { 1: undefined };
  navigateWithQuery({
    page: 1,
    feed: state.feed,
    keyword: state.feed === 'following' ? '' : state.keyword,
    tag: state.feed === 'following' ? '' : state.tag,
  });
};

const onPageSizeChange = () => {
  followingCursors.value = { 1: undefined };
  navigateWithQuery({
    page: 1,
    pageSize: state.pageSize,
  });
};

const changePage = (page: number) => {
  if (page < 1 || loading.value) {
    return;
  }
  if (state.feed === 'following' && page > state.page && !followingCursors.value[page]) {
    return;
  }

  navigateWithQuery({ page });
};

const goToLogin = () => {
  router.push({ name: 'Login' });
};

watch(
  () => route.query,
  async (query) => {
    const normalized = normalizeQuery(query as Record<string, unknown>);
    state.page = normalized.page;
    state.pageSize = normalized.pageSize;
    state.feed = normalized.feed;
    state.keyword = normalized.keyword;
    state.tag = normalized.tag;
    draftKeyword.value = normalized.keyword;
    await fetchResources();
  },
  { immediate: true },
);
</script>

<style scoped>
.catalog-shell {
  padding: 28px 24px 64px;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
}

.catalog-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-panel,
.catalog-hero,
.toolbar-panel,
.state-panel {
  border: 1px solid rgba(56, 61, 64, 0.08);
  border-radius: 24px;
  background: rgba(251, 250, 245, 0.96);
  box-shadow: 0 8px 28px rgba(45, 51, 54, 0.06);
}

.catalog-hero,
.toolbar-panel,
.state-panel {
  contain: layout paint;
}

.side-panel {
  position: sticky;
  top: 108px;
  padding: 20px;
  contain: layout;
}

.side-kicker,
.catalog-kicker {
  margin: 0;
  color: #7c6843;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.side-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.side-summary article {
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f5efe0, #f8f6f0);
}

.side-summary span {
  display: block;
  color: #7a6b55;
  font-size: 12px;
}

.side-summary strong {
  display: block;
  margin-top: 10px;
  color: #152f35;
  font-size: 24px;
}

.active-filters,
.side-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.active-filter,
.side-tag,
.filter-chip {
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

.active-filter {
  padding: 8px 12px;
  background: #e7efee;
  color: #1b434a;
  font-size: 12px;
}

.side-tag,
.filter-chip {
  padding: 8px 14px;
  background: #eef3f2;
  color: #224b53;
  font-size: 13px;
}

.side-tag--active,
.filter-chip--active {
  background: #183f44;
  color: #f7f4eb;
}

.side-empty {
  margin: 14px 0 0;
  color: #6a757a;
  line-height: 1.7;
}

.catalog-main {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.catalog-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(240px, 0.7fr);
  gap: 20px;
  align-items: end;
  padding: 26px;
}

.catalog-hero h1 {
  margin: 12px 0 0;
  color: #152f35;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.04;
}

.catalog-copy {
  max-width: 720px;
  margin: 18px 0 0;
  color: #5c696d;
  line-height: 1.8;
}

.catalog-hero__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.catalog-hero__stats article {
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f5efe0, #f8f6f0);
}

.catalog-hero__stats span {
  display: block;
  color: #7a6b55;
  font-size: 12px;
}

.catalog-hero__stats strong {
  display: block;
  margin-top: 10px;
  color: #152f35;
  font-size: 26px;
}

.toolbar-panel {
  padding: 20px;
}

.toolbar-top,
.toolbar-bottom {
  display: flex;
  gap: 18px;
  align-items: center;
}

.toolbar-bottom {
  margin-top: 18px;
  justify-content: space-between;
}

.search-box {
  flex: 1;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  color: #57666b;
  font-size: 13px;
  font-weight: 700;
}

.page-size-select {
  width: 140px;
}

.resource-grid,
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.loading-card {
  overflow: hidden;
  border-radius: 24px;
}

.loading-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 6px 0;
}

.page-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #4f5d63;
}

.page-indicator small {
  color: #8b7760;
}

@media (max-width: 1180px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .catalog-side {
    order: 2;
  }

  .side-panel {
    position: static;
  }

  .catalog-hero,
  .resource-grid,
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-hero > :first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .catalog-shell {
    padding: 18px 12px 40px;
  }

  .catalog-hero,
  .toolbar-panel,
  .state-panel,
  .side-panel {
    padding: 18px;
    border-radius: 20px;
  }

  .toolbar-top,
  .toolbar-bottom,
  .pagination-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .catalog-hero,
  .catalog-hero__stats,
  .resource-grid,
  .loading-grid {
    grid-template-columns: 1fr;
  }

  .page-size-select {
    width: 100%;
  }
}
</style>
