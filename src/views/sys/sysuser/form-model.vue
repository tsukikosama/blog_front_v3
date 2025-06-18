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
      <a-form-item label="昵称" field="nickname" required :rules="{ required: true, message: '请输入昵称' }">
        <a-input
            v-model="form.nickname"
            placeholder="请输入昵称"
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
      <a-form-item label="手机号" field="phone"  :rules="{ required: false, message: '请输入手机号' }">
        <a-input
            v-model="form.phone"
            placeholder="请输入手机号"
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
      <a-form-item label="描述" field="description"  :rules="{ required: false, message: '请输入描述' }">
        <a-input
            v-model="form.description"
            placeholder="请输入描述"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="头像" field="avatar"  :rules="{ required: true, message: '请选择头像' }">
        <a-upload
            list-type="picture-card"
            :action="uploadUrl"
            :default-file-list="fileList"
            :limit="1"
            image-preview
            @success="uploadSuccess"
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
import {FileItem} from "@arco-design/web-vue/es/upload/interfaces";
import {saveSysUser, type SysUser, updateSysUser} from "@/api/sys/sysUser";

const fileList = []
const uploadUrl =  `${import.meta.env.VITE_API_BASE_URL}/common/file/upload`;


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
const form = reactive<SysUser>({
  id: '',
  username: '',
  nickname: '',
  password:'',
  email:'',
  phone:'',
  avatar:'',
  description:'',
  status:''
});
const handleSubmit = async (done: (closed: boolean) => void) => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (props.id) {
        form.id = props.id;
        await updateSysUser(form);
      } else {
        form.id = undefined;
        await saveSysUser(form);
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

const uploadSuccess = (fileItem: FileItem) => {
    if (fileItem.response?.code === 200) {
      form.avatar = fileItem.response?.data;
    }else{
      Message.error("上传失败");
    }
}

</script>
