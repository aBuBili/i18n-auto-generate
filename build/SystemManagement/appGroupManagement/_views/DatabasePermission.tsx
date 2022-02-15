import React, { useMemo, useState } from 'react';
import { Card, Table, TableColumn } from 'tea-component';
import { RecordNumber, RecordString } from '../_constants';
import { useGETForManagementGetDataTables } from '../_services';
import TablePermission from '../_widgets/DatabasePermissionSearch';
import { useIntl } from '@/utils';
import moment from 'moment';

import styles from './DatabasePermission.less';

const DatabasePermission = () => {
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

  const [data, { loading }] = useGETForManagementGetDataTables({ query });

  const columns: Array<TableColumn> = [
    {
      key: 'database_name',
      align: 'center',
      header: intl.formatMessage({
        id: 'system_management__table_header_database_name',
      }),
    },
    {
      key: 'table_name',
      align: 'center',
      header: intl.formatMessage({
        id: 'system_management__table_header_table_name',
      }),
    },
    {
      key: 'cluster_name',
      align: 'center',
      header: intl.formatMessage({
        id: 'system_management__table_header_clusters',
      }),
    },
    {
      key: 'updated_at',
      align: 'center',
      header: intl.formatMessage({
        id: 'system_management__table_header_apply_date',
      }),
      render(record) {
        return moment(record.updated_at).format('yyyy-MM-DD HH:mm:ss')
      }
    },
  ];

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

  return (
    <div>
      <Card className={styles.card}>
        <TablePermission
          onSearch={(values) => {
            setQuery({
              ...values,
              page: 1,
              size: 10,
            });
          }}
        />
      </Card>
      <div className={styles.mt60}>
        <Table
          columns={columns}
          recordKey="id"
          records={data?.list ?? []}
          addons={addons}
        />
      </div>
    </div>
  );
};

export default DatabasePermission;
