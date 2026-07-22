<template>
  <section class="harbor-shell">
    <div class="harbor-layout">
      <aside class="harbor-aside">
        <div class="aside-card">
          <p class="aside-kicker">快速导航</p>
          <a v-for="item in anchorLinks" :key="item.href" :href="item.href">{{ item.label }}</a>
        </div>

        <div class="aside-card aside-card--muted">
          <p class="aside-kicker">现有后端能力</p>
          <ul>
            <li>关键词搜索</li>
            <li>标签筛选</li>
            <li>最新 / 热门排序</li>
            <li>积分解锁与评论收藏</li>
          </ul>
        </div>
      </aside>

      <div class="harbor-main">
        <section id="overview" class="hero-panel">
          <div class="hero-copy">
            <p class="hero-kicker">RESOURCE HARBOR</p>
            <h1>把资源发布、积分解锁和互动沉淀组织成更清晰的内容首页</h1>
            <p class="hero-description">
              参考内容资源站的信息层级，把你现有的资源列表、热门流、标签入口和用户动作收拢到同一张首页里，重点仍然只使用当前后端已经提供的能力。
            </p>

            <div class="hero-actions">
              <el-button type="primary" size="large" @click="openResources({ sort: 'latest' })">
                进入资源广场
              </el-button>
              <el-button size="large" @click="openResources({ sort: 'hot' })">
                查看热门资源
              </el-button>
              <el-button
                size="large"
                plain
                :disabled="!authStore.isAuthenticated"
                @click="router.push({ name: 'CreateResource' })"
              >
                发布新资源
              </el-button>
            </div>

            <div class="stat-grid">
              <article class="stat-tile">
                <span>热门样本</span>
                <strong>{{ hotResources.length }}</strong>
              </article>
              <article class="stat-tile">
                <span>最新样本</span>
                <strong>{{ latestResources.length }}</strong>
              </article>
              <article class="stat-tile">
                <span>可读免费资源</span>
                <strong>{{ freeResources.length }}</strong>
              </article>
            </div>
          </div>

          <div class="hero-board">
            <div v-if="headlineResource" class="headline-card">
              <div class="headline-card__media">
                <img
                  v-if="headlineResource.coverUrl"
                  :src="headlineResource.coverUrl"
                  :alt="headlineResource.title"
                  loading="lazy"
                  decoding="async"
                />
                <div v-else class="headline-card__placeholder">
                  {{ headlineResource.title.slice(0, 1) }}
                </div>
              </div>
              <div class="headline-card__body">
                <span class="headline-card__label">今日主推</span>
                <h2>{{ headlineResource.title }}</h2>
                <p>{{ headlineResource.preview }}</p>
                <div class="headline-card__tags" v-if="headlineResource.tags?.length">
                  <button
                    v-for="tag in headlineResource.tags"
                    :key="tag"
                    type="button"
                    @click="openResources({ tag })"
                  >
                    {{ tag }}
                  </button>
                </div>
                <el-button type="primary" plain @click="openDetail(headlineResource.id)">
                  阅读详情
                </el-button>
              </div>
            </div>

            <div class="hero-mini-feed">
              <div class="hero-mini-feed__head">
                <span>正在流行</span>
                <button type="button" @click="openResources({ sort: 'hot' })">更多</button>
              </div>
              <article
                v-for="resource in hotResources.slice(0, 4)"
                :key="resource.id"
                class="hero-mini-feed__item"
                @click="openDetail(resource.id)"
              >
                <div>
                  <strong>{{ resource.title }}</strong>
                  <p>{{ resource.preview }}</p>
                </div>
                <span>{{ resource.likeCount ?? 0 }}</span>
              </article>
            </div>
          </div>
        </section>

        <section id="tags" class="section-panel">
          <div class="section-head">
            <div>
              <p class="section-kicker">Tag Navigation</p>
              <h2>标签分区</h2>
            </div>
            <el-button text @click="openResources()">进入全部资源</el-button>
          </div>

          <div v-if="topTags.length" class="tag-cloud">
            <button
              v-for="tag in topTags"
              :key="tag.name"
              type="button"
              class="tag-cloud__item"
              @click="openResources({ tag: tag.name })"
            >
              <strong>{{ tag.name }}</strong>
              <span>{{ tag.count }} 条</span>
            </button>
          </div>
          <el-empty v-else description="当前资源样本还没有形成明显标签分布" />
        </section>

        <section v-if="loading" class="section-panel">
          <div class="loading-grid">
            <el-skeleton v-for="index in 6" :key="index" animated class="loading-card">
              <template #template>
                <el-skeleton-item variant="image" style="width: 100%; height: 210px" />
                <div class="loading-copy">
                  <el-skeleton-item variant="h3" style="width: 54%" />
                  <el-skeleton-item variant="text" style="width: 94%" />
                  <el-skeleton-item variant="text" style="width: 82%" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </section>

        <section v-else-if="errorMessage && !latestResources.length && !hotResources.length" class="section-panel">
          <el-result icon="warning" title="首页内容加载失败" :sub-title="errorMessage">
            <template #extra>
              <el-button type="primary" @click="fetchHomeFeed">重新加载</el-button>
            </template>
          </el-result>
        </section>

        <template v-else>
          <section id="hot" class="section-panel">
            <div class="section-head">
              <div>
                <p class="section-kicker">Hot Feed</p>
                <h2>热门资源</h2>
              </div>
              <el-button text @click="openResources({ sort: 'hot' })">更多内容</el-button>
            </div>

            <div class="resource-grid">
              <ResourceStoryCard
                v-for="resource in hotResources.slice(0, 6)"
                :key="resource.id"
                :resource="resource"
                @tag="handleTagClick"
              />
            </div>
          </section>

          <section id="latest" class="section-panel">
            <div class="section-head">
              <div>
                <p class="section-kicker">Latest Feed</p>
                <h2>最新上架</h2>
              </div>
              <el-button text @click="openResources({ sort: 'latest' })">更多内容</el-button>
            </div>

            <div class="resource-grid">
              <ResourceStoryCard
                v-for="resource in latestResources.slice(0, 6)"
                :key="resource.id"
                :resource="resource"
                @tag="handleTagClick"
              />
            </div>
          </section>

          <section id="free" class="section-panel">
            <div class="section-head">
              <div>
                <p class="section-kicker">Open Access</p>
                <h2>免费可读</h2>
              </div>
              <el-button text @click="openResources({ sort: 'latest' })">浏览更多</el-button>
            </div>

            <div v-if="freeResources.length" class="resource-grid resource-grid--compact">
              <ResourceStoryCard
                v-for="resource in freeResources"
                :key="resource.id"
                :resource="resource"
                variant="compact"
                @tag="handleTagClick"
              />
            </div>
            <el-empty v-else description="当前样本里还没有免费资源" />
          </section>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listArticles } from '../api/article';
