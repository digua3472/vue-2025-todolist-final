<template>
  <div id="loginPage" class="bg-yellow">
    <div class="container loginPage vhContainer ">
      <div class="side">
        <a href="#"><img class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""></a>
        <img class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg">
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <!-- email -->
          <label class="formControls_label" for="email">Email</label>
          <input v-model="emailSignIn" @keyup.enter="signIn" class="formControls_input" type="text" id="email"
            name="email" placeholder="請輸入 email">
          <span v-if="errors.email">{{ errors.email }}</span>
          <!-- password -->
          <label class="formControls_label" for="pwd">密碼</label>
          <input v-model="passwordSignIn" @keyup.enter="signIn" class="formControls_input" type="password" name="pwd"
            id="pwd" placeholder="請輸入密碼">
          <span v-if="errors.password">{{ errors.password }}</span>
          <!-- 登入按鈕 -->
          <input @click.prevent="signIn" class="formControls_btnSubmit" type="button" value="登入">
          <!-- 註冊按鈕 -->
          <a class="formControls_btnLink" href="#signup">註冊帳號</a>
        </form>
      </div>
    </div>
    <!-- 使用 LoadingOverlay 元件 -->
    <LoadingOverlay :show="isShow" />
  </div>
</template>

<script setup>
import axios from 'axios';
import validate from 'validate.js';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const router = useRouter();

const api = 'https://todolist-api.hexschool.io';

const emailSignIn = ref('');
const passwordSignIn = ref('');
const isShow = ref(false);

// 使用vaildate.js驗證
const errors = reactive({
  email: '',
  password: ''
})
const constraints = {
  email: {
    presence: {
      allowEmpty: false,
      message: "^此欄位不可留空"
    },
    email: {
      message: "^必須是正確的 Email 格式"
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^此欄位不可留空"
    },
    length: {
      minimum: 6,
      message: "^密碼至少需要 6 碼"
    }
  }
}

// 登入
const signIn = async () => {
  const formData = {
    email: emailSignIn.value,
    password: passwordSignIn.value
  };

  const result = validate(formData, constraints)
  if (result) {
    errors.email = result.email ? result.email[0] : '';
    errors.password = result.password ? result.password[0] : '';
    console.log('驗證失敗：', result);
    return;
  }

  try {
    isShow.value = true;
    const res = await axios.post(`${api}/users/sign_in`, formData)
    // token寫入cookie
    document.cookie = `customTodoToken=${res.data.token};path=/`;
    alert('登入成功');
    // 登入後跳轉到todolist頁面
    router.push('todolist');
  } catch (error) {
    alert(`登入失敗： ${error.response.data.message}`);
  } finally {
    isShow.value = false;
  }
}



</script>
