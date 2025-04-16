<template>
  <div class="container">
    <p>博客编辑页加载了</p>
    <Breadcrumb :items="['博客', '博客列表']" />
    <a-card class="general-card" :title="$t('博客列表')">
    <a-row>
      <a-col :flex="1">
        <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                  field="title"
                  label="标题"
              >
                <a-input
                    v-model="formModel.title"
                    placeholder="请输入标题"
                    allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="picture" label="首页图片">
                <a-upload
                    list-type="picture-card"
                    action="http://localhost:9001/admin/file/upload"
                    limit="1"
                    image-preview
                    @success="handleUploadSuccess"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                  field="tag"
                  label="标签类型"
              >
                <a-select
                    v-model="formModel.tagId"
                    :options="tagList"
                    placeholder="请选择标签"
                    :field-names="fieldNames"
                    allow-clear
                    multiple
                    :default-value="[]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider style="height: 84px" direction="vertical" />
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
          <a-button type="primary" @click="submit">
            <template #icon>
              <icon-search />
            </template>
            保存
          </a-button>
        </a-space>
      </a-col>
    </a-row>


    </a-card>
    <a-divider style="margin-top: 0" />
    <v-md-editor v-model="formModel.content"
                 height="550px"
    ></v-md-editor>

    </div>

</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {list, Types} from "@/api/blog/type";
import {getBlogById, saveBlog} from "@/api/blog/blog";
import {Message} from "@arco-design/web-vue";
import {useRoute} from "vue-router";

console.log("进入博客编辑页")

const text = ref("")

const generateFormModel = () => {
  return {
    id:'',
    title: '',
    picture: '',
    tagId: [],
    content:''
  };
};

const formModel = ref(generateFormModel());

const tagList = ref<Types[]>([] as Types[])
const getType = async () => {
  const { data } = await list()
  tagList.value = data
}
getType()
const fieldNames = {value: 'id', label: 'tagName'}
const submit = () => {
  saveBlog(formModel.value)
}

const handleUploadSuccess = (file: any) => {
  formModel.value.picture = file?.response.data
  Message.info("上传成功")
};
const route = useRoute()

const fetchData = async () =>{
  console.log(route.params.id)
  const { data } = await getBlogById(route.params.id as string);
  Object.assign(formModel.value, data)
}
fetchData()
watch(
    () => route.params.id,
    async (newId, oldId) => {
      if (newId && newId !== oldId) {
        console.log("路由参数 ID 变化，重新加载数据");
        await fetchData();
      }
    },
    { immediate: true }
)
onMounted(() => {
  console.log("组件加载了")
})
</script>

<style scoped>
.container {
  padding: 0 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
