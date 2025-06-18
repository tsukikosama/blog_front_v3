<template>
  <div class="container">
    <Breadcrumb :items="['用户', '用户列表']" />
    <a-card class="general-card" :title="$t('用户列表')">
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
                    field="nickname"
                    label="昵称"
                >
                  <a-input
                      v-model="formModel.nickname"
                      placeholder="请输入昵称"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="email" label="邮箱">
                  <a-input
                      v-model="formModel.email"
                      placeholder="请输入邮箱"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="userType"
                    label="用户类型"
                >
                  <a-select
                      v-model="formModel.userType"
                      :options="contentTypeOptions"
                      placeholder="请输入用户内容"
                      allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                    field="ban"
                    label="用户状态"
                >
                  <a-select
                      v-model="formModel.ban"
                      :options="userBanStatus"
                      placeholder="请输入用户内容"
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
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
            <a-button type="primary" @click="() => {
                resetPassword(selectedKeys)
            }">
              <template #icon>
                <icon-command />
              </template>
             重置密码
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
          @selection-change="onSelectionChange"
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

        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">

          <a-button  size="small" type="text" @click="deleteUser(record.id)">
            {{ $t('searchTable.columns.operations.delete') }}
          </a-button>
          <a-button  size="small" type="text">
            封禁
          </a-button>
        </template>
      </a-table>
    </a-card>
    <form-modal
        :id="formModalVisible.id"
        v-model:visible="formModalVisible.visible"
        @success="fetchData()"
    >
    </form-modal>
  </div>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import FormModal from '@/views/blogUser/form-model.vue';
import { PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import {deleteUserById, queryUser, resetPwd, userParams, userResponse} from "@/api/blog/user";
import {Message} from "@arco-design/web-vue";
import {pageSysPage, type SysUser} from "@/api/sys/sysUser";


type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    nickname: '',
    email: '',
    ban: '',
    userType: '',
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<SysUser[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);



const formModalVisible = reactive({
  visible: false,
  id: '',
});
const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
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
    width: 50,
  },
  {
    title: t('账号'),
    dataIndex: 'username',
    slotName: 'username',
  },
  {
    title: t('头像'),
    dataIndex: 'avatar',
    slotName: 'avatar',
  },
  // {
  //   title: t('用户类型'),
  //   dataIndex: 'userType',
  //   slotName: 'userType',
  // },
  {
    title: t('邮箱'),
    dataIndex: 'email',
    slotName: 'email',
  },
  {
    title: t('个人简介'),
    dataIndex: 'about',
    slotName: 'about',
  },
  {
    title: t('昵称'),
    dataIndex: 'nickname',
    slotName: 'nickname',
  },
  // {
  //   title: t('封禁状态'),
  //   dataIndex: 'ban',
  //   slotName: 'ban',
  // },
  {
    title: t('注册时间'),
    dataIndex: 'createTime',
    slotName: 'createTime',
  },
  // {
  //   title: t('更新时间'),
  //   dataIndex: 'updateTime',
  //   slotName: 'updateTime',
  // },
  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]);
const contentTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: "会员",
    value: '1',
  },
  {
    label: "普通用户",
    value: '0',
  },

]);
const userBanStatus = computed<SelectOptionData[]>(() => [
  {
    label: "禁用",
    value: '0',
  },
  {
    label: "正常",
    value: '1',
  },

]);

const fetchData = async (
    params: userParams = { current: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await pageSysPage(params);
    console.log(data)
    renderData.value = data.list;
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

const resetPassword = async (ids:number[]) => {
     const { data } =  await resetPwd(ids);

     Message.success(data);
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

const deleteUser =async (id:number) => {
  const {data} = await deleteUserById([id])
  Message.success(data);
  search()
}
const onSelectionChange = (keys: number[]) => {
  console.log('当前选中行 ID:', keys);
};
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
