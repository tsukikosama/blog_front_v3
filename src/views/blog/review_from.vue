<template>
  <a-modal
      v-model:visible="modalVisible"
      title="评论详情"
      :ok-loading="loading"
      :width="1200"
  >
    <a-table
        :columns="columns"
        :data="renderData"
        show-empty-tree
        row-key="id"
        v-model:expandedKeys="expandedKeys"
        :pagination="basePagination.total"
        style="margin-top: 20px" >
      <template #operations = "{ record }">
        <a-button  size="small" type="text" @click="deleteReview(record.id)">
          删除
        </a-button>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref ,watch} from 'vue';
import {FormInstance, Message} from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import {deleteReviewById, queryReview, review, reviewParams} from "@/api/blog/review";
import {Pagination} from "@/types/global";
import {useI18n} from "vue-i18n";


const emit = defineEmits(['success', 'update:visible']);
const props = defineProps({
  id: {
    type: String,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});
const { t } = useI18n();

const expandedKeys = ref([]);
const modalVisible = ref(false);
const formRef = ref<FormInstance>();
const { loading, setLoading } = useLoading();
const form = reactive<any>({
  id: '',

});
const columns = [
  {
    title: '查看子评论',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '用户名',
    dataIndex: 'nickname',
    // slotName: 'nickname',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    // slotName: 'avatar',
  },
  {
    title: '回复内容',
    dataIndex: 'content',
    width:200,
    ellipsis: true,
    tooltip: true,
    // slotName: 'content',
  },
  {
    title: '评论时间',
    dataIndex: 'createTime',
    // slotName: 'createTime',
    width:200
  },
  {
    title: '点赞数',
    dataIndex: 'likes',
    // slotName: 'likes',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width:200
  },
];
const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const params = ref<reviewParams>({
  id:'',
  current: 1,
  pageSize: 10
})
watch(
    () => modalVisible.value,
    (val) => {
      emit('update:visible', val);
    }
);
const renderData = ref<review[]>([]);
const getDetail = async (id: string) => {
  params.value.id = props.id as string
  const res = await queryReview(params.value);
  Object.assign(form,res.data)
  renderData.value = res.data.records
  basePagination.total = res.data.total
};
const deleteReview = (id:number) => {
   deleteReviewById(id);
   getDetail(props.id as string)
}

watch(
    () => props.visible,
    (val) => {
      console.log(props.visible)
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
