import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Table, TableColumn } from 'tea-component';
import { RecordNumber, RecordString } from '../_constants';
import { useGETForManagementRecords } from '../_services';
import AppGroupManagementSearch from '../_widgets/AppGroupManagementSearch';
import { useIntl } from '@/utils';
import moment from 'moment';

import styles from './AppGroupManagement.less';

const AppGroupManagement = () => {
  const history = useHistory();

  const intl = useIntl();
  const [query, setQuery] = useState<
    RecordString<'group_role?' | 'key_word?'> &
      RecordNumber<'end_time_unix' | 'start_time_unix' | 'page' | 'size'>
  >({
    page: 1,
    size: 10,
    start_time_unix: moment().startOf('d').valueOf(),
    end_time_unix: moment().endOf('d').valueOf(),
  });

  const [data, { loading }] = useGETForManagementRecords({ query });

  const addons = useMemo(
    () => [
      Table.addons.pageable({
        recordCount: data?.total ?? 0,
        onPagingChange: ({ pageIndex, pageSize }) => {
          setQuery({
            ...query,
            page: pageIndex ?? 1,
            size: pageSize ?? 10,
          });
        },
      }),
      Table.addons.autotip({
        isLoading: loading,
        emptyText: intl.formatMessage({ id: 'No_data' }),
        loadingText: 'loading...',
      }),
    ],
    [data?.total, intl, loading, query]
  );

  const columns: Array<TableColumn> = useMemo(
    () => [
      {
        key: 'group_code',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_group_id',
        }),
      },
      {
        key: 'group_name',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_group_name',
        }),
      },
      {
        key: 'group_role',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_role',
        }),
      },
      {
        key: 'business',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management_label_business_attribution',
        }),
      },
      {
        key: 'created_at',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_create_at',
        }),
        render(record) {
          return moment(record.created_at).format('yyyy-MM-DD HH:mm:ss');
        },
      },
      {
        key: 'group_header',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_principal',
        }),
      },
      {
        key: 'operation',
        align: 'center',
        header: intl.formatMessage({
          id: 'system_management__table_header_operation',
        }),
        render: (record) => {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `/systemManagement/appGroupManagement/formPage?type=edit&id=${record.id}`
                  );
                }}
              >
                {intl.formatMessage({ id: 'system_management_header_edit' })}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `/systemManagement/appGroupManagement/formPage?type=detail&id=${record.id}`
                  );
                }}
              >
                {intl.formatMessage({ id: 'system_management_header_detail' })}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `/systemManagement/appGroupManagement/formPage?type=apply&group_id=${record.id}&group_code=${record.group_code}&group_name=${record.group_name}`
                  );
                }}
              >
                {intl.formatMessage({
                  id: 'system_management_apply_database_and_table',
                })}
              </Button>
            </>
          );
        },
      },
    ],
    [history, intl]
  );

  return (
    <>
      <Card className={styles.card}>
        <AppGroupManagementSearch
          onSearch={(values) => {
            setQuery({
              ...values,
              group_role: values.group_role ? values.group_role : '0',
              page: 1,
              size: 10,
            });
          }}
        />
      </Card>
      <Button
        className={styles.mt20}
        type="primary"
        onClick={() => {
          history.push(
            '/systemManagement/appGroupManagement/formPage?type=add'
          );
        }}
      >
        {intl.formatMessage({ id: 'system_management_establish_new' })}
      </Button>
      <Table
        recordKey="id"
        columns={columns}
        records={data?.list ?? []}
        addons={addons}
      />
    </>
  );
};

export default AppGroupManagement;
