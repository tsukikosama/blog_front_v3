<template>
  <div class="container">
    <Breadcrumb :items="['博客', '博客列表']"/>
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
                <a-form-item field="nickname" label="作者">
                  <a-input
                      v-model="formModel.userId"
                      placeholder="请输入邮箱"
                      allow-clear
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
                      :options="TypeList"
                      :field-names="fieldNames"
                      placeholder="请选择标签"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="ban"
                    label="博客状态"
                >
                  <a-select :style="{width:'320px'}" placeholder="请选择博客状态">
                    <a-option :value="1">发布</a-option>
                    <a-option :value="0">下架</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="createTime"
                    label="时间"
                >
                  <a-range-picker
                      @select="onSelect"
                      style="width: 254px; marginBottom: 20px;"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical"/>
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search/>
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh/>
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0"/>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary"
                      @click="addOrUpdate()">
              <template #icon>
                <icon-plus/>
              </template>
              发布
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
            <a-button type="primary"
                      @click="batchDelete()">
              批量删除
            </a-button>
          </a-space>
        </a-col>
        <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download/>
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
            >
              <icon-refresh size="18"
              />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon">
                <icon-line-height size="18"/>
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                  v-for="item in densityList"
                  :key="item.value"
                  :value="item.value"
                  :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="false"
          :size="size"
          @page-change="onPageChange"
          :row-selection="rowSelection"
          v-model:selectedKeys="selectedKeys"
          :scroll="{x: 2000}"
          :scrollbar="true"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #tagId="{ record }">
          <a-space>
            <a-tag v-for="(item,index) in getTagName(record.tagId)" color="#168cff" :key="index">{{ item }}</a-tag>
          </a-space>
        </template>
        <template #picture="{ record }">
          <a-space>
            <a-avatar
                :size="50"
                shape="square"
            >
              <img
                  alt="avatar"
                  :src="record.picture"
              />
            </a-avatar>
          </a-space>
        </template>
        <template #avatar="{ record }">
          <a-space>
            <a-avatar
                :size="50"
                shape="square"
            >
              <img
                  alt="avatar"
                  :src="record.avatar"
              />
            </a-avatar>
          </a-space>
        </template>

        <template #createDate="{ record }">
          {{ record.createDate ? record.createDate.substring(0, 10) : '' }}
        </template>
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>

        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.status.${record.status}`) }}
        </template>
<!--        <template #isValid="{ record }">-->
<!--          <a-tag v-if="record.isValid == 1">发布</a-tag>-->
<!--          <a-tag v-else>下架</a-tag>-->
<!--        </template>-->
        <template #operations="{ record }">
          <a-button size="small" type="text" @click="addOrUpdate(record.id)">
            编辑
          </a-button>
          <a-button size="small" type="text" @click="viewReview(record.id)">
            查看评论
          </a-button>
          <a-popconfirm content="确定要删除吗?" @ok="deleteBlog(record.id)">
            <a-button size="small" type="text">
              删除
            </a-button>
          </a-popconfirm>

        </template>
      </a-table>
    </a-card>
    <form-modal
        :id="formModalVisible.id"
        v-model:visible="formModalVisible.visible"
        @success="fetchData()"
    >
    </form-modal>
    <ReviewFrom :id="viewTableVisible.id"
                v-model:visible="viewTableVisible.visible"
                @success="fetchData()">

    </ReviewFrom>
  </div>

</template>

<script lang="ts" setup>
import {computed, ref, reactive, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import FormModal from '@/views/blogUser/form-model.vue';
import {PolicyParams} from '@/api/list';
import {Pagination} from '@/types/global';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {Blog, blogParams, deleteBlogs, queryBlog} from "@/api/blog/blog";
import {useRouter} from "vue-router";
import ReviewFrom from "@/views/blog/review_from.vue";
import {getTypeList, Types} from "@/api/blog/type";
import {Message} from "@arco-design/web-vue";

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    title: '',
    userId: '',
    tagId: '',
    status: '',
    startTime: '',
    endTime: ''
  };
};
const fieldNames = {value: 'id', label: 'tagName'}
const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
const renderData = ref<Blog[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const router = useRouter();
const size = ref<SizeProps>('medium');

const formModalVisible = reactive({
  visible: false,
  id: '',
});
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
});
const selectedKeys = ref([]);
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('searchTable.size.small'),
    value: 'small',
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('searchTable.size.large'),
    value: 'large',
  },
]);
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('searchTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
    width: 50,
  },
  {
    title: t('标题'),
    dataIndex: 'title',
    slotName: 'title',
    width: 100,
  },
  {
    title: t('首图'),
    dataIndex: 'picture',
    slotName: 'picture',
    width: 100,
  },
  {
    title: t('内容'),
    dataIndex: 'content',
    slotName: 'content',
    width: 150,
    ellipsis: true,
    tooltip: true
  },
  {
    title: t('发布日期'),
    dataIndex: 'createDate',
    slotName: 'createDate',
    width: 120
  },
  {
    title: t('标签'),
    dataIndex: 'tagId',
    slotName: 'tagId',
    width: 200
  },
  {
    title: t('流量次数'),
    dataIndex: 'visit',
    slotName: 'visit',
    width: 100
  },
  {
    title: t('发布者'),
    dataIndex: 'nickname',
    slotName: 'nickname',
    width: 100
  },
  {
    title: t('用户头像'),
    dataIndex: 'avatar',
    slotName: 'avatar',
    width: 100
  },
  // {
  //   title: t('状态'),
  //   dataIndex: 'isValid',
  //   slotName: 'isValid',
  //   width: 100,
  // },
  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    width: 150,
    fixed: 'right',
  },
]);

const onSelect = (dateString: string[]) => {
  formModel.value.startTime = dateString[0] as string
  formModel.value.endTime = dateString[1] as string
}

const TypeList = ref<Types[]>([])
const initType = async () => {
  const res = await getTypeList();
  TypeList.value = res.data
}

const batchDelete = () => {
  if (selectedKeys.value.length === 0) {
    Message.info("请选择需要删除的博客")
    return
  }
  deleteBlogs(selectedKeys.value)
}

const fetchData = async (
    params: blogParams = {current: 1, pageSize: 10}
) => {
  setLoading(true);
  try {
    const {data} = await queryBlog(params);
    renderData.value = data.records;
    pagination.current = params.current;
    pagination.total = data.total;
    pagination.pageSize = data.size
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
  initType()
};

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as PolicyParams);
};
const onPageChange = (current: number) => {
  fetchData({...basePagination, current});
};

fetchData();
const reset = () => {
  formModel.value = generateFormModel();
};

const addOrUpdate = (id?: string) => {
  router.push({name: 'blogedit', params: {id}});
}

const deleteBlog = async (ids: number | number[]) => {
  const idList: number[] = Array.isArray(ids) ? ids : [ids];
  const {data} = await deleteBlogs(idList)
  Message.info(data)
  search()
}
const getTagName = (ids: number[]) => {
  if (!ids) return []
  return TypeList.value.filter(tag => ids.includes(tag.id as number)).map(tag => tag.tagName);
}

watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    {deep: true, immediate: true}
);

const viewTableVisible = reactive({
  visible: false,
  id: '',
});
const viewReview = (blogId: string) => {
  viewTableVisible.visible = true
  viewTableVisible.id = blogId
}


</script>


<style scoped lang="less">
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
