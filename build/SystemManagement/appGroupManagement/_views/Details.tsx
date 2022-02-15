import { useIntl } from '@/utils';
import React, { useMemo } from 'react';
import { TabPanel, Tabs } from 'tea-component';
import { useHistory, useLocation } from 'react-router-dom';
import AppGroupInfo from './DetailEdit';
import AppGroupInfoReadOnly from './DetailReadOnly';
import DatabasePermission from './DatabasePermission';

const TAB_KEYS = ['app_group_info', 'database_permission'] as const;

const Details = () => {
  const intl = useIntl();

  const search = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const tabs = useMemo(
    () =>
      TAB_KEYS.map((id) => ({
        id,
        label: intl.formatMessage({ id: `Tab_${id}` }),
      })),
    [intl]
  );

  if (!search.get('type')) {
    history.push('/systemManagement/appGroupManagement');
  }

  const obtainComponent = () => {
    const type = search.get('type');
    if (type === 'detail') return <AppGroupInfoReadOnly />;
    if (type === 'edit') return <AppGroupInfo />;
    return null;
  };

  return (
    <Tabs tabs={tabs}>
      <TabPanel id={TAB_KEYS[0]}>{obtainComponent()}</TabPanel>
      <TabPanel id={TAB_KEYS[1]}>
        <DatabasePermission />
      </TabPanel>
    </Tabs>
  );
};

export default Details;
