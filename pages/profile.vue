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
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <h1 class="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-sm">پروفایل کاربری</h1>

      <div class="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl mb-6">
        <div class="text-center mb-6">
          <div class="relative inline-block">
            <img 
              :src="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.name" 
              alt="Profile Picture" 
              class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg bg-white/10 object-cover"
            />
            <button class="absolute bottom-2 right-0 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-400 transition-colors">
              <UIcon name="i-heroicons-camera" class="w-4 h-4 text-white"/>
            </button>
          </div>
          <h2 class="text-xl font-bold">{{ user.name }}</h2>
          <p class="text-white/60 text-sm dir-ltr">{{ user.email }}</p>
          <p class="text-white/40 text-xs mt-1">عضویت: {{ user.joinedDate }}</p>
        </div>

        <div v-if="editing" class="space-y-4">
          <div>
            <label class="block text-white/80 text-xs font-bold mb-2">نام نمایشی</label>
            <input v-model="user.name" class="w-full bg-black/20 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors" />
          </div>
          <div>
            <label class="block text-white/80 text-xs font-bold mb-2">ایمیل</label>
            <input v-model="user.email" class="w-full bg-black/20 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors" dir="ltr"/>
          </div>
          <div>
            <label class="block text-white/80 text-xs font-bold mb-2">بیوگرافی</label>
            <textarea v-model="user.bio" class="w-full bg-black/20 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors h-24"></textarea>
          </div>
          <div class="flex gap-2 pt-2">
            <button @click="saveProfile" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95">ذخیره تغییرات</button>
            <button @click="editing = false" class="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">لغو</button>
          </div>
        </div>

        <div v-else>
          <div class="bg-white/5 rounded-xl p-4 mb-6 text-white/80 text-sm leading-relaxed border border-white/5">
            {{ user.bio || 'هنوز بیوگرافی ننوشته‌اید...' }}
          </div>
          <button @click="startEditing" class="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5"/>
            ویرایش پروفایل
          </button>
        </div>
      </div>

      <div class="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-red-300">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5"/>
          منطقه خطر
        </h2>
        <button class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-trash" class="w-5 h-5"/>
          حذف حساب کاربری
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