import ResourceStoryCard from '../components/ResourceStoryCard.vue';
import { useAuthStore } from '../store/auth';
import type { ResourceSummary } from '../types/resource';

interface TagStat {
  name: string;
  count: number;
}

const anchorLinks = [
  { href: '#overview', label: '社区入口' },
  { href: '#tags', label: '标签分区' },
  { href: '#hot', label: '热门资源' },
  { href: '#latest', label: '最新上架' },
  { href: '#free', label: '免费可读' },
];

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref('');
const latestResources = ref<ResourceSummary[]>([]);
const hotResources = ref<ResourceSummary[]>([]);

const uniqueResources = computed(() => {
  const orderedMap = new Map<number, ResourceSummary>();
  [...hotResources.value, ...latestResources.value].forEach((resource) => {
    if (!orderedMap.has(resource.id)) {
      orderedMap.set(resource.id, resource);
    }
  });
  return Array.from(orderedMap.values());
});

const headlineResource = computed(() => hotResources.value[0] || latestResources.value[0] || null);

const freeResources = computed(() =>
  uniqueResources.value.filter((resource) => resource.isFree).slice(0, 6),
);

const topTags = computed<TagStat[]>(() => {
  const tagMap = new Map<string, number>();
  uniqueResources.value.forEach((resource) => {
    resource.tags?.forEach((tag) => {
      const normalized = tag.trim();
      if (!normalized) {
        return;
      }
      tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);
});

const openResources = (filters: Record<string, string> = {}) => {
  router.push({
    name: 'Resources',
    query: filters,
  });
};

const openDetail = (id: number) => {
  router.push({ name: 'ResourceDetail', params: { id } });
};

const handleTagClick = (tag: string) => {
  openResources({ tag });
};

const fetchHomeFeed = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const [latest, hot] = await Promise.all([
      listArticles({ page: 1, pageSize: 8, sort: 'latest' }),
      listArticles({ page: 1, pageSize: 8, sort: 'hot' }),
    ]);
    latestResources.value = latest;
    hotResources.value = hot;
  } catch (error) {
    console.error('Failed to load home feed:', error);
    errorMessage.value = '首页资源流暂时不可用，请稍后重试。';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchHomeFeed);
</script>

<style scoped>
.harbor-shell {
  padding: 28px 24px 64px;
}

.harbor-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
}

.harbor-aside {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.aside-card,
.hero-panel,
.section-panel,
.headline-card,
.hero-mini-feed {
  border: 1px solid rgba(56, 61, 64, 0.08);
  border-radius: 26px;
  background: rgba(251, 250, 245, 0.96);
  box-shadow: 0 8px 28px rgba(45, 51, 54, 0.06);
}

.hero-panel,
.section-panel,
.headline-card,
.hero-mini-feed {
  contain: layout paint;
}

.aside-card {
  position: sticky;
  top: 108px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  contain: layout;
}

.aside-card--muted {
  top: 338px;
}

.aside-kicker,
.hero-kicker,
.section-kicker {
  margin: 0;
  color: #7c6843;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.aside-card a {
  color: #19383e;
  font-weight: 600;
  text-decoration: none;
}

.aside-card ul {
  margin: 0;
  padding-left: 18px;
  color: #5f6d72;
  line-height: 1.8;
}

.harbor-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.9fr);
  gap: 24px;
  padding: 28px;
}

