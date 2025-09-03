<template>
  <div id="todoListPage" class="bg-half">
    <!-- nav -->
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm"><a href="#"><span>{{ user.nickname }}的待辦</span></a></li>
        <li><a @click="signOut" href="#login">登出</a></li>
      </ul>
    </nav>
    <!-- 待辦區塊主體 -->
    <div class="container todoListPage vhContainer">
      <div class="todoList_Content">
        <!-- 輸入待辦事項 -->
        <div class="inputBox">
          <input v-model="newTodo" @keyup.enter="addTodo" type="text" placeholder="請輸入待辦事項">
          <a @click.prevent="addTodo" :class="{ disabled: !newTodo.trim() }" href="#">
            <i class="fa fa-plus" :class="newTodo.trim() ? 'fa-plus' : 'fa-ban'"></i>
          </a>
        </div>
        <!-- 待辦事項列表 -->
        <div v-if="todos.length !== 0" class="todoList_list">
          <!-- 頁籤 -->
          <ul class="todoList_tab">
            <li><a @click.prevent="switchTab('all')" :class="{ active: currentTab === 'all' }" href="#">
                全部
              </a>
            </li>
            <li><a @click.prevent="switchTab('unfinished')" :class="{ active: currentTab === 'unfinished' }" href="#">
                待完成
              </a>
            </li>
            <li><a @click.prevent="switchTab('done')" :class="{ active: currentTab === 'done' }" href="#">已完成</a></li>
          </ul>
          <!-- 待辦清單 -->
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="todo in filteredTodos" :key="todo.id">
                <label class="todoList_label">
                  <input @change="toggleTodo(todo.id)" :checked="todo.status" class="todoList_input" type="checkbox">
                  <span>{{ todo.content }}</span>
                </label>
                <a @click.prevent="deleteTodo(todo.id)" href="#">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ unfinishedCount }} 個未完成項目</p>
            </div>
          </div>
        </div>
        <div v-else class="todoList_default">
          <p>目前尚無待辦事項</p>
          <img src="/src/assets/empty 1.png" alt="無待辦事項">
        </div>
      </div>
    </div>
    <!-- 使用 LoadingOverlay 元件 -->
    <LoadingOverlay :show="isShow" />
  </div>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const api = 'https://todolist-api.hexschool.io';
const token = ref(document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i,
  "$1",));
const isShow = ref(false);

// 進入頁面先驗證是否取得token
const user = ref({
  nickname: '',
  uid: ''
})
onMounted(async () => {
  try {
    isShow.value = true;
    const res = await axios.get(`${api}/users/checkout`, {
      headers: {
        authorization: token.value
      }
    })
    console.log(res);
    user.value = res.data;
    getTodos();
  } catch (error) {
    console.log(error);
    alert('驗證失敗，請重新登入')
    // 未驗證成功跳轉到登入頁面
    router.push('login');
  } finally {
    isShow.value = false;
  }
})

// 取得todo資料 getTodos
const todos = ref([]);
const getTodos = async () => {
  const res = await axios.get(`${api}/todos/`, {
    headers: {
      authorization: token.value
    }
  });
  todos.value = res.data.data;
}

// 登出功能
const signOut = async () => {
  try {
    isShow.value = true;
    const res = await axios.post(`${api}/users/sign_out`, {}, {
      headers: {
        authorization: token.value
      }
    })
    console.log(res);
    // 清空cookie
    document.cookie = 'customTodoToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

  } catch (error) {
    console.log(error);
    alert('登出失敗');
  } finally {
    isShow.value = false;
  }
}

// 新增待辦事項功能
const newTodo = ref('');
const addTodo = async () => {
  try {
    isShow.value = true;
    const res = await axios.post(`${api}/todos/`, {
      content: newTodo.value
    }, {
      headers: {
        authorization: token.value
      }
    })
    todos.value.push(res.data.newTodo);
    newTodo.value = '';
  } catch (error) {
    console.log(error);
    alert('新增失敗，請重新輸入待辦事項')
  } finally {
    isShow.value = false;
  }
}

// 頁籤切換功能
// 切換tab
const currentTab = ref('all');
const switchTab = (tab) => {
  currentTab.value = tab
};
// 待辦清單切換狀態
const toggleTodo = async (id) => {
  try {
    isShow.value = true;
    const res = await axios.patch(`${api}/todos/${id}/toggle`, {}, {
      headers: {
        authorization: token.value
      }
    });
    console.log(res);

  } catch (error) {
    console.log(error);
  } finally {
    isShow.value = false;
  }
};
// 篩選清單
const filteredTodos = computed(() => {
  if (currentTab.value === 'unfinished') {
    return todos.value.filter(todo => !todo.status)
  } else if (currentTab.value === 'done') {
    return todos.value.filter(todo => todo.status)
  }
  return todos.value;
});
// 統計未完成項目
const unfinishedCount = computed(() => {
  return todos.value.filter(todo => todo.status === false).length;
})

// 刪除待辦事項功能
const deleteTodo = async (id) => {
  try {
    isShow.value = true;
    await axios.delete(`${api}/todos/${id}`, {
      headers: {
        authorization: token.value
      }
    });
    getTodos();

  } catch (error) {
    console.log(error);
  } finally {
    isShow.value = false;
  }
};

</script>
