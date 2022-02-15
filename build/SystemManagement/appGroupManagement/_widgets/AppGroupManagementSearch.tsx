import React from 'react';
import {
  FieldInput,
  FormProvider,
  useFormCreation,
} from '@datagroup/web-utils';
import { Button, Form, Input, Select } from 'tea-component';
import { RangePicker } from 'tea-component/lib/datepicker/RangePicker';
import { AppGroupManagementSearchProps } from '../_constants/props';
import { AppGroupManagementSearchOptions } from '../_constants/options';
import moment, { Moment } from 'moment';
import { useIntl } from '@/utils';

import styles from './AppGroupManagementSearch.less';

const AppGroupManagementSearch = ({
  onSearch,
}: AppGroupManagementSearchProps) => {
  const intl = useIntl();

  const { form, handleSubmit } = useFormCreation<{
    key_word?: string;
    group_role?: string;
    date_range: Array<Moment>;
  }>({
    onSubmit: (e) => {
      const [start_time_unix, end_time_unix] = e.date_range?.length
        ? [e.date_range[0].valueOf(), e.date_range[1].valueOf()]
        : [moment().startOf('d').valueOf(), moment().endOf('d').valueOf()];

      onSearch?.({
        start_time_unix,
        end_time_unix,
        key_word: e.key_word,
        group_role: e.group_role,
      });
    },
  });

  return (
    <FormProvider
      form={form}
      className={styles.provider}
      onSubmit={handleSubmit}
    >
      <Form style={{ display: 'flex' }}>
        <FieldInput name="date_range">
          <RangePicker
            separator={intl.formatMessage({ id: 'system_management_sperator' })}
            defaultValue={[moment().startOf('d'), moment().endOf('d')]}
            showTime={{
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss'),
              ],
            }}
          />
        </FieldInput>
        <FieldInput name="group_role" className={styles.ml19}>
          <Select
            style={{ width: '150px' }}
            appearance="button"
            clearable
            options={AppGroupManagementSearchOptions}
            placeholder={intl.formatMessage({
              id: 'system_management__table_header_role',
            })}
          />
        </FieldInput>
        <FieldInput name="key_word" className={styles.ml19} compatible>
          <Input
            placeholder={intl.formatMessage({
              id: 'system_management_placeholder_input_app_group',
            })}
          />
        </FieldInput>
      </Form>

      <Form.Action className={styles.action}>
        <Button type="primary" htmlType="submit" onClick={form.submit}>
          {intl.formatMessage({
            id: 'system_management__search_btn_retrieve',
          })}
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            form.batch(() => {
              form.change('group_role', void 0);
              form.change('key_word', void 0);
            });
          }}
        >
          {intl.formatMessage({ id: 'system_management__search_btn_clear' })}
        </Button>
      </Form.Action>
    </FormProvider>
  );
};

export default AppGroupManagementSearch;
