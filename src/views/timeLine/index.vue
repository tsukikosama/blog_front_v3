<template>
  <div class="container">
    <Breadcrumb :items="['标签', '标签列表']" />
    <a-card class="general-card" :title="$t('标签列表')">
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
                    field="tagName"
                    label="标签名"
                >
                  <a-input
                      v-model="formModel.tagName"
                      placeholder="请输入标签名"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary"
                      @click="
                () => {
                  formModalVisible.visible = true;
                  formModalVisible.id = '';
                }
              ">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
        >

          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
            ><icon-refresh size="18"
            /></div>
          </a-tooltip>
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
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
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
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #moduleType="{ record }">
          <a-tag color="#165dff" v-if="record.moduleType == 1">完成</a-tag>
          <a-tag color="#ffb400" v-else>开发中</a-tag>
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button  size="small" type="text" @click="deleteTag(record.id)">
            更新
          </a-button>
          <a-button  size="small" type="text" @click="deleteTag(record.id)">
            {{ $t('searchTable.columns.operations.delete') }}
          </a-button>

        </template>
      </a-table>
    </a-card>
<!--    <form-modal-->
<!--        :id="formModalVisible.id"-->
<!--        v-model:visible="formModalVisible.visible"-->
<!--        @success="fetchData()"-->
<!--    >-->
<!--    </form-modal>-->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {deleteUserById, queryUser, resetPwd, userParams, userResponse} from "@/api/blog/user";
import {Message} from "@arco-design/web-vue";
import {deleteTagById, queryType, typeListRes, Types} from "@/api/blog/type";
import {deleteModules, queryTimeLine, TimeLine} from "@/api/blog/timeLine";


type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    tagName:''
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<TimeLine[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);


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
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('searchTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('模块名'),
    dataIndex: 'moduleName',
    slotName: 'moduleName',
  },
  {
    title: t('状态'),
    dataIndex: 'moduleType',
    slotName: 'moduleType',
  },
  {
    title: t('更新时间'),
    dataIndex: 'updateTime',
    slotName: 'updateTime',
  },
  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    slotName: 'createTime',
  },

  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);

const fetchData = async (
    params: userParams = { current: 1, pageSize: 10 }
) => {
  setLoading(true);
  try {
    const { data } = await queryTimeLine(params);
    renderData.value = data.records;
    pagination.current = params.current;
    pagination.total = data.total;
    pagination.pageSize = data.size
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
fetchData();
const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as PolicyParams);
};
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current });
};

const reset = () => {
  formModel.value = generateFormModel();
};

const deleteTag = async (ids:number) => {
    console.log(ids)
   await deleteModules([ids]);

  Message.success("删除成功");
  search()
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
    { deep: true, immediate: true }
);

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
