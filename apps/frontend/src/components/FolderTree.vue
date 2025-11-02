<template>
  <ul class="folder-tree">
    <li v-for="folder in folders" :key="folder.id">
      <div
        class="folder-item"
        :class="{ open: folder.open }"
        @click="toggle(folder)"
        :style="{ paddingLeft: `${folderDepth(folder) * 16}px` }"
      >
        {{ folder.is_folder ? (folder.open ? '📂' : '📁') : '📄' }}
        {{ folder.name === 'Root' ? '' : folder.name }}
      </div>
      <FolderTree
        v-if="folder.open && folder.children"
        :folders="folder.children"
        @selectFolder="$emit('selectFolder', $event)"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { API_BASE_URL } from '../config/api';

  interface Item {
    id: string;
    name: string;
    is_folder: boolean;
    children?: Item[];
    open?: boolean;
    depth?: number; 
  }

  const props = defineProps<{ folders: Item[] }>();
  const emit = defineEmits<{
    (e: 'selectFolder', folder: Item): void;
  }>();

  async function toggle(folder: Item) {
    if (!folder.is_folder) return;

    folder.open = !folder.open;

    if (folder.open && !folder.children) {
      const res = await fetch(`${API_BASE_URL}/folders/${folder.id}`);
      const children = await res.json();
      folder.children = children.map((c: Item) => ({ ...c, depth: (folder.depth ?? 0) + 1 }));
    }

    emit('selectFolder', folder);
  }

  function folderDepth(folder: Item): number {
    return folder.depth ?? 0;
  }
</script>

<style scoped>
  .folder-tree {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .folder-item {
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    transition: background 0.2s;
  }
  .folder-item:hover {
    background: #e0e0e0;
  }
  .folder-item.open {
    font-weight: bold;
  }
</style>
