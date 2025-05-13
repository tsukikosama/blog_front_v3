<template>
  <a-modal
      v-model:visible="modalVisible"
      :title="props.id ? '修改' : '新增'"
      :ok-loading="loading"
      :width="600"
      @before-ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item label="记录对象" field="name" required :rules="{ required: true, message: '请输入账号' }">
        <a-input
            v-model="form.name"
            placeholder="请输入记录对象"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="原因" field="cause" required :rules="{ required: true, message: '请输入原因' }">
        <a-textarea
            v-model="form.cause"
            default-value="This is the contents of the textarea. This is the contents of the textarea. This is the contents of the textarea."
            :auto-size="{
    minRows:2,
    maxRows:5
  }" style="margin-top: 20px"/>
      </a-form-item>
      <a-form-item label="类型" field="type" required :rules="{ required: true, message: '请输入密码' }">
        <a-input
            v-model="form.type"
            placeholder="请输入原因"
            type="password"
            allow-clear
        />
      </a-form-item>


    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import {FormInstance, Message} from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import {getFriendLinkById, saveFriendLink, updateFriendLink} from "@/api/blog/friendLink";


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
const {loading, setLoading} = useLoading();
const form = reactive<any>({
  id: '',
  name: '',
  cause: '',
  type: ''

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
  Object.assign(form, res.data)
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
