import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "@/utils";
import {
  FieldInput,
  FormProvider,
  useFormCreation,
} from "@datagroup/web-utils";
import moment, { Moment } from "moment";
import {
  Bubble,
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  InputAdornment,
  Modal,
  Radio,
  Select,
  TextArea,
} from "tea-component";

import styles from "./TaskDataSync.less";
import { useInterval } from "../_hooks/useInterval";

interface TaskDataSyncProps {
  onTaskTypeChange: (type: string) => void;
}

const TaskDataSync = ({ onTaskTypeChange }: TaskDataSyncProps) => {
  const intl = useIntl();

  const { form, handleSubmit } = useFormCreation({
    onSubmit(val) {},
    rules: {
      type_id: {
        required: true,
        message: intl.formatMessage({ id: 'select_a_task_type' }),
      },
      data_cluster: {
        required: true,
        message: intl.formatMessage({ id: 'select_a_data_cluster' }),
      },
      work_flow: {
        required: true,
        message: intl.formatMessage({ id: 'please_select_a_workflow_to_belong_to' }),
      },
      app_group: {
        required: true,
        message: intl.formatMessage({ id: 'select_an_application_group' }),
      },
      task_name: {
        required: true,
        message: intl.formatMessage({ id: 'please_enter_a_task_name' }),
      },
      cycle_type: {
        required: true,
        message: intl.formatMessage({ id: 'select_a_period_type' }),
      },
      startDate: {
        required: true,
        message: intl.formatMessage({ id: 'select_a_start_time' }),
      },
      endDate: {
        required: true,
        message: intl.formatMessage({ id: 'please_select_the_end_time' }),
      },
      cycle_period: {
        required: true,
        message: intl.formatMessage({ id: 'please_enter_the_interval' }),
      },
      arrange_time: {
        required: true,
        message: intl.formatMessage({ id: 'please_select_the_time' }),
      },
      dependency_self: {
        required: true,
        message: intl.formatMessage({ id: 'please_select_self_dependency' }),
      },
      data_source: {
        required: true,
        message: intl.formatMessage({ id: 'select_the_source_data_source' }),
      },
      target_data_source: {
        required: true,
        message: intl.formatMessage({ id: 'select_the_target_source_data_source' }),
      },
      source_thive_DB_name: {
        required: true,
        message: "请选择源thive DB名称",
      },
      num_of_ql_query: {
        required: true,
        message: "请输入源sql查询结果字段数量",
      },
      target_table: {
        required: true,
        message: intl.formatMessage({ id: 'select_target_table_mysql' }),
      },
      target_column_name: {
        required: true,
        message: intl.formatMessage({ id: 'please_enter_a_target_column_name' }),
      },
      instance_perform_host_ip_addr: {
        required: true,
        message: "请输入实例执行主机IP地址",
      },
      task_scheduling_priority: {
        required: true,
        message: intl.formatMessage({ id: 'select_a_task_scheduling_priority' }),
      },
      retest_times_for_failed: {
        required: true,
        message: intl.formatMessage({ id: 'enter_the_number_of_failed_retries' }),
      },
      retest_time_for_waiting: {
        required: true,
        message: intl.formatMessage({ id: 'please_select_the_retry_wait_time' }),
      },
    },
  });

  const [periodSuffix, setPeriodSuffix] = useState("day");
  const [deepInputValue, setDeepInputValue] = useState({
    period: "",
    resetTime: "",
  });

  form.change("type_id", "87");

  const saveValues = () => {
    const values = form.getState().values;

    if (values) {
      const twoMinutesAfter = moment().add(2, "minutes");
      localStorage.setItem(
        "thive_data_sync_values",
        JSON.stringify(form.getState().values)
      );

      localStorage.setItem(
        "expired_time",
        twoMinutesAfter.format("YYYY-MM-DD HH:mm:ss")
      );
    }
  };

  useInterval(saveValues, 1000);
  useEffect(() => {
    const thiveData = localStorage.getItem("thive_data_sync_values");
    const expiredTime = localStorage.getItem("expired_time");
    if (moment().isBefore(expiredTime) && thiveData) {
      const formData = JSON.parse(thiveData);

      setDeepInputValue({
        ...deepInputValue,
        resetTime: formData.retest_time_for_waiting ?? "",
        period: formData.cycle_period ?? "",
      });
      if (formData.cycle_type) {
        setPeriodSuffix(formData.cycle_type);
      }

      form.initialize(formData);
    }
  }, []);

  return (
    <>
      <Modal.Body className={styles.body}>
        <FormProvider form={form} onSubmit={handleSubmit}>
          <Form layout={"inline"}>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: "Task_Type" })}
              name="type_id"
              format={(v) => v?.toString()}
            >
              <Select
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                onChange={(value) => {
                  onTaskTypeChange?.(value);
                }}
                options={[
                  {
                    value: "81",
                    text: "PythonSQL script",
                  },
                  {
                    value: "86",
                    text: "Data computing",
                  },
                  {
                    value: "87",
                    text: "数据同步-thive到Mysql",
                  },
                ]}
                size="full"
              />
            </FieldInput>

            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'data_clustering' })}
              name="data_cluster"
            >
              <Select
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                placeholder={intl.formatMessage({ id: 'select_a_data_cluster' })}
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'owning_workflow' })}
              name="work_flow"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'please_select_a_workflow_to_belong_to' })}
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'application_of_group' })}
              name="app_group"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'select_an_application_group' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'the_name_of_the_task' })}
              name="task_name"
            >
              <Input placeholder={intl.formatMessage({ id: 'please_enter_a_task_name' })} type="simulate" size="full" />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'cycle_type' })}
              name="cycle_type"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'select_a_period_type' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                onChange={(value) => setPeriodSuffix(value)}
                options={[
                  { value: "day", text: intl.formatMessage({ id: 'day' }) },
                  { value: "week", text: intl.formatMessage({ id: 'weeks' }) },
                  { value: "month", text: intl.formatMessage({ id: 'month' }) },
                  { value: "hour", text: intl.formatMessage({ id: 'hours' }) },
                ]}
              />
            </FieldInput>
            <Form.Item className={"taskFormItem48"} label={intl.formatMessage({ id: 'the_data_date' })}>
              <div className={styles.dateWrapper}>
                <FieldInput
                  required
                  name="startDate"
                  format={(v: string) => {
                    if (v) return moment(v);
                  }}
                  parse={(v: Moment) => v.format("YYYY-MM-DD")}
                >
                  <DatePicker />
                </FieldInput>
                <i
                  style={{
                    fontSize: 12,
                    margin: "0 6px",
                    verticalAlign: "middle",
                  }}
                >
                  ~
                </i>
                <FieldInput
                  required
                  name="endDate"
                  format={(v: string) => {
                    if (v) return moment(v);
                  }}
                  parse={(v: Moment) => v.format("YYYY-MM-DD")}
                >
                  <DatePicker />
                </FieldInput>
              </div>
            </Form.Item>
            <FieldInput
              required
              className={`taskFormItem48 ${styles.period}`}
              label={intl.formatMessage({ id: 'periodic_intervals' })}
              name="cycle_period"
            >
              <InputAdornment after={periodSuffix}>
                <Input
                  value={deepInputValue.period}
                  onChange={(period) =>
                    setDeepInputValue({ ...deepInputValue, period })
                  }
                  placeholder={intl.formatMessage({ id: 'please_enter_the_interval' })}
                />
              </InputAdornment>
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'scheduling_time' })}
              name="arrange_time"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'please_select_the_time' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'their_own_rely_on' })}
              name="dependency_self"
            >
              <Radio.Group layout="inline">
                <Radio name="yes">{intl.formatMessage({ id: 'is' })}</Radio>
                <Radio name="no">{intl.formatMessage({ id: 'no' })}</Radio>
                <Radio name="muti">{intl.formatMessage({ id: 'multiinstance_parallelism' })}</Radio>
              </Radio.Group>
            </FieldInput>
            <div className={styles.note}>
              <span>
                注：周期类型和起始数据时间一旦选定保存后将不允许再修改
              </span>
            </div>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'the_source_data' })}
              name="data_source"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'select_the_source_data_source' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'target_data_source' })}
              name="target_data_source"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'select_the_target_source_data_source' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="源thive DB名称"
              name="source_thive_DB_name"
            >
              <Select
                placeholder="请选择源thive DB名称"
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="源sql查询结果字段数量"
              name="num_of_ql_query"
            >
              <Input placeholder="请输入源sql查询结果字段数量" size="full" />
            </FieldInput>

            <Form.Item className={styles.mins31}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'the_target_table_mysql' })}
              name="target_table"
            >
              <Select
                placeholder={intl.formatMessage({ id: 'select_target_table_mysql' })}
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <Form.Item className={styles.mins31}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'the_target_of_the_column' })}
              name="target_column_name"
            >
              <Input placeholder={intl.formatMessage({ id: 'please_enter_a_target_column_name' })} size="full" />
            </FieldInput>
            <Form.Item className={styles.mins31}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="实例执行主机IP地址"
              name="instance_perform_host_ip_addr"
            >
              <Input placeholder="请输入实例执行主机IP地址" size="full" />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'task_scheduling_priority' })}
              name="task_scheduling_priority"
            >
              <Radio.Group>
                <Radio name="high">{intl.formatMessage({ id: 'high' })}</Radio>
                <Radio name="middle">{intl.formatMessage({ id: 'in_the' })}</Radio>
                <Radio name="low">{intl.formatMessage({ id: 'low' })}</Radio>
              </Radio.Group>
            </FieldInput>
            <FieldInput
              required
              className={`taskFormItem48`}
              label={intl.formatMessage({ id: 'retry_times' })}
              name="retest_times_for_failed"
            >
              <Input placeholder={intl.formatMessage({ id: 'enter_the_number_of_failed_retries' })} size="full" />
            </FieldInput>
            <FieldInput
              required
              className={`taskFormItem48  ${styles.retest}`}
              label={intl.formatMessage({ id: 'retry_wait_time' })}
              name="retest_time_for_waiting"
            >
              <InputAdornment after={intl.formatMessage({ id: 'minutes' })}>
                <Input
                  value={deepInputValue.resetTime}
                  onChange={(resetTime) =>
                    setDeepInputValue({ ...deepInputValue, resetTime })
                  }
                  placeholder={intl.formatMessage({ id: 'please_select_the_retry_wait_time' })}
                  size="full"
                />
              </InputAdornment>
            </FieldInput>

            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'dirty_data_threshold' })}
              name="dirty_data_value_threshold"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder={intl.formatMessage({ id: 'please_enter_the_dirty_data_threshold' })} />
            </FieldInput>

            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'whether_the_data_source_is_empty_is_allowed_to_succeed' })}
              name="allow_success_as_data_empty"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder={intl.formatMessage({ id: 'select_whether_the_data_source_is_empty_to_allow_success' })}
                options={[
                  {
                    value: "true",
                    text: intl.formatMessage({ id: 'is' }),
                  },
                  {
                    value: "false",
                    text: intl.formatMessage({ id: 'no' }),
                  },
                ]}
              />
            </FieldInput>

            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'data_entry_mode' })}
              name="data_record_mode"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder={intl.formatMessage({ id: 'please_select_the_database_entry_mode' })}
              />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'beeline_output_format' })}
              name="beeline_output_formatting"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入beeline输出格式" />
            </FieldInput>
            <Form.Item className={styles.mins31}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'whether_the_partitions' })}
              name="is_distinct"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder={intl.formatMessage({ id: 'select_partition_or_not' })}
                options={[
                  { text: intl.formatMessage({ id: 'the_partition_table' }), value: "true" },
                  { text: intl.formatMessage({ id: 'no_partition_table' }), value: "false" },
                ]}
              />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'tdw_parameters' })}
              name="is_distinct"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入TDW参数，以分号分隔" />
            </FieldInput>
            <FieldInput
              required
              className={`taskFormItem100`}
              style={{ width: "96.6%", marginLeft: "-9px" }}
              label={"临时存储中间结果HDFS环境"}
              name="is_distinct"
              format={(v) => v?.toString()}
            >
              <Input
                required
                style={{ marginLeft: "19px" }}
                size="full"
                placeholder="请输入临时存储中间结果HDFS环境"
              />
            </FieldInput>
            <Form.Item style={{ marginLeft: "-15px" }}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'temporary_directory_for_storing_data' })}
              name="data_temp_dir"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder={intl.formatMessage({ id: 'please_enter_a_temporary_directory_for_storing_data' })} />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'the_separator' })}
              name="separator"
            >
              <Select
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                placeholder={intl.formatMessage({ id: '++++++++++++++++++++++++++++' })}
                options={[
                  { text: intl.formatMessage({ id: 'the_tab_key' }), value: "tab" },
                  { text: "#", value: "#" },
                  { text: "|", value: "|" },
                ]}
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'read_the_concurrency' })}
              name="read_concurrency"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入并发读源DB线程数" />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={intl.formatMessage({ id: 'write_a_concurrent_degree' })}
              name="write_concurrency"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入并发写源DB线程数" />
            </FieldInput>
            <Form.Item className={`taskFormItem100`} style={{ width: "96.6%" }}>
              <FieldInput
                label={intl.formatMessage({ id: 'the_source_sql' })}
                name="source_sql"
                format={(v) => v?.toString()}
                parse={(v) => v && Number(v)}
              >
                <TextArea
                  style={{ marginLeft: "10px" }}
                  size="full"
                  placeholder={intl.formatMessage({ id: 'please_enter_the_source_sql' })}
                />
              </FieldInput>
            </Form.Item>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button type="primary" onClick={form.submit}>
          {intl.formatMessage({ id: "OK" })}
          {/* 确定 */}
        </Button>
        <Button type="weak">
          下一页
          {/* 取消 */}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default TaskDataSync;
