import React, { useMemo, useState } from 'react';
import EditForm from '../_widgets/EditForm';
import { Loading } from '@/components/loading';
import { useLocation } from 'react-router-dom';
import { useGETForManagementDetails } from '../_services';

import { DetailOptions } from '@/pages/SystemManagement/appGroupManagement/_constants/options';
import { EditFormInitialValuesDetail } from '../_constants';
import { useGETUserList } from '@/pages/dataDev/machineLearning/_services';
import { useHistory } from 'react-router-dom';
import { useIntl } from '@/utils';

import styles from './DetailReadOnly.less';

const DetailReadOnly = () => {
  const intl = useIntl();

  const location = useLocation();
  const search = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const history = useHistory();

  const [initialValues, setInitialValues] =
    useState<EditFormInitialValuesDetail>();

  const id = useMemo(() => {
    if (search.has('id')) {
      const id = search.get('id') as string;
      return id;
    }
    return void 0;
  }, [search]);

  useGETUserList({
    onSuccess(values) {
      const foundMembers = options.find(
        (option) =>
          option.title ===
          intl.formatMessage({
            id: 'system_management_label_header_member_info',
          })
      );

      const selectionOptions = values.map((v) => ({
        value: v.id + '',
        text: v.username,
      }));

      foundMembers!.data.find((d) => d.key === 'member')!.selections =
        selectionOptions;
      foundMembers!.data.find((d) => d.key === 'header')!.selections =
        selectionOptions;
      setOptions([...options]);
    },
  });
  const [, { loading }] = useGETForManagementDetails({
    query: { Id: id ?? '' },
    enabled: !!id,
    onSuccess({
      business_id,
      remark,
      group_code,
      group_header,
      group_member,
      group_name,
    }) {
      setInitialValues({
        group_code,
        group_name,
        business_id,
        remark,
        group_member: group_member?.join(' ; '),
        group_header: group_header?.join(' ; '),
      });
    },
  });

  const [options, setOptions] = useState(DetailOptions(intl));

  if (loading) return <Loading />;

  return (
    <div className={styles.wrapper}>
      <EditForm<EditFormInitialValuesDetail>
        onCancel={() => {
          history.push('/systemManagement/appGroupManagement');
        }}
        initialValues={initialValues}
        options={options}
        displayButton={false}
      />
    </div>
  );
};

export default DetailReadOnly;
