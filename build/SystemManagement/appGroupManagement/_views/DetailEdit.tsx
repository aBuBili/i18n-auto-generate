import React, { useMemo, useState } from 'react';
import EditForm from '../_widgets/EditForm';
import { Loading } from '@/components/loading';
import { useLocation } from 'react-router-dom';
import {
  useGETForManagementDetails,
  usePOSTForEditRecordsManagement,
} from '../_services';

import { EditOptions } from '@/pages/SystemManagement/appGroupManagement/_constants/options';
import { EditFormInitialValuesEdit } from '../_constants';
import { useGETUserList } from '@/pages/dataDev/machineLearning/_services';
import { useHistory } from 'react-router-dom';
import { useIntl } from '@/utils';
import { message } from 'tea-component';

const DetailEdit = () => {
  const intl = useIntl();
  const location = useLocation();
  const search = useMemo(() => new URLSearchParams(location.search), []);
  const history = useHistory();

  const [initialValues, setInitialValues] =
    useState<EditFormInitialValuesEdit>();

  const [, { execute, loading: submitLoading }] =
    usePOSTForEditRecordsManagement();

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
        value: `${v.id}/${v.username}`,
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
      group_code,
      remark,
      group_header_id,
      group_member_id,
      group_member,
      group_header,
      group_name,
    }) {
      const groupMember =
        group_member_id && group_member
          ? group_member_id?.map(
              (member, index) => `${member}/${group_member[index]}`
            )
          : [];
      const groupHeader =
        group_header_id && group_header
          ? group_header_id?.map(
              (header, index) => `${header}/${group_header[index]}`
            )
          : [];
      setInitialValues({
        group_code,
        group_name,
        business_id,
        remark,
        group_member: groupMember,
        group_header: groupHeader,
      });
    },
  });

  const [options, setOptions] = useState(EditOptions(intl));

  const handleSubmit = async (e: EditFormInitialValuesEdit) => {
    const { business_id, remark, group_name, group_code } = e;

    const memberIds = e.group_member?.map((member) => member.split('/')[0]);
    const member = e.group_member?.map((member) => member.split('/')[1]);
    const headerIds = e.group_header?.map((header) => header.split('/')[0]);
    const header = e.group_header?.map((header) => header.split('/')[1]);

    try {
      await execute({
        group_code,
        remark,
        group_name,
        business_id,
        group_header: header,
        group_header_id: headerIds,
        group_member: member,
        group_member_id: memberIds,
        id: Number(id),
      });

      history.push('/systemManagement/appGroupManagement');
    } catch (e: any) {
      message.error(e?.msg);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <EditForm<EditFormInitialValuesEdit>
        onSubmit={handleSubmit}
        onCancel={() => {
          history.push('/systemManagement/appGroupManagement');
        }}
        loading={submitLoading}
        initialValues={initialValues}
        options={options}
        displayButton
      />
    </div>
  );
};

export default DetailEdit;
