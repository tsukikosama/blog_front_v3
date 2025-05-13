<template>
  <a-modal
      v-model:visible="modalVisible"
      :title="props.id ? '修改' : '新增'"
      :ok-loading="loading"
      :width="600"
      @before-ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item label="名称" field="webName" required :rules="{ required: true, message: '请输入账号' }">
        <a-input
            v-model="form.webName"
            placeholder="请输入名称"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="描述" field="webDescript" required :rules="{ required: true, message: '请输入密码' }">
        <a-input
            v-model="form.webDescript"
            placeholder="请输入描述"
            type="password"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="网址" field="webUrl"  required :rules="{
        type:'url'
      }">
        <a-input
            v-model="form.webUrl"
            placeholder="请输入网址"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="邮箱" field="webEmail" required :rules="{

        type:'email'
      }">
        <a-input
            v-model="form.webEmail"
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
import {getFriendLinkById, saveFriendLink, updateFriendLink} from "@/api/blog/friendLink";
import {update} from "lodash";


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
  webUrl: '',
  webName: '',
  webDescript:'',
  webImg:'',
  webEmail:''

});
const handleSubmit = async (done: (closed: boolean) => void) => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (props.id) {
        form.id = props.id;
        await updateFriendLink(form);
      } else {
        form.id = undefined;
        await saveFriendLink(form);
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
  const res = await getFriendLinkById(id);
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
