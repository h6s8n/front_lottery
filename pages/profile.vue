<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinedDate: '2023-01-01',
  bio: 'Blockchain enthusiast and lottery player.',
})

const editing = ref(false)

const startEditing = () => {
  editing.value = true
}

const saveProfile = () => {
  editing.value = false
  // Save profile changes logic
  console.log('Profile saved:', user.value)
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>

    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="text-center mb-4">
        <img src="https://via.placeholder.com/150" alt="Profile Picture" class="w-24 h-24 rounded-full mx-auto mb-4"/>
        <h2 class="text-xl font-bold">{{ user.name }}</h2>
        <p class="text-gray-600">{{ user.email }}</p>
        <p class="text-gray-600">Joined on {{ user.joinedDate }}</p>
      </div>

      <div v-if="editing" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input v-model="user.name" class="w-full bg-gray-200 p-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="user.email" class="w-full bg-gray-200 p-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
          <textarea v-model="user.bio" class="w-full bg-gray-200 p-2 rounded"></textarea>
        </div>
        <button @click="saveProfile" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
      </div>

      <div v-else>
        <p class="text-gray-700 mb-4">{{ user.bio }}</p>
        <button @click="startEditing" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit Profile</button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Account Settings</h2>
      <button class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete Account</button>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
