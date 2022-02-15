import React from 'react';
import {
  FieldInput,
  FormProvider,
  useFormCreation,
} from '@datagroup/web-utils';
import moment, { Moment } from 'moment';
import { useIntl } from '@/utils';
import { Button, Form, Input } from 'tea-component';
import { RangePicker } from 'tea-component/lib/datepicker/RangePicker';

import { DatabasePermissionSearchProps } from '../_constants/props';

import styles from './DatabasePermissionSearch.less';

const DatabasePermission = ({ onSearch }: DatabasePermissionSearchProps) => {
  const { form, handleSubmit } = useFormCreation<{
    date_range: Array<Moment>;
    key_word?: string;
  }>({
    onSubmit(e) {
      const [start_time_unix, end_time_unix] = e.date_range?.length
        ? [e.date_range[0].valueOf(), e.date_range[1].valueOf()]
        : [moment().startOf('d').valueOf(), moment().endOf('d').valueOf()];

      onSearch?.({
        start_time_unix,
        end_time_unix,
        key_word: e.key_word,
      });
    },
  });
  const intl = useIntl();

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
        <FieldInput name="key_word" className={styles.ml19} compatible>
          <Input placeholder={intl.formatMessage({ id: 'Enter_Table_Name' })} />
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
            form.change('key_word', void 0);
          }}
        >
          {intl.formatMessage({ id: 'system_management__search_btn_clear' })}
        </Button>
      </Form.Action>
    </FormProvider>
  );
};

export default DatabasePermission;
