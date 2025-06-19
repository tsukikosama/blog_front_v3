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
                    image-preview
                    @success="handleUploadSuccess"
                    v-model:file-list="imgList"

                    limit="1"
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
    <div  style="border: 1px solid #ccc">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :default-config="toolbarConfig"
      />
      <Editor
          style="height: 500px; overflow-y: auto"
          v-model="formModel.content"
          :default-config="editorConfig"
          @onCreated="handleCreated"
      />
    </div>

  </div>

</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue'
import {getTypeList, Types} from "@/api/blog/type";
import {getBlogById, saveBlog, updateBlog} from "@/api/blog/blog";
import {Message} from "@arco-design/web-vue";
import {useRoute, useRouter} from "vue-router";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css'

const text = ref("")

const generateFormModel = () => {
  return {
    id:null,
    title: '',
    picture: '',
    tagId: [],
    content:''
  };
};
const imgList = ref<any[]>([])
const formModel = ref(generateFormModel());

const tagList = ref<Types[]>([] as Types[])
const getType = async () => {
  const { data } = await getTypeList()
  tagList.value = data
}
getType()
const router = useRouter();
const fieldNames = {value: 'id', label: 'tagName'}
const submit = () => {
  //  判断formModel的id是否值
  if (formModel.value.id != null ){
    updateBlog(formModel.value)
  }else{
    saveBlog(formModel.value)
  }
  Message.success("保存成功")
  router.go(-1);
}

const handleUploadSuccess = (file: any) => {
  formModel.value.picture = file?.response.data
};
const route = useRoute()
// 修改 fetchData 接口
const fetchData = async (id: string) => {
  if (route.params.id != null){
    const { data } = await getBlogById(id);
    imgList.value.push({
      url: data.picture,
      name: '图片',
      uid: Date.now().toString(),
      status: 'done' // ✅ 这一步非常关键
    })
    Object.assign(formModel.value, data);
    //  获取到的data是字符串形式 需要进行切割
    const s = data.tagId?.split(',') || []
    const results = tagList.value
        .filter(tag => s.includes(tag.id?.toString()))
        .map(tag => tag.id);
    formModel.value.tagId = results
  }
};
onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    fetchData(id);
  }
});

// 配置项
const toolbarConfig = {

}
// 编辑器实例（必须用 shallowRef）
const editorRef = shallowRef()
const handleCreated = (editor) => {
  editorRef.value = editor
}
// 销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: `${import.meta.env.VITE_API_BASE_URL}/common/file/upload`,
      fieldName: 'file', // 上传字段名，后端要对应
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      },
      maxFileSize: 2 * 1024 * 1024, // 2MB
      allowedFileTypes: ['image/*'], // 限制类型
      customInsert(res, insertFn) {
        // 假设后端返回格式如下：
        console.log(res.data)
        const url = res.data || ''
        const alt = '图片'
        const href = url
        // ✅ 调用 insertFn 插入图片
        insertFn(url, alt, href)
      },
    }
  }
}

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