.hero-copy h1 {
  margin: 14px 0 0;
  color: #142d33;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
}

.hero-description {
  max-width: 720px;
  margin: 18px 0 0;
  color: #5c696d;
  font-size: 16px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.stat-tile {
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f5efe0, #f8f6f0);
}

.stat-tile span {
  display: block;
  color: #7a6b55;
  font-size: 12px;
}

.stat-tile strong {
  display: block;
  margin-top: 10px;
  color: #152f35;
  font-size: 30px;
}

.hero-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.headline-card {
  overflow: hidden;
}

.headline-card__media {
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(130deg, rgba(19, 63, 69, 0.94), rgba(124, 99, 55, 0.9)),
    #244;
}

.headline-card__media img,
.headline-card__placeholder {
  width: 100%;
  height: 100%;
}

.headline-card__media img {
  display: block;
  object-fit: cover;
}

.headline-card__placeholder {
  display: grid;
  place-items: center;
  color: rgba(247, 241, 228, 0.95);
  font-size: 52px;
  font-weight: 700;
}

.headline-card__body {
  padding: 20px;
}

.headline-card__label {
  color: #7c6843;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.headline-card__body h2 {
  margin: 12px 0 0;
  color: #152f35;
  font-size: 26px;
}

.headline-card__body p {
  margin: 12px 0 0;
  color: #5f6c70;
  line-height: 1.75;
}

.headline-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 20px;
}

.headline-card__tags button,
.tag-cloud__item,
.hero-mini-feed__head button {
  border: 0;
  cursor: pointer;
}

.headline-card__tags button {
  padding: 8px 12px;
  border-radius: 999px;
  background: #e5efee;
  color: #184047;
  font-size: 12px;
}

.hero-mini-feed {
  padding: 18px;
}

.hero-mini-feed__head,
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.hero-mini-feed__head span {
  color: #17363d;
  font-size: 16px;
  font-weight: 700;
}

.hero-mini-feed__head button {
  padding: 0;
  background: transparent;
  color: #7c6843;
  font-weight: 700;
}

.hero-mini-feed__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 14px 0;
  border-top: 1px solid rgba(59, 64, 66, 0.08);
  cursor: pointer;
}

.hero-mini-feed__item strong {
  color: #152f35;
}

.hero-mini-feed__item p {
  margin: 8px 0 0;
  color: #677378;
  font-size: 14px;
  line-height: 1.6;
}

.hero-mini-feed__item span {
  color: #7c6843;
  font-size: 13px;
  font-weight: 700;
}

.section-panel {
  padding: 26px;
}

.section-head h2 {
  margin: 12px 0 0;
  color: #152f35;
  font-size: 28px;
}

.tag-cloud {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.tag-cloud__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #eff4f3, #f7f4ec);
  color: #17363d;
  text-align: left;
}

.tag-cloud__item strong {
  font-size: 15px;
}

.tag-cloud__item span {
  color: #7a6b55;
  font-size: 12px;
}

.resource-grid,
.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.resource-grid--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

@media (max-width: 1180px) {
  .harbor-layout {
    grid-template-columns: 1fr;
  }

  .harbor-aside {
    display: none;
  }

  .hero-panel {
    grid-template-columns: 1fr;
  }

  .resource-grid,
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .harbor-shell {
    padding: 18px 12px 40px;
  }

  .hero-panel,
  .section-panel {
    padding: 20px;
    border-radius: 22px;
  }

  .stat-grid,
  .resource-grid,
  .loading-grid,
  .resource-grid--compact {
    grid-template-columns: 1fr;
  }
}
</style>
