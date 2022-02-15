/**
 * # ====================================================================== #
 * # This file is automatically generated by @datagroup/integrate.
 * # Do not modify this file -- YOUR CHANGES WILL BE ERASED!
 * # Generated time: 2021-12-31 17:36:22
 * # Include tags: 系统管理 - 应用管理系统, 公��接口, 任务发��
 * # ====================================================================== #
 */
// eslint-disable
// tslint:disable

import {
  createHttpGetFactory,
  createHttpPostFactory,
} from '@datagroup/web-utils';

/**
 * 应用管理数据集群列表
 * @tags 系统管理 - 应用管理系统
 * @consumes application/json
 * @produces application/json
 * @request GET:/api/system/diction/cluster_list
 */
export const useGETForDictionClusterList = createHttpGetFactory<
  {
    category: string;
    cluster_address: string;
    cluster_name: string;
    env: string;
    id: number;
    region: string;
  }[],
  {}
>('/api/system/diction/cluster_list');

/**
 * 获取数据库列表
 * @tags 系统管理 - 应用管理系统
 * @consumes application/json
 * @produces application/json
 * @request GET:/api/system/diction/database_list
 */
export const useGETForDictionDatabaseList = createHttpGetFactory<
  {
    database_name: string;
    game_id: number;
  }[],
  {
    cluster_id: number;
  }
>('/api/system/diction/database_list');

/**
 * 获取数据库表列表
 * @tags 系统管理 - 应用管理系统
 * @consumes application/json
 * @produces application/json
 * @request GET:/api/system/diction/table_list
 */
export const useGETForDictionTableList = createHttpGetFactory<
  {
    // 创建时间
    createdAt: string;
    // 表名
    name: string;
    // 负责人
    owner: string;
  }[],
  {
    cluster_id: number;
    database_name: string;
  }
>('/api/system/diction/table_list');

/**
 * 新增库表
 * @tags 系统管理 - 应用管理系统
 * @produces application/json
 * @request POST:/api/system/management/create
 */
export const usePOSTForCreateManagement = createHttpPostFactory<
  {},
  {
    // 集群id
    cluster_id?: number;
    // 集群名称
    cluster_name?: string;
    // 数据库名称
    data_name?: string;
    // 应用组id
    group_id?: number;
    // 应用组名称
    group_name?: string;
    // 表名，多个用英文，隔开，全部使用：*
    table_name?: string;
  },
  {}
>('/api/system/management/create');

/**
 * 应用管理记录详情页
 * @tags 系统管理 - 应用管理系统
 * @produces application/json
 * @request GET:/api/system/management/details
 */
export const useGETForManagementDetails = createHttpGetFactory<
  {
    business: string;
    business_id: number;
    created_at: string;
    created_user_id: number;
    created_user_name: string;
    enable: number;
    group_code: string;
    group_header?: string[];
    group_header_id?: string[];
    group_member?: string[];
    group_member_id?: string[];
    group_name: string;
    group_role: string;
    id: number;
    remark: string;
    updated_user_id: number;
    updated_user_name: string;
  },
  {
    // 用户管理信息id
    Id: string;
  }
>('/api/system/management/details');

/**
 * 新增/编辑应用管理记录
 * @tags 系统管理 - 应用管理系统
 * @produces application/json
 * @request POST:/api/system/management/edit_records
 */
export const usePOSTForEditRecordsManagement = createHttpPostFactory<
  {},
  {
    business?: string;
    // 业务归属id
    business_id?: number;
    // 应用组id
    group_code?: string;
    group_header?: string[];
    group_header_id?: string[];
    group_member?: string[];
    group_member_id?: string[];
    group_name?: string;
    group_role?: string;
    // 数据唯一标识id:新增状态：0；编辑状态：id号
    id?: number;
    remark?: string;
    status?: number
  },
  {}
>('/api/system/management/edit_records');

/**
 * 查询库表信息
 * @tags 系统管理 - 应用管理系统
 * @produces application/json
 * @request GET:/api/system/management/get_data_tables
 */
export const useGETForManagementGetDataTables = createHttpGetFactory<
  {
    list?: {
      cluster_id: number;
      cluster_name: string;
      created_at: string;
      created_user_id: number;
      created_user_name: string;
      // 应用组id
      group_id: number;
      group_name: string;
      id: number;
      remark: string;
      table_name: string;
      updated_at: string;
      updated_user_id: number;
      updated_user_name: string;
    }[];
    // 总数据量
    total: number;
  },
  {
    // 结束时间戳
    end_time_unix: number;
    key_word?: string;
    // 页码 从1开始
    page: number;
    // 单页数据量
    size: number;
    // 开始时间戳
    start_time_unix: number;
  }
>('/api/system/management/get_data_tables');

/**
 * 获取应用管理记录
 * @tags 系统管理 - 应用管理系统
 * @produces application/json
 * @request GET:/api/system/management/records
 */
export const useGETForManagementRecords = createHttpGetFactory<
  {
    list?: {
      business: string;
      business_id: number;
      created_at: string;
      created_user_id: number;
      created_user_name: string;
      enable: number;
      group_code: string;
      group_header: string;
      group_header_id: string;
      group_member: string;
      group_member_id: string;
      group_name: string;
      group_role: string;
      id: number;
      remark: string;
      updated_user_id: number;
      updated_user_name: string;
    }[];
    // 总数据量
    total: number;
  },
  {
    end_time_unix: number;
    group_role?: string;
    key_word?: string;
    // 页码 从1开始
    page: number;
    // 单页数据量
    size: number;
    start_time_unix: number;
  }
>('/api/system/management/records');

/**
 * 从data service层获取logx集群列表，同步配置数据
 * @tags 公��接口
 * @consumes multipart/form-data
 * @produces application/json
 * @request GET:/api/log_query/get_logx_cluster_list
 */
export const useGETForLogQueryGetLogxClusterList = createHttpGetFactory<
  {
    identifier: string;
    name: string;
    region: string;
    type: string;
  },
  {}
>('/api/log_query/get_logx_cluster_list');

/**
 * 获取脚本详情 @author shaw
 * @description 获取脚本详情
 * @tags 任务发��
 * @request GET:/api/task_release/script
 */
export const useGETForTaskReleaseScript = createHttpGetFactory<
  string,
  {
    // 记录id
    id: number;
  }
>('/api/task_release/script');

export const useGETForGameId = createHttpGetFactory<string | undefined>('/api/user/get_game_id');
export const useGETForSystemManagementUser = createHttpGetFactory<string | undefined>('/api/user/get_user');
