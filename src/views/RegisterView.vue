<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="container signUpPage vhContainer">
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
          <h2 class="formControls_txt">註冊帳號</h2>
          <!-- email -->
          <label class="formControls_label" for="email">Email</label>
          <input v-model="emailSignUp" @keyup.enter="signUp" class="formControls_input" type="text" id="email"
            name="email" placeholder="請輸入 email">
          <span v-if="errors.email">{{ errors.email }}</span>
          <!-- nickname -->
          <label class="formControls_label" for="name">您的暱稱</label>
          <input v-model="nickname" @keyup.enter="signUp" class="formControls_input" type="text" name="name" id="name"
            placeholder="請輸入您的暱稱">
          <span v-if="errors.nickname">{{ errors.nickname }}</span>
          <!-- password -->
          <label class="formControls_label" for="pwd">密碼</label>
          <input v-model="passwordSignUp" @keyup.enter="signUp" class="formControls_input" type="password" name="pwd"
            id="pwd" placeholder="請輸入密碼">
          <span v-if="errors.password">{{ errors.password }}</span>
          <!-- comfirmPassword -->
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input v-model="comfirmPassword" @keyup.enter="signUp" class="formControls_input" type="password" name="pwd"
            id="pwd" placeholder="請再次輸入密碼">
          <span v-if="errors.comfirmPassword">{{ errors.comfirmPassword }}</span>
          <!-- 註冊按鈕 -->
          <input @click.prevent="signUp" class="formControls_btnSubmit" type="button" value="註冊帳號">
          <!-- 登入連結 -->
          <a class="formControls_btnLink" href="#login">登入</a>
        </form>
      </div>
    </div>
    <!-- 使用 LoadingOverlay 元件 -->
    <LoadingOverlay :show="isShow" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import validate from 'validate.js';
import { useRouter } from 'vue-router';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const api = 'https://todolist-api.hexschool.io';
const router = useRouter();

const emailSignUp = ref('');
const nickname = ref('');
const passwordSignUp = ref('');
const comfirmPassword = ref('');
const isShow = ref(false);

// 使用vaildate.js驗證
const errors = reactive({
  email: '',
  nickname: '',
  password: '',
  comfirmPassword: ''
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
  nickname: {
    presence: {
      allowEmpty: false,
      message: "^此欄位不可留空"
    },
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
  },
  comfirmPassword: {
    presence: {
      allowEmpty: false,
      message: "^此欄位不可留空"
    },
    equality: {
      attribute: "password",
      message: "^兩次輸入的密碼不一致",
      comparator: function (v1,) {
        return v1 === passwordSignUp.value;
      }
    }
  }
}

// 註冊
const signUp = async () => {
  const formData = {
    email: emailSignUp.value,
    nickname: nickname.value,
    password: passwordSignUp.value,
    comfirmPassword: comfirmPassword.value
  };

  const result = validate(formData, constraints)
  if (result) {
    errors.email = result.email ? result.email[0] : ''
    errors.nickname = result.nickname ? result.nickname[0] : ''
    errors.password = result.password ? result.password[0] : ''
    errors.comfirmPassword = result.comfirmPassword ? result.comfirmPassword[0] : ''
    return;
  }
  try {
    isShow.value = true;
    const res = await axios.post(`${api}/users/sign_up`, formData);
    console.log(res);
    alert('註冊成功');
    // 註冊後跳轉到登入頁面
    router.push('login');
  } catch (error) {
    alert(`註冊失敗： ${error.response.data.message}`);
  } finally {
    isShow.value = false;
  }
}

</script>
