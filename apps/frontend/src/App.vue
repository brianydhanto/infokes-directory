<template>
  <div class="app-container">
    <div class="panel-left">
      <FolderTree
        :folders="rootFolders"
        @selectFolder="onSelectFolder"
      />
    </div>
    <div class="panel-right">
      <FileItems :items="currentItems"  @open-folder="openFolder" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import FolderTree from './components/FolderTree.vue';
  import FileItems from './components/FileItems.vue';
  import { API_BASE_URL } from './config/api';

  interface Item {
    id: string;
    name: string;
    is_folder: boolean;
    extension?: string;
    parent_id?: string;
    depth?: number;
    children?: Item[];
    open?: boolean;
  }

  const rootFolders = ref<Item[]>([]);
  const currentItems = ref<Item[]>([]);

  async function fetchRoot() {
    const res = await fetch(`${API_BASE_URL}/folders`);
    const roots: Item[] = await res.json();

    if (roots.length > 0) {
      const firstRoot = roots[0];

      const childRes = await fetch(`${API_BASE_URL}/folders/${firstRoot.id}`);
      const children = await childRes.json();

      firstRoot.children = children.map((c: Item) => ({
        ...c,
        depth: (firstRoot.depth ?? 0) + 1,
      }));
      firstRoot.open = true;

      rootFolders.value = roots;
      currentItems.value = firstRoot.children ?? [];
    } else {
      rootFolders.value = [];
    }
  }

  function onSelectFolder(folder: Item) {
    currentItems.value = folder.children ?? [];
  }

  async function openFolder(folder: Item) {
    const res = await fetch(`${API_BASE_URL}/folders/${folder.id}`)
    const children = await res.json()
    currentItems.value = children
  }

  onMounted(() => {
    fetchRoot();
  });
</script>

<style>
  .app-container {
    display: flex;
    height: 100vh;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f2f5;
  }
  .panel-left {
    width: 250px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
    background: #fff;
    padding: 8px;
  }
  .panel-right {
    flex: 1;
    padding: 16px;
    overflow-x: auto;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
</style>
