<template>
  <article
    class="story-card"
    :class="[`story-card--${variant}`, { 'story-card--coverless': !resource.coverUrl }]"
    @click="goDetail"
  >
    <div class="story-card__media">
      <img
        v-if="resource.coverUrl"
        :src="resource.coverUrl"
        :alt="resource.title"
        class="story-card__image"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="story-card__placeholder">
        <span>{{ resource.title.slice(0, 1) }}</span>
      </div>

      <div class="story-card__ribbon">
        <span>{{ resource.status || 'published' }}</span>
        <strong>{{ resource.isFree ? '免费' : `${resource.requiredPoints || 0} 积分` }}</strong>
      </div>
    </div>

    <div class="story-card__body">
      <h3>{{ resource.title }}</h3>
      <p v-if="showPreview" class="story-card__preview">{{ resource.preview }}</p>

      <div v-if="resource.tags?.length" class="story-card__tags">
        <button
          v-for="tag in resource.tags"
          :key="tag"
          type="button"
          class="story-card__tag"
          @click.stop="$emit('tag', tag)"
        >
          {{ tag }}
        </button>
      </div>

      <div class="story-card__footer">
        <div class="story-card__stats">
          <span>热度 {{ resource.likeCount ?? 0 }}</span>
          <span>浏览 {{ resource.viewCount ?? 0 }}</span>
          <span>评论 {{ resource.commentCount ?? 0 }}</span>
        </div>

        <button type="button" class="story-card__action" @click.stop="goDetail">
          {{ actionLabel }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ResourceSummary } from '../types/resource';

const props = withDefaults(
  defineProps<{
    resource: ResourceSummary;
    variant?: 'feature' | 'compact';
    showPreview?: boolean;
    actionLabel?: string;
  }>(),
  {
    variant: 'feature',
    showPreview: true,
    actionLabel: '查看详情',
  },
);

defineEmits<{
  tag: [tag: string];
}>();

const router = useRouter();

const goDetail = () => {
  router.push({ name: 'ResourceDetail', params: { id: props.resource.id } });
};
</script>

<style scoped>
.story-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(75, 77, 79, 0.12);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 8px 26px rgba(34, 41, 46, 0.06);
  cursor: pointer;
  contain: layout paint;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.story-card:hover {
  transform: translateY(-4px);
  border-color: rgba(18, 84, 90, 0.22);
  box-shadow: 0 26px 46px rgba(34, 41, 46, 0.12);
}

.story-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background:
    linear-gradient(140deg, rgba(15, 71, 78, 0.92), rgba(183, 142, 78, 0.88)),
    #234;
}

.story-card__image,
.story-card__placeholder {
  width: 100%;
  height: 100%;
}

.story-card__image {
  display: block;
  object-fit: cover;
}

.story-card__placeholder {
  display: grid;
  place-items: center;
  color: rgba(255, 248, 235, 0.95);
  font-size: clamp(42px, 5vw, 56px);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.story-card__ribbon {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(12, 17, 20, 0.82);
  color: #f7efe4;
}

.story-card__ribbon span,
.story-card__ribbon strong {
  font-size: 12px;
}

.story-card__ribbon span {
  opacity: 0.8;
  text-transform: uppercase;
}

.story-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}

.story-card__body h3 {
  margin: 0;
  color: #17252c;
  font-size: 22px;
  line-height: 1.25;
}

.story-card__preview {
  margin: 0;
  color: #5d696f;
  line-height: 1.7;
}

.story-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.story-card__tag,
.story-card__action {
  border: 0;
  cursor: pointer;
}

.story-card__tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e6f0ef;
  color: #205864;
  font-size: 12px;
  transition: background 0.2s ease;
}

.story-card__tag:hover {
  background: #d7e8e6;
}

.story-card__footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.story-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #6f7b80;
  font-size: 13px;
}

.story-card__action {
  padding: 10px 16px;
  border-radius: 999px;
  background: #163d42;
  color: #f7f3ea;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.story-card__action:hover {
  background: #205864;
}

.story-card--compact .story-card__body {
  gap: 10px;
  padding: 18px;
}

.story-card--compact .story-card__body h3 {
  font-size: 18px;
}

.story-card--compact .story-card__preview {
  font-size: 14px;
}

@media (max-width: 720px) {
  .story-card {
    border-radius: 20px;
  }

  .story-card__body {
    padding: 18px;
  }

  .story-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .story-card__action {
    width: 100%;
  }
}
</style>
