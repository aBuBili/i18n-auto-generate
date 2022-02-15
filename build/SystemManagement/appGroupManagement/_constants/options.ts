import { EditFormOptions } from '@/pages/SystemManagement/appGroupManagement/_constants';
import { IntlShape } from 'react-intl';

export const noStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'text',
};

export const grayColor = {
  ...noStyle,
  color: '#bbb',
};

export const blackColor = {
  ...noStyle,
  color: '#000',
};

export const DetailOptions: (int: IntlShape) => EditFormOptions = (intl) => [
  {
    title: intl.formatMessage({
      id: 'system_management_label_header_basic_info',
    }),
    data: [
      {
        type: 'input',
        name: 'group_code',
        label: intl.formatMessage({
          id: 'system_management__table_header_group_id',
        }),
        readonly: {
          style: noStyle,
          disabledColor: 'black',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'group_name',
        label: intl.formatMessage({
          id: 'system_management__table_header_group_name',
        }),
        readonly: {
          style: noStyle,
          disabledColor: 'gray',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'business_id',
        label: intl.formatMessage({
          id: 'system_management_label_business_attribution',
        }),
        readonly: {
          style: noStyle,
          disabledColor: 'black',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'remark',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_remark',
        }),
        readonly: {
          style: noStyle,
          disabledColor: 'black',
        },
        formProps: {},
      },
    ],
  },
  {
    title: intl.formatMessage({
      id: 'system_management_label_header_member_info',
    }),
    data: [
      {
        type: 'input',
        name: 'group_header',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_principal',
        }),
        key: 'header',
        readonly: {
          style: noStyle,
          disabledColor: 'gray',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'group_member',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_member',
        }),
        key: 'member',
        readonly: {
          style: noStyle,
          disabledColor: 'gray',
        },
        formProps: {},
      },
    ],
  },
];

export const EditOptions: (int: IntlShape) => EditFormOptions = (intl) => [
  {
    title: intl.formatMessage({
      id: 'system_management_label_header_basic_info',
    }),
    data: [
      {
        type: 'input',
        name: 'group_code',
        label: intl.formatMessage({
          id: 'system_management__table_header_group_id',
        }),
        readonly: {
          disabledColor: 'black',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'group_name',
        label: intl.formatMessage({
          id: 'system_management__table_header_group_name',
        }),
        readonly: {
          disabledColor: 'black',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'business_id',
        label: intl.formatMessage({
          id: 'system_management_label_business_attribution',
        }),
        readonly: {
          disabledColor: 'black',
        },
        formProps: {},
      },
      {
        type: 'input',
        name: 'remark',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_remark',
        }),
        formProps: {},
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
        name: 'group_header',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_principal',
        }),
        key: 'header',
        formProps: {
          appearance: 'button',
        },
      },
      {
        type: 'selectMultiple',
        name: 'group_member',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_member',
        }),
        key: 'member',
        formProps: {
          appearance: 'button',
        },
      },
    ],
  },
];

export const EstablishOptions: (int: IntlShape) => EditFormOptions = (intl) => [
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
          validate: async (value: string) => {
            if (!GROUP_NAME_REGEX.test(value)) {
              throw new Error(
                intl.formatMessage({ id: 'system_management_group_name_tips' })
              );
            }
          },
        },
      },
      {
        type: 'input',
        name: 'business',
        label: intl.formatMessage({
          id: 'system_management_label_business_attribution',
        }),
        formProps: {
          placeholder: intl.formatMessage({
            id: 'system_management_business_attribution_tips',
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
        name: 'group_header',
        label: intl.formatMessage({
          id: 'system_management_label_app_group_principal',
        }),
        key: 'header',
        formProps: {
          appearance: 'button',
          style: { width: '100%' },
          placeholder: intl.formatMessage({
            id: 'system_management_input_group_principal_tips',
          }),
        },
        rules: {
          required: true,
          message: intl.formatMessage({
            id: 'system_management_input_group_principal_tips',
          }),
        },
      },
      {
        type: 'selectMultiple',
        name: 'group_member',
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
        },
      },
    ],
  },
];

export const AppGroupManagementSearchOptions = [
  { value: '1', text: intl.formatMessage({ id: 'owner' }) },
  { value: '2', text: intl.formatMessage({ id: 'members' }) },
];
