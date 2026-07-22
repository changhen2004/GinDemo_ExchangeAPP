<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="site-header__bar">
        <button type="button" class="site-brand" @click="goTo('Home')">
          <span class="site-brand__mark">RC</span>
          <span class="site-brand__copy">
            <strong>资源社区</strong>
            <small>分享、解锁、沉淀内容价值</small>
          </span>
        </button>

        <nav class="site-nav">
          <button
            v-for="item in navItems"
            :key="item.routeName"
            type="button"
            class="site-nav__item"
            :class="{ 'site-nav__item--active': isActive(item.routeName) }"
            @click="goTo(item.routeName)"
          >
            {{ item.label }}
          </button>
        </nav>

        <form class="site-search" @submit.prevent="submitSearch">
          <input
            v-model.trim="searchKeyword"
            type="search"
            placeholder="搜索标题、标签或感兴趣的资源"
          />
          <button type="submit">搜索</button>
        </form>

        <div class="site-actions">
          <template v-if="authStore.isAuthenticated">
            <button type="button" class="site-pill" @click="goTo('CreateResource')">发布资源</button>
            <button type="button" class="site-user" @click="goTo('Center')">
              <span class="site-user__avatar">{{ usernameInitial }}</span>
              <span class="site-user__meta">
                <strong>{{ authStore.currentUser?.username || '用户' }}</strong>
                <small>{{ authStore.pointsBalance }} 积分</small>
              </span>
            </button>
            <button type="button" class="site-ghost" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <button type="button" class="site-ghost" @click="goTo('Login')">登录</button>
            <button type="button" class="site-pill" @click="goTo('Register')">注册</button>
          </template>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './store/auth';

const navItems = [
  { label: '首页', routeName: 'Home' },
  { label: '资源广场', routeName: 'Resources' },
];

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const searchKeyword = ref('');

const usernameInitial = computed(() => authStore.currentUser?.username.slice(0, 1) || 'U');

watch(
  () => route.query?.keyword,
  (keyword) => {
    searchKeyword.value = typeof keyword === 'string' ? keyword : '';
  },
  { immediate: true },
);

const isActive = (routeName: string) => route.name === routeName;

const goTo = (routeName: string) => {
  router.push({ name: routeName });
};

const submitSearch = () => {
  router.push({
    name: 'Resources',
    query: searchKeyword.value ? { keyword: searchKeyword.value, sort: 'latest' } : {},
  });
};

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(207, 219, 228, 0.7), transparent 22%),
    linear-gradient(180deg, #f4f4f1 0%, #ecece6 100%);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 12px 18px 0;
}

.site-header__bar {
  display: grid;
  grid-template-columns: auto auto minmax(240px, 1fr) auto;
  gap: 14px;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 14px 18px;
  border: 1px solid rgba(34, 41, 46, 0.08);
  border-radius: 22px;
  background: rgba(250, 249, 245, 0.96);
  box-shadow: 0 8px 24px rgba(51, 59, 64, 0.06);
  contain: layout paint;
  will-change: transform;
  transform: translateZ(0);
}

.site-brand,
.site-nav__item,
.site-pill,
.site-ghost,
.site-user,
.site-search button {
  border: 0;
  cursor: pointer;
}

.site-brand {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  padding: 0;
  background: transparent;
  color: #112b31;
  text-align: left;
}

.site-brand__mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #133f45, #7c6337);
  color: #f7f0e1;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.site-brand__copy {
  display: flex;
  flex-direction: column;
}

.site-brand__copy strong {
  font-size: 16px;
}

.site-brand__copy small {
  color: #6a7478;
  font-size: 12px;
}

.site-nav {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px;
  border-radius: 999px;
  background: rgba(225, 231, 230, 0.8);
}

.site-nav__item {
  padding: 10px 16px;
  border-radius: 999px;
  background: transparent;
  color: #53636a;
  font-size: 14px;
  font-weight: 600;
}

.site-nav__item--active {
  background: #153e43;
  color: #f7f4eb;
}

.site-search {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: inset 0 0 0 1px rgba(70, 76, 81, 0.08);
}

.site-search input {
  width: 100%;
  min-width: 0;
  padding: 0 14px;
  border: 0;
  background: transparent;
  color: #1d3438;
  font-size: 14px;
  outline: none;
}

.site-search input::placeholder {
  color: #879095;
}

.site-search button,
.site-pill,
.site-ghost {
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.site-search button,
.site-pill {
  background: #183f44;
  color: #f7f4eb;
}

.site-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.site-ghost {
  background: rgba(221, 227, 225, 0.85);
  color: #21464d;
}

.site-user {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 6px 10px 6px 6px;
  border-radius: 999px;
  background: rgba(221, 227, 225, 0.92);
  color: #17363b;
}

.site-user__avatar {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: #183f44;
  color: #f8f3e9;
  font-size: 13px;
  font-weight: 700;
}

.site-user__meta {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.site-user__meta strong {
  font-size: 13px;
}

.site-user__meta small {
  color: #6a7478;
  font-size: 11px;
}

.app-main {
  min-height: calc(100vh - 92px);
}

@media (max-width: 1240px) {
  .site-header__bar {
    grid-template-columns: auto 1fr auto;
  }

  .site-nav {
    order: 3;
    grid-column: 1 / -1;
    justify-self: flex-start;
  }
}

@media (max-width: 820px) {
  .site-header {
    padding: 12px 12px 0;
  }

  .site-header__bar {
    grid-template-columns: 1fr;
  }

  .site-search,
  .site-actions,
  .site-nav {
    width: 100%;
  }

  .site-actions {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .site-user {
    flex: 1;
  }
}
</style>
