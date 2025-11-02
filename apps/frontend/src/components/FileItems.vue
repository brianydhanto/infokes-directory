<template>
  <div class="file-grid">
    <div
      v-for="item in items"
      :key="item.id"
      class="file-item"
      @dblclick="handleDoubleClick(item)"
    >
      <div class="icon">{{ getIcon(item) }}</div>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Item {
  id: string
  name: string
  is_folder: boolean
  extension?: string
}

const props = defineProps<{ items: Item[] }>()
const emit = defineEmits<{ (e: 'open-folder', folder: Item): void }>()

function handleDoubleClick(item: Item) {
  if (item.is_folder) {
    emit('open-folder', item)
  }
}

function getIcon(item: Item): string {
  if (item.is_folder) return '📁'

  switch (item.extension?.toLowerCase()) {
    case '.txt':
      return '📄'
    case '.pdf':
      return '📄'
    case '.mp4':
    case '.mov':
      return '🎬'
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
      return '🖼️'
    case '.zip':
    case '.rar':
      return '🗜️'
    case '.mp3':
    case '.wav':
      return '🎵'
    default:
      return '📄'
  }
}
</script>

<style scoped>
  .file-grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 12px;
  }

  .file-item {
    flex: 0 0 110px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    background: linear-gradient(145deg, #ffffff, #f3f4f6);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
    background: #eef2ff;
  }

  .icon {
    font-size: 40px;
    transition: transform 0.2s ease;
  }

  .file-item:hover .icon {
    transform: scale(1.1);
  }

  .name {
    margin-top: 8px;
    text-align: center;
    font-size: 14px;
    color: #333;
    font-weight: 500;
    word-break: break-word;
  }
</style>
