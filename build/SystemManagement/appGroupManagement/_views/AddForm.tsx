import React, { useState } from 'react';
import EditForm from '../_widgets/EditForm';

import { useGETForGameId, usePOSTForEditRecordsManagement } from '../_services';
import { EditFormOptions, RecordString } from '../_constants';
import { useGETForUserList } from '@/pages/approvalCenter/approvalManage/_services';
import { useHistory } from 'react-router-dom';
import { useIntl } from '@/utils';
import { message } from 'tea-component';

const GROUP_NAME_REGEX =
  /^([a-zA-Z]+[0-9]+[_])|([a-zA-Z]+[_][0-9]+)|([_][a-zA-Z]+[0-9]+)|([_][0-9]+[a-zA-Z]+)|([0-9]+[_][a-zA-Z]+)|([0-9]+[a-zA-Z]+[_])$/;

const AddForm = () => {
  const intl = useIntl();

  const [options, setOptions] = useState<EditFormOptions>([
    {
      title: intl.formatMessage({
        id: 'system_management_label_header_basic_info',
      }),
      data: [
        {
          type: 'input',
          name: 'group_name',
          label: intl.formatMessage({
            id: 'system_management__table_header_group_name',
          }),
          formProps: {
            placeholder: intl.formatMessage({
              id: 'system_management_group_name_tips',
            }),
            maxLength: 50,
          },
          rules: {
            required: true,
            message: intl.formatMessage({
              id: 'system_management_group_name_tips',
            }),
            trigger: 'blur',
            validate: (value) => {
              if (!GROUP_NAME_REGEX.test(value as string)) {
                throw new Error(
                  intl.formatMessage({
                    id: 'system_management_group_name_tips',
                  })
                );
              }
            },
          },
        },
        {
          type: 'input',
          name: 'business_id',
          label: intl.formatMessage({
            id: 'system_management_label_business_attribution',
          }),
          readonly: {
            style: { background: 'transparent' },
            disabledColor: 'black',
          },
          formProps: {
            placeholder: intl.formatMessage({
              id: 'system_management_choose_game_id',
            }),
          },
          rules: {
            required: true,
            message: intl.formatMessage({
              id: 'system_management_business_attribution_tips',
            }),
          },
        },
        {
          type: 'input',
          name: 'remark',
          label: intl.formatMessage({
            id: 'system_management_label_app_group_remark',
          }),
          formProps: {
            placeholder: intl.formatMessage({
              id: 'system_management_input_group_remark_tips',
            }),
          },
          rules: {
            required: true,
            message: intl.formatMessage({
              id: 'system_management_input_group_remark_tips',
            }),
          },
        },
      ],
    },
    {
      title: intl.formatMessage({
        id: 'system_management_label_header_member_info',
      }),
      data: [
        {
          type: 'selectMultiple',
          name: 'group_header_id',
          label: intl.formatMessage({
            id: 'system_management_label_app_group_principal',
          }),
          key: 'header',
          formProps: {
            appearance: 'button',
            placeholder: intl.formatMessage({
              id: 'system_management_input_group_principal_tips',
            }),
          },
          rules: {
            required: true,
            message: intl.formatMessage({
              id: 'system_management_input_group_principal_tips',
            }),
            min: 1,
          },
        },
        {
          type: 'selectMultiple',
          name: 'group_member_id',
          label: intl.formatMessage({
            id: 'system_management_label_app_group_member',
          }),
          key: 'member',
          formProps: {
            appearance: 'button',
            placeholder: intl.formatMessage({
              id: 'system_management_input_group_member_tips',
            }),
          },
          rules: {
            required: true,
            message: intl.formatMessage({
              id: 'system_management_input_group_member_tips',
            }),
            min: 1,
          },
        },
      ],
    },
  ]);
  const history = useHistory();

  const [, { execute, loading }] = usePOSTForEditRecordsManagement();
  const [gameId] = useGETForGameId();

  useGETForUserList({
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

  return (
    <>
      <EditForm<
        Partial<
          RecordString<
            | 'group_header[]'
            | 'group_member[]'
            | 'group_header_id[]'
            | 'group_member_id[]'
            | 'group_name'
            | 'remark'
          > & { business_id: number }
        >
      >
        initialValues={{
          business_id:
            gameId && !isNaN(Number(gameId)) ? Number(gameId) : void 0,
        }}
        loading={loading}
        onSubmit={async (e) => {
          try {
            const headerIds = e.group_header_id?.map(
              (header) => header.split('/')[0]
            );
            const header = e.group_header_id?.map(
              (header) => header.split('/')[1]
            );
            const memberIds = e.group_member_id?.map(
              (member) => member.split('/')[0]
            );
            const member = e.group_member_id?.map(
              (member) => member.split('/')[1]
            );
            await execute({
              ...e,
              group_header_id: headerIds,
              group_header: header,
              group_member_id: memberIds,
              group_member: member,
              status: 1,
            });

            history.push('/systemManagement/appGroupManagement');
          } catch (e: any) {
            message.error(e?.msg);
          }
        }}
        onCancel={() => history.push('/systemManagement/appGroupManagement')}
        options={options}
      />
    </>
  );
};

export default AddForm;
