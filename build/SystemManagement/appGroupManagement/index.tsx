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
        message: "请选择任务类型",
      },
      data_cluster: {
        required: true,
        message: "请选择数据集群",
      },
      work_flow: {
        required: true,
        message: "请选择所属工作流",
      },
      app_group: {
        required: true,
        message: "请选择应用组",
      },
      task_name: {
        required: true,
        message: "请输入任务名称",
      },
      cycle_type: {
        required: true,
        message: "请选择周期类型",
      },
      startDate: {
        required: true,
        message: "请选择起始时间",
      },
      endDate: {
        required: true,
        message: "请选择结束时间",
      },
      cycle_period: {
        required: true,
        message: "请输入周期间隔",
      },
      arrange_time: {
        required: true,
        message: "请选择时间",
      },
      dependency_self: {
        required: true,
        message: "请选择自身依赖",
      },
      data_source: {
        required: true,
        message: "请选择源数据源",
      },
      target_data_source: {
        required: true,
        message: "请选择目标源数据源",
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
        message: "请选择目标表(Mysql)",
      },
      target_column_name: {
        required: true,
        message: "请输入目标列名",
      },
      instance_perform_host_ip_addr: {
        required: true,
        message: "请输入实例执行主机IP地址",
      },
      task_scheduling_priority: {
        required: true,
        message: "请选择任务调度优先级",
      },
      retest_times_for_failed: {
        required: true,
        message: "请输入失败重试次数",
      },
      retest_time_for_waiting: {
        required: true,
        message: "请选择重试等待时间",
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
              label="数据集群"
              name="data_cluster"
            >
              <Select
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                placeholder="请选择数据集群"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="所属工作流"
              name="work_flow"
            >
              <Select
                placeholder="请选择所属工作流"
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="应用组"
              name="app_group"
            >
              <Select
                placeholder="请选择应用组"
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
              label="任务名称"
              name="task_name"
            >
              <Input placeholder="请输入任务名称" type="simulate" size="full" />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="周期类型"
              name="cycle_type"
            >
              <Select
                placeholder="请选择周期类型"
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                onChange={(value) => setPeriodSuffix(value)}
                options={[
                  { value: "day", text: "日" },
                  { value: "week", text: "周" },
                  { value: "month", text: "月" },
                  { value: "hour", text: "小时" },
                ]}
              />
            </FieldInput>
            <Form.Item className={"taskFormItem48"} label="数据日期">
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
              label="周期间隔"
              name="cycle_period"
            >
              <InputAdornment after={periodSuffix}>
                <Input
                  value={deepInputValue.period}
                  onChange={(period) =>
                    setDeepInputValue({ ...deepInputValue, period })
                  }
                  placeholder="请输入周期间隔"
                />
              </InputAdornment>
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="调度时间"
              name="arrange_time"
            >
              <Select
                placeholder="请选择时间"
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label="自身依赖"
              name="dependency_self"
            >
              <Radio.Group layout="inline">
                <Radio name="yes">是</Radio>
                <Radio name="no">否</Radio>
                <Radio name="muti">多实例并行</Radio>
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
              label="源数据源"
              name="data_source"
            >
              <Select
                placeholder="请选择源数据源"
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
              label="目标数据源"
              name="target_data_source"
            >
              <Select
                placeholder="请选择目标源数据源"
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
              label="目标表(Mysql)"
              name="target_table"
            >
              <Select
                placeholder="请选择目标表(Mysql)"
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
              label="目标列名"
              name="target_column_name"
            >
              <Input placeholder="请输入目标列名" size="full" />
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
              label="任务调度优先级"
              name="task_scheduling_priority"
            >
              <Radio.Group>
                <Radio name="high">高</Radio>
                <Radio name="middle">中</Radio>
                <Radio name="low">低</Radio>
              </Radio.Group>
            </FieldInput>
            <FieldInput
              required
              className={`taskFormItem48`}
              label="失败重试次数"
              name="retest_times_for_failed"
            >
              <Input placeholder="请输入失败重试次数" size="full" />
            </FieldInput>
            <FieldInput
              required
              className={`taskFormItem48  ${styles.retest}`}
              label="重试等待时间"
              name="retest_time_for_waiting"
            >
              <InputAdornment after="分钟">
                <Input
                  value={deepInputValue.resetTime}
                  onChange={(resetTime) =>
                    setDeepInputValue({ ...deepInputValue, resetTime })
                  }
                  placeholder="请选择重试等待时间"
                  size="full"
                />
              </InputAdornment>
            </FieldInput>

            <FieldInput
              className={"taskFormItem48"}
              label={"脏数据阈值"}
              name="dirty_data_value_threshold"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入脏数据阈值" />
            </FieldInput>

            <FieldInput
              required
              className={"taskFormItem48"}
              label={"数据源为空是否允许成功"}
              name="allow_success_as_data_empty"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder="请选择数据源为空是否允许成功"
                options={[
                  {
                    value: "true",
                    text: "是",
                  },
                  {
                    value: "false",
                    text: "否",
                  },
                ]}
              />
            </FieldInput>

            <FieldInput
              className={"taskFormItem48"}
              label={"数据入库模式"}
              name="data_record_mode"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder="请选择数据库入库模式"
              />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label={"beeline输出格式"}
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
              label={"是否分区"}
              name="is_distinct"
              format={(v) => v?.toString()}
            >
              <Select
                size="full"
                appearance="button"
                placeholder="请选择是否分区"
                options={[
                  { text: "分区表", value: "true" },
                  { text: "不分区表", value: "false" },
                ]}
              />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label={"TDW参数"}
              name="is_distinct"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入TDW参数，以分号分隔" />
            </FieldInput>
     
            <Form.Item style={{ marginLeft: "-15px" }}>
              <Bubble trigger="click" content={"Script_Param_Tips"}>
                <Icon type={"help"} />
              </Bubble>
            </Form.Item>
            <FieldInput
              className={"taskFormItem48"}
              label={"数据临时存放目录"}
              name="data_temp_dir"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入数据临时存放目录" />
            </FieldInput>
            <FieldInput
              className={"taskFormItem48"}
              label="分隔符"
              name="separator"
            >
              <Select
                clearable
                type="simulate"
                boxSizeSync
                appearance="button"
                size="full"
                placeholder="请输入不会存在于数据内容中的分隔符"
                options={[
                  { text: "TAB键", value: "tab" },
                  { text: "#", value: "#" },
                  { text: "|", value: "|" },
                ]}
              />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={"读并发度"}
              name="read_concurrency"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入并发读源DB线程数" />
            </FieldInput>
            <FieldInput
              required
              className={"taskFormItem48"}
              label={"写并发度"}
              name="write_concurrency"
              format={(v) => v?.toString()}
            >
              <Input size="full" placeholder="请输入并发写源DB线程数" />
            </FieldInput>
            <Form.Item className={`taskFormItem100`} style={{ width: "96.6%" }}>
              <FieldInput
                label={"源sql"}
                name="source_sql"
                format={(v) => v?.toString()}
                parse={(v) => v && Number(v)}
              >
                <TextArea
                  style={{ marginLeft: "10px" }}
                  size="full"
                  placeholder="请输入源sql"
                />
              </FieldInput>
            </Form.Item>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button type="primary" onClick={form.submit}>
          {intl.formatMessage({ id: "OK" })}
        </Button>
        {/* 确定 */}

        <Button type="weak" onClick={() => {}}> 下一页 </Button>
        {/* 取消 */}
      </Modal.Footer>
    </>
  );
};

export default TaskDataSync;
