<template>
  <a-modal
      v-model:visible="modalVisible"
      :title="props.id ? '修改' : '新增'"
      :ok-loading="loading"
      :width="600"
      @before-ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item label="字典名字" field="code" required :rules="{ required: true, message: '请输入字典名字' }">
        <a-input
            v-model="form.code"
            placeholder="请输入字典名字"
            allow-clear
        />
      </a-form-item>
      <a-form-item label="字典值" field="value" required :rules="{ required: true, message: '请输入字典值' }">
        <a-input
            v-model="form.value"
            placeholder="请输入字典值"
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
import {saveCode, updateCode} from "@/api/blog/code";


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
  id:undefined,
  code:'',
  value:''
});
const handleSubmit = async (done: (closed: boolean) => void) => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
    try {
      if (props.id) {
        form.id = props.id;
        await updateCode(form);
      } else {
        form.id = undefined;
        await saveCode(form);
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
