<template>
  <a-modal
      v-model:visible="modalVisible"
      :title="props.id ? '修改' : '新增'"
      :ok-loading="loading"
      :width="600"
      @before-ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item label="账号" field="username" required :rules="{ required: true, message: '请输入账号' }">
        <a-input
            v-model="form.username"
            placeholder="请输入账号"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="密码" field="password" required :rules="{ required: true, message: '请输入密码' }">
        <a-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱" field="email" >
        <a-input
            v-model="form.email"
            placeholder="请输入邮箱"
            allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { FormInstance, Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import {getUserInfoById, saveUser} from "@/api/blog/user";


const props = defineProps({
  id: {
    type: String,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['success', 'update:visible']);
const modalVisible = ref(false);
const formRef = ref<FormInstance>();
const { loading, setLoading } = useLoading();
const form = reactive<any>({
  id: '',
  username: '',
  password: '',
  email:'',

});
const handleSubmit = async (done: (closed: boolean) => void) => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (props.id) {
        form.id = props.id;
        await saveUser(form);
      } else {
        form.id = undefined;
        await saveUser(form);
      }
      Message.success('操作成功');
      done(true);
      emit('success');
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  } else {
    done(false);
  }
};
const getDetail = async (id: string) => {
  const res = await getUserInfoById(id);
  Object.assign(form,res.data)
};
watch(
    () => modalVisible.value,
    (val) => {
      emit('update:visible', val);
    }
);
watch(
    () => props.visible,
    (val) => {
      modalVisible.value = val;
      formRef.value?.resetFields();
      if (val) {
        if (props.id) {
          getDetail(props.id);
        }
      }
    }
);
</script>
