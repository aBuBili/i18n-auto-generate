import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  useGETForDictionClusterList,
  useGETForDictionDatabaseList,
  useGETForDictionTableList,
  usePOSTForCreateManagement,
} from '../_services';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  SelectMultiple,
  SelectOptionWithGroup,
} from 'tea-component';
import {
  FieldInput,
  FormProvider,
  useFormCreation,
} from '@datagroup/web-utils';
import { useIntl } from '@/utils';
import { RecordString } from '../_constants';

import styles from './ApplyForm.less';
import { Loading } from '@/components/loading';

const ApplyForm = () => {
  const intl = useIntl();

  const history = useHistory();
  const location = useLocation();
  const search = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [cluster, setCluster] = useState<Array<SelectOptionWithGroup>>();
  const [database, setDatabase] = useState<Array<SelectOptionWithGroup>>();
  const [table, setTable] = useState<Array<SelectOptionWithGroup>>();

  const [clusterId, setClusterId] = useState<number>();
  const [clusterName, setClusterName] = useState<string>();
  const [databaseName, setDatabaseName] = useState<string>();
  const [tableLength, setTableLength] = useState<number>();

  const lock = useRef(false);

  const initialValues: Partial<RecordString<'group_code' | 'group_name'>> =
    useMemo(
      () => ({
        group_code: search.has('group_code')
          ? search.get('group_code') ?? ''
          : '',
        group_name: search.has('group_name')
          ? search.get('group_name') ?? ''
          : '',
      }),
      [search]
    );
  const group_id = useMemo(
    () =>
      search.has('group_id')
        ? Number(search.get('group_id')) ?? void 0
        : void 0,
    [search]
  );

  const filterRepeat = (values: Array<{ name: string }>) => {
    const hash: { [key: string]: boolean } = {};
    values = values.reduce(function (
      prev: Array<{ name: string }>,
      next: { name: string }
    ) {
      if (!hash[next.name]) {
        hash[next.name] = true;
        prev.push(next);
      }
      return prev;
    },
    []);

    return values;
  };

  useGETForDictionClusterList({
    onSuccess(values) {
      const clusters = values.map((value) => ({
        value: value.id + '',
        text: value.cluster_name,
      }));
      setCluster(clusters);
    },
  });

  const [, { execute: databaseExecute, loading: databaseLoading }] =
    useGETForDictionDatabaseList({
      enabled: false,
      onSuccess(values) {
        const database = values.map((value) => ({
          value: value.database_name,
          text: value.database_name,
        }));
        setDatabase(database);
      },
    });

  const [, { execute: tableExecute, loading: tableLoading }] =
    useGETForDictionTableList({
      enabled: false,
      onSuccess(values) {
        const data = filterRepeat(values);
        const tables = data.map((d) => ({
          value: d.name,
          text: d.name,
        }));

        setTable(tables);
        setTableLength(tables.length ?? void 0);
      },
    });

  const [, { execute, loading: createLoading }] = usePOSTForCreateManagement();

  const { form, handleSubmit } = useFormCreation<
    RecordString<
      'group_code' | 'group_name' | 'cluster_id' | 'data_name' | 'table_name[]'
    >
  >({
    initialValues,
    rules: {
      cluster_id: {
        required: true,
        message: intl.formatMessage({
          id: 'system_management_select_clusters',
        }),
      },
      data_name: {
        required: true,
        message: intl.formatMessage({
          id: 'system_management_select_database',
        }),
      },
      table_name: {
        required: true,
        message: intl.formatMessage({ id: 'system_management_select_table' }),
        min: 1,
      },
    },
    onSubmit: async (e) => {
      try {
        await execute({
          ...e,
          group_id,
          cluster_id: Number(e.cluster_id),
          cluster_name: clusterName,
          table_name:
            e.table_name.length === tableLength ? '*' : e.table_name.join(','),
        });

        history.push('/systemManagement/appGroupManagement');
      } catch (e: any) {
        message.error(e?.msg);
      }
    },
  });

  const resetSelect = useCallback(() => {
    setDatabase([]);
    setTable([]);
    form.change('table_name', []);
    form.change('data_name', void 0);
  }, [form]);

  useEffect(() => {
    if (clusterId) {
      databaseExecute({ cluster_id: clusterId });
      lock.current = true;
      resetSelect();
    }
  }, [clusterId, databaseExecute, form, resetSelect]);

  useEffect(() => {
    if (databaseName && clusterId && !lock.current) {
      tableExecute({ cluster_id: clusterId, database_name: databaseName });
    }
  }, [clusterId, databaseName, tableExecute]);

  return (
    <FormProvider
      className={styles.wrapper}
      form={form}
      onSubmit={handleSubmit}
    >
      <Form>
        <FieldInput
          label={intl.formatMessage({
            id: 'system_management__table_header_group_id',
          })}
          name="group_code"
          compatible
        >
          <Input disabled />
        </FieldInput>
        <FieldInput
          label={intl.formatMessage({
            id: 'system_management__table_header_group_name',
          })}
          name="group_name"
          compatible
        >
          <Input disabled />
        </FieldInput>
        <FieldInput
          label={intl.formatMessage({
            id: 'system_management__table_header_clusters',
          })}
          name="cluster_id"
          compatible
        >
          <Select
            options={cluster}
            appearance="button"
            placeholder={intl.formatMessage({
              id: 'system_management_select_clusters',
            })}
            onChange={(value, context) => {
              setClusterId(Number(value));
              setClusterName(context.option?.text as string);
            }}
          />
        </FieldInput>
        <FieldInput
          name="data_name"
          label={intl.formatMessage({ id: 'system_management_label_database' })}
          compatible
        >
          <Select
            options={database}
            appearance="button"
            placeholder={intl.formatMessage({
              id: 'system_management_select_database',
            })}
            onChange={(value) => {
              setDatabaseName(value);
              lock.current = false;
            }}
            bottomTips={databaseLoading && <Loading />}
          />
        </FieldInput>
        <FieldInput
          name="table_name"
          label={intl.formatMessage({
            id: 'system_management__table_header_table_name',
          })}
          compatible
        >
          <SelectMultiple
            allOption={table?.length ? { value: '*', text: 'all' } : void 0}
            options={table}
            appearance="button"
            searchable={!!table?.length}
            placeholder={intl.formatMessage({
              id: 'system_management_label_apply',
            })}
            bottomTips={tableLoading && <Loading />}
          />
        </FieldInput>
      </Form>

      <Form.Action className={styles.formAction}>
        <Button
          loading={createLoading}
          htmlType="submit"
          style={{ marginLeft: '12px' }}
          type="primary"
        >
          {intl.formatMessage({ id: 'system_management_btn_saving' })}
        </Button>

        <Button
          htmlType="button"
          style={{ marginLeft: '12px' }}
          onClick={() => {
            history.push('/systemManagement/appGroupManagement');
          }}
        >
          {intl.formatMessage({ id: 'system_management_btn_cancel' })}
        </Button>
      </Form.Action>
    </FormProvider>
  );
};

export default ApplyForm;
